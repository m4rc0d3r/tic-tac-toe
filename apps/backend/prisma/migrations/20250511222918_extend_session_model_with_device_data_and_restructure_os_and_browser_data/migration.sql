/*
Warnings:

- You are about to drop the column `browser` on the `sessions` table. All the data in the column will be lost.
- You are about to drop the column `os` on the `sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "sessions"
DROP COLUMN "browser",
DROP COLUMN "os",
ADD COLUMN "browser_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN "browser_version" TEXT NOT NULL DEFAULT '',
ADD COLUMN "device_model" TEXT NOT NULL DEFAULT '',
ADD COLUMN "device_type" TEXT NOT NULL DEFAULT '',
ADD COLUMN "device_vendor" TEXT NOT NULL DEFAULT '',
ADD COLUMN "os_name" TEXT NOT NULL DEFAULT '',
ADD COLUMN "os_version" TEXT NOT NULL DEFAULT '';
