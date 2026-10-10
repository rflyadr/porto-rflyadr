'use client';

import { useEffect, useState } from 'react';
import type { Project } from '@/lib/defaults';
import { Lines } from './Lines';

export default function ProjectDetail({ project: p, nextSlug }: { project: Project; nextSlug: string }) {
  const images = [p.image, ...p.gallery].filter(Boolean);
  const [active, setActive] = useState(0);
  // Rotation stops for good once the visitor interacts, so text never changes
  // under someone who is reading it.
  const [paused, setPaused] = useState(false);
  const main = images[active] ?? '';
  const note = p.imageNotes?.[main] ?? '';
  // The main image is the project's own view: its description (if any) sits
  // above the full write-up. A sub image shows just its description.
  const isMain = active === 0;

  // A URL saved without a scheme ("example.com") would otherwise be treated as
  // a path relative to this page.
  const liveHref = p.liveUrl && !/^[a-z][a-z0-9+.-]*:\/\//i.test(p.liveUrl)
    ? `https://${p.liveUrl}`
    : p.liveUrl;

  // Cycle the gallery until the visitor takes over.
  useEffect(() => {
    if (paused || images.length < 2) return;
    const t = setInterval(() => setActive((i) => (i + 1) % images.length), 4500);
    return () => clearInterval(t);
  }, [paused, images.length]);

  useEffect(() => {
    let box: { destroy: () => void } | undefined;
    let live = true;
    import('glightbox').then(({ default: GLightbox }) => {
      if (live) box = GLightbox({ selector: '.portfolio-details .glightbox' });
    });
    return () => { live = false; box?.destroy(); };
  }, [p.blocks]);

  return (
    <main className="main">
      <div className="page-title light-background">
        <div className="container d-lg-flex justify-content-between align-items-center">
          <h1 className="mb-2 mb-lg-0">{p.title}</h1>
          <nav className="breadcrumbs">
            <ol>
              <li><a href="/">Home</a></li>
              <li><a href="/#portfolio">Portfolio</a></li>
              <li className="current">{p.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      <section id="portfolio-details" className="portfolio-details section">
        <div className="container" data-aos="fade-up" data-aos-delay="100">
          <div className="row gy-4">

            {/* Media column — wider than the text, so screenshots are readable. */}
            <div className="col-lg-8 pd-media-col" data-aos="fade-right">
              <div className="portfolio-details-media">
                {main && (
                  <div className="main-image" onMouseEnter={() => setPaused(true)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={main} alt={p.title} className="img-fluid" />
                  </div>
                )}

                {images.length > 1 && (
                  <div className="thumbnail-grid">
                    {images.map((src, i) => (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img key={`${src}-${i}`} src={src} alt=""
                        className={`img-fluid${i === active ? ' is-active' : ''}`}
                        title={p.imageNotes?.[src] ? 'Click to read about this screen' : undefined}
                        onClick={() => { setPaused(true); setActive(i); }} />
                    ))}
                  </div>
                )}

                {p.tech.length > 0 && (
                  <div className="tech-stack-badges" data-aos="fade-up" data-aos-delay="300">
                    {p.tech.map((t) => <span key={t}>{t}</span>)}
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4 pd-text-col" data-aos="fade-left">
              <div className="portfolio-details-content">
                <div className="project-meta">
                  <div className="badge-wrapper">
                    <span className="project-badge">{p.category}</span>
                    <span className={`project-kind project-kind-${p.kind ?? 'personal'}`}>
                      {p.kind === 'professional' ? 'Professional' : 'Personal'}
                    </span>
                  </div>
                  {(p.date || p.client) && (
                    <div className="date-client">
                      {p.date && <div className="meta-item"><i className="bi bi-calendar-check"></i><span>{p.date}</span></div>}
                      {p.client && <div className="meta-item"><i className="bi bi-buildings"></i><span>{p.client}</span></div>}
                    </div>
                  )}
                </div>

                <h2 className="project-title">{p.title}</h2>

                {(p.tags?.length ?? 0) > 0 && (
                  <div className="project-tags">
                    {p.tags!.map((t) => <span key={t}>{t}</span>)}
                  </div>
                )}

                {p.liveUrl && (
                  <div className="project-website">
                    <i className="bi bi-link-45deg"></i>
                    <a href={liveHref} target="_blank" rel="noreferrer">{p.liveUrl.replace(/^https?:\/\//, '')}</a>
                  </div>
                )}

                {/* A sub image shows only its own description; the main image
                    keeps the full write-up below it. */}
                {!isMain ? (
                  <div className="project-overview image-detail" key={main}>
                    <h3 className="project-block-heading">
                      <i className="bi bi-image me-2"></i>
                      Image {active + 1} of {images.length}
                    </h3>
                    {note
                      ? <div className="project-block-text"><Lines text={note} /></div>
                      : <p className="text-muted fst-italic">No description for this image yet.</p>}
                    <button type="button" className="back-to-overview" onClick={() => { setPaused(true); setActive(0); }}>
                      <i className="bi bi-arrow-left"></i> Back to overview
                    </button>
                  </div>
                ) : (
                  <div className="project-overview">
                    <p className="lead">{p.description}</p>

                    {note && (
                      <div className="main-image-note">
                        <Lines text={note} />
                      </div>
                    )}

                    {p.blocks.map((b, i) => {
                      if (b.type === 'heading') {
                        return (
                          <h3 className="project-block-heading" key={b.id}>
                            {b.icon && <i className={`bi ${b.icon} me-2`}></i>}{b.text}
                          </h3>
                        );
                      }
                      if (b.type === 'text') {
                        return (
                          <div className="project-block-text" key={b.id}>
                            {b.text.split(/\n\s*\n/).map((para, n) => (
                              <p key={n}><Lines text={para} /></p>
                            ))}
                          </div>
                        );
                      }
                      if (b.type === 'image') {
                        return b.src ? (
                          <figure className="project-block-image" key={b.id}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <a href={b.src} className="glightbox" data-gallery={`project-${i}`}>
                              <img src={b.src} alt={b.caption || p.title} className="img-fluid" />
                            </a>
                            {b.caption && <figcaption>{b.caption}</figcaption>}
                          </figure>
                        ) : null;
                      }
                      return b.images.length ? (
                        <figure className="project-block-gallery" key={b.id}>
                          <div className="project-block-gallery-grid">
                            {b.images.map((src, n) => (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <a href={src} className="glightbox" data-gallery={`project-${i}`} key={`${src}-${n}`}>
                                <img src={src} alt={b.caption || p.title} className="img-fluid" />
                              </a>
                            ))}
                          </div>
                          {b.caption && <figcaption>{b.caption}</figcaption>}
                        </figure>
                      ) : null;
                    })}
                  </div>
                )}

                {p.features.length > 0 && isMain && (
                  <div className="project-features" data-aos="fade-up" data-aos-delay="300">
                    <h3><i className="bi bi-stars"></i> Key Features</h3>
                    <ul className="feature-list">
                      {p.features.map((f) => <li key={f}><i className="bi bi-check2-circle"></i> {f}</li>)}
                    </ul>
                  </div>
                )}

                <div className="cta-buttons" data-aos="fade-up" data-aos-delay="400">
                  <a href="/#portfolio" className="btn-view-project">Back to Portfolio</a>
                  {nextSlug !== p.slug && (
                    <a href={`/portfolio/${nextSlug}`} className="btn-next-project">
                      Next Project <i className="bi bi-arrow-right"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
