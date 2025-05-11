/*
  Warnings:

  - You are about to drop the column `compilaOutput` on the `Submission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "compilaOutput",
ADD COLUMN     "compileOutput" TEXT;
