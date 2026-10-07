import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";
import type {
  CreateServiceResponse,
  GetAdminAnalyticsResponse,
} from "@/types/admin.type";
import type {
  GetAllServicesResponse,
  ServiceParams,
} from "@/types/service.type";

export function getAdminAnalytics() {
  return apiClient<GetAdminAnalyticsResponse>("/analytics/admin");
}

export const createService = async (payload: FormData) => {
  return apiClient<CreateServiceResponse>("/services", {
    method: "POST",
    body: payload,
  });
};

export function getAllServices(params: ServiceParams = {}) {
  return apiClient<GetAllServicesResponse>("/services", {
    params,
  });
}

export function updateService(id: string, payload: FormData) {
  return apiClient<ApiResponse<null>>(`/services/${id}`, {
    method: "PATCH",
    body: payload,
  });
}
export function deleteService(id: string) {
  return apiClient<ApiResponse<null>>(`/services/${id}`, {
    method: "DELETE",
  });
}
