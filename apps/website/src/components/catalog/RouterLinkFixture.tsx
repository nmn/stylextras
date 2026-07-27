"use client";

import { RouterLink } from "@/components/router-link";
import { ButtonLink } from "@stylextras/ui/button";
import { Link } from "@stylextras/ui/link";
import { useEffect, useRef, useState } from "react";

export function RouterLinkFixture() {
  const [hydrated, setHydrated] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const buttonLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    setHydrated(
      linkRef.current?.tagName === "A" &&
        buttonLinkRef.current?.tagName === "A",
    );
  }, []);

  return (
    <main
      aria-labelledby="router-link-fixture-title"
      data-hydrated={hydrated ? "true" : "false"}
      data-testid="router-link-fixture"
    >
      <h1 id="router-link-fixture-title">Router link verification</h1>
      <RouterLink data-testid="router-link-internal" href="/docs">
        Internal
      </RouterLink>
      <RouterLink data-testid="router-link-hash" href="#target">
        Hash
      </RouterLink>
      <RouterLink data-testid="router-link-download" download href="/docs">
        Download
      </RouterLink>
      <RouterLink
        data-testid="router-link-target"
        href="/docs"
        target="_self"
      >
        Target
      </RouterLink>
      <RouterLink
        data-testid="router-link-external"
        href="https://example.com"
      >
        External
      </RouterLink>
      <RouterLink
        data-testid="router-link-prevented"
        href="/docs"
        onClick={(event) => event.preventDefault()}
      >
        Prevented
      </RouterLink>
      <Link data-testid="package-link" href="#package-link" ref={linkRef}>
        Package link
      </Link>
      <ButtonLink
        data-testid="package-button-link"
        href="#package-button-link"
        ref={buttonLinkRef}
        size="sm"
      >
        Package button link
      </ButtonLink>
      <div id="target">Hash target</div>
    </main>
  );
}
