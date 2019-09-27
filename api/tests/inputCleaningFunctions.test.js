const moment = require('moment');
const inputCleaningFunctions = require('../util/inputCleaningFunctions');
jest.mock('moment');
moment.mockImplementation(() => {
  return {
    format: jest.fn()
      .mockImplementation(() => "2019-01-01")
      .mockName("moment.format"),
    add: jest.fn()
      .mockImplementation(() => {
        return {
          format: jest.fn()
            .mockImplementation(() => "2019-01-05")
            .mockName("moment.add.format")
        };
      })
      .mockName("moment.add")
  };
});


// ---- inputArrayFunc ----
test('inputArrayFunc to return null on falsy input', () => {
  expect(inputCleaningFunctions.inputArrayFunc(null)).toBe(null);
  expect(inputCleaningFunctions.inputArrayFunc(0)).toBe(null);
  expect(inputCleaningFunctions.inputArrayFunc('')).toBe(null);
  expect(inputCleaningFunctions.inputArrayFunc(false)).toBe(null);
  expect(inputCleaningFunctions.inputArrayFunc(undefined)).toBe(null);
});

test('inputArrayFunc to return correct value when passed non-array value', () => {
  expect(inputCleaningFunctions.inputArrayFunc(4)).toBe('4');
  expect(inputCleaningFunctions.inputArrayFunc('2')).toBe('2');
  expect(inputCleaningFunctions.inputArrayFunc('abc')).toBe('abc');
  expect(inputCleaningFunctions.inputArrayFunc('abc;def')).toBe('abc\\;def');
  expect(inputCleaningFunctions.inputArrayFunc('abc:def')).toBe('abc\\:def');
  expect(inputCleaningFunctions.inputArrayFunc('abc;:def')).toBe('abc\\;\\:def');
  expect(inputCleaningFunctions.inputArrayFunc(true)).toBe('true');
});

test('inputArrayFunc to return correct value when passed array value', () => {
  expect(inputCleaningFunctions.inputArrayFunc([4])).toBe('4');
  expect(inputCleaningFunctions.inputArrayFunc(['2'])).toBe('2');
  expect(inputCleaningFunctions.inputArrayFunc(['abc'])).toBe('abc');
  expect(inputCleaningFunctions.inputArrayFunc(['abc;def'])).toBe('abc\\;def');
  expect(inputCleaningFunctions.inputArrayFunc(['abc:def'])).toBe('abc\\:def');
  expect(inputCleaningFunctions.inputArrayFunc(['abc;:def'])).toBe('abc\\;\\:def');
  expect(inputCleaningFunctions.inputArrayFunc([true])).toBe('true');

  expect(inputCleaningFunctions.inputArrayFunc([4, '2'])).toBe('4;2');
  expect(inputCleaningFunctions.inputArrayFunc(['2', '4'])).toBe('2;4');
  expect(inputCleaningFunctions.inputArrayFunc(['abc', 1, '2'])).toBe('abc;1;2');
  expect(inputCleaningFunctions.inputArrayFunc(['abc;def', 'abc'])).toBe('abc\\;def;abc');
  expect(inputCleaningFunctions.inputArrayFunc(['abc:def', 'a;bc', 4])).toBe('abc\\:def;a\\;bc;4');
  expect(inputCleaningFunctions.inputArrayFunc(['abc;:def'])).toBe('abc\\;\\:def');
  expect(inputCleaningFunctions.inputArrayFunc([true, false])).toBe('true;false');
});


// ---- outputArrayFunc ----
test('outputArrayFunc to return null on falsy input', () => {
  expect(inputCleaningFunctions.outputArrayFunc(null)).toBe(null);
  expect(inputCleaningFunctions.outputArrayFunc(0)).toBe(null);
  expect(inputCleaningFunctions.outputArrayFunc('')).toBe(null);
  expect(inputCleaningFunctions.outputArrayFunc(false)).toBe(null);
  expect(inputCleaningFunctions.outputArrayFunc(undefined)).toBe(null);
});

test('outputArrayFunc to return correct value when passed non-string value', () => {
  expect(inputCleaningFunctions.outputArrayFunc(4)).toStrictEqual(['4']);
  expect(inputCleaningFunctions.outputArrayFunc(true)).toStrictEqual(['true']);
});

