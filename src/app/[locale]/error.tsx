"use client";

import { ErrorPage } from "@/components/organisms/error-page";

export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return <ErrorPage retry={reset} />;
}
