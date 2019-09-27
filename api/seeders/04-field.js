exports.tableName = 'field';

exports.inserts = [
  // ---- New User Acess Form ----
  // Requestor Info
  { id: 1, categoryId: 1, name: 'Requestor', typeId: 10, sortOrder: 1 },
  { id: 2, categoryId: 1, name: 'Telephone', typeId: 10, sortOrder: 2 },
  { id: 3, categoryId: 1, name: 'Requestor Email', typeId: 10, sortOrder: 3 },

  // Employee Info
  { id: 4, categoryId: 2, name: 'First Name', typeId: 2, required: 1, sortOrder: 1, elementOptions: 'fieldSize:5' },
  { id: 5, categoryId: 2, name: 'Middle Initial', typeId: 2, required: 1, sortOrder: 2, elementOptions: 'fieldSize:2' },
  { id: 6, categoryId: 2, name: 'Last Name', typeId: 2, required: 1, sortOrder: 3, elementOptions: 'fieldSize:5' },
  { id: 7, categoryId: 2, name: 'Job Title', typeId: 12, required: 1, sortOrder: 4, elementOptions: 'fieldSize:4'  },
  { id: 8, categoryId: 2, name: 'Other Job Title', typeId: 2, required: 1, sortOrder: 5,
    dependentOnId: 7, dependentOnValue: 'Other', requiredErrorMessage: 'Please enter a job title', elementOptions: 'fieldSize:4' },
  { id: 9, categoryId: 2, name: 'Start Date', typeId: 7, required: 1, sortOrder: 6,
    elementOptions: 'minDate:today;fieldSize:4' },
  { id: 10, categoryId: 2, name: 'Region', typeId: 3, required: 1, sortOrder: 7, options: 'Northwest;Southwest;Mountain;South Central;Northeast;Southeast', elementOptions: 'fieldSize:4' },
  { id: 11, categoryId: 2, name: 'Address', typeId: 2, required: 1, sortOrder: 8, elementOptions: 'fieldSize:12' },
  { id: 12, categoryId: 2, name: 'City', typeId: 2, required: 1, sortOrder: 9, elementOptions: 'fieldSize:4' },
  { id: 13, categoryId: 2, name: 'State', typeId: 9, required: 1, sortOrder: 10, elementOptions: 'fieldSize:4' },
  { id: 14, categoryId: 2, name: 'Zip Code', typeId: 11, required: 1, sortOrder: 11, elementOptions: 'min:0;max:999999999;fieldSize:4' },
  { id: 15, categoryId: 2, name: 'Department', typeId: 12, required: 1, sortOrder: 12, elementOptions: 'fieldSize:4' },
  { id: 16, categoryId: 2, name: 'Manager/Supervisor', typeId: 12, required: 1, sortOrder: 13, elementOptions: 'fieldSize:4' }, // TODO make this an ADP user field
  { id: 17, categoryId: 2, name: 'Internet and Internal Email System Policy, Signed/Filed',
    typeId: 13, required: 1, requiredErrorMessage: 'Please pick an internet policy response', sortOrder: 14, elementOptions: 'fieldSize:4' },
  { id: 18, categoryId: 2, name: 'HR Representative', typeId: 2, required: 1, sortOrder: 15, elementOptions: 'fieldSize:4' }, // TODO make this an ADP user field
  { id: 19, categoryId: 2, name: 'Employment Type', typeId: 3, required: 1, requiredErrorMessage: 'Please pick an employee type', sortOrder: 16,
    options: 'Employee;Contractor', elementOptions: 'fieldSize:4' },
  { id: 20, categoryId: 2, name: 'Exp. Date', typeId: 7, sortOrder: 17,
    dependentOnId: 19, dependentOnValue: 'Contractor', elementOptions: 'maxDate:moment-6-month;fieldSize:4' },

  // Computer
  { id: 21, categoryId: 3, name: 'Type of Computer', typeId: 3, sortOrder: 1, required: 1,
    options: 'None;Laptop;Desktop (Terminal)', elementOptions: 'fieldSize:4;default:None' },
  { id: 22, categoryId: 3, name: 'Specialty Software', typeId: 6, sortOrder: 3,
    options: 'Snag It;Visio;Project;Other', elementOptions: 'fieldSize:4' },
  { id: 23, categoryId: 3, name: 'Other', typeId: 2, sortOrder: 4, dependentOnId: 22, dependentOnValue: 'Other', elementOptions: 'fieldSize:4' },
  { id: 24, categoryId: 3, name: 'USS Remote?', typeId: 13, sortOrder: 5, required: 0, elementOptions: 'fieldSize:4' },
  { id: 25, categoryId: 3, name: 'Mirror Access', typeId: 2, sortOrder: 2, elementOptions: 'fieldSize:4' }, // TODO make this an ADP user field

  // Telephone
  { id: 26, categoryId: 4, name: 'Desk Phone/Extension', typeId: 3, sortOrder: 1, required: 1,
    options: 'None;New;Reassign Existing Number;Replace Existing Deskphone', elementOptions: 'fieldSize:4;default:None' },
  { id: 27, categoryId: 4, name: 'Mobile', typeId: 13, sortOrder: 2, required: 1, elementOptions: 'fieldSize:4;default:No' },

  // Other
  { id: 28, categoryId: 5, name: 'Citrix Desktop', typeId: 13, sortOrder: 1, elementOptions: 'fieldSize:2' },
  { id: 29, categoryId: 5, name: 'Navision', typeId: 6, sortOrder: 2, options: 'Salesperson Code;CCR Code;Purchaser Code', elementOptions: 'fieldSize:4'},

  // Additional Requests/Notes
  { id: 30, categoryId: 6, name: 'Notes', typeId: 1, sortOrder: 1, elementOptions: 'fieldSize:12' },


  // ---- Termination Request ----
  // Requestor Info
  { id: 31, categoryId: 7, name: 'Requestor', typeId: 10, sortOrder: 1 },
  { id: 32, categoryId: 7, name: 'Telephone', typeId: 10, sortOrder: 2 },
  { id: 33, categoryId: 7, name: 'Requestor Email', typeId: 10, sortOrder: 3 },

  // Employee Info
  { id: 34, categoryId: 8, name: 'First Name', typeId: 2, required: 1, sortOrder: 1, elementOptions: 'fieldSize:5' },
  { id: 35, categoryId: 8, name: 'Middle Initial', typeId: 2, required: 1, sortOrder: 2, elementOptions: 'fieldSize:2' },
  { id: 36, categoryId: 8, name: 'Last Name', typeId: 2, required: 1, sortOrder: 3, elementOptions: 'fieldSize:5' },
  { id: 37, categoryId: 8, name: 'AD Alias', typeId: 2, required: 1, sortOrder: 4, elementOptions: 'fieldSize:4'  },
  { id: 38, categoryId: 8, name: 'Date of Termination', typeId: 7, sortOrder: 17, elementOptions: 'maxDate:moment-6-month;fieldSize:4' },
  { id: 39, categoryId: 8, name: 'Department', typeId: 12, required: 1, sortOrder: 12, elementOptions: 'fieldSize:4' },
  { id: 40, categoryId: 8, name: 'Manager/Supervisor', typeId: 12, required: 1, sortOrder: 13, elementOptions: 'fieldSize:4' }, // TODO make this an ADP user field
  { id: 41, categoryId: 8, name: 'HR Representative', typeId: 2, required: 1, sortOrder: 15, elementOptions: 'fieldSize:4' }, // TODO make this an ADP user field

  // Computer/Email
  { id: 42, categoryId: 9, name: 'Computer', typeId: 3, sortOrder: 1, required: 1,
    options: 'None;Laptop;Desktop (Terminal)', elementOptions: 'fieldSize:4;default:None' },
  { id: 43, categoryId: 9, name: 'Where is Laptop?', typeId: 2, sortOrder: 2, dependentOnId: 42, dependentOnValue: 'Laptop', elementOptions: 'fieldSize:4' },
  { id: 44, categoryId: 9, name: 'Laptop Shipped Back To Corporate?', typeId: 7, required: 1, sortOrder: 3,
    elementOptions: 'fieldSize:4', dependentOnId: 42, dependentOnValue: 'Laptop' },
  { id: 45, categoryId: 9, name: 'Tracking Number', typeId: 2, sortOrder: 4, elementOptions: 'fieldSize:4', dependentOnId: 42, dependentOnValue: 'Laptop' },
  { id: 46, categoryId: 9, name: 'Set-Up Out of Office Message [Email]', typeId: 13, sortOrder: 5 },
  { id: 47, categoryId: 9, name: 'Redirect Email To', typeId: 1, sortOrder: 6, elementOptions: 'fieldSize:4', dependentOnId: 46 },
  { id: 48, categoryId: 9, name: 'Require My Documents Shortcut', typeId: 13, sortOrder: 7 },
  { id: 49, categoryId: 9, name: 'Provide Document Shortcut To', typeId: 1, sortOrder: 8, elementOptions: 'fieldSize:4', dependentOnId: 48 },
  { id: 50, categoryId: 9, name: 'How Long For?', typeId: 1, sortOrder: 9, elementOptions: 'fieldSize:4', dependentOnId: 48 },

  // Telephone
  { id: 51, categoryId: 10, name: 'Has Desk Phone/Extension', typeId: 13, sortOrder: 1 },
  { id: 52, categoryId: 10, name: 'Extension', typeId: 2, sortOrder: 2, elementOptions: 'fieldSize:4', dependentOnId: 51 },
  { id: 53, categoryId: 10, name: 'Has Cellphone', typeId: 13, sortOrder: 3, elementOptions: 'fieldSize:4' },
  { id: 54, categoryId: 10, name: 'Where Is Cellphone?', typeId: 2, sortOrder: 4, elementOptions: 'fieldSize:4', dependentOnId: 53 },
  { id: 55, categoryId: 10, name: 'Cellphone Shipped Back to Corporate?', typeId: 7, sortOrder: 5, elementOptions: 'fieldSize:4', dependentOnId: 53 },
  { id: 56, categoryId: 10, name: 'Tracking Number', typeId: 2, sortOrder: 6, elementOptions: 'fieldSize:4', dependentOnId: 55 },


  // ---- Business Application Request ----
  // Requestor Info
  { id: 57, categoryId: 12, name: 'Requestor', typeId: 10, sortOrder: 1 },
  { id: 58, categoryId: 12, name: 'Telephone', typeId: 10, sortOrder: 2 },
  { id: 59, categoryId: 12, name: 'Requestor Email', typeId: 10, sortOrder: 3 },

  // Employee Information
  { id: 60, categoryId: 13, name: 'Request Access For User', typeId: 2, required: 1, sortOrder: 1, elementOptions: 'fieldSize:4' }, // TODO make this an ADP user field
  { id: 61, categoryId: 13, name: 'If you are unable to find the user in the list above, select this box', typeId: 13, sortOrder: 2, elementOptions: 'fieldSize:4' },
  { id: 62, categoryId: 13, name: 'First Name', typeId: 2, required: 1, sortOrder: 3, elementOptions: 'fieldSize:5', dependentOnId: 61 },
  { id: 63, categoryId: 13, name: 'Middle Initial', typeId: 2, required: 1, sortOrder: 4, elementOptions: 'fieldSize:2', dependentOnId: 61 },
  { id: 64, categoryId: 13, name: 'Last Name', typeId: 2, required: 1, sortOrder: 5, elementOptions: 'fieldSize:5', dependentOnId: 61 },
  { id: 65, categoryId: 13, name: 'Email Address', typeId: 2, required: 1, sortOrder: 6, elementOptions: 'fieldSize:5', dependentOnId: 61 },
  { id: 66, categoryId: 13, name: 'I am authorized to make the request and acknowledge that the access is required for legitimate business reasons.  I understand that if I provide false information in connection with this request, or misuse this access or the information obtained, I will be subjected to discipline, up to and including termination.',
    typeId: 13, required: 1, requiredErrorMessage: 'You must agree to continue', sortOrder: 7, elementOptions: 'fieldSize:12' },

  // Business Applications
  { id: 67, categoryId: 14, name: 'USS Business Applications', typeId: 14, sortOrder: 1, elementOptions: 'fieldSize:12' },
  { id: 68, categoryId: 14, name: 'Business Justification', typeId: 1, sortOrder: 2, elementOptions: 'fieldSize:5' },
  { id: 69, categoryId: 14, name: 'Special Notes', typeId: 1, sortOrder: 3, elementOptions: 'fieldSize:5' },

  // Field 67 table
  { id: 70, categoryId: 14, name: 'Business Application', typeId: 2, sortOrder: 1, forTableFieldId: 67, required: 1 },
  { id: 71, categoryId: 14, name: 'Environment', typeId: 6, sortOrder: 2, options: 'Development;QA;Prod;N/A', forTableFieldId: 67, required: 1 },
  { id: 72, categoryId: 14, name: 'Access Roles', typeId: 2, sortOrder: 3, forTableFieldId: 67 },
  { id: 73, categoryId: 14, name: 'Effective Date', typeId: 7, sortOrder: 4, forTableFieldId: 67, required: 1 },
  { id: 74, categoryId: 14, name: 'Business Owner', typeId: 2, sortOrder: 6, forTableFieldId: 67 }, // TODO make ADP user
  { id: 75, categoryId: 14, name: 'End Date', typeId: 7, sortOrder: 5, forTableFieldId: 67 }


  // // ---- Test Form ----
  // // Ponies
  // { id: 34, categoryId: 7, name: 'Who\'s Here To Answer Questions About Ponies?', typeId: 10 },
  // { id: 35, categoryId: 7, name: 'Your Favorite Mane Six Pony', typeId: 4, sortOrder: 1, options: 'Fluttershy;Rainbow Dash;Twilight Sparkle;Rarity;Applejack;Pinkie Pie',
  //   required: 1, requiredErrorMessage: "Please select your favorite mane six pony", elementOptions: 'default:Applejack' },
  // { id: 36, categoryId: 7, name: 'Your Pony Name', typeId: 2, sortOrder: 2 },
  //
  // // Dragons
  // { id: 37, categoryId: 8, name: 'When Will We Find The Dragons?', typeId: 7, sortOrder: 1, required: 1, elementOptions: 'maxDate:moment-20-year;minDate:today' },
  // { id: 38, categoryId: 8, name: 'Where Will We Find The Dragons?', typeId: 9, sortOrder: 2, required: 1 },
  // { id: 39, categoryId: 8, name: 'Your Favorite Type Of Dragon', typeId: 3, sortOrder: 3, required: 1, options: 'Asian Lung;Knucker;Western;Wyvern;Drake' },
  // { id: 40, categoryId: 8, name: 'ADP User Most Likely To Secretly Be A Dragon', typeId: 8, sortOrder: 4 },
  //
  // // Snacks
  // { id: 41, categoryId: 9, name: 'Pick Your Snacks', typeId: 5, sortOrder: 1, options: 'Cookies;Chips;Candy;Chocolate;Popcorn' },
  // { id: 42, categoryId: 9, name: 'Pick More Snacks', typeId: 6, sortOrder: 2, options: 'Twix;Snickers;Lay\'s Chips;Keebler Cookies' },
  // { id: 43, categoryId: 9, name: 'Your Favorite Keebler Cookie', typeId: 4, sortOrder: 3, options: 'Grasshopper;Peanut Butter Dreams;Fudge Stripes;That Other One',
  //   dependentOnId: 42, dependentOnValue: 'Keebler Cookies' },
  // { id: 44, categoryId: 9, name: 'More Snacks', typeId: 1, sortOrder: 4 },
  // { id: 45, categoryId: 9, name: 'Are You Sure You Listed All Your Snacks?', typeId: 4, sortOrder: 5,
  //   dependentOnId: 44, options: 'Yes;No' },
];
