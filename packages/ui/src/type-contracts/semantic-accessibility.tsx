import { ButtonLink } from '../button'
import { Content } from '../content'
import { Navbar } from '../navbar'
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from '../pagination'
import { RangeCalendar } from '../range-calendar'
import { SidebarNavigation } from '../sidebar-layout'
import { TableScrollArea } from '../table'
import {
  TableOfContents,
  TableOfContentsItem,
  TableOfContentsLink,
  TableOfContentsList,
  TableOfContentsTitle,
} from '../table-of-contents'
import { TagItem, TagList } from '../tag-group'
import { Toolbar } from '../toolbar'
import { Link } from '../link'

// @ts-expect-error links require a real destination
const linkWithoutHref = <Link>Documentation</Link>
// @ts-expect-error button links require a real destination
const buttonLinkWithoutHref = <ButtonLink>Documentation</ButtonLink>
// @ts-expect-error navigation landmarks require a name
const unnamedNavbar = <Navbar />
// @ts-expect-error toolbars require a name
const unnamedToolbar = <Toolbar />
// @ts-expect-error sidebar navigation landmarks require a name
const unnamedSidebarNavigation = <SidebarNavigation />
// @ts-expect-error table-of-contents landmarks require a name
const unnamedTableOfContents = <TableOfContents />
// @ts-expect-error focusable scroll areas require a name
const unnamedFocusableTable = <TableScrollArea tabIndex={0} />
// @ts-expect-error pagination landmarks require a name
const unnamedPagination = <Pagination />
// @ts-expect-error pagination landmarks require a root-owned current destination
const paginationWithoutCurrentHref = <Pagination aria-label="Result pages" />
// @ts-expect-error pagination links require a real destination
const paginationLinkWithoutHref = <PaginationLink>1</PaginationLink>
// @ts-expect-error per-field props cannot override the root-owned submitted name
const divergentRangeName = <RangeCalendar legend="Dates" startProps={{ name: 'other' }} />

const namedNavbar = <Navbar aria-label="Primary" />
const namedToolbar = <Toolbar aria-labelledby="editing-actions" />
const namedSidebarNavigation = <SidebarNavigation aria-label="Documentation" />
const passiveTableScrollArea = <TableScrollArea />
const focusableTableScrollArea = <TableScrollArea tabIndex={0} aria-label="Data" />
const articleContent = <Content as="article" />
const tableOfContents = (
  <TableOfContents aria-labelledby="contents-title">
    <TableOfContentsTitle as="h3" id="contents-title">
      On this page
    </TableOfContentsTitle>
    <TableOfContentsList>
      <TableOfContentsItem>
        <TableOfContentsLink href="#overview">Overview</TableOfContentsLink>
        <TableOfContentsList>
          <TableOfContentsItem>
            <TableOfContentsLink href="#details">Details</TableOfContentsLink>
          </TableOfContentsItem>
        </TableOfContentsList>
      </TableOfContentsItem>
    </TableOfContentsList>
  </TableOfContents>
)
const pagination = (
  <Pagination aria-label="Result pages" currentHref="?page=1">
    <PaginationList>
      <PaginationItem>
        <PaginationLink href="?page=1">
          1
        </PaginationLink>
      </PaginationItem>
    </PaginationList>
  </Pagination>
)
const tagList = (
  <TagList>
    <TagItem>Native</TagItem>
  </TagList>
)

void [
  linkWithoutHref,
  buttonLinkWithoutHref,
  unnamedNavbar,
  unnamedToolbar,
  unnamedSidebarNavigation,
  unnamedTableOfContents,
  unnamedFocusableTable,
  unnamedPagination,
  paginationWithoutCurrentHref,
  paginationLinkWithoutHref,
  divergentRangeName,
  namedNavbar,
  namedToolbar,
  namedSidebarNavigation,
  passiveTableScrollArea,
  focusableTableScrollArea,
  articleContent,
  tableOfContents,
  pagination,
  tagList,
]
