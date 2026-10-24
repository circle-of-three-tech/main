import { BrainCircuit, Cloud, Code2, Database, Globe, Layers, PenTool, ShieldCheck, Smartphone, Sparkles, type LucideIcon } from "lucide-react";

export const SERVICE_ICONS: Record<string, LucideIcon> = { BrainCircuit, Cloud, Code2, Database, Globe, Layers, PenTool, ShieldCheck, Smartphone, Sparkles };

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = SERVICE_ICONS[name] ?? Code2;
  return <Icon className={className} aria-hidden />;
}
