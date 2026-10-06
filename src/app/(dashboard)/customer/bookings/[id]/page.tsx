import CustomerBookingDetail from "@/components/modules/customer/customer-booking-detail";

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CustomerBookingDetail bookingId={id} />;
}
