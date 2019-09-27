// Functions for editing/viewing the form types, without any user input

const inputCleaning = require('./inputCleaningFunctions');

const specialFields = {
  options: {
    input: inputCleaning.inputArrayFunc,
    output: inputCleaning.outputArrayFunc
  },

  elementOptions: {
    input: inputCleaning.inputObjectFunc,
    output: inputCleaning.outputObjectFunc
  },

  dependentOnValue: {
    input: inputCleaning.inputArrayFunc,
    output: inputCleaning.outputArrayFunc
  }
};

const specialOptions = {
  stateSelect: [
    "Alabama",
    "Alaska",
    "American Samoa",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District Of Columbia",
    "Federated States Of Micronesia",
    "Florida",
    "Georgia",
    "Guam",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Marshall Islands",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Northern Mariana Islands",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Palau",
    "Pennsylvania",
    "Puerto Rico",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virgin Islands",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
  ],
  boolean: ['Yes', 'No']
};


// Convert any "special" fields to a front-end friendly JSON format
const getGenericErrorResponseForFieldType = type => {
  switch (type) {
    case 'autocomplete':
      return 'Please select a value';
    case 'ADPuser':
      return 'Please select a user';
    case 'boolean':
      return 'Please select yes or no';
    case 'checkbox':
    case 'multiselect':
      return 'Please select at least one value';
    case 'date':
      return 'Please enter a date';
    case 'radio':
    case 'select':
      return 'Please select one';
    case 'stateSelect':
      return 'Please choose a state';
    case 'textarea':
    case 'textbox':
      return 'Please enter some text';
    default:
      return 'Please enter a value';
  }
};
const cleanFieldsForOutput = fields => cleanFieldsForInputOrOutput(fields, 'output');
const cleanFieldsForInput = fields => cleanFieldsForInputOrOutput(fields, 'input');
const cleanFieldsForInputOrOutput = (fields, inOrOut) => {
  if (!fields)
    return [];
  const specialKeys = Object.keys(specialFields);
  return (Array.isArray(fields)? fields : [fields]).map(field => {
    if (!field)
      return {};

    const fieldKeys = Object.keys(field);
    const specialKeysIntersection = specialKeys.filter(x => fieldKeys.includes(x) && field[x]); // Get the special keys that have truthy values for the field
    const fieldHasSpecialKeys = !!specialKeysIntersection.length;
    const requiredErrorMessageIsBlank = !!(field.required === 1 && !field.requiredErrorMessage);
    const fieldHasAutocompleteOptions = !!(field.autocompleteOptions);
    const fieldHasSpecialOptions = !!(!field.options && specialOptions[field.typeName] && !fieldHasAutocompleteOptions);

    if (!fieldHasSpecialKeys && !requiredErrorMessageIsBlank && !fieldHasSpecialOptions && !fieldHasAutocompleteOptions)
      return field;

    const newField = { ...field };
    if (fieldHasSpecialKeys) {
      for (let i = 0; i < specialKeysIntersection.length; i++) {
        const key = specialKeysIntersection[i];
        const func = inOrOut === 'input' ? specialFields[key].input : specialFields[key].output;
        newField[key] = func(newField[key]);
      }
    }

    if (fieldHasAutocompleteOptions) {
      newField.options = newField.autocompleteOptions;
      delete newField.autocompleteOptions;
    } else if (fieldHasSpecialOptions) {
      newField.options = specialOptions[field.typeName];
    }

    if (requiredErrorMessageIsBlank)
      newField.requiredErrorMessage = getGenericErrorResponseForFieldType(newField.typeName || '');

    if (newField.elementOptions && newField.elementOptions.default && (newField.value === undefined || newField.value === null)) {
      newField.value = newField.elementOptions.default;
    }

    return newField;
  });
};

module.exports = {
  cleanFieldsForOutput,
  cleanFieldsForInput
};
