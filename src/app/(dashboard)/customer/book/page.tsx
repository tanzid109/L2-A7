import BookingForm from "@/components/modules/booking/booking-form";

const BookPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { serviceId } = await searchParams;
  const initialServiceId =
    typeof serviceId === "string" && serviceId.length > 0
      ? serviceId
      : undefined;

  return <BookingForm initialServiceId={initialServiceId} />;
};

export default BookPage;
