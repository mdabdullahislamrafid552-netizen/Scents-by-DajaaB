'use client';
import ShellClient from '@/components/ShellClient';
import HomeContent from '@/components/HomeContent';

// This file handles the "/" route in Next.js dev mode (Turbopack picks app/page.tsx
// over app/(main)/page.tsx). It wraps HomeContent with ShellClient explicitly so
// the header/footer/drawers are present. In production builds, (main)/page.tsx
// takes over and receives the shell from (main)/layout.tsx.
export default function Page() {
  return (
    <ShellClient>
      <HomeContent />
    </ShellClient>
  );
}
