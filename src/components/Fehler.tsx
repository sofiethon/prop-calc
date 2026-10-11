import { CircleAlert } from "lucide-react";

export default function Fehler({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-base font-normal text-foreground">
      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.25} aria-hidden="true" />
      {text}
    </p>
  );
}
