import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createService,
  deleteService,
  getAdminAnalytics,
  getAllServices,
  updateService,
} from "@/api";
import type { ServiceParams } from "@/types";

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
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
