-- Descriptions structurées (intro + puces « Projet : détail ») rendues par RichDescription
BEGIN;

UPDATE "experiences" SET
  "description_fr" = E'Chez e-Business Afrique (Lomé, Togo), entreprise de services du numérique, j''ai repris des applications en production pour en assurer la maintenance, la continuité et l''évolution : corrections issues des recettes clients (UAT), refactorisation du code, sécurisation et scripts de déploiement.\n- NSIA Togo (nsiadirect.tg) : API Laravel de l''assurance en ligne utilisée par l''application mobile, centralisation du calcul des tarifs (auto, moto, habitation, voyage), paiement mobile money SEMOA, attestations et factures PDF envoyées par e-mail, documentation de l''API.\n- Base Réglementation (Laravel, Nuxt) : suivi réglementaire de projets de recherche, droits d''accès par rôles, identifiants UUID, imports et exports Excel/PDF, alertes e-mail, refonte du manuel réglementaire.\n- Base Budget (Laravel) : gestion multi-sites des budgets et des dépenses, soldes en temps réel et blocage des dépassements.\n- NSIA Bénin : souscription d''assurance voyage en ligne.',
  "description_en" = E'At e-Business Afrique (Lomé, Togo), a digital services company, I took over production applications to ensure their maintenance, continuity and growth: fixes from client acceptance testing (UAT), code refactoring, security hardening and deployment scripts.\n- NSIA Togo (nsiadirect.tg): Laravel API behind the online insurance mobile app, centralised pricing (car, motorbike, home, travel), SEMOA mobile money payments, PDF certificates and invoices sent by email, API documentation.\n- Regulatory Database (Laravel, Nuxt): regulatory tracking of research projects, role-based access, UUID identifiers, Excel imports, Excel/PDF exports, email alerts, redesigned regulatory handbook.\n- Budget Database (Laravel): multi-site budget and expense management, real-time balances and overspending prevention.\n- NSIA Benin: online travel insurance subscription.',
  "updated_at" = now()
WHERE "organization" = 'e-Business Afrique';

UPDATE "experiences" SET
  "description_fr" = E'TranSoniCa (Accra, Ghana), société de paiement sans contact par carte à puce.\n- Site web : refonte complète en Next.js et TypeScript, en conservant tous les contenus et adresses existants.\n- Back-office : outil sur mesure (Supabase, rôles et sécurité par ligne) pour gérer les contenus, les tarifs, les demandes de cartes et le réseau d''ambassadeurs.\n- Prochaine étape : plateforme de suivi des bus en temps réel, avec application chauffeur (Flutter), carte pour les passagers et tableau de bord de supervision.',
  "description_en" = E'TranSoniCa (Accra, Ghana), a contactless smart card payment company.\n- Website: full rebuild in Next.js and TypeScript, keeping all existing content and URLs.\n- Back-office: custom tool (Supabase, roles and row-level security) to manage content, pricing, card applications and the ambassador network.\n- Next step: a real-time bus tracking platform, with a driver app (Flutter), a passenger map and a supervision dashboard.',
  "updated_at" = now()
WHERE "organization" = 'TranSoniCa';

COMMIT;
