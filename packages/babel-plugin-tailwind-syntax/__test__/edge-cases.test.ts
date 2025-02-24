import { describe, test, expect } from "vitest";

import { makeCompiler } from "../src/classes-to-css";
import { convertFromCssToJss } from "../src/helpers";

const x = {
  "flex-grow bg-gray-50 text-gray-700": ["flex-grow"],
  "inline-flex items-center justify-between space-x-2": ["space-x-2"],
  "w-3/4 bg-opacity-90 text-opacity-80": ["bg-opacity-90", "text-opacity-80"],
  "z-50 bg-opacity-75 backdrop-blur-sm": ["bg-opacity-75"],
  "flex-shrink-0 text-gray-500": ["flex-shrink-0"],
  "hover:bg-opacity-80 active:bg-opacity-60": [
    "hover:bg-opacity-80",
    "active:bg-opacity-60",
  ],
  "md:hover:shadow-2xl md:hover:scale-105 transition-all duration-500": [
    "md:hover:shadow-2xl",
    "md:hover:scale-105",
  ],
  "container mx-auto sm:px-4 md:px-8 lg:px-16": ["container"],
  "aspect-w-16 aspect-h-9": ["aspect-w-16", "aspect-h-9"],
  "sm:container md:max-w-3xl lg:max-w-5xl": ["sm:container"],
  "prose prose-lg prose-blue": ["prose", "prose-lg", "prose-blue"],
  "backdrop-filter backdrop-blur-lg bg-opacity-80": ["bg-opacity-80"],
  "sm:focus-within:shadow-lg sm:focus-within:border-blue-500": [
    "sm:focus-within:shadow-lg",
    "sm:focus-within:border-blue-500",
  ],
  "container:sm:grid container:sm:grid-cols-3 container:md:flex container:lg:block":
    [
      ,
      "container:sm:grid",
      "container:sm:grid-cols-3",
      "container:md:flex",
      "container:lg:block",
    ],
  "lg:shadow-outline lg:shadow-md": ["lg:shadow-outline"],
  "bg-gradient-conic from-blue-400 via-purple-500 to-pink-600": [
    "bg-gradient-conic",
  ],
  "2xl:text-6xl sm:text-4xl xs:text-sm": ["2xl:text-6xl", "xs:text-sm"],
  "scroll-smooth hover:scroll-snap-stop": ["hover:scroll-snap-stop"],
  "child:bg-red-400 child:m-4 child:flex child:h-16": [
    "child:bg-red-400",
    "child:m-4",
    "child:flex",
    "child:h-16",
  ],
  "only:child:border-2 only:child:border-gray-500": [
    "only:child:border-2",
    "only:child:border-gray-500",
  ],
  "hover:before:bg-gradient-to-t hover:before:from-green-400 hover:before:to-blue-400":
    [
      ,
      "hover:before:bg-gradient-to-t",
      "hover:before:from-green-400",
      "hover:before:to-blue-400",
    ],
  "aria-checked:bg-blue-600 aria-disabled:opacity-50": [
    "aria-checked:bg-blue-600",
    "aria-disabled:opacity-50",
  ],
  "supports:bg-blend-multiply blend-multiply": [
    "@supports:bg-blend-multiply",
    "blend-multiply",
  ],
  "sm:text-opacity-75 md:text-opacity-50 lg:text-opacity-25": [
    "sm:text-opacity-75",
    "md:text-opacity-50",
    "lg:text-opacity-25",
  ],
  "marker:text-pink-500 marker:font-extrabold": [
    "marker:text-pink-500",
    "marker:font-extrabold",
  ],
  "flex-grow-0 flex-shrink hover:grow hover:shrink-0": [
    "flex-grow-0",
    "flex-shrink",
  ],
  "md:hover:translate-x-2 lg:hover:translate-y-2": [
    "md:hover:translate-x-2",
    "lg:hover:translate-y-2",
  ],
  "xs:w-auto sm:w-1/2 md:w-full lg:w-screen": ["xs:w-auto"],
};

