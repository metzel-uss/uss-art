// The difference between these functions and the ones in specialFormTypeFields is that these are for the actual user form
// specialFormTypeFields is for editing/viewing the form types, without any user input

const inputCleaning = require('./inputCleaningFunctions');

const specialFormInputTypes = {
  checkbox: {
    input: inputCleaning.inputArrayFunc,
    output: inputCleaning.outputArrayFunc
  },
  multiselect: {
    input: inputCleaning.inputArrayFunc,
    output: inputCleaning.outputArrayFunc
  }
};

const cleanFormFieldForInput = field => cleanUserInputFieldForInputOrOutput(field, "input");
const cleanFormFieldForOutput = field => cleanUserInputFieldForInputOrOutput(field, "output");
const cleanUserInputFieldForInputOrOutput = (field, inOrOut) => {
  const fieldTypeName = field.typeName;
  if (inOrOut === 'input')
    delete field.typeName;
  if (specialFormInputTypes[fieldTypeName]) {
    const newField = {...field};
    const func = inOrOut === 'input'? specialFormInputTypes[fieldTypeName].input : specialFormInputTypes[fieldTypeName].output;
    newField.value = func(newField.value);
    return newField;
  } else {
    return field;
  }
};

module.exports = {
  cleanFormFieldForInput,
  cleanFormFieldForOutput
};
