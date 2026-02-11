/*
  Warnings:

  - You are about to drop the column `balance` on the `User` table. All the data in the column will be lost.
  - Changed the type of `currency` on the `UserPayment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."CurrencyType" AS ENUM ('TON', 'XTR', 'USDT');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "balance";

-- AlterTable
ALTER TABLE "public"."UserPayment" DROP COLUMN "currency",
ADD COLUMN     "currency" "public"."CurrencyType" NOT NULL;

-- CreateTable
CREATE TABLE "public"."UserBalance" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "currency" "public"."CurrencyType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserBalance_ownerId_currency_key" ON "public"."UserBalance"("ownerId", "currency");

-- AddForeignKey
ALTER TABLE "public"."UserBalance" ADD CONSTRAINT "UserBalance_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
