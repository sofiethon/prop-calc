import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  titel: string;
  text: string;
};

export default function FeatureCard({ icon: Icon, titel, text }: Props) {
  return (
    <div className="rounded-md bg-subtle p-6 sm:p-8">
      {/* Lucide-Icons sind ohne aria-label automatisch aria-hidden – rein dekorativ. */}
      <Icon className="mb-4 text-foreground" size={24} strokeWidth={1.25} />
      <h2 className="mb-2 font-display text-h3 font-normal tracking-heading">{titel}</h2>
      <p className="text-body">{text}</p>
    </div>
  );
}
