exports.tableName = 'requestFormStatus';

exports.inserts = [
  { id: 1, name: 'Draft', canBeDeleted: 0 },
  { id: 2, name: 'Pending Approval', canBeDeleted: 0 },
  { id: 3, name: 'Rejected', canBeDeleted: 0 },
  { id: 4, name: 'Approved', canBeDeleted: 0 }
];
