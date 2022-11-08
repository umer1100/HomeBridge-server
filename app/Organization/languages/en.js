/**
 * Organization Language File: English
 *
 * This file holds all English language translations for the Organization feature.
 * This file is compiled by /services/language.js to generate the final English locale
 * All English translations aggregated from all features can be found in /locales/en.json
 */

'use strict';

module.exports = {
  'ORGANIZATION[Welcome]': 'Welcome',

  // V1Login
  'ORGANIZATION[Invalid Login Credentials]': 'The email and/or password you entered is incorrect.',
  'ORGANIZATION[Organization Account Inactive]': 'Organization account is inactive.',
  'ORGANIZATION[Organization Account Deleted]': 'Organization account has been deleted.',

  // V1Read
  'ORGANIZATION[Organization Account Does Not Exist]': 'Organization account does not exist.',

  // V1Create
  'ORGANIZATION[Terms of Service Not Accepted]': 'You must agree to our Terms of Service.',
  'ORGANIZATION[Organization Already Exists]': 'Organization user already exists.',
  'ORGANIZATION[Invalid Time Zone]': 'Time Zone is invalid.',

  // V1ConfirmPassword
  'ORGANIZATION[Invalid Password Reset Token]': 'Invalid password reset token or reset token has expired.',
  'ORGANIZATION[Invalid Password Format]':
    'Password must contain at least 1 lowercase letter, at least 1 uppercase letter, at least 1 number, at least one symbol (!@#$%^&*), and must be at least twelve characters in length.',
  'ORGANIZATION[Passwords Not Equal]': 'The passwords entered do not match.',

  // V1UpdateEmail
  'ORGANIZATION[Same Email]': 'Your new email cannot be the same as your current email.',
  'ORGANIZATION[Email Already Taken]': 'The new email you entered is already taken.',

  // V1UpdatePassword
  'ORGANIZATION[Password Authentication Failed]': 'Original password entered is incorrect.'
};
