'use client';

import { useEffect, useRef } from 'react';
import Typed from 'typed.js';
import { useContent } from './ContentProvider';
import { Media } from './Media';

export default function Hero() {
  const { settings, hero, socials, heroCards } = useContent();
  const typedEl = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!typedEl.current) return;
    const typed = new Typed(typedEl.current, {
      strings: settings.typedText.split(',').map((t) => t.trim()).filter(Boolean),
      loop: true, typeSpeed: 100, backSpeed: 50, backDelay: 2000,
    });
    return () => typed.destroy();
  }, [settings.typedText]);

  return (
    <section id="hero" className="hero section">
      <div className="container">
        <div className="row g-0 align-items-center">
          <div className="col-lg-6 hero-content" data-aos="fade-right" data-aos-delay="100">
            <div className="content-wrapper">
              <h1 className="hero-title"><span className="typed" ref={typedEl}></span></h1>
              <p className="lead">{hero.description}</p>
              <div className="hero-actions" data-aos="fade-up" data-aos-delay="300">
                <a href={hero.button1Link} className="btn btn-primary">{hero.button1Label}</a>
                <a href={hero.button2Link} className="btn btn-outline">{hero.button2Label}</a>
              </div>
              <div className="social-links" data-aos="fade-up" data-aos-delay="400">
                {socials.map((s, i) => (
                  <a key={`${s.platform}-${i}`} href={s.url} aria-label={s.platform}><i className={`bi ${s.icon}`}></i></a>
                ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6 hero-image" data-aos="fade-left" data-aos-delay="200">
            <div className="image-container">
              <div className="floating-elements">
                {heroCards.map((c, i) => (
                  <div key={`${c.label}-${i}`} className={`floating-card card-${(i % 3) + 1}`} data-aos="zoom-in" data-aos-delay={300 + i * 100}>
                    <i className={`bi ${c.icon}`}></i>
                    <span>{c.label}</span>
                  </div>
                ))}
              </div>
              <Media path={hero.image} alt="Portfolio Hero" className="img-fluid hero-main-image" />
              <div className="image-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