test('outputArrayFunc to return correct value when passed string value', () => {
  expect(inputCleaningFunctions.outputArrayFunc('2')).toStrictEqual(['2']);
  expect(inputCleaningFunctions.outputArrayFunc('abc')).toStrictEqual(['abc']);
  expect(inputCleaningFunctions.outputArrayFunc('abc\\;def')).toStrictEqual(['abc;def']);
  expect(inputCleaningFunctions.outputArrayFunc('abc\\:def')).toStrictEqual(['abc:def']);
  expect(inputCleaningFunctions.outputArrayFunc('abc\\;\\:def')).toStrictEqual(['abc;:def']);
  expect(inputCleaningFunctions.outputArrayFunc('true')).toStrictEqual(['true']);

  expect(inputCleaningFunctions.outputArrayFunc('4;2')).toStrictEqual(['4', '2']);
  expect(inputCleaningFunctions.outputArrayFunc('2;4')).toStrictEqual(['2', '4']);
  expect(inputCleaningFunctions.outputArrayFunc('abc;1;2')).toStrictEqual(['abc', '1', '2']);
  expect(inputCleaningFunctions.outputArrayFunc('abc\\;def;abc')).toStrictEqual(['abc;def', 'abc']);
  expect(inputCleaningFunctions.outputArrayFunc('abc\\:def;a\\;bc;4')).toStrictEqual(['abc:def', 'a;bc', '4']);
  expect(inputCleaningFunctions.outputArrayFunc('abc\\;\\:def')).toStrictEqual(['abc;:def']);
  expect(inputCleaningFunctions.outputArrayFunc('true;false')).toStrictEqual(['true', 'false']);
});


// ---- inputObjectFunc ----
test('inputObjectFunc to return null on falsy input', () => {
  expect(inputCleaningFunctions.inputObjectFunc(null)).toBe(null);
  expect(inputCleaningFunctions.inputObjectFunc(0)).toBe(null);
  expect(inputCleaningFunctions.inputObjectFunc('')).toBe(null);
  expect(inputCleaningFunctions.inputObjectFunc(false)).toBe(null);
  expect(inputCleaningFunctions.inputObjectFunc(undefined)).toBe(null);
});

test('inputObjectFunc to return correct value when passed non-object value', () => {
  expect(inputCleaningFunctions.inputObjectFunc(4)).toStrictEqual(null);
  expect(inputCleaningFunctions.inputObjectFunc('abc')).toStrictEqual(null);
  expect(inputCleaningFunctions.inputObjectFunc(true)).toStrictEqual(null);
});

test('inputObjectFunc to return correct value when passed object value', () => {
  expect(inputCleaningFunctions.inputObjectFunc(['abc'])).toStrictEqual('0:abc');
  expect(inputCleaningFunctions.inputObjectFunc({ a: 4 })).toStrictEqual('a:4');
  expect(inputCleaningFunctions.inputObjectFunc({ a: '4', b: 4 })).toStrictEqual('a:4;b:4');
  expect(inputCleaningFunctions.inputObjectFunc({ a: 'ab;cd', b: 'ab:cd' })).toStrictEqual('a:ab\\;cd;b:ab\\:cd');
});


// ---- outputObjectFunc ----
test('outputObjectFunc to return null on falsy input', () => {
  expect(inputCleaningFunctions.outputObjectFunc(null)).toBe(null);
  expect(inputCleaningFunctions.outputObjectFunc(0)).toBe(null);
  expect(inputCleaningFunctions.outputObjectFunc('')).toBe(null);
  expect(inputCleaningFunctions.outputObjectFunc(false)).toBe(null);
  expect(inputCleaningFunctions.outputObjectFunc(undefined)).toBe(null);
});

test('outputObjectFunc to return correct value when passed non-string value', () => {
  expect(inputCleaningFunctions.outputObjectFunc(4)).toStrictEqual(null);
  expect(inputCleaningFunctions.outputObjectFunc(['abc'])).toStrictEqual(null);
  expect(inputCleaningFunctions.outputObjectFunc({ a: 'abc' })).toStrictEqual(null);
  expect(inputCleaningFunctions.outputObjectFunc(true)).toStrictEqual(null);
});

test('outputObjectFunc to return correct value when passed string value', () => {
  expect(inputCleaningFunctions.outputObjectFunc('abc')).toStrictEqual({ abc: null });
  expect(inputCleaningFunctions.outputObjectFunc('abc:def')).toStrictEqual({ abc: 'def' });
  expect(inputCleaningFunctions.outputObjectFunc('abc:def;ghi:jkl')).toStrictEqual({ abc: 'def', ghi: 'jkl' });
  expect(inputCleaningFunctions.outputObjectFunc('abc\\:def:abc\\;def;a\\:b:3')).toStrictEqual({ "abc:def": 'abc;def', "a:b": '3' });

  expect(inputCleaningFunctions.outputObjectFunc('minDate:today')).toStrictEqual({ minDate: moment().format('YYYY-MM-DD') });
  expect(inputCleaningFunctions.outputObjectFunc('maxDate:today')).toStrictEqual({ maxDate: moment().format('YYYY-MM-DD') });
  expect(inputCleaningFunctions.outputObjectFunc('minDate:moment-4-days')).toStrictEqual({ minDate: moment().add(4, 'days').format('YYYY-MM-DD') });
});
