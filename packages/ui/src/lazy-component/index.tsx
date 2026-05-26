"use client";

import { lazy, useRef } from "react";
import type { ComponentType } from "react";
import { ensurePopoverPolyfills, isPopoverOpen } from "../platform-polyfills";

export type ReactComponent<Props = Record<string, never>> =
  ComponentType<Props>;
export type LazyComponentLoader<Props = Record<string, never>> = () => Promise<
  ReactComponent<Props>
>;

type LazyState<Props> = {
  LazyContent: ReactComponent<Props> | null;
  loader: LazyComponentLoader<Props>;
  promise: Promise<{ default: ReactComponent<Props> }> | null;
};

export function useLazyComponent<Props>(loader: LazyComponentLoader<Props>) {
  const stateRef = useRef<LazyState<Props>>({
    LazyContent: null,
    loader,
    promise: null,
  });

  function load() {
    if (stateRef.current.loader !== loader) {
      stateRef.current = {
        LazyContent: null,
        loader,
        promise: null,
      };
    }

    stateRef.current.promise ??= loader().then((component) => ({
      default: component,
    }));
    return stateRef.current.promise;
  }

  stateRef.current.LazyContent ??= lazy(load);

  return {
    LazyContent: stateRef.current.LazyContent,
    preload: load,
  };
}

export function showPopoverWithSource(
  element: HTMLElement,
  source: HTMLElement | null,
) {
  void ensurePopoverPolyfills().then(() => {
    if (!element.isConnected || isPopoverOpen(element)) {
      return;
    }

    const showPopover = element.showPopover as (options?: {
      source?: HTMLElement;
    }) => void;
    showPopover.call(element, source ? { source } : undefined);
  });
}
