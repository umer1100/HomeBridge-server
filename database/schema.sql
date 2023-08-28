-- DATABASE TABLES --

-- Table names are plural and PascalCase
-- Table column names are camelCase
-- ENUM names are ALL CAPS WITH NO UNDERSCORES, SPACES OR DASHES
-- ENUM values are ALL CAPS WITH UNDERSCORES AND NO SPACES AND NO DASHES

-- ALL TIMES ARE IN UTC OFFSET 0

------------------------------------- TABLE TEMPLATE -------------------------------------------
-- EXAMPLES TABLE --
-- Description of what table is for --
CREATE TYPE EXAMPLETYPE AS ENUM ('ONE', 'TWO', 'THREE');
CREATE TABLE IF NOT EXISTS Examples (
  -- 1. Primary Key --
  id BIGSERIAL PRIMARY KEY NOT NULL,

  -- 2. Foreign Keys --
  otherTableId BIGINT NOT NULL REFERENCES OtherTable(id),
  otherTable2Id BIGINT NOT NULL REFERENCES OtherTable2(id),

  -- 3. Third-Party Vendor IDs --
  auth0Id STRING DEFAULT NULL,
  stripeId STRING DEFAULT NULL,
  twilioId INT DEFAULT NULL,

  -- 4. Customized Columns --
  col1 INT NOT NULL DEFAULT 1,
  col2 STRING NOT NULL UNIQUE,
  col3 TEXT DEFAULT NULL,
  col4 BOOLEAN NOT NULL DEFAULT TRUE,
  col5 EXAMPLETYPE DEFAULT 'ONE',
  col6 TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  col7 JSON NOT NULL DEFAULT '{"key":"value"}',

  -- 5. Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);
------------------------------------------------------------------------------------------------

