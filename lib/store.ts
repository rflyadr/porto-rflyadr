import 'server-only';
import Database from 'better-sqlite3';
import { mkdirSync, readFileSync } from 'fs';
import path from 'path';
import { defaultContent, migrateProject, type SiteContent } from './defaults';

// Storage: one SQLite file + an uploads folder, both under DATA_DIR.
// The whole editable site is one JSON document in the `kv` table.
export const DATA_DIR = process.env.DATA_DIR || path.join(/*turbopackIgnore: true*/ process.cwd(), 'data');
export const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

let db: Database.Database | undefined;
function open() {
  if (db) return db;
  mkdirSync(DATA_DIR, { recursive: true });
  db = new Database(path.join(DATA_DIR, 'porto.db'));
  db.pragma('journal_mode = WAL');
  db.exec('CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL)');
  return db;
}

// Saved values are layered over the defaults, so new fields never break old data.
function merge(saved: Partial<SiteContent>): SiteContent {
  const d = defaultContent;
  return {
    settings: { ...d.settings, ...saved.settings },
    hero: { ...d.hero, ...saved.hero },
    about: { ...d.about, ...saved.about },
    skills: { ...d.skills, ...saved.skills },
    resume: { ...d.resume, ...saved.resume },
    portfolio: { ...d.portfolio, ...saved.portfolio },
    contact: { ...d.contact, ...saved.contact },
    socials: saved.socials ?? d.socials,
    heroCards: saved.heroCards ?? d.heroCards,
    highlights: saved.highlights ?? d.highlights,
    timeline: saved.timeline ?? d.timeline,
    skillCategories: saved.skillCategories ?? d.skillCategories,
    skillStats: saved.skillStats ?? d.skillStats,
    certifications: saved.certifications ?? d.certifications,
    experience: saved.experience ?? d.experience,
    education: saved.education ?? d.education,
    contactInfo: saved.contactInfo ?? d.contactInfo,
    portfolioFilters: saved.portfolioFilters ?? d.portfolioFilters,
    // Older saves have overview/challenge/solution instead of blocks.
    projects: (saved.projects ?? d.projects).map(migrateProject),
  };
}

/**
 * Static export mode (GitHub Pages): read the committed JSON instead of
 * SQLite, so the site builds with no database and no server.
 */
export const STATIC_MODE = process.env.STATIC_EXPORT === '1';

let staticCache: SiteContent | undefined;
function readStatic(): SiteContent {
  if (staticCache) return staticCache;
  try {
    const file = path.join(process.cwd(), 'content', 'site.json');
    staticCache = merge(JSON.parse(readFileSync(file, 'utf8')));
  } catch {
    staticCache = defaultContent;
  }
  return staticCache;
}

export async function getContent(): Promise<SiteContent> {
  if (STATIC_MODE) return readStatic();
  const row = open().prepare('SELECT value FROM kv WHERE key = ?').get('content') as { value: string } | undefined;
  return row ? merge(JSON.parse(row.value)) : defaultContent;
}

export async function saveContent(input: unknown): Promise<SiteContent> {
  const content = merge((input ?? {}) as Partial<SiteContent>);
  open()
    .prepare('INSERT INTO kv (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at')
    .run('content', JSON.stringify(content), new Date().toISOString());
  return content;
}
