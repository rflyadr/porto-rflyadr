/**
 * A panel in the admin grid.
 *  - `wide`: span every column.
 *  - `fill`: take the remaining height of its column and scroll its own body,
 *    so a long list never makes the whole page scroll.
 */
export function Card({ title, wide, fill, children }: {
  title: string;
  wide?: boolean;
  fill?: boolean;
  children: React.ReactNode;
}) {
  const cls = [
    'admin-card',
    wide ? 'admin-card-wide' : '',
    fill ? 'admin-card-fill' : '',
  ].filter(Boolean).join(' ');

  return (
    <section className={cls}>
      <h2>{title}</h2>
      {fill ? <div className="admin-card-body">{children}</div> : children}
    </section>
  );
}

/**
 * Explicit columns. Each <Column> stacks its own cards; a column with a
 * `fill` card lets that card absorb the leftover height.
 */
export function Columns({ ratio, children }: {
  ratio?: '1-1' | '1-2' | '2-1' | '3' | '1-1-2' | '1-2-2';
  children: React.ReactNode;
}) {
  const cls = `admin-cols${ratio && ratio !== '1-1' ? ` admin-cols-${ratio}` : ''}`;
  return <div className={cls}>{children}</div>;
}

/** One column inside <Columns>. */
export function Column({ children }: { children: React.ReactNode }) {
  return <div className="admin-col">{children}</div>;
}
