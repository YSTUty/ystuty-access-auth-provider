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
  if ($infoTable) {
    const infoArr = ($infoTable as any).parsetable(
      false,
      true,
      true,
    ) as string[][];

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
