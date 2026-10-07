"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ApplicationParams, ApplicationStatus } from "@/types";
import TechnicianApprovalTable from "./technician-approval-table";
import TechnicianReviewSheet from "./technician-review-sheet";

type TabValue = "ALL" | ApplicationStatus;

const statusTabs: [TabValue, string][] = [
  ["PENDING", "Pending"],
  ["APPROVED", "Approved"],
  ["REJECTED", "Rejected"],
  ["ALL", "All"],
];

export default function TechnicianApprovalTabs() {
  const [tab, setTab] = useState<TabValue>("ALL");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [page, setPage] = useState(1);

  const handleTabChange = (value: string) => {
    setTab(value as TabValue);
    setPage(1);
  };

  const queryParams: ApplicationParams = {
    page,
    limit: 10,
    ...(tab === "ALL" ? {} : { status: tab }),
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 my-5">
        <Input
          type="search"
          placeholder="Search loaded applications by name or email"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="w-full max-w-xs"
        />
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList>
            {statusTabs.map(([value, label]) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <TechnicianApprovalTable
        {...queryParams}
        search={search}
        handleReview={setSelectedId}
        handlePageChange={setPage}
      />

      <TechnicianReviewSheet
        selectedId={selectedId}
        onClose={() => setSelectedId("")}
        {...queryParams}
      />
    </>
  );
}
