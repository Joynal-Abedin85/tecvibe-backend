/*
  Warnings:

  - You are about to drop the column `verdorid` on the `Product` table. All the data in the column will be lost.
  - Added the required column `vendorid` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_verdorid_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "verdorid",
ADD COLUMN     "vendorid" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_vendorid_fkey" FOREIGN KEY ("vendorid") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
