import PaymentResult from "@/components/modules/booking/payment-result";

const PaymentSuccessPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { session_id } = await searchParams;
  const sessionId =
    typeof session_id === "string" && session_id.length > 0
      ? session_id
      : undefined;

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <PaymentResult mode="success" sessionId={sessionId} />
    </div>
  );
};

export default PaymentSuccessPage;
