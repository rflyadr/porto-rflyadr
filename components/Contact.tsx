'use client';

import { useContent } from './ContentProvider';

export default function Contact() {
  const { contact, contactInfo } = useContent();

  function sendToWA(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const msg = `Subject: ${f.get('subject')}\nName: ${f.get('name')} (${f.get('email')})\nMessage:\n${f.get('message')}`;
    window.open(`https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <section id="contact" className="contact section light-background">
      <div className="container section-title" data-aos="fade-up">
        <h2>{contact.sectionTitle}</h2>
        <p>{contact.sectionSubtitle}</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <div className="row g-4 g-lg-5">
          <div className="col-lg-5">
            <div className="info-box" data-aos="fade-up" data-aos-delay="200">
              <h3>{contact.infoTitle}</h3>
              {contactInfo.map((item, i) => (
                <div className="info-item" key={`${item.title}-${i}`} data-aos="fade-up" data-aos-delay={300 + i * 100}>
                  <div className="icon-box"><i className={`bi ${item.icon}`}></i></div>
                  <div className="content">
                    <h4>{item.title}</h4>
                    <p>
                      {item.link
                        ? <a href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{item.text}</a>
                        : item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-7">
            <div className="contact-form" data-aos="fade-up" data-aos-delay="300">
              <h3>{contact.formTitle}</h3>
              <p>{contact.formSubtitle}</p>
              <form onSubmit={sendToWA}>
                <div className="row gy-4">
                  <div className="col-md-6"><input type="text" name="name" className="form-control" placeholder="Your Name" required /></div>
                  <div className="col-md-6"><input type="email" name="email" className="form-control" placeholder="Your Email" required /></div>
                  <div className="col-12"><input type="text" name="subject" className="form-control" placeholder="Subject" required /></div>
                  <div className="col-12"><textarea name="message" className="form-control" rows={6} placeholder="Message" required></textarea></div>
                  <div className="col-12 text-center"><button type="submit" className="btn">{contact.buttonLabel}</button></div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
