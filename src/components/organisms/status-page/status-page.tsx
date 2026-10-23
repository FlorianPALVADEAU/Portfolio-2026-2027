"use client";

import { Asterisk } from "lucide-react";
import NextLink from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/atoms/button";
import { Icon } from "@/components/atoms/icon";
import { Rise } from "@/components/atoms/rise";
import { RiseText } from "@/components/atoms/rise-text";
import { Magnetic } from "@/features/magnetic";
import { Marquee } from "@/features/marquee";
import { RiseReveal } from "@/features/rise-reveal";
import { MAIN_ID } from "@/features/route-focus";
import type { Locale, Messages } from "@/lib/i18n";

type StatusCopy = Messages["status"]["notFound"];

type StatusPageProps = {
  locale: Locale;
  /** The oversized numeral behind the headline. */
  code: string;
  copy: StatusCopy;
  labels: Pick<Messages["status"], "retry" | "home" | "work">;
  /** Renders the failed segment again; offered on errors only, in place of the way to the work. */
  retry?: () => void;
};

const subscribeToNothing = () => () => {};

/** The address as typed. The page is served from the proxy's 404 route, so the server cannot know it. */
function useTypedPath() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => window.location.pathname,
    () => "",
  );
}

const MONO = "font-mono text-sm tracking-widest uppercase";

/**
 * A dead end of the site, written like the rest of it: the oversized numeral and the headline rise
 * in word by word, the actions lean toward the pointer and the band keeps moving underneath. It
 * lives inside the site layout, so the header stays and the way back is one click away.
 */
export function StatusPage({ locale, code, copy, labels, retry }: StatusPageProps) {
  const pathname = useTypedPath();
  const band = [0, 1, 2].map((index) => ({
    id: `status-${index}`,
    content: (
      <span aria-hidden={index > 0 || undefined} className="flex items-center gap-8 md:gap-12">
        {copy.marquee}
        <Icon
          icon={Asterisk}
          className="size-[0.55em] animate-[spin_10s_linear_infinite] motion-reduce:animate-none"
        />
      </span>
    ),
  }));

  return (
    <main id={MAIN_ID} tabIndex={-1} className="focus:outline-none">
      <RiseReveal className="flex min-h-svh flex-col justify-between gap-10 px-(--gutter) pt-24 pb-8 md:pt-28 md:pb-10">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <Rise>
            <p className={`flex items-center gap-3 ${MONO}`}>
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent motion-reduce:hidden" />
                <span className="relative size-2 rounded-full bg-accent" />
              </span>
              {copy.kicker}
            </p>
          </Rise>
          <Rise className="min-w-0">
            <p className={`truncate text-muted-foreground ${MONO}`}>{pathname}</p>
          </Rise>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          <div aria-hidden="true" className="flex items-end justify-between gap-6">
            <p className="text-[clamp(7rem,0.5rem+28vw,18rem)] leading-[0.8] font-semibold tracking-tighter">
              <RiseText>{code}</RiseText>
            </p>
            <Icon
              icon={Asterisk}
              className="mb-[2vw] hidden size-[clamp(6rem,2rem+14vw,14rem)] shrink-0 animate-[spin_24s_linear_infinite] stroke-1 text-foreground/25 md:block motion-reduce:animate-none"
            />
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-5xl text-[clamp(2.25rem,1rem+5vw,6rem)] leading-[0.95] font-semibold tracking-tight text-balance">
              <RiseText>{copy.lead}</RiseText>{" "}
              <RiseText className="text-foreground/55">{copy.accent}</RiseText>
            </h1>
            <Rise>
              <p className="max-w-[48ch] text-lg text-muted-foreground">{copy.body}</p>
            </Rise>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Rise>
              <Magnetic strength={0.25}>
                {retry ? (
                  <Button size="lg" onClick={retry}>
                    {labels.retry}
                  </Button>
                ) : (
                  <Button asChild size="lg">
                    <NextLink href={`/${locale}`}>{labels.home}</NextLink>
                  </Button>
                )}
              </Magnetic>
            </Rise>
            <Rise>
              <Magnetic strength={0.25}>
                <Button asChild size="lg" variant="outline">
                  <NextLink href={retry ? `/${locale}` : `/${locale}#works`} data-jump="">
                    {retry ? labels.home : labels.work}
                  </NextLink>
                </Button>
              </Magnetic>
            </Rise>
          </div>
        </div>

        <Rise>
          <Marquee
            items={band}
            label={copy.marquee}
            speed={100}
            itemClassName="text-[clamp(2.5rem,1.2rem+5vw,5.5rem)] leading-none font-semibold tracking-tight whitespace-nowrap text-foreground/20"
            className="border-0 bg-transparent px-0 py-0"
          />
        </Rise>
      </RiseReveal>
    </main>
  );
}
