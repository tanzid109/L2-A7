import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllTechnicians, reviewApplication, technicianApply } from "@/api";
import type { ApplicationParams } from "@/types";

export function useTechnicianApply() {
  return useMutation({
    mutationFn: technicianApply,
  });
}

export function useGetAllApplications(params: ApplicationParams) {
  return useQuery({
    queryKey: ["technician-applications", params],
    queryFn: () => getAllTechnicians(params),
  });
}

export function useReviewApplication() {
  return useMutation({
    mutationFn: reviewApplication,
  });
}
