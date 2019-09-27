const fieldBase = {
  id: 1,
  categoryId: 1,
  name: 'Field Test',
  sortOrder: 1,
  typeId: 1,
  elementOptions: 'fieldSize:4'
};

const opt1 = 'Opt 1';
const opt2 = 'Opt 2';
const opt3 = 'Opt 3';

const multipleOptionsFieldBase = {
  ...fieldBase,
  options: `${opt1};${opt2};${opt3}`
};
const multipleOptionsFieldInput = {
  ...multipleOptionsFieldBase,
  value: [opt2, opt1]
};
const multipleOptionsFieldOutput = {
  ...multipleOptionsFieldBase,
  value: `${opt2};${opt1}`
};

const oneOptionFieldBase = {
  ...fieldBase,
  options: opt1
};
const oneOptionFieldInput = {
  ...oneOptionFieldBase,
  value: [opt1]
};
const oneOptionFieldOutput = {
  ...oneOptionFieldBase,
  value: opt1
};


module.exports = {
  textareaFieldOutput: { ...fieldBase, typeName: 'textarea', value: 'Text area' },
  textareaFieldInput: { ...fieldBase, typeName: 'textarea', value: 'Text area' },

  textboxFieldOutput: { ...fieldBase, typeName: 'textbox', value: 'Text box' },
  textboxFieldInput: { ...fieldBase, typeName: 'textbox', value: 'Text box' },

  checkboxFieldOutput: { ...multipleOptionsFieldOutput, typeName: 'checkbox' },
  checkboxFieldInput: { ...multipleOptionsFieldInput, typeName: 'checkbox' },

  checkboxOneOptionFieldOutput: { ...oneOptionFieldOutput, typeName: 'checkbox' },
  checkboxOneOptionFieldInput: { ...oneOptionFieldInput, typeName: 'checkbox' },

  multiselectFieldOutput: { ...multipleOptionsFieldOutput, typeName: 'multiselect' },
  multiselectFieldInput: { ...multipleOptionsFieldInput, typeName: 'multiselect' },

  multiselectOneOptionFieldOutput: { ...oneOptionFieldOutput, typeName: 'multiselect' },
  multiselectOneOptionFieldInput: { ...oneOptionFieldInput, typeName: 'multiselect' },

  selectFieldOutput: { ...multipleOptionsFieldBase, value: opt1, typeName: 'select' },
  selectFieldInput: { ...multipleOptionsFieldBase, value: opt1, typeName: 'select' },

  radioFieldOutput: { ...multipleOptionsFieldBase, value: opt1, typeName: 'radio' },
  radioFieldInput: { ...multipleOptionsFieldBase, value: opt1, typeName: 'radio' },

  stateSelectFieldOutput: { ...fieldBase, value: 'MA', typeName: 'stateSelect' },
  stateSelectFieldInput: { ...fieldBase, value: 'MA', typeName: 'stateSelect' },

  readonlyFieldOutput: { ...fieldBase, value: 'Read Only', typeName: 'readonly' },
  readonlyFieldInput: { ...fieldBase, value: 'Read Only', typeName: 'readonly' },

  numericFieldOutput: { ...fieldBase, value: 123, typeName: 'numeric' },
  numericFieldInput: { ...fieldBase, value: 123, typeName: 'numeric' },

  booleanFieldOutput: { ...fieldBase, value: true, typeName: 'boolean' },
  booleanFieldInput: { ...fieldBase, value: true, typeName: 'boolean' }
};
