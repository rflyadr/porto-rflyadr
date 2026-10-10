'use client';

import { useContent } from './ContentProvider';
import { Lines } from './Lines';

export default function Resume() {
  const { resume, experience, education } = useContent();

  return (
    <section id="resume" className="resume section">
      <div className="container section-title">
        <h2>{resume.sectionTitle}</h2>
        <p>{resume.sectionSubtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row">
          <div className="col-lg-6" data-aos="fade-right" data-aos-delay="200">
            <div className="experience-section">
              <div className="section-header">
                <h2><i className={`bi ${resume.experienceIcon}`}></i> {resume.experienceTitle}</h2>
                <p className="section-subtitle">{resume.experienceSubtitle}</p>
              </div>
              <div className="experience-cards">
                {experience.map((job, i) => (
                  <div className="experience-card" key={`${job.role}-${i}`} data-aos="zoom-in" data-aos-delay={300 + i * 100}>
                    <div className="card-header">
                      <div className="role-info">
                        <h3>{job.role}</h3>
                        <h4>{job.company}</h4>
                      </div>
                      <span className="duration">{job.duration}</span>
                    </div>
                    <div className="card-body">
                      <p><Lines text={job.description} /></p>
                      {job.achievements.length > 0 && (
                        <ul className="achievements">
                          {job.achievements.map((a) => <li key={a}>{a}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6" data-aos="fade-left" data-aos-delay="200">
            <div className="education-section">
              <div className="section-header">
                <h2><i className={`bi ${resume.educationIcon}`}></i> {resume.educationTitle}</h2>
                <p className="section-subtitle">{resume.educationSubtitle}</p>
              </div>
              <div className="education-timeline">
                <div className="timeline-track"></div>
                {education.map((ed, i) => (
                  <div className="education-item" key={`${ed.title}-${i}`} data-aos="slide-up" data-aos-delay={300 + i * 100}>
                    <div className="timeline-marker"></div>
                    <div className="education-content">
                      <div className="degree-header">
                        <h3>{ed.title}</h3>
                        <span className="year">{ed.year}</span>
                      </div>
                      <h4 className="institution">{ed.institution}</h4>
                      <p><Lines text={ed.description} /></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
