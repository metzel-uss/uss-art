const formInputFields = jest.genMockFromModule('../formInputFields');

formInputFields.cleanFormFieldForInput = jest.fn()
  .mockImplementation(field => {
    const typeName = field.typeName;
    delete field.typeName;
    switch (typeName) {
      case 'checkbox':
      case 'multiselect':
        if (field.value)
          field.value = field.value.join(';');
        return field;
      default:
        return field;
    }
  }).mockName("cleanFormFieldForInput");

formInputFields.cleanFormFieldForOutput = jest.fn()
  .mockImplementation(field => {
    const typeName = field.typeName;
    delete field.typeName;
    switch (typeName) {
      case 'checkbox':
      case 'multiselect':
        if (field.value)
          field.value = field.value.split(/(?<!\\);/);
        return field;
      default:
        return field;
    }
  }).mockName("cleanFormFieldForInput");

module.exports = formInputFields;
