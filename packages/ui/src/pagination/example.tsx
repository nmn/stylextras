"use client";

import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "./index";
import { DemoFrame, DemoStack } from "../example-theme/demo";

export default function Example() {
  return (
    <>
      <DemoFrame
        title="Page states"
        description="Each named pagination landmark owns one current destination."
      >
        <DemoStack>
          <Pagination aria-label="Search result pages" currentHref="?page=2">
            <PaginationList>
              {[1, 2, 3, 4, 5].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`?page=${page}`}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationList>
          </Pagination>
          <Pagination aria-label="Audit log pages" currentHref="?audit-page=4">
            <PaginationList>
              {[1, 2, 3, 4, 5].map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`?audit-page=${page}`}
                    aria-label={`Page ${page}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
            </PaginationList>
          </Pagination>
        </DemoStack>
      </DemoFrame>
    </>
  );
}
