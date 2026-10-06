import { getAdminAnalytics } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useSuspenseGetAdminAnalytics() {
  return useSuspenseQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
  });
}
