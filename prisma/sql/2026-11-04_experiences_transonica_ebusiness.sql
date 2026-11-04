-- Expériences : TranSoniCa (en cours) et e-Business Afrique (mission de 3 mois)
-- Ordre : expériences en cours d'abord, puis par date de début décroissante.

BEGIN;

INSERT INTO "experiences" ("id", "title_fr", "title_en", "organization", "duration", "type", "description_fr", "description_en", "display_order", "updated_at")
SELECT gen_random_uuid()::text,
  'Développeur Full-Stack', 'Full-Stack Developer', 'TranSoniCa', '2026 - Présent', 'WORK',
  'TranSoniCa (Accra, Ghana), société de paiement sans contact par carte à puce. Refonte complète du site web en Next.js et TypeScript, et création d''un back-office sur mesure (Supabase, rôles et sécurité par ligne) pour gérer les contenus, les tarifs, les demandes de cartes et le réseau d''ambassadeurs. Prochaine étape : une plateforme de suivi des bus en temps réel, avec application chauffeur (Flutter), carte pour les passagers et tableau de bord de supervision.',
  'TranSoniCa (Accra, Ghana), a contactless smart card payment company. Full rebuild of the website in Next.js and TypeScript, and a custom back-office (Supabase, roles and row-level security) to manage content, pricing, card applications and the ambassador network. Next step: a real-time bus tracking platform, with a driver app (Flutter), a passenger map and a supervision dashboard.',
  1, now()
WHERE NOT EXISTS (SELECT 1 FROM "experiences" WHERE "organization" = 'TranSoniCa');

INSERT INTO "experiences" ("id", "title_fr", "title_en", "organization", "duration", "type", "description_fr", "description_en", "display_order", "updated_at")
SELECT gen_random_uuid()::text,
  'Développeur Full-Stack', 'Full-Stack Developer', 'e-Business Afrique', '2025 - 2026', 'WORK',
  'Mission de 3 mois chez e-Business Afrique (Lomé, Togo), entreprise de services du numérique. Évolutions d''applications Laravel et Vue.js en production : souscription en ligne d''assurance voyage pour NSIA Bénin (produits, tarifs, attestations PDF), suivi budgétaire en temps réel avec blocage des dépassements, et base de données réglementaire.',
  'Three-month assignment at e-Business Afrique (Lomé, Togo), a digital services company. Enhancements to Laravel and Vue.js applications in production: online travel insurance subscription for NSIA Benin (products, pricing, PDF certificates), real-time budget tracking with overspending prevention, and a regulatory database.',
  4, now()
WHERE NOT EXISTS (SELECT 1 FROM "experiences" WHERE "organization" = 'e-Business Afrique');

UPDATE "experiences" SET "display_order" = 2, "updated_at" = now() WHERE "organization" = 'Genuine Service Provider';
UPDATE "experiences" SET "display_order" = 3, "updated_at" = now() WHERE "organization" = 'Medlitebill';
UPDATE "experiences" SET "display_order" = 5, "updated_at" = now() WHERE "organization" = 'ITPLEX-Consult';
UPDATE "experiences" SET "display_order" = 6, "updated_at" = now() WHERE "organization" = 'Cognitive Factory';

COMMIT;
