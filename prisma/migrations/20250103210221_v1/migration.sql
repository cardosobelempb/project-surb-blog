/*
  Warnings:

  - The primary key for the `blog_posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blogId` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `blog_posts` table. All the data in the column will be lost.
  - The primary key for the `blog_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blogId` on the `blog_users` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `blog_users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `blog_users` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `blog_users` table. All the data in the column will be lost.
  - The primary key for the `blogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bgColor` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `subtitle` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `textColor` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `blogs` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(60)` to `VarChar(45)`.
  - You are about to alter the column `slug` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(60)` to `VarChar(45)`.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[blog_id]` on the table `blog_posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `blog_posts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[blog_id]` on the table `blog_users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `blog_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `blog_id` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `blog_posts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `blog_id` to the `blog_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `blog_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `blog_users` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `blog_users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `sub_title` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `blogs` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `blogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_blogId_fkey";

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_userId_fkey";

-- DropForeignKey
ALTER TABLE "blog_users" DROP CONSTRAINT "blog_users_blogId_fkey";

-- DropForeignKey
ALTER TABLE "blog_users" DROP CONSTRAINT "blog_users_userId_fkey";

-- AlterTable
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_pkey",
DROP COLUMN "blogId",
DROP COLUMN "body",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "subtitle",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "blog_id" UUID NOT NULL,
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delete_at" TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sub_title" VARCHAR(100),
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "blog_users" DROP CONSTRAINT "blog_users_pkey",
DROP COLUMN "blogId",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "blog_id" UUID NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "blog_users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_pkey",
DROP COLUMN "bgColor",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "subtitle",
DROP COLUMN "textColor",
DROP COLUMN "updatedAt",
ADD COLUMN     "bg_color" VARCHAR(45) NOT NULL DEFAULT '#000000',
ADD COLUMN     "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "delete_at" TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "sub_title" VARCHAR(191) NOT NULL,
ADD COLUMN     "text_color" VARCHAR(45) NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "updated_at" TIMESTAMP NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(45),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(45),
ADD CONSTRAINT "blogs_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "user_id" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "sessions" (
    "sessionToken" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "verification_token" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_id_key" ON "accounts"("user_id");

-- CreateIndex
CREATE INDEX "accounts_user_id_idx" ON "accounts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_user_id_key" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_blog_id_key" ON "blog_posts"("blog_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_user_id_key" ON "blog_posts"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_users_blog_id_key" ON "blog_users"("blog_id");

-- CreateIndex
CREATE UNIQUE INDEX "blog_users_user_id_key" ON "blog_users"("user_id");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_users" ADD CONSTRAINT "blog_users_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_users" ADD CONSTRAINT "blog_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_blog_id_fkey" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
