const specialFormTypeFields = jest.genMockFromModule('../specialFormTypeFields');

specialFormTypeFields.cleanFieldsForOutput = jest.fn()
  .mockImplementation(field => {
    const typeName = field.typeName;
    delete field.typeName;
    switch (typeName) {
      case 'elementOptions':
        if (field.value) {
          const vals = field.value.split(/(?<!\\);/);
          const returnValue = {};
          for (let i = 0; i < vals.length; i++) {
            let [key, val] = vals[i].split(/(?<!\\):/);
            key = key.replace(/\\;/gi, ';').replace(/\\:/gi, ':');
            val = val.replace(/\\;/gi, ';').replace(/\\:/gi, ':');
            returnValue[key] = val;
          }
          field.value = returnValue;
        }
        break;
      case 'options':
      case 'dependentOnValue':
        if (field.value)
          field.value = field.value.join(';');
        break;
      }
      return field;
  }).mockName("cleanFieldsForOutput");

specialFormTypeFields.cleanFieldsForInput = jest.fn()
  .mockImplementation(field => {
    const typeName = field.typeName;
    delete field.typeName;
    switch (typeName) {
      case 'elementOptions':
        if (field.value) {
          const keys = Object.keys(field.value);
          const returnValue = {};
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i].replace(/;/gi, '\\;').replace(/:/gi, '\\:');
            const val = field.value[keys[i]].replace(/;/gi, '\\;').replace(/:/gi, '\\:');
            returnValue[key] = val;
          }
          field.value = returnValue;
        }
        break;
      case 'options':
      case 'dependentOnValue':
        if (field.value)
          field.value = field.value.join(';');
        break;
    }
    return field;
  }).mockName("cleanFieldsForInput");

module.exports = specialFormTypeFields;
