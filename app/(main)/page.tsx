'use client';
import HomeContent from '@/components/HomeContent';

// Shell (Header / Footer / Drawers) is provided by app/(main)/layout.tsx → ShellClient.
// HomeContent contains the actual home page JSX.
export default function HomePage() {
  return <HomeContent />;
}
