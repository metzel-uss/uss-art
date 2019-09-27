const moment = require('moment');

// -- Common functions for cleaning form inputs --
const unescapedDelimiterRegex = /(?<!\\);/; // Split on non-escaped semicolons
const unescapeDelimiters = value => {
  if (value === undefined) return null;
  if (typeof value != 'string') return value;
  return value.replace(/\\;/gi, ';').replace(/\\:/gi, ':');
};
const escapeDelimiters = value => {
  if (value === undefined) return null;
  if (typeof value != 'string') return value;
  return value.replace(/;/gi, '\\;').replace(/:/gi, '\\:');
};
const inputArrayFunc = value => value ? (Array.isArray(value) ? value : [value]).map(escapeDelimiters).join(';') : null;
const outputArrayFunc = value => value ? value.toString().split(unescapedDelimiterRegex).map(unescapeDelimiters) : null;
const inputObjectFunc = value => value && typeof value === 'object' ? Object.keys(value).map(k => `${escapeDelimiters(k)}:${escapeDelimiters(value[k])}`).join(';') : null;
const outputObjectFunc = value => value && typeof value === 'string' ? cleanElementOptionsForOutput(value.split(unescapedDelimiterRegex)) : null;

// Convert special key element options to usable data
const cleanElementOptionsForOutput = elementOptionsArray => {
  const elementOptions = {};
  for (let i = 0; i < elementOptionsArray.length; i++) {
    let [key, value] = elementOptionsArray[i].split(/(?<!\\):/);

    switch (key) {
      case 'minDate':
      case 'maxDate':
        if (value === 'today') {
          value = moment(Date.now()).format('YYYY-MM-DD');
        } else if (value.includes('moment')) {
          let [m, num, timeUnit] = value.split('-');
          try {
            value = moment(Date.now()).add(num, timeUnit).format('YYYY-MM-DD');
          } catch (e) {
            value = moment(Date.now()).format('YYYY-MM-DD');
          }
        }
        break;
    }

    elementOptions[unescapeDelimiters(key)] = unescapeDelimiters(value);
  }
  return elementOptions;
};

module.exports = {
  inputArrayFunc,
  outputArrayFunc,
  inputObjectFunc,
  outputObjectFunc
};
