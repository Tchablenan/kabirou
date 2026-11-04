/** Échappe le texte avant de l'insérer dans du HTML (e-mails de notification). */
export function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Ramène un texte sur une seule ligne (sujet d'e-mail : pas de saut de ligne). */
export function singleLine(text: string) {
  return text.replace(/[\r\n\t]+/g, " ").trim();
}

/** JSON inséré dans une balise <script> : « < » échappé pour qu'aucun </script> ne ferme la balise. */
export function safeJsonForScript(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
