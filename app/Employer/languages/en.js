/**
 * Employer Language File: English
 *
 * This file holds all English language translations for the Employer feature.
 * This file is compiled by /services/language.js to generate the final English locale
 * All English translations aggregated from all features can be found in /locales/en.json
 */

'use strict';

module.exports = {
  'EMPLOYER[Welcome]': 'Welcome',

  // V1Login
  'EMPLOYER[Invalid Login Credentials]': 'The email and/or password you entered is incorrect.',
  'EMPLOYER[Employer Account Inactive]': 'Employer account is inactive.',
  'EMPLOYER[Employer Account Deleted]': 'Employer account has been deleted.',

  // V1Read
  'EMPLOYER[Employer Account Does Not Exist]': 'Employer account does not exist.',
  'EMPLOYER[Unauthorized Access]': 'You do not have access to this employer information.',

  // V1Create
  'EMPLOYER[Terms of Service Not Accepted]': 'You must agree to our Terms of Service.',
  'EMPLOYER[Employer Already Exists]': 'Employer user already exists.',
  'EMPLOYER[Invalid Time Zone]': 'Time Zone is invalid.',

  // V1ConfirmPassword
  'EMPLOYER[Invalid Password Reset Token]': 'Invalid password reset token or reset token has expired.',
  'EMPLOYER[Invalid Password Format]':
    'Password must contain at least 1 lowercase letter, at least 1 uppercase letter, at least 1 number, at least one symbol (!@#$%^&*), and must be at least twelve characters in length.',
  'EMPLOYER[Passwords Not Equal]': 'The passwords entered do not match.',

  // V1UpdateEmail
  'EMPLOYER[Same Email]': 'Your new email cannot be the same as your current email.',
  'EMPLOYER[Email Already Taken]': 'The new email you entered is already taken.',

  // V1UpdatePassword
  'EMPLOYER[Password Authentication Failed]': 'Original password entered is incorrect.'
};
