'use client';

import Link from 'next/link';
import type { SiteContent } from '@/lib/defaults';
import { Card, Column, Columns } from './Card';
import { ImageField, Text } from './fields';
import { ListEditor } from './ListEditor';
import { SectionForm } from './SectionForm';

export default function SiteEditor({ initial }: { initial: SiteContent }) {
  return (
    <SectionForm initial={initial}>
      {(d, patch) => {
        const s = (f: keyof SiteContent['settings']) => ({
          value: d.settings[f] ?? '',
          onChange: (v: string) => patch((d) => ({ settings: { ...d.settings, [f]: v } })),
        });
        return (
          <Columns ratio="1-1">
            <Column>
              <Card title="Identity">
                <Text label="Page title (browser tab)" {...s('pageTitle')} />
                <Text label="Your name (sidebar and footer)" {...s('name')} />
                <Text label="Typed hero text" {...s('typedText')} />
                <p className="small text-muted">Separate with commas to cycle through several phrases.</p>
              </Card>

              <Card title="CV">
                <ImageField label="CV file (PDF)" accept="application/pdf" {...s('cvFile')} />
              </Card>
            </Column>

            <Column>
              <Card title="Social links" fill>
                <p className="small text-muted">
                  Shown both in the sidebar and under the hero text. The same list appears on the{' '}
                  <Link href="/admin/hero">Hero</Link> page.
                </p>
                <ListEditor
                  title="Links"
                  items={d.socials}
                  onChange={(update) => patch((d) => ({ socials: update(d.socials) }))}
                  fields={[
                    { key: 'platform', label: 'Name' },
                    { key: 'url', label: 'URL' },
                    { key: 'icon', label: 'Icon', type: 'icon' },
                  ]}
                  blank={() => ({ platform: '', url: '', icon: 'bi-link-45deg', order: d.socials.length })}
                  itemLabel={(i) => i.platform}
                  grid={2}
                />
              </Card>
            </Column>
          </Columns>
        );
      }}
    </SectionForm>
  );
}
