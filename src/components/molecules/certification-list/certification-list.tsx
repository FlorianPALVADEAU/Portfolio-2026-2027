import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Icon } from "@/components/atoms/icon";
import { Link } from "@/components/atoms/link";
import { Pop } from "@/components/atoms/pop";
import { cn } from "@/lib/utils";
import { TiltPlate } from "./tilt-plate";

type CertificationListProps = {
  items: readonly {
    id: string;
    name: string;
    issuer: string;
    year: number;
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
 * One plate per credential, hung at slightly different heights: the badge large on a glow, the
 * name beneath, and the score (or the year) as an outlined figure behind. The identifier and the
 * verification link show on hover or focus with a mouse, and always on a touch screen.
 */
export function CertificationList({ items, labels }: CertificationListProps) {
  return (
    <ul className="grid gap-4 md:grid-cols-3 md:gap-6">
      {items.map((item, order) => (
        <li key={item.id} className={cn(order === 1 && "md:mt-12")}>
          <Pop from="pop" delay={0.25 + order * STAGGER_SECONDS} className="h-full">
            <TiltPlate className="group/plate relative flex h-full min-h-72 flex-col justify-between gap-6 overflow-hidden rounded-[2rem] border border-border bg-surface p-6 transition-[border-color,box-shadow] duration-(--duration-base) [transform-style:preserve-3d] hover:border-accent hover:shadow-lg md:min-h-[26rem]">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-4 -right-2 text-[clamp(6rem,11vw,10rem)] leading-none font-semibold tracking-tighter text-transparent select-none [-webkit-text-stroke:1px_var(--border)]"
              >
                {item.score ?? item.year}
              </span>
              <div className="relative flex flex-1 items-center justify-center">
                <span
                  aria-hidden="true"
                  className="absolute size-40 rounded-full bg-accent/25 blur-3xl transition-transform duration-(--duration-slow) group-hover/plate:scale-125"
                />
                <Image
                  src={item.logo}
                  alt=""
                  width={160}
                  height={160}
                  unoptimized
                  className="relative size-28 drop-shadow-2xl transition-transform duration-(--duration-slow) ease-out-expo group-hover/plate:scale-110 md:size-36"
                />
              </div>
              <div className="relative flex flex-col gap-1">
                <p className="text-2xl font-semibold text-pretty">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {[item.issuer, item.year, item.score].filter(Boolean).join(" · ")}
                </p>
                <div className="grid transition-[grid-template-rows,opacity] duration-(--duration-base) pointer-fine:grid-rows-[0fr] pointer-fine:opacity-0 pointer-fine:group-focus-within/plate:grid-rows-[1fr] pointer-fine:group-focus-within/plate:opacity-100 pointer-fine:group-hover/plate:grid-rows-[1fr] pointer-fine:group-hover/plate:opacity-100">
                  <div className="flex flex-col gap-2 overflow-hidden">
                    <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3 text-sm">
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
            </TiltPlate>
          </Pop>
        </li>
      ))}
    </ul>
  );
}
