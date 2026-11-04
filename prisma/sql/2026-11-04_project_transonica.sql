-- Projet portfolio : site web TranSoniCa (refonte + back-office), placé en premier
BEGIN;

UPDATE "projects" SET "display_order" = "display_order" + 1, "updated_at" = now()
WHERE NOT EXISTS (SELECT 1 FROM "projects" WHERE "slug" = 'transonica');

INSERT INTO "projects" ("id", "title", "slug", "summary_en", "summary_fr", "description_en", "description_fr", "image_url", "link",
  "categories", "features", "tags", "impact_title_en", "impact_title_fr", "impact_content_en", "impact_content_fr",
  "project_date", "my_role_en", "my_role_fr", "display_order", "updated_at")
SELECT gen_random_uuid()::text, 'TranSoniCa', 'transonica',
  'Contactless payments', 'Paiement sans contact',
  'Full rebuild of the website of TranSoniCa, a Ghanaian company issuing contactless smart cards to pay for the bus, shopping and meals. The old WordPress site was replaced by a fast Next.js site that keeps all existing content and URLs, backed by a custom back-office to manage services, pricing, promotions, news, card applications and student ambassadors.',
  'Refonte complète du site web de TranSoniCa, entreprise ghanéenne qui émet des cartes à puce sans contact pour payer le bus, les courses et les repas. L''ancien site WordPress a été remplacé par un site Next.js rapide qui conserve tous les contenus et adresses existants, relié à un back-office sur mesure pour gérer les services, les tarifs, les promotions, les actualités, les demandes de cartes et les ambassadeurs étudiants.',
  '/assets/images/kbi/transonica.webp', 'https://transonicaghana.com',
  ARRAY[]::text[], ARRAY['online_card_applications','custom_cms_backoffice','role_based_security'],
  ARRAY['Next.js','TypeScript','Supabase','Tailwind CSS'],
  'A site the team runs on its own', 'Un site que l''équipe gère en autonomie',
  'TranSoniCa now updates its prices, promotions and news itself from the back-office, without going through a developer, and receives card and ambassador applications directly online.',
  'TranSoniCa met désormais à jour ses tarifs, promotions et actualités elle-même depuis le back-office, sans passer par un développeur, et reçoit directement en ligne les demandes de cartes et d''ambassadeurs.',
  '2026',
  'Full-Stack Developer: website rebuild (Next.js, TypeScript), back-office design and build (Supabase, roles and row-level security), deployment.',
  'Développeur Full-Stack : refonte du site (Next.js, TypeScript), conception et développement du back-office (Supabase, rôles et sécurité par ligne), mise en ligne.',
  1, now()
WHERE NOT EXISTS (SELECT 1 FROM "projects" WHERE "slug" = 'transonica');

COMMIT;
