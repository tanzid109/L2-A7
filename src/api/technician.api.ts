import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  Application,
  ApplicationParams,
  Availability,
  AvailabilityParams,
  BookingParams,
  CreateAvailabilityPayload,
  GetAllApplicationsResponse,
  GetBookingDetailResponse,
  GetMyAvailabilityResponse,
  GetMyTechnicianProfileResponse,
  GetTechnicianAnalyticsResponse,
  GetTechnicianBookingsResponse,
  GetTechnicianReviewsResponse,
  GetTechniciansResponse,
  ReviewApplicationPayload,
  ReviewParams,
  TechnicianParams,
  TechnicianProfile,
  UpdateAvailabilityPayload,
  UpdateBookingStatusPayload,
  UpdateBookingStatusResponse,
  UpdateTechnicianProfilePayload,
} from "@/types";

export function technicianApply(payload: FormData) {
  return apiClient<ApiResponse<Application>>("/technicians/application", {
    method: "POST",
    body: payload,
  });
}

export function getTechnicians(params: TechnicianParams = {}) {
  return apiClient<GetTechniciansResponse>("/technicians", { params });
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

export function getMyTechnicianBookings(params: BookingParams = {}) {
  return apiClient<GetTechnicianBookingsResponse>("/bookings/technician/my", {
    params,
  });
}

export function getBookingDetail(bookingId: string) {
  return apiClient<GetBookingDetailResponse>(`/bookings/${bookingId}`);
}

export function updateBookingStatus(
  bookingId: string,
  payload: UpdateBookingStatusPayload,
) {
  return apiClient<UpdateBookingStatusResponse>(
    `/bookings/${bookingId}/status`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function getMyAvailability(params: AvailabilityParams = {}) {
  return apiClient<GetMyAvailabilityResponse>("/availability/my", { params });
}

export function createAvailability(payload: CreateAvailabilityPayload) {
  return apiClient<ApiResponse<Availability>>("/availability", {
    method: "POST",
    body: payload,
  });
}

export function updateAvailability(
  availabilityId: string,
  payload: UpdateAvailabilityPayload,
) {
  return apiClient<ApiResponse<Availability>>(
    `/availability/${availabilityId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export function deleteAvailability(availabilityId: string) {
  return apiClient<ApiResponse<null>>(`/availability/${availabilityId}`, {
    method: "DELETE",
  });
}

export function getMyTechnicianProfile() {
  return apiClient<GetMyTechnicianProfileResponse>("/technicians/profile/me");
}

export function updateMyTechnicianProfile(
  payload: UpdateTechnicianProfilePayload | FormData,
) {
  return apiClient<ApiResponse<TechnicianProfile>>("/technicians/profile/me", {
    method: "PATCH",
    body: payload,
  });
}

export function toggleTechnicianAvailability() {
  return apiClient<ApiResponse<TechnicianProfile>>(
    "/technicians/availability/toggle",
    { method: "PATCH" },
  );
}

export function getMyTechnicianAnalytics() {
  return apiClient<GetTechnicianAnalyticsResponse>("/analytics/technician");
}

export function getTechnicianReviews(
  profileId: string,
  params: ReviewParams = {},
) {
  return apiClient<GetTechnicianReviewsResponse>(
    `/reviews/technician/${profileId}`,
    { params },
  );
}
