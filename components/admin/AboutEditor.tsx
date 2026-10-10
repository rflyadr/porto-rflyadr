'use client';

import type { SiteContent } from '@/lib/defaults';
import { Card, Column, Columns } from './Card';
import { ImageField, Text } from './fields';
import { ListEditor } from './ListEditor';
import { SectionForm } from './SectionForm';

export default function AboutEditor({ initial }: { initial: SiteContent }) {
  return (
    <SectionForm initial={initial}>
      {(d, patch) => {
        const about = (f: keyof SiteContent['about']) => ({
          value: d.about[f] ?? '',
          onChange: (v: string) => patch((d) => ({ about: { ...d.about, [f]: v } })),
        });
        return (
          <>
            <Columns ratio="3">

              <Column>
                <Card title="Section heading">
                  <div className="row">
                            <div className="col-md-6"><Text label="Title" {...about('sectionTitle')} /></div>
                            <div className="col-md-6"><Text label="Subtitle" {...about('sectionSubtitle')} /></div>
                  </div>
                </Card>

                <Card title="Photo and quote">
                  <ImageField label="Photo" {...about('image')} />
                  <Text label="Quote under the photo" {...about('quote')} />
                </Card>

                <Card title="Bio">
                  <Text label="Heading" {...about('heading')} />
                  <Text label="Bio text" area {...about('bio')} />
                </Card>

                <Card title="Fun fact and buttons">
                  <div className="row">
                            <div className="col-md-3"><Text label="Emoji" {...about('funFactEmoji')} /></div>
                            <div className="col-md-9"><Text label="Fun fact text" {...about('funFactText')} /></div>
                            <div className="col-md-6"><Text label="Button 1 label" {...about('button1Label')} /></div>
                            <div className="col-md-6"><Text label="Button 2 label (downloads the CV)" {...about('button2Label')} /></div>
                  </div>
                </Card>
              </Column>

              <Column>
                <Card title="Highlight cards" fill>
                  <ListEditor
                            title="The three cards under the bio"
                            items={d.highlights}
                            onChange={(update) => patch((d) => ({ highlights: update(d.highlights) }))}
                            fields={[
                              { key: 'icon', label: 'Icon', type: 'icon' },
                              { key: 'title', label: 'Title' },
                              { key: 'text', label: 'Text', type: 'area' },
                            ]}
                            blank={() => ({ icon: 'bi-star', title: '', text: '', order: d.highlights.length })}
                            itemLabel={(i) => i.title}
                  />
                </Card>
              </Column>

              <Column>
                <Card title="Journey timeline" fill>
                  <ListEditor
                            title="Entries"
                            items={d.timeline}
                            onChange={(update) => patch((d) => ({ timeline: update(d.timeline) }))}
                            fields={[
                              { key: 'year', label: 'Year / period' },
                              { key: 'description', label: 'Description (line breaks are kept)', type: 'area' },
                            ]}
                            blank={() => ({ year: '', description: '', order: d.timeline.length })}
                            itemLabel={(i) => i.year}
                  />
                </Card>
              </Column>

            </Columns>
          </>
        );
      }}
    </SectionForm>
  );
}
