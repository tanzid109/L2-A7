export function getErrorMessage(error: unknown) {
  return (
    (error as Error & { data?: { message?: string } })?.data?.message ||
    (error as Error)?.message ||
    "Something went wrong. Please try again"
  );
}
