const util = require('./testUtil');
jest.mock('../util/inputCleaningFunctions');
const formInputFields = require('../util/formInputFields');

// ---- Checkbox ----
test('Checkbox values to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.checkboxFieldOutput);
  expect(result).toStrictEqual(util.checkboxFieldInput);
});

test('Checkbox values to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.checkboxFieldInput);
  const expected = { ...util.checkboxFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});

test('Checkbox value with one option to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.checkboxOneOptionFieldOutput);
  expect(result).toStrictEqual(util.checkboxOneOptionFieldInput);
});

test('Checkbox value with one option to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.checkboxOneOptionFieldInput);
  const expected = { ...util.checkboxOneOptionFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Multiselect ----
test('Multiselect values to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.multiselectFieldOutput);
  expect(result).toStrictEqual(util.multiselectFieldInput);
});

test('Multiselect values to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.multiselectFieldInput);
  const expected = { ...util.multiselectFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});

test('Multiselect value with one option to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.multiselectOneOptionFieldOutput);
  expect(result).toStrictEqual(util.multiselectOneOptionFieldInput);
});

test('Multiselect value with one option to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.multiselectOneOptionFieldInput);
  const expected = { ...util.multiselectOneOptionFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Text Area ----
test('Text area value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.textareaFieldOutput);
  expect(result).toStrictEqual(util.textareaFieldInput);
});

test('Text area value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.textareaFieldInput);
  const expected = { ...util.textareaFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Text Box ----
test('Text box value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.textboxFieldOutput);
  expect(result).toStrictEqual(util.textboxFieldInput);
});

test('Text box value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.textboxFieldInput);
  const expected = { ...util.textboxFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Select ----
test('Select value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.selectFieldOutput);
  expect(result).toStrictEqual(util.selectFieldInput);
});

test('Select value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.selectFieldInput);
  const expected = { ...util.selectFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Radio ----
test('Radio value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.radioFieldOutput);
  expect(result).toStrictEqual(util.radioFieldInput);
});

test('Radio value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.radioFieldInput);
  const expected = { ...util.radioFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- State Select ----
test('State select value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.stateSelectFieldOutput);
  expect(result).toStrictEqual(util.stateSelectFieldInput);
});

test('State select value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.stateSelectFieldInput);
  const expected = { ...util.stateSelectFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Read Only ----
test('Read only value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.readonlyFieldOutput);
  expect(result).toStrictEqual(util.readonlyFieldInput);
});

test('Read only value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.readonlyFieldInput);
  const expected = { ...util.readonlyFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Numeric ----
test('Numeric value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.numericFieldOutput);
  expect(result).toStrictEqual(util.numericFieldInput);
});

test('Numeric value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.numericFieldInput);
  const expected = { ...util.numericFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});


// ---- Boolean ----
test('Boolean value to be cleaned for output', () => {
  const result = formInputFields.cleanFormFieldForOutput(util.booleanFieldOutput);
  expect(result).toStrictEqual(util.booleanFieldInput);
});

test('Boolean value to be cleaned for input', () => {
  const result = formInputFields.cleanFormFieldForInput(util.booleanFieldInput);
  const expected = { ...util.booleanFieldOutput };
  delete expected.typeName;
  expect(result).toStrictEqual(expected);
});
