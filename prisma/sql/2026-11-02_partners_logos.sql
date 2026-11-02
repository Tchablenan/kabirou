-- Partenaires : logos, nouveaux clients (CMO VistaMD, Lynx HD) et ordre d'affichage alterné
-- (pastille logo / pastille nom) pour le bandeau « Ils me font confiance ».
-- Les sites aljannahjet.com, ter-maximum-ltd.com et anbcorporate.com ne sont plus en ligne
-- (domaine expiré / parqué / injoignable au 02/11/2026) : leur lien est retiré.

BEGIN;

UPDATE "companies" SET "logo_url" = '/assets/images/partners/aljannah-jet.png',  "url" = NULL, "display_order" = 2,  "updated_at" = now() WHERE "name" = 'Al Jannah Jet';
UPDATE "companies" SET "logo_url" = '/assets/images/partners/ter-maximum.png',   "url" = NULL, "display_order" = 6,  "updated_at" = now() WHERE "name" = 'TER Maximum Ltd';
UPDATE "companies" SET "logo_url" = '/assets/images/partners/anb-corporate.png', "url" = NULL, "display_order" = 10, "updated_at" = now() WHERE "name" = 'ANB Corporate';

UPDATE "companies" SET "display_order" = 1, "updated_at" = now() WHERE "name" = 'Genuine Service Provider';
UPDATE "companies" SET "display_order" = 3, "updated_at" = now() WHERE "name" = 'Medlitebill';
UPDATE "companies" SET "display_order" = 5, "updated_at" = now() WHERE "name" = 'ITPLEX-Consult';
UPDATE "companies" SET "display_order" = 7, "updated_at" = now() WHERE "name" = 'Cognitive Factory';
UPDATE "companies" SET "display_order" = 9, "updated_at" = now() WHERE "name" = 'KapyGenius';

INSERT INTO "companies" ("id", "name", "kind", "logo_url", "detail_fr", "detail_en", "period", "current", "url", "display_order", "updated_at")
SELECT gen_random_uuid()::text, 'CMO VistaMD', 'CLIENT', '/assets/images/partners/cmo-vistamd.png',
       'Santé · Abidjan, Côte d''Ivoire', 'Healthcare · Abidjan, Côte d''Ivoire', '2025', true, NULL, 4, now()
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE "name" = 'CMO VistaMD');

INSERT INTO "companies" ("id", "name", "kind", "logo_url", "detail_fr", "detail_en", "period", "current", "url", "display_order", "updated_at")
SELECT gen_random_uuid()::text, 'Lynx HD', 'CLIENT', '/assets/images/partners/lynx-hd.png',
       'Électronique & électroménager · Lomé, Togo', 'Electronics & home appliances · Lomé, Togo', '2026', true, NULL, 8, now()
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE "name" = 'Lynx HD');

COMMIT;
