'use client';

import { useContent } from './ContentProvider';
import { Media } from './Media';

const nav = [
  ['Home', '#hero'], ['About', '#about'], ['Resume', '#resume'],
  ['Portfolio', '#portfolio'], ['Contact', '#contact'],
];

export default function Sidebar() {
  const { settings, socials, hero } = useContent();
  const toggle = () => document.body.classList.toggle('mobile-nav-active');

  return (
    <header id="header" className="header d-flex align-items-center fixed-top">
      <div className="container-fluid position-relative d-flex align-items-center justify-content-between">
        <a href="/" className="logo d-flex align-items-center" />
        <nav id="navmenu" className="navmenu">
          <div className="profile-img">
            <Media path={hero.image} className="img-fluid rounded-circle" />
          </div>
          <a href="/" className="logo d-flex align-items-center justify-content-center active">
            <h1 className="sitename">{settings.name}</h1>
          </a>
          <div className="social-links text-center">
            {socials.map((s, i) => (
              <a key={`${s.platform}-${i}`} href={s.url} aria-label={s.platform}><i className={`bi ${s.icon}`}></i></a>
            ))}
          </div>
          <ul>
            {nav.map(([label, href]) => (
              <li key={href}><a href={`/${href}`} onClick={() => document.body.classList.remove('mobile-nav-active')}>{label}</a></li>
            ))}
          </ul>
          <i className="mobile-nav-toggle d-xl-none bi bi-list" onClick={toggle}></i>
        </nav>
      </div>
    </header>
  );
}
