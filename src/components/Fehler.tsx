import { CircleAlert } from "lucide-react";

export default function Fehler({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-1 flex items-start gap-1.5 text-base font-medium text-accent">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      {text}
    </p>
  );
}
