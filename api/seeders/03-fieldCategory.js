exports.tableName = 'fieldCategory';

exports.inserts = [
  // ---- New User Access Form ----
  { id: 1, name: 'Requestor Information', formTypeId: 1, sortOrder: 1, required: 1 },
  { id: 2, name: 'Employee Information', formTypeId: 1, sortOrder: 2, required: 1 },
  { id: 3, name: 'Computer', formTypeId: 1, sortOrder: 3 },
  { id: 4, name: 'Telephone', formTypeId: 1, sortOrder: 4 },
  { id: 5, name: 'Other', formTypeId: 1, sortOrder: 5 },
  { id: 6, name: 'Additional Requests', formTypeId: 1, sortOrder: 6 },

  // ---- Termination Request ----
  { id: 7, name: 'Requestor Information', formTypeId: 2, sortOrder: 1, required: 1 },
  { id: 8, name: 'Employee Information', formTypeId: 2, sortOrder: 2, required: 1 },
  { id: 9, name: 'Computer/Email', formTypeId: 2, sortOrder: 3 },
  { id: 10, name: 'Telephone', formTypeId: 2, sortOrder: 4 },
  { id: 11, name: 'USS Business Applications', formTypeId: 2, sortOrder: 5 },
  
  // ---- Business Application Request ----
  { id: 12, name: 'Requestor Information', formTypeId: 3, sortOrder: 1, required: 1 },
  { id: 13, name: 'Employee Information', formTypeId: 3, sortOrder: 2, required: 1 },
  { id: 14, name: 'Business Applications', formTypeId: 3, sortOrder: 3 },

  // ---- Test Request ----
  // { id: 7, name: 'Ponies', formTypeId: 4, sortOrder: 1, required: 1 },
  // { id: 8, name: 'Dragons', formTypeId: 4, sortOrder: 2 },
  // { id: 9, name: 'Snacks', formTypeId: 4, sortOrder: 3 }
];
