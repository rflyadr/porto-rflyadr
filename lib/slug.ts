/** URL-safe slug for a project: "My Cool App!" -> "my-cool-app" */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Appends -2, -3 … until the slug is unique among `taken`. */
export function uniqueSlug(base: string, taken: string[]): string {
  const root = slugify(base) || 'project';
  if (!taken.includes(root)) return root;
  let n = 2;
  while (taken.includes(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
