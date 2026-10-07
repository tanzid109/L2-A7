"use client";

import { RefreshCw, Search, Star } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import TablePagination from "@/components/ui/table-pagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTechnicians } from "@/hooks";
import type { TechnicianParams } from "@/types";

const PAGE_LIMIT = 6;
const ALL_SPECIALIZATIONS = "ALL";
const AVAILABILITY_TABS = [
  { value: "ALL", label: "All Technicians" },
  { value: "AVAILABLE", label: "Available" },
] as const;

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function TechniciansExplorer() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState(ALL_SPECIALIZATIONS);
  const [availability, setAvailability] = useState<string>("ALL");
  const [page, setPage] = useState(1);

  const params: TechnicianParams = {
    page,
    limit: PAGE_LIMIT,
    ...(search.trim() ? { search: search.trim() } : {}),
    ...(specialization !== ALL_SPECIALIZATIONS ? { specialization } : {}),
    ...(availability === "AVAILABLE" ? { isAvailable: true } : {}),
  };

  const { data, isPending, isError, isFetching, refetch } =
    useGetTechnicians(params);
  const technicians = data?.data.data ?? [];
  const meta = data?.data.meta;

  const { data: catalogData } = useGetTechnicians({ limit: 100 });

  const specializations = useMemo(() => {
    const values = (catalogData?.data.data ?? []).map(
      (technician) => technician.specialization,
    );
    return [...new Set(values)].sort();
  }, [catalogData]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecialization(value);
    setPage(1);
  };

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Technicians
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Our Technicians
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Meet the verified professionals behind every job — compare experience,
          ratings and availability.
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
              placeholder="Search technicians…"
              className="h-9 pl-9"
              aria-label="Search technicians"
            />
          </div>
          <Button type="submit" className="h-9">
            Search
          </Button>
        </form>

        {specializations.length > 0 && (
          <Tabs
            value={specialization}
            onValueChange={handleSpecializationChange}
          >
            <TabsList className="max-w-full overflow-x-auto">
              <TabsTrigger value={ALL_SPECIALIZATIONS}>All</TabsTrigger>
              {specializations.map((name) => (
                <TabsTrigger key={name} value={name}>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}

        <Tabs value={availability} onValueChange={handleAvailabilityChange}>
          <TabsList className="max-w-full overflow-x-auto">
            {AVAILABILITY_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        {meta ? (
          <>
            {meta.total} {meta.total === 1 ? "technician" : "technicians"} found
          </>
        ) : (
          ""
        )}
      </p>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      ) : isError ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-8 text-center">
          <p className="text-sm font-semibold text-destructive">
            Could not load technicians
          </p>
          <p className="text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw />
            Retry
          </Button>
        </div>
      ) : technicians.length === 0 ? (
        <div className="mx-auto flex max-w-md flex-col items-center gap-2 rounded-lg border border-dashed p-10 text-center">
          <p className="text-sm font-medium">No technicians found</p>
          <p className="text-sm text-muted-foreground">
            Try a different search, specialization or availability filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {technicians.map((technician) => (
            <Card
              key={technician.id}
              className="transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {technician.user.avatar ? (
                      // biome-ignore lint/performance/noImgElement: avatar from API
                      <img
                        src={technician.user.avatar}
                        alt={technician.user.name}
                        className="size-full rounded-full object-cover"
                      />
                    ) : (
                      getInitials(technician.user.name)
                    )}
                  </span>
                  <div className="min-w-0">
                    <CardTitle className="line-clamp-1">
                      {technician.user.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-1">
                      {technician.specialization}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="size-4 fill-current text-amber-500" />
                    {Number(technician.rating).toFixed(1)}
                    <span className="text-xs">({technician.totalReviews})</span>
                  </span>
                  <span>{technician.experience} yrs experience</span>
                </div>

                {technician.bio && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {technician.bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge
                    variant={technician.isAvailable ? "outline" : "secondary"}
                  >
                    {technician.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                  <span className="text-sm font-semibold">
                    {Number(technician.hourlyRate).toLocaleString()} BDT/hr
                  </span>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  nativeButton={false}
                  render={<Link href="/customer/book" />}
                >
                  Book Service
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <TablePagination
        page={page}
        totalPages={meta?.totalPages ?? 1}
        handlePageChange={setPage}
      />
    </div>
  );
}
