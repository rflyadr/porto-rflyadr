'use client';

import { useContent } from './ContentProvider';
import { Lines } from './Lines';
import { Media } from './Media';

export default function About() {
  const { about, highlights, timeline, settings } = useContent();
  return (
    <section id="about" className="about section">
      <div className="container section-title">
        <h2>{about.sectionTitle}</h2>
        <p>{about.sectionSubtitle}</p>
      </div>
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row align-items-center">
          <div className="col-lg-5" data-aos="fade-right" data-aos-delay="200">
            <div className="profile-image-wrapper">
              <div className="profile-image">
                <Media path={about.image} alt="Profile" className="img-fluid" />
              </div>
              <div className="signature-section">
                <p className="quote">{about.quote}</p>
              </div>
            </div>
          </div>
          <div className="col-lg-7" data-aos="fade-left" data-aos-delay="300">
            <div className="about-content">
              <div className="intro">
                <h2>{about.heading}</h2>
                <p>{about.bio}</p>
              </div>
              <div className="skills-grid">
                {highlights.map((h, i) => (
                  <div key={`${h.title}-${i}`} className="skill-item" data-aos="zoom-in" data-aos-delay={400 + i * 50}>
                    <div className="skill-icon"><i className={`bi ${h.icon}`}></i></div>
                    <h4>{h.title}</h4>
                    <p>{h.text}</p>
                  </div>
                ))}
              </div>
              <div className="journey-timeline" data-aos="fade-up" data-aos-delay="300">
                {timeline.map((t, i) => (
                  <div key={`${t.year}-${i}`} className="timeline-item">
                    <div className="year">{t.year}</div>
                    <div className="description"><Lines text={t.description} /></div>
                  </div>
                ))}
              </div>
              <div className="cta-section" data-aos="fade-up" data-aos-delay="400">
                <div className="fun-fact">
                  <span className="emoji">{about.funFactEmoji}</span>
                  <span className="text">{about.funFactText}</span>
                </div>
                <div className="action-buttons">
                  <a href="#portfolio" className="btn btn-primary">{about.button1Label}</a>
                  <a href={settings.cvFile} className="btn btn-outline" download>{about.button2Label}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
