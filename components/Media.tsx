/* eslint-disable @next/next/no-img-element */
// Paths are either /assets/... (bundled) or /uploads/... (admin uploads).
// On GitHub Pages the whole site sits under /<repo>/, so prefix absolute paths.
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function withBase(path: string): string {
  return path.startsWith('/') ? `${base}${path}` : path;
}

export function Media({ path, ...rest }: { path: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return path ? <img src={withBase(path)} alt="" {...rest} /> : null;
}
