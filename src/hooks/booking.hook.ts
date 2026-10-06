import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBooking,
  createBooking,
  createCheckoutSession,
  createReview,
  getCustomerAnalytics,
  getMyBookings,
  getMyPayments,
  getTechnicianAvailability,
} from "@/api";
import type {
  AvailabilityParams,
  BookingParams,
  CreateBookingPayload,
  CreateReviewPayload,
  PaymentParams,
} from "@/types";

export function useGetTechnicianAvailability(
  technicianId: string,
  params: AvailabilityParams = {},
) {
  return useQuery({
    queryKey: ["availability", technicianId, params],
    queryFn: () => getTechnicianAvailability(technicianId, params),
    enabled: Boolean(technicianId),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-analytics"] });
    },
  });
}

export function useGetMyBookings(params: BookingParams = {}) {
  return useQuery({
    queryKey: ["customer-bookings", params],
    queryFn: () => getMyBookings(params),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["customer-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["customer-payments"] });
      queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
    },
  });
}

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: string) => createCheckoutSession(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-payments"] });
      queryClient.invalidateQueries({ queryKey: ["customer-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
    },
  });
}

export function useGetMyPayments(params: PaymentParams = {}) {
  return useQuery({
    queryKey: ["customer-payments", params],
    queryFn: () => getMyPayments(params),
  });
}

export function useGetCustomerAnalytics() {
  return useQuery({
    queryKey: ["customer-analytics"],
    queryFn: getCustomerAnalytics,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["customer-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
      queryClient.invalidateQueries({ queryKey: ["technician-reviews"] });
    },
  });
}
