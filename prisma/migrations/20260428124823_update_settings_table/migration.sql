/*
  Warnings:

  - You are about to drop the column `description` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Settings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "badge_heading" TEXT,
    "default_badge_message" TEXT,
    "bg_color" TEXT,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Settings" ("id") SELECT "id" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
