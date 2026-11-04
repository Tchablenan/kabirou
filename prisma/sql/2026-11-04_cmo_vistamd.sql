-- CMO VistaMD : expérience freelance + 2 projets portfolio (application de gestion médicale, site vitrine)
-- Image de l'application : tirée des vidéos guides tournées sur la base de démo (patients fictifs).

BEGIN;

-- Expérience (en cours, freelance) : après TranSoniCa, avant Genuine Service Provider
UPDATE "experiences" SET "display_order" = "display_order" + 1, "updated_at" = now()
WHERE "type" = 'WORK' AND "display_order" >= 2
  AND NOT EXISTS (SELECT 1 FROM "experiences" WHERE "organization" = 'CMO VistaMD');

INSERT INTO "experiences" ("id", "title_fr", "title_en", "organization", "duration", "type", "description_fr", "description_en", "display_order", "updated_at")
SELECT gen_random_uuid()::text,
  'Développeur Full-Stack (Freelance)', 'Full-Stack Developer (Freelance)', 'CMO VistaMD', '2025 - Présent', 'WORK',
  E'Mission freelance pour CMO VistaMD, centre médical de cardiologie et de spécialités à Abidjan (Côte d''Ivoire).\n- Application de gestion médicale : conçue avec le médecin-chef, du cahier des charges à la mise en production (Laravel 12, Next.js) ; rendez-vous, dossier patient, consultation guidée, examens (ECG, Holter, échographies), ordonnances et certificats PDF, caisse et tiers payant.\n- Site vitrine : site React et TypeScript dont le formulaire de rendez-vous alimente directement l''application du cabinet.\n- Mise en service : droits par métier (médecin, secrétaire, infirmier, caisse), recette avec l''équipe et vidéos de formation ; en service réel depuis novembre 2026.',
  E'Freelance assignment for CMO VistaMD, a cardiology and multi-specialty medical center in Abidjan (Côte d''Ivoire).\n- Medical management application: designed with the chief physician, from specifications to production (Laravel 12, Next.js); appointments, patient records, guided consultation, exams (ECG, Holter, ultrasound), PDF prescriptions and certificates, billing and insurance third-party payment.\n- Showcase website: React and TypeScript site whose appointment form feeds the clinic''s application directly.\n- Rollout: role-based access (doctor, secretary, nurse, cashier), acceptance testing with the team and training videos; in live use since November 2026.',
  2, now()
WHERE NOT EXISTS (SELECT 1 FROM "experiences" WHERE "organization" = 'CMO VistaMD');

-- Projets : les deux CMO en tête du portfolio
UPDATE "projects" SET "display_order" = "display_order" + 2, "updated_at" = now()
WHERE NOT EXISTS (SELECT 1 FROM "projects" WHERE "slug" IN ('cmo-vistamd-application', 'cmo-vistamd-site'));

INSERT INTO "projects" ("id", "title", "slug", "summary_en", "summary_fr", "description_en", "description_fr", "image_url", "link",
  "categories", "features", "tags", "impact_title_en", "impact_title_fr", "impact_content_en", "impact_content_fr",
  "project_date", "my_role_en", "my_role_fr", "display_order", "updated_at")
SELECT gen_random_uuid()::text, 'CMO VistaMD — Application médicale', 'cmo-vistamd-application',
  'Medical management', 'Gestion médicale',
  'Custom medical management application for CMO VistaMD, a cardiology center in Abidjan, built from specifications to production with the chief physician. It covers the whole patient journey: appointment requests received from the website, reception and vital signs, a 9-step guided consultation, exams (ECG, Holter, ultrasound) and reports, PDF prescriptions and certificates, billing, insurance third-party payment and receivables. Each role (doctor, secretary, nurse, cashier) has its own screens and permissions.',
  'Application de gestion médicale sur mesure pour CMO VistaMD, centre de cardiologie à Abidjan, menée du cahier des charges à la mise en production avec le médecin-chef. Elle couvre tout le parcours du patient : demandes de rendez-vous reçues depuis le site, accueil et constantes, consultation guidée en 9 étapes, examens (ECG, Holter, échographies) et comptes rendus, ordonnances et certificats PDF, caisse, tiers payant et créances d''assurance. Chaque métier (médecin, secrétaire, infirmier, caissier) dispose de ses propres écrans et droits.',
  '/assets/images/kbi/cmo-vistamd-app.webp', '',
  ARRAY[]::text[], ARRAY['consultation_workflow','medical_exams_reports','billing_insurance'],
  ARRAY['Laravel','Next.js','MySQL','Tailwind CSS'],
  'In live use since November 2026', 'En service réel depuis novembre 2026',
  'After acceptance testing with the team and role-based training videos, the clinic now tracks its patients, exams and payments in a single tool.',
  'Après une recette avec l''équipe et des vidéos de formation par métier, le centre suit désormais ses patients, ses examens et ses encaissements dans un seul outil.',
  '2026',
  'Freelance Full-Stack Developer: requirements and specifications with the chief physician, database design, Laravel API, Next.js interface, acceptance testing, training and go-live.',
  'Développeur Full-Stack freelance : analyse et cahier des charges avec le médecin-chef, conception de la base de données, API Laravel, interface Next.js, recette, formation et mise en production.',
  1, now()
WHERE NOT EXISTS (SELECT 1 FROM "projects" WHERE "slug" = 'cmo-vistamd-application');

INSERT INTO "projects" ("id", "title", "slug", "summary_en", "summary_fr", "description_en", "description_fr", "image_url", "link",
  "categories", "features", "tags", "impact_title_en", "impact_title_fr", "impact_content_en", "impact_content_fr",
  "project_date", "my_role_en", "my_role_fr", "display_order", "updated_at")
SELECT gen_random_uuid()::text, 'CMO VistaMD — Site web', 'cmo-vistamd-site',
  'Medical center', 'Centre médical',
  'Showcase website for CMO VistaMD, a multi-specialty medical center in Abidjan (cardiology and 10 specialties). It presents the services, the team and 24/7 emergencies, and lets visitors request an appointment online: the request lands directly in the clinic''s management application, where the team confirms it. A link leads to the patient portal.',
  'Site vitrine de CMO VistaMD, centre médical pluridisciplinaire à Abidjan (cardiologie et 10 spécialités). Il présente les services, l''équipe et les urgences 24h/24, et permet de demander un rendez-vous en ligne : la demande arrive directement dans l''application de gestion du cabinet, où l''équipe la confirme. Un accès mène à l''espace patient.',
  '/assets/images/kbi/cmo-vistamd-site.webp', 'https://cmovistamd.com',
  ARRAY[]::text[], ARRAY['online_appointment_requests','medical_specialties_showcase','patient_portal_access'],
  ARRAY['React','TypeScript','Vite','Tailwind CSS'],
  'Appointments that reach the clinic directly', 'Des rendez-vous qui arrivent directement au cabinet',
  'Appointment requests no longer go through scattered calls and messages: they reach the front desk tool, which confirms them and prepares the patient''s visit.',
  'Les demandes de rendez-vous ne passent plus par des appels et des messages dispersés : elles arrivent dans l''outil du secrétariat, qui les confirme et prépare la venue du patient.',
  '2025',
  'Freelance Front-End Developer: site design and build (React, TypeScript), appointment form connected to the application API, go-live.',
  'Développeur Front-End freelance : conception et intégration du site (React, TypeScript), formulaire de rendez-vous relié à l''API de l''application, mise en ligne.',
  2, now()
WHERE NOT EXISTS (SELECT 1 FROM "projects" WHERE "slug" = 'cmo-vistamd-site');

COMMIT;
