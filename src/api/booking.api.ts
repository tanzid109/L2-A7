import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  AvailabilityParams,
  Booking,
  BookingParams,
  CancelBookingResponse,
  CreateBookingPayload,
  CreateCheckoutSessionResponse,
  CreateReviewPayload,
  CreateReviewResponse,
  GetCustomerAnalyticsResponse,
  GetMyBookingsResponse,
  GetMyPaymentsResponse,
  GetTechnicianAvailabilityResponse,
  PaymentParams,
} from "@/types";

export function getTechnicianAvailability(
  technicianId: string,
  params: AvailabilityParams = {},
) {
  return apiClient<GetTechnicianAvailabilityResponse>(
    `/availability/technician/${technicianId}`,
    {
      params: { limit: 100, ...params },
    },
  );
}

export function createBooking(payload: CreateBookingPayload) {
  return apiClient<ApiResponse<Booking>>("/bookings", {
    method: "POST",
    body: payload,
  });
}

export function getMyBookings(params: BookingParams = {}) {
  return apiClient<GetMyBookingsResponse>("/bookings/my", { params });
}

export function cancelBooking(bookingId: string) {
  return apiClient<CancelBookingResponse>(`/bookings/${bookingId}/cancel`, {
    method: "PATCH",
  });
}

export function createCheckoutSession(bookingId: string) {
  return apiClient<CreateCheckoutSessionResponse>("/payments/checkout", {
    method: "POST",
    body: { bookingId },
  });
}

export function getMyPayments(params: PaymentParams = {}) {
  return apiClient<GetMyPaymentsResponse>("/payments/my", { params });
}

export function getCustomerAnalytics() {
  return apiClient<GetCustomerAnalyticsResponse>("/analytics/customer");
}

export function createReview(payload: CreateReviewPayload) {
  return apiClient<CreateReviewResponse>("/reviews", {
    method: "POST",
    body: payload,
  });
}
