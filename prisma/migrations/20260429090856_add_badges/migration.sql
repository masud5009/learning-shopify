-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "badge_heading" TEXT,
    "default_badge_message" TEXT,
    "badge_2" TEXT,
    "badge_3" TEXT,
    "bg_color" TEXT,
    "is_enabled" BOOLEAN
);
INSERT INTO "new_Settings" ("badge_heading", "bg_color", "default_badge_message", "id", "is_enabled") SELECT "badge_heading", "bg_color", "default_badge_message", "id", "is_enabled" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