/**
 * @flow strict
 */

const convert =
  (compile: (strings: string) => string) => (classNames: string) => {
    let resultCss, resultJSS;
    try {
      resultCss = compile(classNames);
      resultJSS = convertFromCssToJss(classNames, resultCss);
      return resultJSS;
    } catch {
      console.log("Error converting", classNames);
      console.log("CSS Result:", resultCss);
      console.log("JSS Result:", resultJSS, "\n\n\n\n");
      return null;
    }
  };

describe("tailwind-to-stylex converting individual classnames", () => {
  test("background opacity (bg-opacity-* NOT supported) --IN-- absolute top-0 left-0 h-full w-full bg-black/50", async () => {
    const input = "absolute top-0 left-0 h-full w-full bg-black/50";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));

    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .absolute {
        position: absolute;
      }

      .top-0 {
        top: 0;
      }

      .left-0 {
        left: 0;
      }

      .h-full {
        height: 100%;
      }

      .w-full {
        width: 100%;
      }

      .bg-black\\/50 {
        background-color: oklab(0% none none / .5);
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "backgroundColor": "oklab(0% none none / .5)",
        "height": "100%",
        "left": "0",
        "position": "absolute",
        "top": "0",
        "width": "100%",
      }
    `);
  });
  test("grow --IN-- grow bg-gray-50 text-gray-700", async () => {
    const input = "grow bg-gray-50 text-gray-700";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .grow {
        flex-grow: 1;
      }

      .bg-gray-50 {
        background-color: #f9fafb;
      }

      .text-gray-700 {
        color: #374151;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
     {
       "backgroundColor": "#f9fafb",
       "color": "#374151",
       "flexGrow": "1",
     }
    `);
  });
  test('space-x-2 NOT SUPPORTED --IN-- "inline-flex items-center justify-between space-x-2"', async () => {
    const input = "inline-flex items-center justify-between space-x-2";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .inline-flex {
        display: inline-flex;
      }

      .items-center {
        align-items: center;
      }

      .justify-between {
        justify-content: space-between;
      }

      :where(.space-x-2 > :not(:last-child)) {
        --tw-space-x-reverse: 0;
        margin-inline-start: calc(.5rem * var(--tw-space-x-reverse));
        margin-inline-end: calc(.5rem * calc(1 - var(--tw-space-x-reverse)));
      }

      @property --tw-space-x-reverse {
        syntax: "*";
        inherits: false;
        initial-value: 0;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
     {
       "alignItems": "center",
       "display": "inline-flex",
       "justifyContent": "space-between",
     }
    `);
  });
  test('text-opacity-80 is DEPRECATED --IN-- "w-3/4 bg-opacity-90 text-opacity-80"', async () => {
    const input = "w-3/4 bg-opacity-90 text-opacity-80";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .w-3\\/4 {
        width: 75%;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
     {
       "width": "75%",
     }
    `);
  });
  test('"z-50 bg-opacity-75 backdrop-blur-sm"', async () => {
    const input = "z-50 bg-opacity-75 backdrop-blur-sm";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .z-50 {
        z-index: 50;
      }

      .backdrop-blur-sm {
        --tw-backdrop-blur: blur(4px);
        -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
        backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      }

      @property --tw-backdrop-blur {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-brightness {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-contrast {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-grayscale {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-hue-rotate {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-invert {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-opacity {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-saturate {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-sepia {
        syntax: "*";
        inherits: false
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
     {
       "--tw-backdrop-blur": "blur(4px)",
       "WebkitBackdropFilter": "var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )",
       "backdropFilter": "var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )",
       "zIndex": "50",
     }
    `);
  });
  test('"flex-shrink-0 text-gray-500"', async () => {
    const input = "flex-shrink-0 text-gray-500";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .flex-shrink-0 {
        flex-shrink: 0;
      }

      .text-gray-500 {
        color: #6b7280;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "color": "#6b7280",
        "flexShrink": "0",
      }
    `);
  });
  test('"hover:bg-opacity-80 active:bg-opacity-60"', async () => {
    const input = "hover:bg-opacity-80 active:bg-opacity-60";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"md:hover:shadow-2xl md:hover:scale-105 transition-all duration-500"', async () => {
    const input =
      "md:hover:shadow-2xl md:hover:scale-105 transition-all duration-500";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .transition-all {
        transition-property: all;
        transition-timing-function: var(--tw-ease, cubic-bezier(.4, 0, .2, 1));
        transition-duration: var(--tw-duration, .15s);
      }

      .duration-500 {
        --tw-duration: .5s;
        transition-duration: .5s;
      }

      @media (width >= 48rem) {
        @media (hover: hover) {
          .md\\:hover\\:scale-105:hover {
            --tw-scale-x: 105%;
            --tw-scale-y: 105%;
            --tw-scale-z: 105%;
            scale: var(--tw-scale-x) var(--tw-scale-y);
          }
        }
      }

      @media (width >= 48rem) {
        @media (hover: hover) {
          .md\\:hover\\:shadow-2xl:hover {
            --tw-shadow: 0 25px 50px -12px var(--tw-shadow-color, #00000040);
            box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
          }
        }
      }

      @property --tw-duration {
        syntax: "*";
        inherits: false
      }

      @property --tw-scale-x {
        syntax: "*";
        inherits: false;
        initial-value: 1;
      }

      @property --tw-scale-y {
        syntax: "*";
        inherits: false;
        initial-value: 1;
      }

      @property --tw-scale-z {
        syntax: "*";
        inherits: false;
        initial-value: 1;
      }

      @property --tw-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-shadow-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-inset-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-inset-shadow-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-inset-ring-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-inset-ring-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-ring-inset {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-offset-width {
        syntax: "<length>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-ring-offset-color {
        syntax: "*";
        inherits: false;
        initial-value: #fff;
      }

      @property --tw-ring-offset-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "--tw-duration": ".5s",
        "transitionDuration": ".5s",
        "transitionProperty": "all",
        "transitionTimingFunction": "var(--tw-ease, cubic-bezier(.4, 0, .2, 1))",
      }
    `);
  });
  test('"container mx-auto sm:px-4 md:px-8 lg:px-16"', async () => {
    const input = "container mx-auto sm:px-4 md:px-8 lg:px-16";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .container {
        width: 100%;
      }

      @media (width >= 40rem) {
        .container {
          max-width: 40rem;
        }
      }

      @media (width >= 48rem) {
        .container {
          max-width: 48rem;
        }
      }

      @media (width >= 64rem) {
        .container {
          max-width: 64rem;
        }
      }

      @media (width >= 80rem) {
        .container {
          max-width: 80rem;
        }
      }

      @media (width >= 96rem) {
        .container {
          max-width: 96rem;
        }
      }

      .mx-auto {
        margin-inline: auto;
      }

      @media (width >= 40rem) {
        .sm\\:px-4 {
          padding-inline: 1rem;
        }
      }

      @media (width >= 48rem) {
        .md\\:px-8 {
          padding-inline: 2rem;
        }
      }

      @media (width >= 64rem) {
        .lg\\:px-16 {
          padding-inline: 4rem;
        }
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "marginInline": "auto",
        "maxWidth": {
          "@media (width >= 40rem)": "40rem",
          "@media (width >= 48rem)": "48rem",
          "@media (width >= 64rem)": "64rem",
          "@media (width >= 80rem)": "80rem",
          "@media (width >= 96rem)": "96rem",
          "default": null,
        },
        "paddingInline": {
          "@media (width >= 40rem)": "1rem",
          "@media (width >= 48rem)": "2rem",
          "@media (width >= 64rem)": "4rem",
          "default": null,
        },
        "width": "100%",
      }
    `);
  });
  test('"aspect-w-16 aspect-h-9"', async () => {
    const input = "aspect-w-16 aspect-h-9";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"sm:container md:max-w-3xl lg:max-w-5xl"', async () => {
    const input = "sm:container md:max-w-3xl lg:max-w-5xl";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      @media (width >= 40rem) {
        .sm\\:container {
          width: 100%;
        }

        @media (width >= 40rem) {
          .sm\\:container {
            max-width: 40rem;
          }
        }

        @media (width >= 48rem) {
          .sm\\:container {
            max-width: 48rem;
          }
        }

        @media (width >= 64rem) {
          .sm\\:container {
            max-width: 64rem;
          }
        }

        @media (width >= 80rem) {
          .sm\\:container {
            max-width: 80rem;
          }
        }

        @media (width >= 96rem) {
          .sm\\:container {
            max-width: 96rem;
          }
        }
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "maxWidth": {
          "@media (width >= 40rem)": {
            "@media (width >= 40rem)": "40rem",
            "@media (width >= 48rem)": "48rem",
            "@media (width >= 64rem)": "64rem",
            "@media (width >= 80rem)": "80rem",
            "@media (width >= 96rem)": "96rem",
            "default": null,
          },
          "default": null,
        },
        "width": {
          "@media (width >= 40rem)": "100%",
          "default": null,
        },
      }
    `);
  });
  test('"prose prose-lg prose-blue"', async () => {
    const input = "prose prose-lg prose-blue";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"backdrop-filter backdrop-blur-lg bg-opacity-80"', async () => {
    const input = "backdrop-filter backdrop-blur-lg bg-opacity-80";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .backdrop-blur-lg {
        --tw-backdrop-blur: blur(16px);
        -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
        backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      }

      .backdrop-filter {
        -webkit-backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
        backdrop-filter: var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, );
      }

      @property --tw-backdrop-blur {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-brightness {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-contrast {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-grayscale {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-hue-rotate {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-invert {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-opacity {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-saturate {
        syntax: "*";
        inherits: false
      }

      @property --tw-backdrop-sepia {
        syntax: "*";
        inherits: false
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
     {
       "--tw-backdrop-blur": "blur(16px)",
       "WebkitBackdropFilter": "var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )",
       "backdropFilter": "var(--tw-backdrop-blur, ) var(--tw-backdrop-brightness, ) var(--tw-backdrop-contrast, ) var(--tw-backdrop-grayscale, ) var(--tw-backdrop-hue-rotate, ) var(--tw-backdrop-invert, ) var(--tw-backdrop-opacity, ) var(--tw-backdrop-saturate, ) var(--tw-backdrop-sepia, )",
     }
    `);
  });
  test('"sm:focus-within:shadow-lg sm:focus-within:border-blue-500"', async () => {
    const input = "sm:focus-within:shadow-lg sm:focus-within:border-blue-500";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      @media (width >= 40rem) {
        .sm\\:focus-within\\:border-blue-500:focus-within {
          border-color: #3b82f6;
        }
      }

      @media (width >= 40rem) {
        .sm\\:focus-within\\:shadow-lg:focus-within {
          --tw-shadow: 0 10px 15px -3px var(--tw-shadow-color, #0000001a), 0 4px 6px -4px var(--tw-shadow-color, #0000001a);
          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
        }
      }

      @property --tw-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-shadow-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-inset-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-inset-shadow-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-inset-ring-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-inset-ring-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-ring-inset {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-offset-width {
        syntax: "<length>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-ring-offset-color {
        syntax: "*";
        inherits: false;
        initial-value: #fff;
      }

      @property --tw-ring-offset-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"lg:shadow-outline lg:shadow-md"', async () => {
    const input = "lg:shadow-outline lg:shadow-md";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      @media (width >= 64rem) {
        .lg\\:shadow-md {
          --tw-shadow: 0 4px 6px -1px var(--tw-shadow-color, #0000001a), 0 2px 4px -2px var(--tw-shadow-color, #0000001a);
          box-shadow: var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow);
        }
      }

      @property --tw-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-shadow-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-inset-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-inset-shadow-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-inset-ring-color {
        syntax: "*";
        inherits: false
      }

      @property --tw-inset-ring-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }

      @property --tw-ring-inset {
        syntax: "*";
        inherits: false
      }

      @property --tw-ring-offset-width {
        syntax: "<length>";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-ring-offset-color {
        syntax: "*";
        inherits: false;
        initial-value: #fff;
      }

      @property --tw-ring-offset-shadow {
        syntax: "*";
        inherits: false;
        initial-value: 0 0 #0000;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "--tw-shadow": {
          "@media (width >= 64rem)": "0 4px 6px -1px var(--tw-shadow-color, #0000001a), 0 2px 4px -2px var(--tw-shadow-color, #0000001a)",
          "default": null,
        },
        "boxShadow": {
          "@media (width >= 64rem)": "var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
          "default": null,
        },
      }
    `);
  });
  test('"bg-gradient-conic from-blue-400 via-purple-500 to-pink-600"', async () => {
    const input = "bg-gradient-conic from-blue-400 via-purple-500 to-pink-600";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .from-blue-400 {
        --tw-gradient-from: #60a5fa;
        --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
      }

      .via-purple-500 {
        --tw-gradient-via: #a855f7;
        --tw-gradient-via-stops: var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position);
        --tw-gradient-stops: var(--tw-gradient-via-stops);
      }

      .to-pink-600 {
        --tw-gradient-to: #db2777;
        --tw-gradient-stops: var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position));
      }

      @property --tw-gradient-position {
        syntax: "*";
        inherits: false
      }

      @property --tw-gradient-from {
        syntax: "<color>";
        inherits: false;
        initial-value: #0000;
      }

      @property --tw-gradient-via {
        syntax: "<color>";
        inherits: false;
        initial-value: #0000;
      }

      @property --tw-gradient-to {
        syntax: "<color>";
        inherits: false;
        initial-value: #0000;
      }

      @property --tw-gradient-stops {
        syntax: "*";
        inherits: false
      }

      @property --tw-gradient-via-stops {
        syntax: "*";
        inherits: false
      }

      @property --tw-gradient-from-position {
        syntax: "<length-percentage>";
        inherits: false;
        initial-value: 0%;
      }

      @property --tw-gradient-via-position {
        syntax: "<length-percentage>";
        inherits: false;
        initial-value: 50%;
      }

      @property --tw-gradient-to-position {
        syntax: "<length-percentage>";
        inherits: false;
        initial-value: 100%;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "--tw-gradient-from": "#60a5fa",
        "--tw-gradient-stops": "var(--tw-gradient-via-stops, var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-to) var(--tw-gradient-to-position))",
        "--tw-gradient-to": "#db2777",
        "--tw-gradient-via": "#a855f7",
        "--tw-gradient-via-stops": "var(--tw-gradient-position), var(--tw-gradient-from) var(--tw-gradient-from-position), var(--tw-gradient-via) var(--tw-gradient-via-position), var(--tw-gradient-to) var(--tw-gradient-to-position)",
      }
    `);
  });
  test('"2xl:text-6xl", "xs:text-sm" --IN-- "2xl:text-6xl sm:text-4xl xs:text-sm"', async () => {
    const input = "2xl:text-6xl sm:text-4xl xs:text-sm";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"scroll-smooth hover:scroll-snap-stop"', async () => {
    const input = "scroll-smooth hover:scroll-snap-stop";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .scroll-smooth {
        scroll-behavior: smooth;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
     {
       "scrollBehavior": "smooth",
     }
    `);
  });
  test('"child:bg-red-400 child:m-4 child:flex child:h-16"', async () => {
    const input = "child:bg-red-400 child:m-4 child:flex child:h-16";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"only:child:border-2 only:child:border-gray-500"', async () => {
    const input = "only:child:border-2 only:child:border-gray-500";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"aria-checked:bg-blue-600 aria-disabled:opacity-50"', async () => {
    const input = "aria-checked:bg-blue-600 aria-disabled:opacity-50";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .aria-checked\\:bg-blue-600[aria-checked="true"] {
        background-color: #2563eb;
      }

      .aria-disabled\\:opacity-50[aria-disabled="true"] {
        opacity: .5;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"supports:bg-blend-multiply blend-multiply"', async () => {
    const input = "supports:bg-blend-multiply blend-multiply";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"sm:text-opacity-75 md:text-opacity-50 lg:text-opacity-25"', async () => {
    const input = "sm:text-opacity-75 md:text-opacity-50 lg:text-opacity-25";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */

      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"marker:text-pink-500 marker:font-extrabold"', async () => {
    const input = "marker:text-pink-500 marker:font-extrabold";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .marker\\:text-pink-500 ::marker {
        color: #ec4899;
      }

      .marker\\:text-pink-500::marker {
        color: #ec4899;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "::marker": {
          "color": "#ec4899",
          "default": null,
        },
      }
    `);
  });
  test('"flex-grow-0 flex-shrink hover:grow hover:shrink-0"', async () => {
    const input = "flex-grow-0 flex-shrink hover:grow hover:shrink-0";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      .flex-shrink {
        flex-shrink: 1;
      }

      .flex-grow-0 {
        flex-grow: 0;
      }

      @media (hover: hover) {
        .hover\\:shrink-0:hover {
          flex-shrink: 0;
        }
      }

      @media (hover: hover) {
        .hover\\:grow:hover {
          flex-grow: 1;
        }
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
      {
        "flexGrow": {
          "@media (hover: hover)": {
            ":hover": "1",
            "default": null,
          },
          "default": "0",
        },
        "flexShrink": {
          "@media (hover: hover)": {
            ":hover": "0",
            "default": null,
          },
          "default": "1",
        },
      }
    `);
  });
  test('"md:hover:translate-x-2 lg:hover:translate-y-2"', async () => {
    const input = "md:hover:translate-x-2 lg:hover:translate-y-2";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      @media (width >= 48rem) {
        @media (hover: hover) {
          .md\\:hover\\:translate-x-2:hover {
            --tw-translate-x: .5rem;
            translate: var(--tw-translate-x) var(--tw-translate-y);
          }
        }
      }

      @media (width >= 64rem) {
        @media (hover: hover) {
          .lg\\:hover\\:translate-y-2:hover {
            --tw-translate-y: .5rem;
            translate: var(--tw-translate-x) var(--tw-translate-y);
          }
        }
      }

      @property --tw-translate-x {
        syntax: "*";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-y {
        syntax: "*";
        inherits: false;
        initial-value: 0;
      }

      @property --tw-translate-z {
        syntax: "*";
        inherits: false;
        initial-value: 0;
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`{}`);
  });
  test('"xs:w-auto sm:w-1/2 md:w-full lg:w-screen"', async () => {
    const input = "xs:w-auto sm:w-1/2 md:w-full lg:w-screen";
    const compile = await makeCompiler();
    const css = compile(input.split(" "));
    expect(css).toMatchInlineSnapshot(`
      "/*! tailwindcss v4.0.8 | MIT License | https://tailwindcss.com */
      @media (width >= 40rem) {
        .sm\\:w-1\\/2 {
          width: 50%;
        }
      }

      @media (width >= 48rem) {
        .md\\:w-full {
          width: 100%;
        }
      }

      @media (width >= 64rem) {
        .lg\\:w-screen {
          width: 100vw;
        }
      }
      "
    `);

    expect(convert(compile)(input)).toMatchInlineSnapshot(`
     {
       "width": {
         "@media (width >= 40rem)": "50%",
         "@media (width >= 48rem)": "100%",
         "@media (width >= 64rem)": "100vw",
         "default": null,
       },
     }
    `);
  });
});
