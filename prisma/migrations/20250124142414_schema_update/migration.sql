/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "sessions" ADD COLUMN     "id" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_id_key" ON "accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_id_key" ON "sessions"("id");
