/* eslint-disable no-useless-escape */
export function slugify(text: string): string {
  return text
    .toString() // Convert to string
    .toLowerCase() // Convert to lowercase
    .trim() // Trim whitespace
    .replace(/\s+/g, "-") // Replace spaces with -

    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
export function unslugify(slug: string): string {
  return slug
    .replace(/[-_]/g, " ") // Replace hyphens/underscores with spaces
    .replace(/\s+/g, " ") // Remove extra spaces
    .trim() // Trim leading/trailing whitespace
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
}
