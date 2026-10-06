import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createService, getAdminAnalytics } from "@/api";

export function useSuspenseGetAdminAnalytics() {
  return useSuspenseQuery({
    queryKey: ["admin-analytics"],
    queryFn: getAdminAnalytics,
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: createService,
  });
}
