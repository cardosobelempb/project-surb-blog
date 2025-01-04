/*
  Warnings:

  - The primary key for the `blog_posts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blog_id` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `delete_at` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `sub_title` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `blog_posts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `blog_posts` table. All the data in the column will be lost.
  - The primary key for the `blog_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blog_id` on the `blog_users` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `blog_users` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `blog_users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `blog_users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `blog_users` table. All the data in the column will be lost.
  - The primary key for the `blogs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bg_color` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `delete_at` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `sub_title` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `text_color` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `blogId` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `body` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `blog_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blogId` to the `blog_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `blog_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `blog_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `blogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_blog_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_users" DROP CONSTRAINT "blog_users_blog_id_fkey";

-- DropForeignKey
ALTER TABLE "blog_users" DROP CONSTRAINT "blog_users_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropIndex
DROP INDEX "blog_posts_blog_id_key";

-- DropIndex
DROP INDEX "blog_posts_user_id_key";

-- DropIndex
DROP INDEX "blog_users_blog_id_key";

-- DropIndex
DROP INDEX "blog_users_user_id_key";

-- AlterTable
ALTER TABLE "blog_posts" DROP CONSTRAINT "blog_posts_pkey",
DROP COLUMN "blog_id",
DROP COLUMN "content",
DROP COLUMN "created_at",
DROP COLUMN "delete_at",
DROP COLUMN "is_active",
DROP COLUMN "sub_title",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "blogId" TEXT NOT NULL,
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "subtitle" VARCHAR(100),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "blog_users" DROP CONSTRAINT "blog_users_pkey",
DROP COLUMN "blog_id",
DROP COLUMN "created_at",
DROP COLUMN "is_active",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "blogId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "blog_users_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "blogs" DROP CONSTRAINT "blogs_pkey",
DROP COLUMN "bg_color",
DROP COLUMN "created_at",
DROP COLUMN "delete_at",
DROP COLUMN "is_active",
DROP COLUMN "sub_title",
DROP COLUMN "text_color",
DROP COLUMN "updated_at",
ADD COLUMN     "bgColor" VARCHAR(45) NOT NULL DEFAULT '#FFFFFF',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "subtitle" VARCHAR(191),
ADD COLUMN     "textColor" VARCHAR(45) NOT NULL DEFAULT '#000000',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "title" SET DATA TYPE VARCHAR(60),
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(60),
ADD CONSTRAINT "blogs_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "accounts";

-- DropTable
DROP TABLE "sessions";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "verification_token";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "refresh_token_expires_in" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_users" ADD CONSTRAINT "blog_users_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_users" ADD CONSTRAINT "blog_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "blogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
