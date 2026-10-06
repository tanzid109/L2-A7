import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createService, deleteService, getAdminAnalytics, getAllServices } from "@/api";
import { ServiceParams } from "@/types/service.type";

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

export function useGetAllServices(params?: ServiceParams) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getAllServices(params),
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
