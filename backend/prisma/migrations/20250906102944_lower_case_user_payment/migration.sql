/*
  Warnings:

  - The values [STARS,CRYPTOBOT] on the enum `PaymentProviderType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,PAID,CANCELLED,FAILED] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentProviderType_new" AS ENUM ('stars', 'cryptobot');
ALTER TABLE "public"."UserPayment" ALTER COLUMN "provider" TYPE "public"."PaymentProviderType_new" USING ("provider"::text::"public"."PaymentProviderType_new");
ALTER TYPE "public"."PaymentProviderType" RENAME TO "PaymentProviderType_old";
ALTER TYPE "public"."PaymentProviderType_new" RENAME TO "PaymentProviderType";
DROP TYPE "public"."PaymentProviderType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."PaymentStatus_new" AS ENUM ('pending', 'paid', 'cancelled', 'failed');
ALTER TABLE "public"."UserPayment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."UserPayment" ALTER COLUMN "status" TYPE "public"."PaymentStatus_new" USING ("status"::text::"public"."PaymentStatus_new");
ALTER TYPE "public"."PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "public"."PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "public"."PaymentStatus_old";
ALTER TABLE "public"."UserPayment" ALTER COLUMN "status" SET DEFAULT 'pending';
COMMIT;

-- AlterTable
ALTER TABLE "public"."UserPayment" ALTER COLUMN "status" SET DEFAULT 'pending';
