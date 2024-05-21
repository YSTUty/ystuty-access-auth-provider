import * as cheerio from 'cheerio';
import * as chTableParser from 'cheerio-tableparser';

export const getUserInfo = (html: string) => {
  const $ = cheerio.load(html);
  chTableParser($);

  const nameString = $('.ContentHeader ul lir:nth-child(3)').text().trim();
  const matchResult = nameString.match(
    /(?<name>.+) \((?<login>[a-z0-9\._\-]{1,40})\)( (?<group>[а-я0-9\-]{1,10}))?/i,
  );

  const {
    name: fullname = null,
    login = null,
    group = null,
  } = matchResult?.groups || {};

  let [first_name, last_name, middle_name] = fullname?.split(' ');
  let avatar_url = $(
    'div.RightContentColumn > div > div > table:nth-child(4) > tbody > tr > td:nth-child(1) > img',
  ).attr('src');

  let birthday: string = null;
  let emails: string[] = [];
  let ticketId: string = null;

  const $infoTable = $('#parent_popup_click2 > div > table > tbody');
  if ($infoTable.length > 0) {
    const infoArr = ($infoTable as any).parsetable(
      false,
      true,
      true,
    ) as string[][];

    if (infoArr.length > 0) {
      const birthdayIdx = infoArr[0].findIndex((e) =>
        e.startsWith('Дата рождения'),
      );
      if (birthdayIdx !== -1) {
        birthday = infoArr[1][birthdayIdx];
      }

      const emailsIdx = infoArr[0].findIndex((e) => e.startsWith('E-mail'));
      if (emailsIdx !== -1) {
        emails = infoArr[1][emailsIdx].split(' ').map((e) => e.trim());
      }

      const ticketIdIndex = infoArr[0].findIndex(
        (e) => e.startsWith('Читательский билет'), // `Читательский билет №:login:`
      );
      if (ticketIdIndex !== -1) {
        ticketId = infoArr[1][ticketIdIndex].split(' ').at(0);
      }
    }
  }

  return {
    first_name,
    last_name,
    middle_name,
    birthday,
    emails,
    ticketId,
    avatar_url,
    login,
    group,
  };
};

export const getCodeYSTU = (html: string) => {
  const $ = cheerio.load(html);
  const codeYSTU = $('input[name="codeYSTU"]').val();
  return codeYSTU || null;
};

export const getRestoreData = (html: string) => {
  const $ = cheerio.load(html);

  const fullName = $('font').contents().eq(1).text().trim();
  const login = $('b').text().trim();
  const password = $('font')
    .contents()
    .eq(7)
    .text()
    .trim()
    .split(':')[1]
    .trim();
  const email = $('font').contents().eq(11).text().trim();

  return {
    fullName,
    login,
    password,
    email,
  };
};

export const getMarks = (html: string) => {
  const $ = cheerio.load(html);
  chTableParser($);

  const values = [];
  const $table = $('#tab1');
  if ($table) {
    const arTable = ($table as any).parsetable(false, true, true) as string[][];

    const [titles, ...arData] = arTable[0]
      .map((_, i) => arTable.map((row) => row[i]))
      .filter((e) => e.some(Boolean));

    for (const row of arData) {
      values.push({
        number: row[0],
        course: row[1],
        semester: row[2],
        subject: row[3],
        controlType: row[4],
        // zed: row[5],
        markScore: row[6],
        markType: row[7],
      });
    }

    // values.push(...arData);
  }

  return { values };
};

export const getOrders = (html: string) => {
  const $ = cheerio.load(html);
  chTableParser($);

  const values = [];
  const $table = $('#tab1');
  if ($table) {
    const arTable = ($table as any).parsetable(
      false,
      true,
      false,
    ) as string[][];

    const [titles, ...arData] = arTable[0]
      .map((_, i) => arTable.map((row) => row[i]))
      .filter((e) => e.some(Boolean));

    for (const row of arData) {
      // check for `Запись на получение услуг.` table
      if (!row[5]) continue;

      values.push({
        number: $('<div>' + row[0] + '</div>')
          .text()
          .trim(),
        date: $('<div>' + row[1] + '</div>')
          .text()
          .trim(),
        subject: $('<div>' + row[2] + '</div>')
          .text()
          .trim(),
        user: $('<div>' + row[3] + '</div>')
          .text()
          .trim(),
        cabinet: $('<div>' + row[4] + '</div>')
          .text()
          .trim(),
        status: $('<div>' + row[5] + '</div>')
          .find('img')
          ?.attr('alt'),
      });
    }

    // values.push({ arTable });
  }

  return { values };
};
