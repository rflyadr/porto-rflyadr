// Admin side-nav. Each content link maps to a section of the site.
export const EDIT_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
  { href: '/admin/hero', label: 'Hero', icon: 'bi-person-badge' },
  { href: '/admin/about', label: 'About', icon: 'bi-file-person' },
  { href: '/admin/skills', label: 'Skills', icon: 'bi-bar-chart' },
  { href: '/admin/resume', label: 'Resume', icon: 'bi-journal-text' },
  { href: '/admin/projects', label: 'Projects', icon: 'bi-grid' },
  { href: '/admin/contact', label: 'Contact', icon: 'bi-envelope' },
  { href: '/admin/site', label: 'Site settings', icon: 'bi-gear' },
];

// Public pages, so you can jump from the admin into the live site.
export const SITE_LINKS = [
  { href: '/', label: 'Home', icon: 'bi-house' },
  { href: '/#about', label: 'About', icon: 'bi-person' },
  { href: '/#skills', label: 'Skills', icon: 'bi-bar-chart' },
  { href: '/#resume', label: 'Resume', icon: 'bi-journal-text' },
  { href: '/#portfolio', label: 'Portfolio', icon: 'bi-grid' },
  { href: '/#contact', label: 'Contact', icon: 'bi-envelope' },
];
