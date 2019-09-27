const specialFormTypeFields = require('../util/specialFormTypeFields');
jest.mock('../util/inputCleaningFunctions');

// ---- cleanFieldsForOutput ----
test('cleanFieldsForOutput to return empty array when given falsy input', () => {
  expect(specialFormTypeFields.cleanFieldsForOutput(null)).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForOutput(0)).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForOutput('')).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForOutput(false)).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForOutput(undefined)).toStrictEqual([]);
});

test('cleanFieldsForOutput to return correct value when given non-array input', () => {
  expect(specialFormTypeFields.cleanFieldsForOutput({ ab: 'c' })).toStrictEqual([{ ab: 'c' }]);
});

test('cleanFieldsForOutput to return correct value when given correct input', () => {
  expect(specialFormTypeFields.cleanFieldsForOutput([{ ab: 'c' }])).toStrictEqual([{ ab: 'c' }]);

  // Special keys
  expect(specialFormTypeFields.cleanFieldsForOutput([{ options: 'opt 1;opt 2' }])).toStrictEqual([{ options: ['opt 1', 'opt 2'] }]);
  expect(specialFormTypeFields.cleanFieldsForOutput([{ elementOptions: 'abc:def;ghi:jkl' }])).toStrictEqual([{ elementOptions: { abc: 'def', ghi: 'jkl' } }]);
  expect(specialFormTypeFields.cleanFieldsForOutput([{ dependentOnValue: '1;2' }])).toStrictEqual([{ dependentOnValue: ['1', '2'] }]);

  // Required/required error message
  expect(specialFormTypeFields.cleanFieldsForOutput([{ required: 1, typeName: 'textbox' }])).toStrictEqual([{ required: 1, typeName: 'textbox', requiredErrorMessage: "Please enter some text" }]);
  expect(specialFormTypeFields.cleanFieldsForOutput([{ required: 1, typeName: 'textbox', requiredErrorMessage: 'Error' }])).toStrictEqual([{ required: 1, typeName: 'textbox', requiredErrorMessage: 'Error' }]);

  // Autocomplete options
  expect(specialFormTypeFields.cleanFieldsForOutput([{ autocompleteOptions: [{ a: 'bc' }] }])).toStrictEqual([{ options: [{ a: 'bc' }] }]);

  // Special options
  expect(specialFormTypeFields.cleanFieldsForOutput([{ typeName: 'boolean' }])).toStrictEqual([{ typeName: 'boolean', options: ['Yes', 'No'] }]);

  // Default value
  expect(specialFormTypeFields.cleanFieldsForOutput([{ elementOptions: 'default:abc' }])).toStrictEqual([{ elementOptions: { default: 'abc' }, value: 'abc' }]);
  expect(specialFormTypeFields.cleanFieldsForOutput([{ elementOptions: 'default:abc', value: null }])).toStrictEqual([{ elementOptions: { default: 'abc' }, value: 'abc' }]);
  expect(specialFormTypeFields.cleanFieldsForOutput([{ elementOptions: 'default:abc', value: "aaa" }])).toStrictEqual([{ elementOptions: { default: 'abc' }, value: 'aaa' }]);
});


// ---- cleanFieldsForInput ----
test('cleanFieldsForInput to return empty array when given falsy input', () => {
  expect(specialFormTypeFields.cleanFieldsForInput(null)).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForInput(0)).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForInput('')).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForInput(false)).toStrictEqual([]);
  expect(specialFormTypeFields.cleanFieldsForInput(undefined)).toStrictEqual([]);
});

test('cleanFieldsForInput to return correct value when given non-array input', () => {
  expect(specialFormTypeFields.cleanFieldsForInput({ ab: 'c' })).toStrictEqual([{ ab: 'c' }]);
});

test('cleanFieldsForInput to return correct value when given correct input', () => {
  expect(specialFormTypeFields.cleanFieldsForInput([{ ab: 'c' }])).toStrictEqual([{ ab: 'c' }]);

  // Special keys
  expect(specialFormTypeFields.cleanFieldsForInput([{ options: ['opt 1', 'opt 2'] }])).toStrictEqual([{ options: 'opt 1;opt 2' }]);
  expect(specialFormTypeFields.cleanFieldsForInput([{ elementOptions: { abc: 'def', ghi: 'jkl' } }])).toStrictEqual([{ elementOptions: 'abc:def;ghi:jkl' }]);
  expect(specialFormTypeFields.cleanFieldsForInput([{ dependentOnValue: ['1', '2'] }])).toStrictEqual([{ dependentOnValue: '1;2' }]);

  // Required/required error message
  expect(specialFormTypeFields.cleanFieldsForInput([{ required: 1, typeName: 'textbox' }])).toStrictEqual([{ required: 1, typeName: 'textbox', requiredErrorMessage: "Please enter some text" }]);
  expect(specialFormTypeFields.cleanFieldsForInput([{ required: 1, typeName: 'textbox', requiredErrorMessage: 'Error' }])).toStrictEqual([{ required: 1, typeName: 'textbox', requiredErrorMessage: 'Error' }]);

  // Autocomplete options
  expect(specialFormTypeFields.cleanFieldsForInput([{ autocompleteOptions: [{ a: 'bc' }] }])).toStrictEqual([{ options: [{ a: 'bc' }] }]);

  // Special options
  expect(specialFormTypeFields.cleanFieldsForInput([{ typeName: 'boolean' }])).toStrictEqual([{ typeName: 'boolean', options: ['Yes', 'No'] }]);

  // Default value
  expect(specialFormTypeFields.cleanFieldsForInput([{ elementOptions: {default: 'abc'} }])).toStrictEqual([{ elementOptions: 'default:abc' }]);
});
