"use client";
import { useEffect } from "react";

import type { JSX } from "react";
import type { ErrorPageProps } from "@/types/props";

function ErrorPage({ error, reset }: ErrorPageProps): JSX.Element {
  useEffect(() => {
    // eslint-disable-next-line no-console -- Client Component: pino is server-only, console is the only option here
    console.error(error);
  }, [error]);

  return (
    <main>
      <h1>Something went wrong</h1>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}

export default ErrorPage;
