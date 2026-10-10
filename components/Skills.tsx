'use client';

import { useEffect, useRef } from 'react';
import { useContent } from './ContentProvider';

export default function Skills() {
  const { skills, skillCategories, skillStats, certifications } = useContent();
  const ref = useRef<HTMLElement>(null);

  // Fill the progress bars when each skill card scrolls into view.
  useEffect(() => {
    const groups = ref.current?.querySelectorAll('.skills-animation') ?? [];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.querySelectorAll<HTMLElement>('.progress .progress-bar').forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
        io.unobserve(e.target);
      }),
      { rootMargin: '0px 0px -20% 0px' },
    );
    groups.forEach((g) => io.observe(g));
    return () => io.disconnect();
  }, [skillCategories]);

  return (
    <section id="skills" ref={ref} className="skills section">
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          <div className="col-lg-8">
            <div className="skills-grid">
              <div className="row g-4">
                {skillCategories.map((cat, i) => (
                  <div className="col-md-6" key={`${cat.title}-${i}`} data-aos="flip-left" data-aos-delay={200 + i * 100}>
                    <div className="skill-card">
                      <div className="skill-header">
                        <i className={`bi ${cat.icon}`}></i>
                        <h3>{cat.title}</h3>
                      </div>
                      <div className="skills-animation">
                        {cat.skills.map((s, j) => (
                          <div className="skill-item" key={`${s.name}-${j}`}>
                            <div className="skill-info">
                              <span className="skill-name">{s.name}</span>
                              <span className="skill-percentage">{s.percent}%</span>
                            </div>
                            <div className="skill-bar progress">
                              <div className="progress-bar" role="progressbar"
                                aria-valuenow={s.percent} aria-valuemin={0} aria-valuemax={100}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="skills-summary" data-aos="fade-left" data-aos-delay="200">
              <h3>{skills.summaryTitle}</h3>
              <p>{skills.summaryText}</p>

              {skillStats.length > 0 && (
                <div className="summary-stats">
                  {skillStats.map((s, i) => (
                    <div className="stat-item" key={`${s.label}-${i}`} data-aos="zoom-in" data-aos-delay={300 + i * 100}>
                      <div className="stat-circle"><i className={`bi ${s.icon}`}></i></div>
                      <div className="stat-info">
                        <span className="stat-number">{s.number}</span>
                        <span className="stat-label">{s.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {certifications.length > 0 && (
                <div className="skills-badges" data-aos="fade-up" data-aos-delay="600">
                  <h4>{skills.certificationsTitle}</h4>
                  <div className="badge-list">
                    {certifications.map((c, i) => <div className="skill-badge" key={`${c.label}-${i}`}>{c.label}</div>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
