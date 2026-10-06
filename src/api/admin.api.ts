import apiClient from "@/lib/apiClient";
import { GetAdminAnalyticsResponse } from "@/types/admin.type";

export function getAdminAnalytics() {
  return apiClient<GetAdminAnalyticsResponse>("/analytics/admin");
}
