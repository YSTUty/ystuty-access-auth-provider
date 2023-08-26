const t: Record<string, string> = {};
t['%D0%B0'] = '%E0';
t['%D0%B1'] = '%E1';
t['%D0%B2'] = '%E2';
t['%D0%B3'] = '%E3';
t['%D0%B4'] = '%E4';
t['%D0%B5'] = '%E5';
t['%D1%91'] = '%B8';
t['%D0%B6'] = '%E6';
t['%D0%B7'] = '%E7';
t['%D0%B8'] = '%E8';
t['%D0%B9'] = '%E9';
t['%D0%BA'] = '%EA';
t['%D0%BB'] = '%EB';
t['%D0%BC'] = '%EC';
t['%D0%BD'] = '%ED';
t['%D0%BE'] = '%EE';
t['%D0%BF'] = '%EF';
t['%D1%80'] = '%F0';
t['%D1%81'] = '%F1';
t['%D1%82'] = '%F2';
t['%D1%83'] = '%F3';
t['%D1%84'] = '%F4';
t['%D1%85'] = '%F5';
t['%D1%86'] = '%F6';
t['%D1%87'] = '%F7';
t['%D1%88'] = '%F8';
t['%D1%89'] = '%F9';
t['%D1%8C'] = '%FC';
t['%D1%8B'] = '%FB';
t['%D1%8A'] = '%FA';
t['%D1%8D'] = '%FD';
t['%D1%8E'] = '%FE';
t['%D1%8F'] = '%FF';
t['%D0%90'] = '%C0';
t['%D0%91'] = '%C1';
t['%D0%92'] = '%C2';
t['%D0%93'] = '%C3';
t['%D0%94'] = '%C4';
t['%D0%95'] = '%C5';
t['%D0%81'] = '%A8';
t['%D0%96'] = '%C6';
t['%D0%97'] = '%C7';
t['%D0%98'] = '%C8';
t['%D0%99'] = '%C9';
t['%D0%9A'] = '%CA';
t['%D0%9B'] = '%CB';
t['%D0%9C'] = '%CC';
t['%D0%9D'] = '%CD';
t['%D0%9E'] = '%CE';
t['%D0%9F'] = '%CF';
t['%D0%A0'] = '%D0';
t['%D0%A1'] = '%D1';
t['%D0%A2'] = '%D2';
t['%D0%A3'] = '%D3';
t['%D0%A4'] = '%D4';
t['%D0%A5'] = '%D5';
t['%D0%A6'] = '%D6';
t['%D0%A7'] = '%D7';
t['%D0%A8'] = '%D8';
t['%D0%A9'] = '%D9';
t['%D0%AC'] = '%DC';
t['%D0%AB'] = '%DB';
t['%D0%AA'] = '%DA';
t['%D0%AD'] = '%DD';
t['%D0%AE'] = '%DE';
t['%D0%AF'] = '%DF';

const rt: Record<string, string> = {};
rt['%E0'] = '%D0%B0';
rt['%E1'] = '%D0%B1';
rt['%E2'] = '%D0%B2';
rt['%E3'] = '%D0%B3';
rt['%E4'] = '%D0%B4';
rt['%E5'] = '%D0%B5';
rt['%B8'] = '%D1%91';
rt['%E6'] = '%D0%B6';
rt['%E7'] = '%D0%B7';
rt['%E8'] = '%D0%B8';
rt['%E9'] = '%D0%B9';
rt['%EA'] = '%D0%BA';
rt['%EB'] = '%D0%BB';
rt['%EC'] = '%D0%BC';
rt['%ED'] = '%D0%BD';
rt['%EE'] = '%D0%BE';
rt['%EF'] = '%D0%BF';
rt['%F0'] = '%D1%80';
rt['%F1'] = '%D1%81';
rt['%F2'] = '%D1%82';
rt['%F3'] = '%D1%83';
rt['%F4'] = '%D1%84';
rt['%F5'] = '%D1%85';
rt['%F6'] = '%D1%86';
rt['%F7'] = '%D1%87';
rt['%F8'] = '%D1%88';
rt['%F9'] = '%D1%89';
rt['%FC'] = '%D1%8C';
rt['%FB'] = '%D1%8B';
rt['%FA'] = '%D1%8A';
rt['%FD'] = '%D1%8D';
rt['%FE'] = '%D1%8E';
rt['%FF'] = '%D1%8F';
rt['%C0'] = '%D0%90';
rt['%C1'] = '%D0%91';
rt['%C2'] = '%D0%92';
rt['%C3'] = '%D0%93';
rt['%C4'] = '%D0%94';
rt['%C5'] = '%D0%95';
rt['%A8'] = '%D0%81';
rt['%C6'] = '%D0%96';
rt['%C7'] = '%D0%97';
rt['%C8'] = '%D0%98';
rt['%C9'] = '%D0%99';
rt['%CA'] = '%D0%9A';
rt['%CB'] = '%D0%9B';
rt['%CC'] = '%D0%9C';
rt['%CD'] = '%D0%9D';
rt['%CE'] = '%D0%9E';
rt['%CF'] = '%D0%9F';
rt['%D0'] = '%D0%A0';
rt['%D1'] = '%D0%A1';
rt['%D2'] = '%D0%A2';
rt['%D3'] = '%D0%A3';
rt['%D4'] = '%D0%A4';
rt['%D5'] = '%D0%A5';
rt['%D6'] = '%D0%A6';
rt['%D7'] = '%D0%A7';
rt['%D8'] = '%D0%A8';
rt['%D9'] = '%D0%A9';
rt['%DC'] = '%D0%AC';
rt['%DB'] = '%D0%AB';
rt['%DA'] = '%D0%AA';
rt['%DD'] = '%D0%AD';
rt['%DE'] = '%D0%AE';
rt['%DF'] = '%D0%AF';

export function convert_to_cp1251(val: string) {
  let ret = '';

  const len = val.length;
  let i = 0;
  while (i < len) {
    let f = 0;
    for (const keyVar in t) {
      if (val.substring(i, i + 6) == keyVar) {
        ret += t[keyVar];
        i += 6;
        f = 1;
      }
    }

    if (!f) {
      ret += val.substring(i, i + 1);
      i++;
    }
  }

  return ret;
}

export function convert_from_cp1251(val: string) {
  let ret = '';

  const len = val.length;
  let i = 0;
  while (i < len) {
    let f = 0;
    for (const keyVar in rt) {
      if (val.substring(i, i + 3) == keyVar) {
        ret += rt[keyVar];
        i += 3;
        f = 1;
      }
    }

    if (!f) {
      ret += val.substring(i, i + 1);
      i++;
    }
  }

  return ret;
}

export function urlencode(val: string | number) {
  val = val.toString();

  return encodeURIComponent(val)
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
    .replace(/%20/g, '+');
}

export function urldecode(val: string | number) {
  try {
    return decodeURIComponent(val.toString().replace(/\+/g, '%20'));
  } catch {}
  return null;
}
