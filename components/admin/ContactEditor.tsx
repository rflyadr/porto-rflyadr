'use client';

import type { SiteContent } from '@/lib/defaults';
import { Card, Column, Columns } from './Card';
import { Text } from './fields';
import { ListEditor } from './ListEditor';
import { SectionForm } from './SectionForm';

export default function ContactEditor({ initial }: { initial: SiteContent }) {
  return (
    <SectionForm initial={initial}>
      {(d, patch) => {
        const c = (f: keyof SiteContent['contact']) => ({
          value: d.contact[f] ?? '',
          onChange: (v: string) => patch((d) => ({ contact: { ...d.contact, [f]: v } })),
        });
        return (
          <>
            <Columns ratio="1-1">

              <Column>
                <Card title="Section heading">
                  <Text label="Title" {...c('sectionTitle')} />
                  <Text label="Subtitle" area {...c('sectionSubtitle')} />
                </Card>

                <Card title="WhatsApp form">
                  <Text label="Form heading" {...c('formTitle')} />
                  <Text label="Form subtitle" {...c('formSubtitle')} />
                  <Text label="Button label" {...c('buttonLabel')} />
                  <Text label="WhatsApp number" help="Country code, digits only – e.g. 6283100592719" {...c('whatsappNumber')} />
                </Card>
              </Column>

              <Column>
                <Card title="Contact info" fill>
                  <Text label="Box heading" {...c('infoTitle')} />
                  <ListEditor
                            title="Items"
                            items={d.contactInfo}
                            onChange={(update) => patch((d) => ({ contactInfo: update(d.contactInfo) }))}
                            fields={[
                              { key: 'icon', label: 'Icon', type: 'icon' },
                              { key: 'title', label: 'Label (e.g. Email)' },
                              { key: 'text', label: 'Text shown' },
                              { key: 'link', label: 'Link (optional)' },
                            ]}
                            blank={() => ({ icon: 'bi-geo-alt', title: '', text: '', link: '', order: d.contactInfo.length })}
                            itemLabel={(i) => i.title}
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
