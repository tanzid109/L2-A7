import TechnicianApprovalTabs from "@/components/modules/technician-approval/technician-approval-tabs";

export default function ApproveTechnicianPage() {
  return (
    <section className="p-5">
      <div>
        <h1>Technician approval</h1>
        <p>Please review and make sure the given data is real.</p>
      </div>
      <TechnicianApprovalTabs />
    </section>
  );
}
