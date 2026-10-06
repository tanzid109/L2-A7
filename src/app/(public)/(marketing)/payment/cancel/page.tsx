import PaymentResult from "@/components/modules/booking/payment-result";

const PaymentCancelPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { bookingId } = await searchParams;
  const id =
    typeof bookingId === "string" && bookingId.length > 0
      ? bookingId
      : undefined;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <PaymentResult mode="cancel" bookingId={id} />
    </div>
  );
};

export default PaymentCancelPage;
