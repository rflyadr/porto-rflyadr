/* eslint-disable @next/next/no-img-element */
// Plain <img>: paths are either /assets/... (bundled) or /uploads/... (admin uploads).
export function Media({ path, ...rest }: { path: string } & React.ImgHTMLAttributes<HTMLImageElement>) {
  return path ? <img src={path} alt="" {...rest} /> : null;
}
