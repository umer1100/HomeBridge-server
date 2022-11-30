/**
 * Script used to create a new organization
 *
 * Remember to set database url
 *
 * node scripts/create_organization.js
 */

const name = 'Organization Name';
const url = 'www.example.com';

let { V1Create } = require('../app/Organization/actions/V1Create');

let req = {
  args: {
    name: name,
    url: url
  }
};

(async () => {
  const result = await V1Create(req)
    .then(res => console.log(res))
    .catch(err => console.log(err));
  process.exit(0);
})();
