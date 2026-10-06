import TechnicianBookingDetail from "@/components/modules/technician/technician-booking-detail";

const TechnicianBookingDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  return <TechnicianBookingDetail bookingId={id} />;
};

export default TechnicianBookingDetailPage;
