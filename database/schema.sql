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

-- Employers TABLE --
CREATE TABLE IF NOT EXISTS Employers (
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
  loginCount INT NOT NULL DEFAULT 0,
  lastLogin TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,

  -- Autogenerated by Sequelize
  deletedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NULL,
  createdAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc'),
  updatedAt TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
);

-- Users TABLE --
CREATE TYPE SEXTYPE AS ENUM ('MALE', 'FEMALE', 'OTHER');
CREATE TYPE KYCIDTYPE AS ENUM ('SSN', 'PASSPORT');
CREATE TABLE IF NOT EXISTS Users (
  id BIGSERIAL PRIMARY KEY NOT NULL,

  employerId BIGINT DEFAULT NULL REFERENCES Employers(id),

  timezone STRING NOT NULL DEFAULT 'UTC',
  locale STRING NOT NULL DEFAULT 'en',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  sex SEXTYPE DEFAULT NULL,

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