'use strict';

const { itemRemove } = require('../helper');
const models = require('../../../models');
const joi = require('@hapi/joi');
const { ERROR_CODES, errorResponse, joiErrorsMessage } = require('../../../services/error');

module.exports = {
  V1UnlinkAccounts
};

async function V1UnlinkAccounts(req) {
  const schema = joi.object({
    itemId: joi
      .string()
      .trim()
      .min(1)
      .required()
      .error(new Error(req.__('PLAIDACCOUNT_V1UnlinkAccounts_Invalid_Argument[publicToken]')))
  });

  const { error, value } = schema.validate(req.args);
  if (error) return Promise.resolve(errorResponse(req, ERROR_CODES.BAD_REQUEST_INVALID_ARGUMENTS, joiErrorsMessage(error)));
  req.args = value;

  try {
    let accounts = await models.plaidAccount.findAll({
      where: {
        itemId: req.args.itemId
      }
    });

    let itemRemoveResponse = await itemRemove({
      'access_token': accounts[0]?.accessToken
    });

    if(itemRemoveResponse) {
      await models.plaidAccount.destroy({
        where: {
          itemId: req.args.itemId
        }
      });
    }
    return Promise.resolve({
      status: 200,
      success: true
    });
  } catch (error) {
    return Promise.reject(error);
  }
}
