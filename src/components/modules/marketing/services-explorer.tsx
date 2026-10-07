"use client";

import { Search } from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import ServiceCards from "@/components/shared/service-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TablePagination from "@/components/ui/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllServices } from "@/hooks";
import type { ServiceParams } from "@/types";

const PAGE_LIMIT = 9;
const ALL_CATEGORIES = "ALL";

export default function ServicesExplorer() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL_CATEGORIES);
  const [page, setPage] = useState(1);

  const params: ServiceParams = {
    page,
    limit: PAGE_LIMIT,
    isActive: true,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(category !== ALL_CATEGORIES ? { category } : {}),
  };

  const { data } = useGetAllServices(params);
  const meta = data?.data.meta;

  const { data: catalogData } = useGetAllServices({
    isActive: true,
    limit: 100,
  });

  const categories = useMemo(() => {
    const values = (catalogData?.data.data ?? []).map(
      (service) => service.category,
    );
    return [...new Set(values)].sort();
  }, [catalogData]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value === ALL_CATEGORIES ? ALL_CATEGORIES : value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Services
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          All Services
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Browse every available service, compare upfront prices and book in a
          few steps.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search services…"
              className="h-9 pl-9"
              aria-label="Search services"
            />
          </div>
          <Button type="submit" className="h-9">
            Search
          </Button>
        </form>

        {categories.length > 0 && (
          <Tabs value={category} onValueChange={handleCategoryChange}>
            <TabsList className="max-w-full overflow-x-auto">
              <TabsTrigger value={ALL_CATEGORIES}>All</TabsTrigger>
              {categories.map((name) => (
                <TabsTrigger key={name} value={name}>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {meta ? (
          <>
            {meta.total} {meta.total === 1 ? "service" : "services"} found
          </>
        ) : (
          ""
        )}
      </p>

      <ServiceCards {...params} />

      <TablePagination
        page={page}
        totalPages={meta?.totalPages ?? 1}
        handlePageChange={setPage}
      />
    </div>
  );
}
