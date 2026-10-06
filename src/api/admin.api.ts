import apiClient from "@/lib/apiClient";
import { ApiResponse } from "@/types";
import {
  CreateServiceResponse,
  GetAdminAnalyticsResponse,
} from "@/types/admin.type";
import { GetAllServicesResponse, ServiceParams } from "@/types/service.type";

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

export function deleteService(id: string) {
  return apiClient<ApiResponse<null>>(`/services/${id}`, {
    method: "DELETE",
  });
}


