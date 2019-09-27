const moment = require('moment');

exports.tableName = 'fieldToRequestForm';

exports.inserts = [
  // New User Request example
  { requestFormId: 1, fieldId: 1, value: 'Jimothy Carrot' }, // Requestor Information - Requestor
  { requestFormId: 1, fieldId: 2, value: '111-222-3333' }, // Requestor Information - Telephone
  { requestFormId: 1, fieldId: 3, value: 'jimothy.carrot@example.net' }, // Requestor Information - Requestor Email

  { requestFormId: 1, fieldId: 4, value: 'Georgia' }, // Employee Information - First Name
  { requestFormId: 1, fieldId: 5, value: 'K' }, // Employee Information - Middle Initial
  { requestFormId: 1, fieldId: 6, value: 'Pearson' }, // Employee Information - Last Name
  { requestFormId: 1, fieldId: 7, value: 'Cubicle Carpenter' }, // Employee Information - Job Title
  { requestFormId: 1, fieldId: 8, value: moment(Date.now()).add(7, 'days').format('YYYY-MM-DD') }, // Employee Information - Start Date
  { requestFormId: 1, fieldId: 9, value: 'Northeast' }, // Employee Information - Region
  { requestFormId: 1, fieldId: 10, value: '123 Turnip Ave' }, // Employee Information - Address
  { requestFormId: 1, fieldId: 11, value: 'Fox Burrow' }, // Employee Information - City
  { requestFormId: 1, fieldId: 12, value: '07734' }, // Employee Information - Zip Code
  { requestFormId: 1, fieldId: 13, value: 'Maintenance' }, // Employee Information - Department
  { requestFormId: 1, fieldId: 14, value: 'Jimothy Carrot' }, // Employee Information - Manager/Supervisor
  { requestFormId: 1, fieldId: 15, value: 'Yes - Signed & Filed' }, // Employee Information - Internet and Internal Email System Policy
  { requestFormId: 1, fieldId: 16, value: 'Tequila Mockingbird' }, // Employee Information - HR Representative
  { requestFormId: 1, fieldId: 17, value: 'Contractor' }, // Employee Information - Employment Type
  { requestFormId: 1, fieldId: 18, value: moment(Date.now()).add(160, 'days').format('YYYY-MM-DD') }, // Employee Information - Exp. Date

  { requestFormId: 1, fieldId: 19, value: 'Laptop' }, // Computer - Type of Computer
  { requestFormId: 1, fieldId: 20, value: 'Other' }, // Computer - Specialty Software
  { requestFormId: 1, fieldId: 21, value: 'AutoCAD' }, // Computer - Other
  { requestFormId: 1, fieldId: 22, value: 'No' }, // Computer - USS Remote?

  { requestFormId: 1, fieldId: 23, value: 'Reassign Existing Number' }, // Telephone - Desk Phone/Extension
  { requestFormId: 1, fieldId: 24, value: '808-303-1010' }, // Telephone - Mobile

  { requestFormId: 1, fieldId: 25, value: 'I don\'t know what this field is' }, // Other - Sorry idk what this all is
  { requestFormId: 1, fieldId: 26, value: 'Allergic to spaghetti' }  // Additional Requests - Notes
];
