"use client";

import { Asterisk } from "lucide-react";
import NextLink from "next/link";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/atoms/button";
import { Rise } from "@/components/atoms/rise";
import { RiseText } from "@/components/atoms/rise-text";
import { DuckStage } from "@/features/duck-stage";
import { Magnetic } from "@/features/magnetic";
import { NumeralPlay, SpinningMark } from "@/features/numeral-play";
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
 * in word by word and the actions lean toward the pointer. A big duck in Swiss dress turns to follow
 * the pointer and says what happened. It
 * lives inside the site layout, so the header stays and the way back is one click away.
 */
export function StatusPage({ locale, code, copy, labels, retry }: StatusPageProps) {
  const pathname = useTypedPath();
  return (
    <main
      id={MAIN_ID}
      tabIndex={-1}
      className="fixed inset-x-0 top-0 h-svh overflow-hidden focus:outline-none"
    >
      <RiseReveal triggerMargin="0px" className="relative h-full">
        {/* The duck fills the screen behind the text and is cropped by its bottom edge. */}
        <DuckStage
          className="absolute inset-x-0 top-[34svh] bottom-0 z-0 md:top-[4svh] md:right-[-4%] md:left-[22%] md:-bottom-[22svh]"
          fallback={
            <div aria-hidden="true" className="absolute inset-0 z-0 grid place-items-center">
              <SpinningMark
                icon={Asterisk}
                className="size-[min(50vw,50svh)] cursor-pointer stroke-1 text-foreground/25 transition-colors hover:text-accent"
              />
            </div>
          }
        />

        <div className="pointer-events-none relative z-10 flex h-full flex-col px-(--gutter) pt-24 pb-[3svh] md:pt-28">
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

          <div className="mt-[2svh] flex max-w-[34rem] flex-col gap-[1.5svh] md:mt-[4svh] md:max-w-[40%]">
            <h1 className="order-2 text-[min(clamp(1.5rem,1rem+2.4vw,3rem),5.5svh)] leading-tight font-semibold tracking-tight text-balance">
              <RiseText>{copy.lead}</RiseText>{" "}
              <RiseText className="text-foreground/55">{copy.accent}</RiseText>
            </h1>
            <div className="pointer-events-auto w-fit">
              <NumeralPlay
                code={code}
                className="text-[min(30vw,14svh)] leading-[0.8] font-semibold tracking-tighter md:text-[min(17vw,26svh,15rem)]"
              />
            </div>
            <div className="order-3 hidden md:block">
              <Rise>
                <p className="max-w-[40ch] text-lg text-muted-foreground">{copy.body}</p>
              </Rise>
            </div>
          </div>

          <div className="flex-1 md:hidden" />
          <div className="pointer-events-auto mt-[2svh] flex flex-wrap items-center gap-3 md:mt-[3svh]">
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
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="bg-background/75 backdrop-blur-sm"
                >
                  <NextLink href={retry ? `/${locale}` : `/${locale}#works`} data-jump="">
                    {retry ? labels.home : labels.work}
                  </NextLink>
                </Button>
              </Magnetic>
            </Rise>
          </div>
        </div>
      </RiseReveal>
    </main>
  );
}
