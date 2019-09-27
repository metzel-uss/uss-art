const express = require('express');
const router = express.Router();

const testUsers = [
  {
    id: 1,
    firstName: 'Jim',
    midInitial: 'D',
    lastName: 'Halpert',
    title: 'Sales Representative',
    manager: 3,
    effectiveDate: '2000-01-01',
    region: 'Northeast',
    address: '12 Oak Street',
    city: 'Scranton',
    state: 'PA',
    zip: '12345',
    department: 'Sales',
    hrRep: 4,
    employmentType: 2,
    expirationDate: null,
    internetPolicySigned: true
  },
  {
    id: 2,
    firstName: 'Pamela',
    midInitial: 'M',
    lastName: 'Beesly',
    title: 'Receptionist',
    manager: 3,
    effectiveDate: '2000-07-03',
    region: 'Northeast',
    address: '56 Beaver Pond',
    city: 'Scranton',
    state: 'PA',
    zip: '12345',
    department: 'General',
    hrRep: 4,
    employmentType: 2,
    expirationDate: null,
    internetPolicySigned: true
  },
  {
    id: 3,
    firstName: 'Michael',
    midInitial: 'M',
    lastName: 'Scott',
    title: 'Regional Manager',
    manager: 3,
    effectiveDate: '1999-03-22',
    region: 'Northeast',
    address: '775 Frying Pan Lane',
    city: 'Scranton',
    state: 'PA',
    zip: '12345',
    department: 'Management',
    hrRep: 4,
    employmentType: 2,
    expirationDate: null,
    internetPolicySigned: true
  },
  {
    id: 4,
    firstName: 'Tobias',
    midInitial: 'W',
    lastName: 'Flenderson',
    title: 'Human Resources Representative',
    manager: 3,
    effectiveDate: '1999-06-16',
    region: 'Northeast',
    address: '331 Singing Brook Way',
    city: 'Scranton',
    state: 'PA',
    zip: '12345',
    department: 'HR',
    hrRep: null,
    employmentType: 2,
    expirationDate: null,
    internetPolicySigned: true
  },
  {
    id: 5,
    firstName: 'Roy',
    midInitial: 'H',
    lastName: 'Anderson',
    title: 'Warehouse Guy',
    manager: 6,
    effectiveDate: '2015-04-18',
    region: 'Northeast',
    address: '42 Jerk Road',
    city: 'Scranton',
    state: 'PA',
    zip: '12345',
    department: 'General',
    hrRep: 4,
    employmentType: 1,
    expirationDate: '2020-04-18',
    internetPolicySigned: false
  }
];

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(testUsers);
});

module.exports = {
  endpoint: '/api/users',
  router
};
