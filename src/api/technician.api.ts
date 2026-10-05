import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Application,
  ApplicationParams,
  GetAllApplicationsResponse,
  ReviewApplicationPayload,
} from "@/types";

export function technicianApply(payload: FormData) {
  return apiClient<ApiResponse<Application>>("/technicians/application", {
    method: "POST",
    body: payload,
  });
}

export function getAllTechnicians(params: ApplicationParams = {}) {
  return apiClient<GetAllApplicationsResponse>("/technicians/applications", {
    params,
  });
}

export function reviewApplication(payload: ReviewApplicationPayload) {
  const { applicationId, status, rejectionReason } = payload;

  return apiClient<ApiResponse<Application>>(
    `/technicians/applications/${applicationId}`,
    {
      method: "PATCH",
      body: { status, rejectionReason },
    },
  );
}
