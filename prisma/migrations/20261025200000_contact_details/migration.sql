-- Set the published contact details (email + WhatsApp-only phone) on the live site settings row.
INSERT INTO "SiteSettings" ("id", "tagline", "description", "email", "phone", "address", "city", "country", "updatedAt")
VALUES ('site', 'We engineer software that moves Africa forward.', '', 'victor@circleofthreetech.com', '+234 903 170 6318', 'Lagos', 'Lagos', 'Nigeria', NOW())
ON CONFLICT ("id") DO UPDATE SET "email" = EXCLUDED."email", "phone" = EXCLUDED."phone", "updatedAt" = NOW();
