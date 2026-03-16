/* eslint-disable no-console */
const fs = require('fs');
const assert = require('assert');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'hw4.html');
const html = fs.readFileSync(htmlPath, 'utf8');

function mustInclude(needle, msg){
  assert(
    html.includes(needle),
    msg || `Expected hw4.html to include: ${JSON.stringify(needle)}`
  );
}

// Q1: accept "yeterli" instead of "yeterince" with warning
mustInclude("Not: по нашему мнению yeterince в этом предложении звучит лучше, чем yeterli, однако ответ засчитан!",
  'Q1 warning text is missing');
assert(
  /idx === 0[\s\S]*?answersMatchWithNormReplacement\(v, it\.answers, 'yeterince', 'yeterli'\)/.test(html),
  'Q1: expected logic for yeterince -> yeterli (answersMatchWithNormReplacement)'
);

// Q2: accept "şuanda" with warning + new valid answers with "için" variants
mustInclude('Not: слово şu anda пишется раздельно, но ответ засчитан!', 'Q2 warning text is missing');
assert(
  /idx === 1[\s\S]*?answersMatchWithNormReplacement\(v, it\.answers, 'şu anda', 'şuanda'\)/.test(html),
  'Q2: expected logic for şu anda -> şuanda (answersMatchWithNormReplacement)'
);

[
  'Şu anda böyle şeyler için vaktim yok',
  'Şu anda böyle şeyler için zamanım yok',
  'Şu anda bu tür şeyler için vaktim yok',
  'Şu anda bu tür şeyler için zamanım yok',
  'Şu anda bu tarz şeyler için vaktim yok',
  'Şu anda bu tarz şeyler için zamanım yok',
  'Benim şu anda böyle şeyler için vaktim yok',
  'Benim şu anda bu tarz şeyler için zamanım yok',
].forEach(s => mustInclude(s, `Q2: missing expected answer variant: ${s}`));

// Q3: new answers + "bir" optional
['Onun hafızası çok iyi', 'Hafızası çok iyi'].forEach(s => mustInclude(s, `Q3: missing new answer: ${s}`));

// Q3/Q5: bir-optional logic should exist and be applied to idx 2 and idx 4
mustInclude('function dropBirFromNorm', 'Expected helper dropBirFromNorm');
mustInclude('function answersMatchNoBir', 'Expected helper answersMatchNoBir');
assert(
  /\(idx === 2 \|\| idx === 4\)[\s\S]*?answersMatchNoBir\(v, it\.answers\)/.test(html),
  'Expected bir-optional logic to be applied for idx 2 and idx 4'
);

// Q7: RU prompt hint added
mustInclude('Эта история нелогична. (досл. «у этой истории нет логичной стороны»)', 'Q7: missing RU hint');

console.log('OK: hw4.html checks passed');
