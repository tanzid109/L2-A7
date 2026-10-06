import AdminOverview from "@/components/modules/admin/admin-overview";
import AdminOverviewLoading from "@/components/modules/admin/admin-overview-loading";
import { Suspense } from "react";

const AdminDashboard = () => {
  return (
    <Suspense fallback={<AdminOverviewLoading />}>
      <AdminOverview />
    </Suspense>
  );
};

export default AdminDashboard;