-- Ajout de TranSoniCa (collaboration en cours, Accra) dans « Ils me font confiance »
INSERT INTO "companies" ("id", "name", "kind", "logo_url", "detail_fr", "detail_en", "period", "current", "url", "display_order", "updated_at")
SELECT gen_random_uuid()::text, 'TranSoniCa', 'EMPLOYER', '/assets/images/partners/transonica.png',
       'Accra, Ghana', 'Accra, Ghana', '2026', true, 'https://transonicaghana.com', 11, now()
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE lower("name") = 'transonica');