-- ADMINS TABLE --
CREATE TABLE IF NOT EXISTS Admins (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  timezone STRING NOT NULL DEFAULT 'UTC',
  locale STRING NOT NULL DEFAULT 'en',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  name STRING NOT NULL,
  email STRING NOT NULL UNIQUE,
  phone STRING DEFAULT NULL,
  salt TEXT NOT NULL, -- random salt value
  password TEXT NOT NULL, -- hashed password
  passwordResetToken TEXT DEFAULT NULL UNIQUE,
  passwordResetExpire TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  acceptedTerms BOOLEAN NOT NULL DEFAULT TRUE, -- whether this admin accepted our terms / services
  loginCount INT NOT NULL DEFAULT 0,
  lastLogin TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

-- Organizations TABLE --
CREATE TABLE IF NOT EXISTS Organizations (
  id BIGSERIAL PRIMARY KEY NOT NULL,
  timezone STRING NOT NULL DEFAULT 'UTC',
  locale STRING NOT NULL DEFAULT 'en',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  name STRING NOT NULL,
  email STRING NOT NULL UNIQUE,
  phone STRING DEFAULT NULL,
  spendLimit INT DEFAULT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

-- Users TABLE --
CREATE TYPE SEXTYPE AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE KYCIDTYPE AS ENUM ('SSN', 'PASSPORT');
CREATE TYPE ROLETYPE AS ENUM ('EMPLOYER', 'ADMIN', 'MANAGER', 'EMPLOYEE', 'GUEST');

CREATE TABLE IF NOT EXISTS Users (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  organizationId BIGINT DEFAULT NULL REFERENCES Organizations(id),

  timezone STRING NOT NULL DEFAULT 'UTC',
  locale STRING NOT NULL DEFAULT 'en',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sex SEXTYPE DEFAULT NULL,
  roleType ROLETYPE default NULL,

  -- Following values are necessary for KYC
  firstName STRING NOT NULL,
  middleName STRING DEFAULT NULL,
  lastName STRING NOT NULL,
  email STRING NOT NULL UNIQUE,
  phone STRING DEFAULT NULL,
  kycIdType KYCIDTYPE DEFAULT NULL,
  kycIdNumber INT DEFAULT NULL,
  addressLine1 TEXT DEFAULT NULL,
  addressLine2 TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  state TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  zipcode TEXT DEFAULT NULL,
  dateOfBirth TIMESTAMP WITHOUT TIME ZONE DEFAULT NUll,
  -- End KYC


  salt TEXT NOT NULL, -- random salt value
  password TEXT NOT NULL, -- hashed password
  passwordResetToken TEXT DEFAULT NULL UNIQUE,
  passwordResetExpire TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  emailConfirmed BOOLEAN NOT NULL DEFAULT FALSE,
  emailConfirmationToken TEXT DEFAULT NULL UNIQUE,
  emailResetToken TEXT DEFAULT NULL UNIQUE,
  resetEmail TEXT DEFAULT NULL, -- must check email if this email already exists both when this is created and when this is about to change email
  acceptedTerms BOOLEAN NOT NULL DEFAULT TRUE, -- whether this user accepted our terms / services
  loginCount INT NOT NULL DEFAULT 0,
  lastLogin TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

-- Employee Sync TABLE --
CREATE TYPE STATUSTYPE AS ENUM ('RUNNING', 'FINISHED', 'CANCELLED', 'SCHEDULED');
CREATE TABLE IF NOT EXISTS EmployeeSyncs (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  organizationId BIGINT DEFAULT NULL REFERENCES Organizations(id),

  startedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  finishedAt TIMESTAMP WITHOUT TIME ZONE,
  status STATUSTYPE NOT NULL,
  succeeded BOOLEAN DEFAULT FALSE,
  description JSON DEFAULT NULL,

);




-- Plaid Account TABLE --
CREATE TABLE IF NOT EXISTS PlaidAccounts (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  userId BIGINT DEFAULT NULL REFERENCES Users(id),

  itemId TEXT NOT NULL UNIQUE,
  accountId TEXT NOT NULL UNIQUE,
  accessToken TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  mask TEXT NOT NULL,
  currentBalance REAL DEFAULT 0.0,
  availableBalance REAL DEFAULT 0.0,
  processorToken TEXT DEFAULT NULL,
  custUrl TEXT DEFAULT NULL,
  fundingSourceURL TEXT DEFAULT NULL,
  type TEXT DEFAULT NULL,
  subtype TEXT DEFAULT NULL,
  primaryAccount BOOLEAN DEFAULT FALSE


  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')

);


CREATE TYPE TRANSACTIONTYPE AS ENUM ('PLATFORM', 'EMPLOYER');

-- Credit Wallet TABLE --
CREATE TABLE IF NOT EXISTS CreditWallet (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  userId BIGINT DEFAULT NULL REFERENCES Users(id),

  dollars REAL DEFAULT 0.0,
  walletType WALLETTYPE NOT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')

);


-- Credit Wallet History TABLE --
CREATE TABLE IF NOT EXISTS CreditWalletLogs (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  creditWalletId BIGINT DEFAULT NULL REFERENCES CreditWallet(id),
  dollars REAL DEFAULT 0.0,
  description JSON DEFAULT NULL,

  -- Autogenerated by Sequelize
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);


CREATE TYPE CONTRIBUTIONTYPE AS ENUM ('DEFAULT', 'MATCHED', 'SPOT_BONUS', 'SIGNUP_BONUS', 'MILESTONE_BONUS');
CREATE TYPE TRANSACTIONTYPE AS ENUM ('DEPOSIT', 'WITHDRAWAL');

CREATE TABLE IF NOT EXISTS Transactions (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  sourcedAccountId BIGINT NOT NULL REFERENCES PlaidAccount(id),
  fundedAccountId BIGINT NOT NULL REFERENCES PlaidAccount(id),

  amount REAL NOT NULL,
  contributionType CONTRIBUTIONTYPE NOT NULL,
  transactionType TRANSACTIONTYPE NOT NULL,
  transferUrl TEXT DEFAULT NULL,

  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
)



-- Programs TABLE --
CREATE TABLE IF NOT EXISTS Programs (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  organizationId BIGINT DEFAULT NULL REFERENCES Organizations(id),

  isProgramActive BOOLEAN NOT NULL DEFAULT FALSE,
  signupBonusActive BOOLEAN NOT NULL DEFAULT FALSE,
  signupBonusValue REAL DEFAULT 0.0,
  defaultContribution REAL DEFAULT 0.0,


  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')

);


-- Sessions TABLE --
CREATE TABLE IF NOT EXISTS Sessions (
  id INT PRIMARY KEY NOT NULL,

  userId INT NOT NULL REFERENCES Users(id),
  JWT STRING DEFAULT NULL
  expireAT DATE NOT NULL

    -- Autogenerated by Sequelize
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);


-- Agents TABLE --
CREATE TABLE IF NOT EXISTS Agents (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  firstName STRING NOT NULL,
  middleName STRING DEFAULT NULL,
  lastName STRING NOT NULL,
  email STRING NOT NULL UNIQUE,
  phone STRING DEFAULT NULL,

  reviewsURL TEXT DEFAULT NULL,
  applicationURL TEXT DEFAULT NULL,
  imageURL TEXT DEFAULT NULL,


  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')

)


-- Lenders TABLE --
CREATE TABLE IF NOT EXISTS Lenders (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  firstName STRING NOT NULL,
  middleName STRING DEFAULT NULL,
  lastName STRING NOT NULL,
  email STRING NOT NULL UNIQUE,
  phone STRING DEFAULT NULL,
  officeName STRING DEFAULT NULL,
  nmlsID TEXT DEFAULT NULL,

  reviewsURL TEXT DEFAULT NULL,
  applicationURL TEXT DEFAULT NULL,
  imageURL TEXT DEFAULT NULL,



  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
)


-- Closers TABLE --
CREATE TABLE IF NOT EXISTS Closers (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  firstName STRING NOT NULL,
  middleName STRING DEFAULT NULL,
  lastName STRING NOT NULL,
  email STRING NOT NULL UNIQUE,
  phone STRING DEFAULT NULL,
  website TEXT DEFAULT NUll,
  officeName TEXT DEFAULT NULL,

  reviewsURL TEXT DEFAULT NULL,
  applicationURL TEXT DEFAULT NULL,
  imageURL TEXT DEFAULT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
)


-- Resources TABLE --
CREATE TABLE IF NOT EXISTS Resources (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  name STRING NOT NULL,
  description TEXT NOT NULL,
  infoURL TEXT NOT NULL,
  imageURL TEXT NOT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
)

-- Addresses TABLE --
CREATE TABLE IF NOT EXISTS Addresses(
  id BIGSERIAL PRIMARY KEY NOT NULL,

  addressLine1 TEXT DEFAULT NULL,
  addressLine2 TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  state TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  zipcode TEXT DEFAULT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
)
