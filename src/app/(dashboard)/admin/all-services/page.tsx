"use client";

import { Suspense, useState } from "react";
import ServiceTable from "@/components/modules/admin/service-table";
import ServiceTableLoading from "@/components/modules/admin/service-table-loading";

const AllServices = () => {
  const [page, setPage] = useState(1);

  return (
    <Suspense fallback={<ServiceTableLoading />}>
      <ServiceTable page={page} handlePageChange={setPage} />
    </Suspense>
  );
};

export default AllServices;
