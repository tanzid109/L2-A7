import apiClient from "@/lib/apiClient";
import {
  CreateServiceResponse,
  GetAdminAnalyticsResponse,
} from "@/types/admin.type";

export function getAdminAnalytics() {
  return apiClient<GetAdminAnalyticsResponse>("/analytics/admin");
}

export const createService = async (payload: FormData) => {
  return apiClient<CreateServiceResponse>("/services", {
    method: "POST",
    body: payload,
  });
};


