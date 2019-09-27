const moment = require('moment');

exports.tableName = 'fieldToRequestForm';

exports.inserts = [
  // ---- New User Request ----
  // Requestor Information
  { requestFormId: 1, fieldId: 1, value: 'Jimothy Carrot' }, // Requestor
  { requestFormId: 1, fieldId: 2, value: '111-222-3333' }, // Telephone
  { requestFormId: 1, fieldId: 3, value: 'jimothy.carrot@example.net' }, // Requestor Email

  // Employee Information
  { requestFormId: 1, fieldId: 4, value: 'Georgia' }, // First Name
  { requestFormId: 1, fieldId: 5, value: 'K' }, // Middle Initial
  { requestFormId: 1, fieldId: 6, value: 'Pearson' }, // Last Name
  { requestFormId: 1, fieldId: 7, value: '16' }, // Job Title
  { requestFormId: 1, fieldId: 8, value: 'Cubicle Carpenter' }, // Other Job Title
  { requestFormId: 1, fieldId: 9, value: moment(Date.now()).add(7, 'days').format('YYYY-MM-DD') }, // Start Date
  { requestFormId: 1, fieldId: 10, value: 'Northeast' }, // Region
  { requestFormId: 1, fieldId: 11, value: '123 Turnip Ave' }, // Address
  { requestFormId: 1, fieldId: 12, value: 'Fox Burrow' }, // City
  { requestFormId: 1, fieldId: 13, value: 'Massachusetts' }, // State
  { requestFormId: 1, fieldId: 14, value: 07734 }, // Zip Code
  { requestFormId: 1, fieldId: 15, value: '4' }, // Department
  { requestFormId: 1, fieldId: 16, value: '253262245527' }, // Manager/Supervisor
  { requestFormId: 1, fieldId: 17, value: 'true' }, // Internet and Internal Email System Policy
  { requestFormId: 1, fieldId: 18, value: 'Tequila Mockingbird' }, // HR Representative
  { requestFormId: 1, fieldId: 19, value: 'Contractor' }, // Employment Type
  { requestFormId: 1, fieldId: 20, value: moment(Date.now()).add(160, 'days').format('YYYY-MM-DD') }, // Exp. Date

  // Computer
  { requestFormId: 1, fieldId: 21, value: 'Laptop' }, // Type of Computer
  { requestFormId: 1, fieldId: 22, value: 'Other' }, // Specialty Software
  { requestFormId: 1, fieldId: 23, value: 'AutoCAD' }, // Other
  { requestFormId: 1, fieldId: 24, value: 'false' }, // USS Remote?

  // Telephone
  { requestFormId: 1, fieldId: 26, value: 'Reassign Existing Number' }, // Desk Phone/Extension
  { requestFormId: 1, fieldId: 27, value: 'Yes' }, // Mobile

  // Other
  { requestFormId: 1, fieldId: 28, value: true }, // Citrix Desktop
  { requestFormId: 1, fieldId: 29, value: 'Salesperson Code' }, // Salesperson Code

  // Additional Requests
  { requestFormId: 1, fieldId: 30, value: 'Allergic to spaghetti' }, // Notes
  
  
  // ---- Termination Request ----
  // Requestor Info
  { requestFormId: 2, fieldId: 31, value: 'Tyreece Marriott' }, // Requestor
  { requestFormId: 2, fieldId: 32, value: '111-222-3333' }, // Telephone
  { requestFormId: 2, fieldId: 33, value: 'tyreece.marriott@example.net' }, // Requestor Email

  // Employee Info
  { requestFormId: 2, fieldId: 34, value: 'Malika' }, // First Name
  { requestFormId: 2, fieldId: 35, value: 'F' }, // Middle Initial
  { requestFormId: 2, fieldId: 36, value: 'Forrest' }, // Last Name
  { requestFormId: 2, fieldId: 37, value: 'mfforr' }, // AD Alias
  { requestFormId: 2, fieldId: 38, value: '2019' }, // Date of Termination
  { requestFormId: 2, fieldId: 39, value: '3' }, // Department
  { requestFormId: 2, fieldId: 40, value: '662019182962' }, // Manager/Supervisor
  { requestFormId: 2, fieldId: 41, value: 'Blane Shah' }, // HR Representative
  
  // Computer/Email
  { requestFormId: 2, fieldId: 42, value: 'Laptop' }, // Computer
  { requestFormId: 2, fieldId: 43, value: 'In transit' }, // Where is Laptop?
  { requestFormId: 2, fieldId: 44, value: moment(Date.now()).add(-2, 'days').format('YYYY-MM-DD') }, // Laptop Shipped Back To Corporate?
  { requestFormId: 2, fieldId: 45, value: 'ABC1234' }, // Tracking Number
  { requestFormId: 2, fieldId: 46, value: true }, // Set-Up Out of Office Message [Email]
  { requestFormId: 2, fieldId: 47, value: "jimothy.carrot@example.net" }, // Redirect Email To
  { requestFormId: 2, fieldId: 48, value: true }, // Require My Documents Shortcut
  { requestFormId: 2, fieldId: 49, value: 'Jimothy Carrot' }, // Provide Document Shortcut To
  { requestFormId: 2, fieldId: 50, value: '5 Days' }, // How Long For?

  // Telephone
  { requestFormId: 2, fieldId: 51, value: true }, // Has Desk Phone/Extension
  { requestFormId: 2, fieldId: 52, value: '44355' }, // Extension
  { requestFormId: 2, fieldId: 53, value: true }, // Has Cellphone
  { requestFormId: 2, fieldId: 54, value: 'Not yet shipped' }, // Where Is Cellphone?
  
  
  // ---- New User Request ----
  // Requestor Info
  { requestFormId: 3, fieldId: 57, value: 'Jarpo Humbert' }, // Requestor
  { requestFormId: 3, fieldId: 58, value: '(123) 333-6253' }, // Telephone
  { requestFormId: 3, fieldId: 59, value: 'jarpo.humbert@example.horse' }, // Requestor Email

  // Employee Information
  { requestFormId: 3, fieldId: 60, value: 'Jarpo Humbert' }, // Request Access For User

  // Business Applications
  { requestFormId: 3, fieldId: 68, value: 'I need these for stuff and things.' }, // Business Justification
  { requestFormId: 3, fieldId: 69, value: 'Beep' }, // Special Notes

  // Field 67 table
  { requestFormId: 3, fieldId: 70, rowId: 1, value: 'Visio' }, // Business Application
  { requestFormId: 3, fieldId: 71, rowId: 1, value: 'N/A' }, // Environment
  { requestFormId: 3, fieldId: 72, rowId: 1, value: 'N/A' }, // Access Roles
  { requestFormId: 3, fieldId: 73, rowId: 1, value: moment(Date.now()).format('YYYY-MM-DD') }, // Effective Date
  { requestFormId: 3, fieldId: 74, rowId: 1, value: '' }, // Business Owner
  { requestFormId: 3, fieldId: 75, rowId: 1, value: '' }, // End Date

  { requestFormId: 3, fieldId: 70, rowId: 2, value: 'Salesforce' }, // Business Application
  { requestFormId: 3, fieldId: 71, rowId: 2, value: 'Dev;QA' }, // Environment
  { requestFormId: 3, fieldId: 72, rowId: 2, value: 'BA' }, // Access Roles
  { requestFormId: 3, fieldId: 73, rowId: 2, value: moment(Date.now()).add(-12, 'days').format('YYYY-MM-DD') }, // Effective Date
  { requestFormId: 3, fieldId: 74, rowId: 2, value: 'David Nirtquig' }, // Business Owner
  { requestFormId: 3, fieldId: 75, rowId: 2, value: moment(Date.now()).add(365, 'days').format('YYYY-MM-DD') } // End Date
];
