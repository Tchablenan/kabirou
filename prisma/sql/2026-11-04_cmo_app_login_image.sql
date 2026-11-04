-- Application CMO VistaMD : image = page de connexion (publique, sans donnée patient)
UPDATE "projects" SET "image_url" = '/assets/images/kbi/cmo-vistamd-app-login.webp', "updated_at" = now()
WHERE "slug" = 'cmo-vistamd-application';
