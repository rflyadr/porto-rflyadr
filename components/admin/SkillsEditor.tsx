'use client';

import type { SiteContent, SkillCategory } from '@/lib/defaults';
import { Card, Column, Columns } from './Card';
import { IconField, NumberField, Text } from './fields';
import { ListEditor } from './ListEditor';
import { SectionForm } from './SectionForm';

export default function SkillsEditor({ initial }: { initial: SiteContent }) {
  return (
    <SectionForm initial={initial}>
      {(d, patch) => {
        const s = (f: keyof SiteContent['skills']) => ({
          value: d.skills[f] ?? '',
          onChange: (v: string) => patch((d) => ({ skills: { ...d.skills, [f]: v } })),
        });

        // `next` may be a function of the live category, so edits to a skill row
        // never rebuild the list from a stale render.
        const setCategory = (
          i: number,
          next: Partial<SkillCategory> | ((c: SkillCategory) => Partial<SkillCategory>),
        ) =>
          patch((d) => ({
            skillCategories: d.skillCategories.map((c, n) =>
              (n === i ? { ...c, ...(typeof next === 'function' ? next(c) : next) } : c)),
          }));

        return (
          <>
            <Columns ratio="1-1-2">
              <Column>
                <Card title="Summary">
                  <Text label="Title" {...s('summaryTitle')} />
                  <Text label="Text" area {...s('summaryText')} />
                </Card>

                <Card title="Certifications">
                  <Text label="Heading" {...s('certificationsTitle')} />
                  <ListEditor
                    title="Badges"
                    items={d.certifications}
                    onChange={(update) => patch((d) => ({ certifications: update(d.certifications) }))}
                    fields={[{ key: 'label', label: 'Certification' }]}
                    blank={() => ({ label: '', order: d.certifications.length })}
                    itemLabel={(i) => i.label}
                  />
                </Card>
              </Column>

              <Column>
                <Card title="Stats">
                  <ListEditor
                    title="Numbers under the summary"
                    items={d.skillStats}
                    onChange={(update) => patch((d) => ({ skillStats: update(d.skillStats) }))}
                    fields={[
                      { key: 'icon', label: 'Icon', type: 'icon' },
                      { key: 'number', label: 'Number (e.g. 8+)' },
                      { key: 'label', label: 'Label' },
                    ]}
                    blank={() => ({ number: '', label: '', icon: 'bi-star', order: d.skillStats.length })}
                    itemLabel={(i) => i.label}
                  />
                </Card>
              </Column>

              <Column>
                <Card title="Skill categories" fill>
                  <p className="small text-muted">Each category becomes one card with its own progress bars. The skills in a category should add up to 100% – each bar is that skill’s share of the category.</p>
                  {d.skillCategories.map((cat, i) => (
                    <div className="admin-list-item" key={`cat-${i}`}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="small">
                          <strong>{cat.title || 'New category'}</strong>
                          {(() => {
                            const total = cat.skills.reduce((sum, sk) => sum + (sk.percent || 0), 0);
                            const ok = total === 100;
                            return (
                              <span className={`badge ms-2 ${ok ? 'text-bg-success' : 'text-bg-warning'}`}
                                title={ok ? 'Adds up to 100%' : 'The skills in a category should add up to 100%'}>
                                {total}%
                              </span>
                            );
                          })()}
                        </span>
                        <span className="btn-group btn-group-sm">
                          <button type="button" className="btn btn-outline-secondary" disabled={i === 0}
                            onClick={() => patch((d) => {
                              const next = [...d.skillCategories];
                              [next[i - 1], next[i]] = [next[i], next[i - 1]];
                              return { skillCategories: next.map((c, n) => ({ ...c, order: n })) };
                            })}>↑</button>
                          <button type="button" className="btn btn-outline-secondary" disabled={i === d.skillCategories.length - 1}
                            onClick={() => patch((d) => {
                              const next = [...d.skillCategories];
                              [next[i + 1], next[i]] = [next[i], next[i + 1]];
                              return { skillCategories: next.map((c, n) => ({ ...c, order: n })) };
                            })}>↓</button>
                          <button type="button" className="btn btn-outline-danger"
                            onClick={() => patch((d) => ({ skillCategories: d.skillCategories.filter((_, n) => n !== i) }))}>
                            Delete
                          </button>
                        </span>
                      </div>

                      <Text label="Category title" value={cat.title} onChange={(v) => setCategory(i, { title: v })} />
                      <IconField value={cat.icon} onChange={(v) => setCategory(i, { icon: v })} />

                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="form-label small fw-semibold mb-0">Skills</span>
                        {cat.skills.length > 0 && (
                          <button type="button" className="btn btn-sm btn-link p-0 text-decoration-none"
                            onClick={() => setCategory(i, (c) => {
                              const total = c.skills.reduce((sum, sk) => sum + (sk.percent || 0), 0);
                              if (!total) return {};
                              const scaled = c.skills.map((sk) => ({
                                ...sk, percent: Math.round((sk.percent || 0) / total * 100),
                              }));
                              // Put any rounding drift on the largest entry so it lands on 100.
                              const drift = 100 - scaled.reduce((sum, sk) => sum + sk.percent, 0);
                              if (drift) {
                                let big = 0;
                                scaled.forEach((sk, n) => { if (sk.percent > scaled[big].percent) big = n; });
                                scaled[big] = { ...scaled[big], percent: scaled[big].percent + drift };
                              }
                              return { skills: scaled };
                            })}>
                            Rescale to 100%
                          </button>
                        )}
                      </div>
                      {cat.skills.map((sk, j) => (
                        <div className="row g-2 align-items-end mb-2" key={`sk-${j}`}>
                          <div className="col-7">
                            <input className="form-control form-control-sm" value={sk.name} placeholder="Skill name"
                              onChange={(e) => setCategory(i, (c) => ({
                                skills: c.skills.map((x, n) => (n === j ? { ...x, name: e.target.value } : x)),
                              }))} />
                          </div>
                          <div className="col-3">
                            <div className="input-group input-group-sm">
                              <input type="number" className="form-control" value={sk.percent} min={0} max={100}
                                onChange={(e) => setCategory(i, (c) => ({
                                  skills: c.skills.map((x, n) => (n === j
                                    ? { ...x, percent: Math.max(0, Math.min(100, Number(e.target.value) || 0)) } : x)),
                                }))} />
                              <span className="input-group-text">%</span>
                            </div>
                          </div>
                          <div className="col-2">
                            <button type="button" className="btn btn-sm btn-outline-danger w-100"
                              onClick={() => setCategory(i, (c) => ({ skills: c.skills.filter((_, n) => n !== j) }))}>×</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" className="btn btn-sm btn-outline-primary"
                        onClick={() => setCategory(i, (c) => ({ skills: [...c.skills, { name: '', percent: 70 }] }))}>
                        + Add skill
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => patch((d) => ({
                      skillCategories: [...d.skillCategories,
                        { title: '', icon: 'bi-star', skills: [], order: d.skillCategories.length }],
                    }))}>
                    + Add category
                  </button>
                </Card>
              </Column>
            </Columns>
          </>
        );
      }}
    </SectionForm>
  );
}
