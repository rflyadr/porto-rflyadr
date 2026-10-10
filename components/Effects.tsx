'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import { useContent } from './ContentProvider';

// Page-wide behaviour: scroll animations, header state, scroll-spy, back-to-top.
export default function Effects() {
  const content = useContent();

  useEffect(() => {
    AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
  }, []);

  // New content renders new animated nodes.
  useEffect(() => { AOS.refreshHard(); }, [content]);

  useEffect(() => {
    const top = document.getElementById('scroll-top');
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.navmenu a'));
    const onScroll = () => {
      document.body.classList.toggle('scrolled', window.scrollY > 100);
      top?.classList.toggle('active', window.scrollY > 100);
      if (location.pathname !== '/') return;
      links.forEach((a) => {
        const hash = a.hash;
        const el = hash ? document.querySelector<HTMLElement>(hash) : null;
        if (!el) return;
        const pos = window.scrollY + 200;
        a.classList.toggle('active', pos >= el.offsetTop && pos <= el.offsetTop + el.offsetHeight);
      });
    };
    onScroll();
    document.addEventListener('scroll', onScroll);
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to #section after load (e.g. coming back from a project page).
  useEffect(() => {
    if (!location.hash) return;
    const t = setTimeout(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' }), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <a href="#" id="scroll-top" className="scroll-top d-flex align-items-center justify-content-center"
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
      <i className="bi bi-arrow-up-short"></i>
    </a>
  );
}
