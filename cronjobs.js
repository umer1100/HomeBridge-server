/**
 * Run all cronjobs
 * https://devcenter.heroku.com/articles/scheduled-jobs-custom-clock-processes
 * https://www.npmjs.com/package/cron
 * This is the clock process on heroku
 *
 * !Important: Should only have 1 dyno process running for this. heroku ps:scale clock=1
 */

'use strict';

// ENV variables
const { NODE_ENV, REDIS_URL } = process.env;

// third party node modules
const CronJob = require('cron').CronJob;
const Queue = require('bull'); // process background tasks from Queue

// Print Process Info
console.log(`CLOCK process.pid: ${process.pid}`);
console.log(`CLOCK process.env.NODE_ENV: ${NODE_ENV}`);

/*****************/
/***** ADMIN *****/
/*****************/
const AdminQueue = new Queue('AdminQueue', REDIS_URL);

/************************/
/***** EMPLOYEESYNC *****/
/************************/
const EmployeeSyncQueue = new Queue('EmployeeSyncQueue', REDIS_URL);

// Syncs all Organization HRIS systems. Run every day at midnight.
new CronJob(
  '0 0 0 * * *',
  () => {
    EmployeeSyncQueue.add('V1SyncAllOrganizations');
  },
  null,
  true,
  'UTC'
);

/************************/
/***** CREDITWALLET *****/
/************************/
const CreditWalletQueue = new Queue('CreditWalletQueue', REDIS_URL);

// Adds money to everyone's wallet at the beginning of every month
new CronJob(
  '0 0 0 1 * *',
  () => {
    CreditWalletQueue.add('V1AddMonthlyCredit');
  },
  null,
  true,
  'UTC'
);
