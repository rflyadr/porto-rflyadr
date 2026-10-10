'use client';

import Link from 'next/link';
import type { SiteContent } from '@/lib/defaults';
import { Card, Column, Columns } from './Card';
import { ImageField, Text } from './fields';
import { ListEditor } from './ListEditor';
import { SectionForm } from './SectionForm';

export default function HeroEditor({ initial }: { initial: SiteContent }) {
  return (
    <SectionForm initial={initial}>
      {(d, patch) => {
        const hero = (f: keyof SiteContent['hero']) => ({
          value: d.hero[f] ?? '',
          onChange: (v: string) => patch((d) => ({ hero: { ...d.hero, [f]: v } })),
        });
        return (
          <Columns ratio="3">
            <Column>
              <Card title="Intro">
                <Text label="Description" area {...hero('description')} />
                <ImageField label="Hero image" {...hero('image')} />
              </Card>

              <Card title="Buttons">
                <div className="row">
                  <div className="col-md-6"><Text label="Button 1 label" {...hero('button1Label')} /></div>
                  <div className="col-md-6"><Text label="Button 1 link" {...hero('button1Link')} /></div>
                  <div className="col-md-6"><Text label="Button 2 label" {...hero('button2Label')} /></div>
                  <div className="col-md-6"><Text label="Button 2 link" {...hero('button2Link')} /></div>
                </div>
                <p className="small text-muted mb-0">
                  Links can be a section on the page (<code>#portfolio</code>) or a full URL.
                </p>
              </Card>
            </Column>

            <Column>
              <Card title="Floating cards" fill>
                <ListEditor
                  title="Cards over the hero image"
                  items={d.heroCards}
                  onChange={(update) => patch((d) => ({ heroCards: update(d.heroCards) }))}
                  fields={[{ key: 'icon', label: 'Icon', type: 'icon' }, { key: 'label', label: 'Text' }]}
                  blank={() => ({ icon: 'bi-star', label: '', order: d.heroCards.length })}
                  itemLabel={(i) => i.label}
                />
              </Card>
            </Column>

            <Column>
              <Card title="Social links" fill>
                <p className="small text-muted">
                  One list, shown both under the hero text and in the site sidebar. Editing it here is the
                  same as editing it under <Link href="/admin/site">Site settings</Link>.
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
