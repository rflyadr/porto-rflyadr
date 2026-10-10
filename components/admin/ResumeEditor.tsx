'use client';

import type { SiteContent } from '@/lib/defaults';
import { Card, Column, Columns } from './Card';
import { IconField, Text } from './fields';
import { ListEditor } from './ListEditor';
import { SectionForm } from './SectionForm';

export default function ResumeEditor({ initial }: { initial: SiteContent }) {
  return (
    <SectionForm initial={initial}>
      {(d, patch) => {
        const r = (f: keyof SiteContent['resume']) => ({
          value: d.resume[f] ?? '',
          onChange: (v: string) => patch((d) => ({ resume: { ...d.resume, [f]: v } })),
        });
        return (
          <Columns ratio="1-2-2">
            <Column>
              <Card title="Section heading">
                <Text label="Title" {...r('sectionTitle')} />
                <Text label="Subtitle" area {...r('sectionSubtitle')} />
              </Card>
            </Column>

            <Column>
              <Card title="Experience column" fill>
                <Text label="Column title" {...r('experienceTitle')} />
                <IconField value={d.resume.experienceIcon}
                  onChange={(v) => patch((d) => ({ resume: { ...d.resume, experienceIcon: v } }))} />
                <Text label="Column subtitle" {...r('experienceSubtitle')} />
                <ListEditor
                  title="Jobs"
                  items={d.experience}
                  onChange={(update) => patch((d) => ({ experience: update(d.experience) }))}
                  fields={[
                    { key: 'role', label: 'Role' },
                    { key: 'company', label: 'Company' },
                    { key: 'duration', label: 'Duration (e.g. Aug 2023 – Present)' },
                    { key: 'description', label: 'Description', type: 'area' },
                    { key: 'achievements', label: 'Achievements', type: 'tags' },
                  ]}
                  blank={() => ({ role: '', company: '', duration: '', description: '', achievements: [], order: d.experience.length })}
                  itemLabel={(i) => i.role}
                />
              </Card>
            </Column>

            <Column>
              <Card title="Education column" fill>
                <Text label="Column title" {...r('educationTitle')} />
                <IconField value={d.resume.educationIcon}
                  onChange={(v) => patch((d) => ({ resume: { ...d.resume, educationIcon: v } }))} />
                <Text label="Column subtitle" {...r('educationSubtitle')} />
                <ListEditor
                  title="Education and certificates"
                  items={d.education}
                  onChange={(update) => patch((d) => ({ education: update(d.education) }))}
                  fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'year', label: 'Year' },
                    { key: 'institution', label: 'Institution' },
                    { key: 'description', label: 'Description', type: 'area' },
                  ]}
                  blank={() => ({ title: '', year: '', institution: '', description: '', order: d.education.length })}
                  itemLabel={(i) => i.title}
                />
              </Card>
            </Column>
          </Columns>
        );
      }}
    </SectionForm>
  );
}
