import Image from "next/image";
import Link from "next/link";

export function LogoMark({ className = "h-11 w-auto" }: { className?: string }) {
  return <Image src="/images/logo-mark.png" alt="" width={975} height={1277} priority className={className} />;
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="Study Help home">
      <LogoMark />
      <span className="font-display text-lg font-bold tracking-tight">Study Help</span>
    </Link>
  );
}
