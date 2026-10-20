import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import { Pop } from "@/components/atoms/pop";
import { cn } from "@/lib/utils";

type CertificationListProps = {
  items: readonly {
    id: string;
    name: string;
    issuer: string;
    /** When it was obtained, as the reader's language writes it, such as `mai 2026`. */
    issued: string;
    score: string | null;
    logo: string;
    /** Public identifier a verifier asks for, when the issuer gives one. */
    credentialId: string | null;
    verifyUrl: string;
  }[];
  labels: { verify: string; credentialId: string };
};

const STAGGER_SECONDS = 0.15;

/**
 * One plate per credential, hung at slightly different heights: the badge large on a glow with
 * the date as an outlined figure right behind it, and the name beneath. The identifier and the
 * verification link show on hover or focus with a mouse, and always on a touch screen, where the
 * plate lies flat as a row.
 */
export function CertificationList({ items, labels }: CertificationListProps) {
  return (
    <ul className="grid gap-3 md:grid-cols-3 md:gap-6">
      {items.map((item, order) => (
        <li key={item.id} className={cn(order === 1 && "md:mt-12")}>
          <Pop from="pop" delay={0.25 + order * STAGGER_SECONDS} className="h-full">
            <div className="group/plate relative flex h-full items-center gap-4 overflow-hidden rounded-[2rem] border border-border bg-surface p-4 transition-[border-color,box-shadow] duration-(--duration-base) hover:border-accent hover:shadow-lg md:min-h-[26rem] md:flex-col md:items-stretch md:justify-between md:gap-6 md:p-6">
              <div className="relative flex size-28 shrink-0 items-center justify-center md:size-auto md:flex-1">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 flex justify-center text-center text-[1.35rem] leading-none font-semibold tracking-tighter whitespace-nowrap text-transparent uppercase select-none [-webkit-text-stroke:1px_color-mix(in_oklch,var(--foreground)_35%,transparent)] md:top-2 md:text-[clamp(2.25rem,4vw,4.5rem)]"
                >
                  <span>{item.issued}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute size-20 rounded-full bg-accent/25 blur-3xl transition-transform duration-(--duration-slow) group-hover/plate:scale-125 md:size-40"
                />
                <Image
                  src={item.logo}
                  alt=""
                  width={160}
                  height={160}
                  unoptimized
                  className="relative mt-5 size-20 drop-shadow-2xl transition-transform duration-(--duration-slow) ease-out-expo group-hover/plate:scale-110 md:mt-16 md:size-36"
                />
              </div>
              <div className="relative flex min-w-0 flex-col gap-1">
                <p className="text-xl font-semibold text-pretty md:text-2xl">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {[item.issuer, item.issued, item.score].filter(Boolean).join(" · ")}
                </p>
                <div className="grid transition-[grid-template-rows,opacity] duration-(--duration-base) pointer-fine:grid-rows-[0fr] pointer-fine:opacity-0 pointer-fine:group-focus-within/plate:grid-rows-[1fr] pointer-fine:group-focus-within/plate:opacity-100 pointer-fine:group-hover/plate:grid-rows-[1fr] pointer-fine:group-hover/plate:opacity-100">
                  <div className="flex flex-col gap-2 overflow-hidden">
                    <div className="mt-2 flex flex-col gap-1.5 border-t border-border pt-2 text-sm md:mt-3 md:gap-2 md:pt-3">
                      {item.credentialId && (
                        <p className="flex flex-wrap gap-x-2 font-mono text-xs break-all text-muted-foreground">
                          <span>{labels.credentialId}</span>
                          <span className="text-foreground">{item.credentialId}</span>
                        </p>
                      )}
                      <Link
                        href={item.verifyUrl}
                        external
                        className="group/verify inline-flex w-fit items-center gap-1.5 font-medium"
                      >
                        {labels.verify}
                        <Icon
                          icon={ArrowUpRight}
                          size="sm"
                          className="transition-transform duration-(--duration-base) group-hover/verify:translate-x-0.5 group-hover/verify:-translate-y-0.5"
                        />
                        <span className="sr-only">{`${item.name}, ${item.issuer}`}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Pop>
        </li>
      ))}
    </ul>
  );
}
