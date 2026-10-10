'use client';

import { useEffect, useState } from 'react';
import { useContent } from './ContentProvider';

export default function Portfolio() {
  const { portfolio, portfolioFilters, projects } = useContent();
  const [active, setActive] = useState('*');
  const shown = projects.filter((p) => active === '*' || p.filters.includes(active));

  useEffect(() => {
    // glightbox touches `window` on import, so load it in the browser only.
    let box: { destroy: () => void } | undefined;
    let live = true;
    import('glightbox').then(({ default: GLightbox }) => {
      if (live) box = GLightbox({ selector: '.portfolio .glightbox' });
    });
    return () => { live = false; box?.destroy(); };
  }, [active, projects]);

  return (
    <section id="portfolio" className="portfolio section">
      <div className="container section-title" data-aos="fade-up">
        <h2>{portfolio.sectionTitle}</h2>
        <p>{portfolio.sectionSubtitle}</p>
      </div>

      <div className="container-fluid" data-aos="fade-up" data-aos-delay="100">
        <div className="isotope-layout">
          <ul className="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="200">
            <li className={active === '*' ? 'filter-active' : ''} onClick={() => setActive('*')}>
              <i className="bi bi-grid-3x3"></i> {portfolio.allLabel}
            </li>
            {portfolioFilters.map((f) => (
              <li key={f.key} className={active === f.key ? 'filter-active' : ''} onClick={() => setActive(f.key)}>
                {f.label}
              </li>
            ))}
          </ul>

          <div className="row g-4 isotope-container" data-aos="fade-up" data-aos-delay="300">
            {shown.map((p) => (
              <div key={p.slug} className="col-xl-3 col-lg-4 col-md-6 portfolio-item isotope-item">
                <article className="portfolio-entry">
                  <figure className="entry-image">
                    {/* A project may have no image yet; never render src="". */}
                    {p.image
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={p.image} className="img-fluid" alt={p.title} loading="lazy" />
                      : <div className="entry-image-placeholder" aria-hidden="true"><i className="bi bi-image"></i></div>}
                    <span className={`project-kind project-kind-${p.kind ?? 'personal'}`}>
                      {p.kind === 'professional' ? 'Professional' : 'Personal'}
                    </span>
                    <div className="entry-overlay">
                      <div className="overlay-content">
                        <div className="entry-meta">{p.category}</div>
                        <h3 className="entry-title">{p.title}</h3>
                        {(p.tags?.length ?? 0) > 0 && (
                          <div className="entry-tags">
                            {p.tags!.map((t) => <span key={t}>{t}</span>)}
                          </div>
                        )}
                        <div className="entry-links">
                          {p.image && (
                            <a href={p.image} className="glightbox" data-gallery="portfolio-gallery"
                              data-glightbox={`title: ${p.title}; description: ${p.description}`}>
                              <i className="bi bi-arrows-angle-expand"></i>
                            </a>
                          )}
                          {/* Opens in a new tab so the visitor keeps their place
                              in the portfolio grid. */}
                          <a href={`/portfolio/${p.slug}`} target="_blank" rel="noopener"
                            title="View details (opens in a new tab)">
                            <i className="bi bi-arrow-right"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </figure>
                </article>
              </div>
            ))}
            {shown.length === 0 && <p className="text-center py-4">No projects in this category yet.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
