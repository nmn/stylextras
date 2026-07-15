import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "@/components/layout/page";
import { ReferenceGallery } from "@/components/catalog/ReferenceGallery";
import { Link } from "fumadocs-core/framework";
import * as stylex from "@stylexjs/stylex";
import {
  experimentalCatalog,
  stableCatalog,
  type BrowserMode,
} from "@stylextras/ui/catalog";
import { vars } from "@/theming/vars.stylex";

const groups: Array<{
  description: string;
  mode: BrowserMode;
  title: string;
}> = [
  {
    description:
      "Semantic HTML and CSS own behavior, validation, form state, and interaction.",
    mode: "native",
    title: "Native / zero behavior JS",
  },
  {
    description:
      "New platform APIs enhance a native baseline with narrow feature-detected fallbacks.",
    mode: "enhanced",
    title: "Native enhanced",
  },
  {
    description:
      "Focused controllers cover composite state that the browser does not yet provide.",
    mode: "client",
    title: "Client composites",
  },
];

export default function DocsIndexPage() {
  return (
    <DocsPage>
      <title>Components | StyleXtras</title>
      <DocsTitle>Native-first components</DocsTitle>
      <DocsDescription>
        Styled native elements, same-set StyleX variables, and small controllers
        only where the platform still has a real gap.
      </DocsDescription>
      <DocsBody>
        <ReferenceGallery />

        <section {...stylex.props(styles.catalog)}>
          <header {...stylex.props(styles.catalogHeader)}>
            <div>
              <h2 {...stylex.props(styles.catalogTitle)}>Stable catalog</h2>
              <p {...stylex.props(styles.catalogDescription)}>
                {stableCatalog.length} canonical entrypoints generated from the
                package manifest.
              </p>
            </div>
            <Link href="/docs/migration-0.2" {...stylex.props(styles.migration)}>
              0.2 migration guide
            </Link>
          </header>

          <div {...stylex.props(styles.groups)}>
            {groups.map((group) => {
              const entries = stableCatalog.filter(
                (entry) => entry.mode === group.mode,
              );
              return (
                <section key={group.mode} {...stylex.props(styles.group)}>
                  <div {...stylex.props(styles.groupHeader)}>
                    <h3 {...stylex.props(styles.groupTitle)}>{group.title}</h3>
                    <span {...stylex.props(styles.count)}>{entries.length}</span>
                  </div>
                  <p {...stylex.props(styles.groupDescription)}>
                    {group.description}
                  </p>
                  <ul {...stylex.props(styles.list)}>
                    {entries.map((entry) => (
                      <li key={entry.export}>
                        <Link
                          href={`/docs/components/${entry.export}`}
                          {...stylex.props(styles.link)}
                        >
                          <span {...stylex.props(styles.linkName)}>{entry.name}</span>
                          <span {...stylex.props(styles.fallback)}>
                            {entry.fallback}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>

        <section {...stylex.props(styles.experimental)}>
          <div>
            <h2 {...stylex.props(styles.catalogTitle)}>Experimental catalog</h2>
            <p {...stylex.props(styles.catalogDescription)}>
              Advanced controls stay namespaced until their accessibility,
              browser, visual, and size gates are satisfied.
            </p>
          </div>
          <div {...stylex.props(styles.experimentalLinks)}>
            {experimentalCatalog.map((entry) => (
              <Link
                href={`/docs/experimental/${entry.export.replace("experimental/", "")}`}
                key={entry.export}
                {...stylex.props(styles.experimentalLink)}
              >
                {entry.name}
              </Link>
            ))}
          </div>
        </section>
      </DocsBody>
    </DocsPage>
  );
}

const styles = stylex.create({
  catalog: {
    display: "grid",
    gap: 18,
    marginBlockStart: 36,
  },
  catalogHeader: {
    alignItems: {
      default: "start",
      "@media (min-width: 680px)": "end",
    },
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width: 680px)": "row",
    },
    gap: 12,
    justifyContent: "space-between",
  },
  catalogTitle: {
    color: vars["--color-fd-foreground"],
    fontSize: 24,
    fontWeight: 650,
    lineHeight: 1.25,
    margin: 0,
  },
  catalogDescription: {
    color: vars["--color-fd-muted-foreground"],
    fontSize: 14,
    lineHeight: 1.55,
    marginBlock: "6px 0",
  },
  migration: {
    borderColor: vars["--color-fd-border"],
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
    color: vars["--color-fd-primary"],
    fontSize: 13,
    fontWeight: 600,
    paddingBlock: 8,
    paddingInline: 11,
    textDecoration: "none",
    ":hover": {
      backgroundColor: vars["--color-fd-muted"],
    },
  },
  groups: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: {
      default: "minmax(0, 1fr)",
      "@media (min-width: 760px)": "repeat(3, minmax(0, 1fr))",
    },
  },
  group: {
    backgroundColor: `color-mix(in oklab, ${vars["--color-fd-background"]} 94%, ${vars["--color-fd-muted"]})`,
    borderColor: vars["--color-fd-border"],
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 1,
    minWidth: 0,
    padding: 14,
  },
  groupHeader: {
    alignItems: "center",
    display: "flex",
    gap: 8,
    justifyContent: "space-between",
  },
  groupTitle: {
    color: vars["--color-fd-foreground"],
    fontSize: 15,
    fontWeight: 650,
    margin: 0,
  },
  count: {
    backgroundColor: vars["--color-fd-muted"],
    borderRadius: 999,
    color: vars["--color-fd-muted-foreground"],
    fontFamily: "var(--default-mono-font-family)",
    fontSize: 11,
    lineHeight: 1,
    paddingBlock: 5,
    paddingInline: 7,
  },
  groupDescription: {
    color: vars["--color-fd-muted-foreground"],
    fontSize: 12,
    lineHeight: 1.5,
    marginBlock: "7px 12px",
    minHeight: 54,
  },
  list: {
    display: "grid",
    gap: 3,
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  link: {
    alignItems: "center",
    borderRadius: 7,
    color: vars["--color-fd-foreground"],
    display: "flex",
    fontSize: 13,
    gap: 8,
    justifyContent: "space-between",
    paddingBlock: 7,
    paddingInline: 8,
    textDecoration: "none",
    ":hover": {
      backgroundColor: vars["--color-fd-muted"],
    },
  },
  linkName: {
    fontWeight: 550,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  fallback: {
    color: vars["--color-fd-muted-foreground"],
    fontFamily: "var(--default-mono-font-family)",
    fontSize: 10,
  },
  experimental: {
    borderBlockStartColor: vars["--color-fd-border"],
    borderBlockStartStyle: "solid",
    borderBlockStartWidth: 1,
    display: "grid",
    gap: 14,
    marginBlockStart: 36,
    paddingBlockStart: 28,
  },
  experimentalLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
  },
  experimentalLink: {
    backgroundColor: vars["--color-fd-muted"],
    borderColor: vars["--color-fd-border"],
    borderRadius: 7,
    borderStyle: "solid",
    borderWidth: 1,
    color: vars["--color-fd-foreground"],
    fontSize: 12,
    paddingBlock: 7,
    paddingInline: 9,
    textDecoration: "none",
    ":hover": {
      borderColor: vars["--color-fd-primary"],
    },
  },
});
