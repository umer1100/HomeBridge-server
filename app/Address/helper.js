/**
 * ADDRESS HELPER
 */

'use strict';
const joi = require('@hapi/joi'); // argument validations: https://github.com/hapijs/joi/blob/master/API.md


module.exports = {
  joiAddressSchema
}

/**
 * joiAddressSchema
 *
 * @returns joi schema to verify address object
 */
function joiAddressSchema() {
  return joi.object({
    addressLine1: joi.string().trim().min(1),
    addressLine2: joi.string().trim().min(1),
    city: joi.string().trim().min(1),
    state: joi.string().trim().min(1),
    country: joi.string().trim().min(1),
    zipcode: joi.string().trim().min(1)
  })
}