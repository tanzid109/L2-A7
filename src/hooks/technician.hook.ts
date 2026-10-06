import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAvailability,
  deleteAvailability,
  getAllTechnicians,
  getBookingDetail,
  getMyAvailability,
  getMyTechnicianAnalytics,
  getMyTechnicianBookings,
  getMyTechnicianProfile,
  getTechnicianReviews,
  getTechnicians,
  reviewApplication,
  technicianApply,
  toggleTechnicianAvailability,
  updateAvailability,
  updateBookingStatus,
  updateMyTechnicianProfile,
} from "@/api";
import type {
  ApplicationParams,
  AvailabilityParams,
  BookingParams,
  CreateAvailabilityPayload,
  ReviewParams,
  TechnicianParams,
  UpdateAvailabilityPayload,
  UpdateBookingStatusPayload,
} from "@/types";

export function useTechnicianApply() {
  return useMutation({
    mutationFn: technicianApply,
  });
}

export function useGetTechnicians(params: TechnicianParams = {}) {
  return useQuery({
    queryKey: ["technicians", params],
    queryFn: () => getTechnicians(params),
  });
}

export function useGetAllApplications(params: ApplicationParams) {
  return useQuery({
    queryKey: ["technician-applications", params],
    queryFn: () => getAllTechnicians(params),
  });
}

export function useReviewApplication() {
  return useMutation({
    mutationFn: reviewApplication,
  });
}

export function useGetMyTechnicianAnalytics() {
  return useQuery({
    queryKey: ["technician-analytics"],
    queryFn: getMyTechnicianAnalytics,
  });
}

export function useGetMyTechnicianBookings(params: BookingParams = {}) {
  return useQuery({
    queryKey: ["technician-bookings", params],
    queryFn: () => getMyTechnicianBookings(params),
  });
}

export function useGetBookingDetail(bookingId: string) {
  return useQuery({
    queryKey: ["booking-detail", bookingId],
    queryFn: () => getBookingDetail(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bookingId,
      payload,
    }: {
      bookingId: string;
      payload: UpdateBookingStatusPayload;
    }) => updateBookingStatus(bookingId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking-detail"] });
      queryClient.invalidateQueries({ queryKey: ["technician-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["technician-availability"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
      queryClient.invalidateQueries({ queryKey: ["customer-bookings"] });
    },
  });
}

export function useGetMyAvailability(params: AvailabilityParams = {}) {
  return useQuery({
    queryKey: ["technician-availability", params],
    queryFn: () => getMyAvailability(params),
  });
}

export function useCreateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAvailabilityPayload) =>
      createAvailability(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-availability"] });
      queryClient.invalidateQueries({ queryKey: ["technician-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useUpdateAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      availabilityId,
      payload,
    }: {
      availabilityId: string;
      payload: UpdateAvailabilityPayload;
    }) => updateAvailability(availabilityId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-availability"] });
      queryClient.invalidateQueries({ queryKey: ["technician-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useDeleteAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (availabilityId: string) => deleteAvailability(availabilityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-availability"] });
      queryClient.invalidateQueries({ queryKey: ["technician-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}

export function useGetMyTechnicianProfile() {
  return useQuery({
    queryKey: ["technician-profile"],
    queryFn: getMyTechnicianProfile,
    retry: false,
  });
}

export function useUpdateMyTechnicianProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyTechnicianProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-profile"] });
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

export function useToggleTechnicianAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTechnicianAvailability,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technician-profile"] });
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
    },
  });
}

export function useGetTechnicianReviews(
  profileId: string,
  params: ReviewParams = {},
) {
  return useQuery({
    queryKey: ["technician-reviews", profileId, params],
    queryFn: () => getTechnicianReviews(profileId, params),
    enabled: Boolean(profileId),
  });
}
