'use client';

import { createContext, useContext } from 'react';
import { defaultContent, type SiteContent } from '@/lib/defaults';

const Ctx = createContext<SiteContent>(defaultContent);
export const useContent = () => useContext(Ctx);

// Content is read on the server (see app/layout.tsx) and passed down.
export function ContentProvider({ content, children }: { content: SiteContent; children: React.ReactNode }) {
  return <Ctx.Provider value={content}>{children}</Ctx.Provider>;
}
