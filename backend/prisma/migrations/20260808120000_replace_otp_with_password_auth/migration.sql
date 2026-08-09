CREATE TYPE "AccountType" AS ENUM ('USER', 'VENUE_OWNER');

ALTER TABLE "User"
ADD COLUMN "passwordHash" TEXT,
ADD COLUMN "accountType" "AccountType" NOT NULL DEFAULT 'USER';

-- Existing passwordless accounts cannot be logged into until they register again.
UPDATE "User" SET "passwordHash" = '$2b$12$disabledLegacyAccountHash00000000000000000000000000000'
WHERE "passwordHash" IS NULL;
ALTER TABLE "User" ALTER COLUMN "passwordHash" SET NOT NULL;

DROP TABLE IF EXISTS "EmailOtp";
DROP TABLE IF EXISTS "AuthIdentity";
DROP INDEX IF EXISTS "User_providerId_idx";
ALTER TABLE "User" DROP COLUMN IF EXISTS "providerId";
