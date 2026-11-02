-- Logo KapyGenius (mascotte) + ordre du bandeau : les 3 partenaires sans logo répartis entre les logos
BEGIN;
UPDATE "companies" SET "logo_url" = '/assets/images/partners/kapygenius.png', "display_order" = 9, "updated_at" = now() WHERE "name" = 'KapyGenius';
UPDATE "companies" SET "display_order" = 1,  "updated_at" = now() WHERE "name" = 'Genuine Service Provider';
UPDATE "companies" SET "display_order" = 2,  "updated_at" = now() WHERE "name" = 'Medlitebill';
UPDATE "companies" SET "display_order" = 3,  "updated_at" = now() WHERE "name" = 'Al Jannah Jet';
UPDATE "companies" SET "display_order" = 4,  "updated_at" = now() WHERE "name" = 'CMO VistaMD';
UPDATE "companies" SET "display_order" = 5,  "updated_at" = now() WHERE "name" = 'ITPLEX-Consult';
UPDATE "companies" SET "display_order" = 6,  "updated_at" = now() WHERE "name" = 'TER Maximum Ltd';
UPDATE "companies" SET "display_order" = 7,  "updated_at" = now() WHERE "name" = 'Lynx HD';
UPDATE "companies" SET "display_order" = 8,  "updated_at" = now() WHERE "name" = 'Cognitive Factory';
UPDATE "companies" SET "display_order" = 10, "updated_at" = now() WHERE "name" = 'ANB Corporate';
COMMIT;
