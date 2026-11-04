-- e-Business Afrique : 3 mois sur site à Lomé, puis à distance (déc. 2025 - juil. 2026)
UPDATE "experiences" SET
  "duration" = '12/2025 - 07/2026',
  "description_fr" = replace("description_fr",
    'Chez e-Business Afrique (Lomé, Togo), entreprise de services du numérique, j''ai repris',
    'Chez e-Business Afrique (Lomé, Togo), entreprise de services du numérique, 3 mois sur site puis à distance, j''ai repris'),
  "description_en" = replace("description_en",
    'At e-Business Afrique (Lomé, Togo), a digital services company, I took over',
    'At e-Business Afrique (Lomé, Togo), a digital services company, three months on site and then remotely, I took over'),
  "updated_at" = now()
WHERE "organization" = 'e-Business Afrique';
