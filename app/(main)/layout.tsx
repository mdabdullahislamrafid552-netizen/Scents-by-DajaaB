import ShellClient from "@/components/ShellClient";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <ShellClient>{children}</ShellClient>;
}
