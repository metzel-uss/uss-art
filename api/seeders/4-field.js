exports.tableName = 'field';

exports.inserts = [
  // ---- New User Acess Form ----
  // Requestor Info
  { id: 1, categoryId: 1, name: 'Requestor', typeId: 2, sortOrder: 1 },
  { id: 2, categoryId: 1, name: 'Telephone', typeId: 2, sortOrder: 2 },
  { id: 3, categoryId: 1, name: 'Requestor Email', typeId: 2, sortOrder: 3 },

  // Employee Info
  { id: 4, categoryId: 2, name: 'First Name', typeId: 2, sortOrder: 1 },
  { id: 5, categoryId: 2, name: 'Middle Initial', typeId: 2, sortOrder: 2 },
  { id: 6, categoryId: 2, name: 'Last Name', typeId: 2, sortOrder: 3 },
  { id: 7, categoryId: 2, name: 'Job Title', typeId: 2, sortOrder: 4 },
  { id: 8, categoryId: 2, name: 'Start Date', typeId: 7, sortOrder: 5,
    elementOptions: 'minDate:today' },
  { id: 9, categoryId: 2, name: 'Region', typeId: 2, sortOrder: 6 },
  { id: 10, categoryId: 2, name: 'Address', typeId: 2, sortOrder: 7 },
  { id: 11, categoryId: 2, name: 'City', typeId: 2, sortOrder: 8 },
  { id: 12, categoryId: 2, name: 'Zip Code', typeId: 2, sortOrder: 9 },
  { id: 13, categoryId: 2, name: 'Department', typeId: 2, sortOrder: 10 },
  { id: 14, categoryId: 2, name: 'Manager/Supervisor', typeId: 2, sortOrder: 11 },
  { id: 15, categoryId: 2, name: 'Internet and Internal Email System Policy',
    typeId: 4, sortOrder: 12, options: 'No - Not Signed;Yes - Signed & Filed' },
  { id: 16, categoryId: 2, name: 'HR Representative', typeId: 2, sortOrder: 13 },
  { id: 17, categoryId: 2, name: 'Employment Type', typeId: 3, sortOrder: 14,
    options: 'Employee;Contractor' },
  { id: 18, categoryId: 2, name: 'Exp. Date', typeId: 7, sortOrder: 15,
    dependentOnId: 17, dependentOnValue: 'Contractor', elementOptions: 'maxDate:6month' },

  // Computer
  { id: 19, categoryId: 3, name: 'Type of Computer', typeId: 3, sortOrder: 1,
    options: 'Laptop;Desktop (Terminal)' },
  { id: 20, categoryId: 3, name: 'Specialty Software', typeId: 5, sortOrder: 2,
    options: 'Snag It;Visio;Project;Other' },
  { id: 21, categoryId: 3, name: 'Other', typeId: 1, sortOrder: 3, dependentOnId: 20, dependentOnValue: 'Other' },
  { id: 22, categoryId: 3, name: 'USS Remote?', typeId: 4, sortOrder: 4, options: 'Yes;No' },

  // Telephone
  { id: 23, categoryId: 4, name: 'Desk Phone/Extension', typeId: 3, sortOrder: 1,
    options: 'None;New;Reassign Existing Number;Replace Existing Deskphone' },
  { id: 24, categoryId: 4, name: 'Mobile', typeId: 3, sortOrder: 2, options: 'Yes;No' },

  // Other
  { id: 25, categoryId: 5, name: 'Sorry idk what this all is', typeId: 2, sortOrder: 1 },
  
  // Additional Requests/Notes
  { id: 26, categoryId: 6, name: 'Notes', typeId: 1, sortOrder: 1 }
];