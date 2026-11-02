-- Section « Ils me font confiance » : table des entreprises gérée depuis le back-office.
-- Appliqué avec : npx prisma db execute --file prisma/sql/2026-11-02_companies.sql
-- (ne pas utiliser `prisma db push` : le schéma diverge de la base sur blog_posts et settings)

BEGIN;

CREATE TYPE "CompanyKind" AS ENUM ('EMPLOYER', 'CLIENT');

CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" "CompanyKind" NOT NULL DEFAULT 'CLIENT',
    "logo_url" TEXT,
    "detail_fr" TEXT,
    "detail_en" TEXT,
    "period" TEXT,
    "current" BOOLEAN NOT NULL DEFAULT false,
    "url" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- Accessible uniquement via Prisma (rôle postgres), pas via l'API publique Supabase
ALTER TABLE "companies" ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE "companies" FROM anon, authenticated;

-- Données initiales
INSERT INTO "companies" ("id", "name", "kind", "detail_fr", "detail_en", "period", "current", "url", "display_order", "updated_at") VALUES
  (gen_random_uuid()::text, 'Genuine Service Provider', 'EMPLOYER', 'Accra, Ghana',  'Accra, Ghana',  '2025', true,  NULL, 1, now()),
  (gen_random_uuid()::text, 'Medlitebill',              'EMPLOYER', 'New York, USA', 'New York, USA', '2023', true,  NULL, 2, now()),
  (gen_random_uuid()::text, 'ITPLEX-Consult',           'EMPLOYER', 'Lomé, Togo',    'Lomé, Togo',    '2024', false, NULL, 3, now()),
  (gen_random_uuid()::text, 'Cognitive Factory',        'EMPLOYER', 'Lomé, Togo',    'Lomé, Togo',    '2023', false, NULL, 4, now()),
  (gen_random_uuid()::text, 'Al Jannah Jet',            'CLIENT', 'Aviation privée',           'Private aviation',         '2025', false, 'https://aljannahjet.com/',            5, now()),
  (gen_random_uuid()::text, 'TER Maximum Ltd',          'CLIENT', 'Logistique & fret',         'Logistics & freight',      '2024', false, 'https://www.ter-maximum-ltd.com/',    6, now()),
  (gen_random_uuid()::text, 'ANB Corporate',            'CLIENT', 'Conseil & performance',     'Consulting & performance', '2024', false, 'https://www.anbcorporate.com/',       7, now()),
  (gen_random_uuid()::text, 'KapyGenius',               'CLIENT', 'Intelligence artificielle', 'Artificial intelligence',  '2024', false, 'https://kapygpt.kapygenius.com/auth', 8, now());

COMMIT;
