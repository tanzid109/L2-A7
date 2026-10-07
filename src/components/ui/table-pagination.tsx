import type { Dispatch, SetStateAction } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";

interface PageButton {
  key: string;
  page: number | null;
}

const getButtonArray = (totalPages: number, page: number): PageButton[] => {
  const pages = (...values: number[]): PageButton[] =>
    values.map((value) => ({ key: `page-${value}`, page: value }));

  if (totalPages <= 7) {
    return pages(...Array.from({ length: totalPages }, (_, i) => i + 1));
  }

  if (page <= 4) {
    return [
      ...pages(1, 2, 3, 4, 5),
      { key: "ellipsis-right", page: null },
      ...pages(totalPages),
    ];
  }

  if (page >= totalPages - 3) {
    return [
      ...pages(1),
      { key: "ellipsis-left", page: null },
      ...pages(
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ),
    ];
  }

  return [
    ...pages(1),
    { key: "ellipsis-left", page: null },
    ...pages(page - 1, page, page + 1),
    { key: "ellipsis-right", page: null },
    ...pages(totalPages),
  ];
};

interface Props {
  totalPages: number;
  handlePageChange: Dispatch<SetStateAction<number>>;
  page: number;
}

export default function TablePagination({
  totalPages,
  handlePageChange,
  page,
}: Props) {
  const goToPage = (target: number) => {
    if (target < 1 || target > totalPages) return;
    handlePageChange(target);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goToPage(page - 1)}
            aria-disabled={page === 1}
            className={
              page === 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
        {getButtonArray(totalPages, page).map(({ key, page: target }) =>
          target === null ? (
            <PaginationItem key={key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={key}>
              <PaginationLink
                onClick={() => goToPage(target)}
                isActive={page === target}
              >
                {target}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => goToPage(page + 1)}
            aria-disabled={page === totalPages}
            className={
              page === totalPages ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
