import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border">
      <div className="page-container flex items-center justify-between gap-4 py-4">
        <Link href="/" className="flex min-h-11 flex-col items-start gap-2 text-foreground">
          {/* Das Logo hat unten freien Rand; das Feld schneidet ihn ab (Ausschnitt oben). */}
          <span className="relative block h-12 aspect-[1344/1000] overflow-hidden">
            <Image
              src="/sotho-logo.png"
              alt="SoTho"
              fill
              priority
              sizes="65px"
              className="object-cover object-top"
            />
          </span>
          <span className="text-caption font-normal tracking-eyebrow text-muted">prop-calc</span>
        </Link>
      </div>
    </header>
  );
}
