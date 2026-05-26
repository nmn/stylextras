type PopoverPolyfillModule = typeof import("@oddbird/popover-polyfill/fn");

let popoverPromise: Promise<PopoverPolyfillModule> | null = null;
let anchorPositioningPromise: Promise<unknown> | null = null;

export function attachPopoverPolyfills(node: HTMLElement | null) {
  if (!node) {
    return;
  }

  void ensurePopoverPolyfills();
}

export function ensurePopoverPolyfills() {
  return Promise.all([
    ensurePopoverPolyfill(),
    ensureAnchorPositioningPolyfill(),
  ]);
}

export function ensurePopoverPolyfill() {
  if (supportsPopover()) {
    return Promise.resolve();
  }

  popoverPromise ??= import("@oddbird/popover-polyfill/fn").then((module) => {
    if (!module.isSupported() && !module.isPolyfilled()) {
      module.apply();
    }

    return module;
  });

  return popoverPromise;
}

export function ensureAnchorPositioningPolyfill() {
  if (supportsAnchorPositioning()) {
    return Promise.resolve();
  }

  anchorPositioningPromise ??=
    import("@oddbird/css-anchor-positioning/fn").then(({ default: polyfill }) =>
      polyfill(),
    );

  return anchorPositioningPromise;
}

export function isPopoverOpen(element: HTMLElement) {
  try {
    return element.matches(":popover-open");
  } catch {
    return element.classList.contains(":popover-open");
  }
}

export function hidePopoverElement(element: HTMLElement) {
  void ensurePopoverPolyfill().then(() => {
    if (element.isConnected && isPopoverOpen(element)) {
      element.hidePopover();
    }
  });
}

function supportsPopover() {
  return (
    typeof HTMLElement !== "undefined" &&
    "showPopover" in HTMLElement.prototype &&
    "hidePopover" in HTMLElement.prototype
  );
}

function supportsAnchorPositioning() {
  return (
    typeof document !== "undefined" &&
    "anchorName" in document.documentElement.style
  );
}
