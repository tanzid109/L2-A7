import type { ApiResponse } from "./api.type";
import type { Availability, Booking, BookingStatus } from "./booking.type";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ApplicationFile {
  url: string;
  publicId: string;
}

export interface ApplicationUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "TECHNICIAN" | "ADMIN";
}

export interface Application {
  id: string;
  userId: string;
  resume: string;
  resumePublicId: string;
  additionalFiles: ApplicationFile[];
  specialization: string;
  experience: number;
  hourlyRate: string;
  bio: string;
  status: ApplicationStatus;
  rejectionReason: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: ApplicationUser;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta;
}

export type GetAllApplicationsResponse = PaginatedApiResponse<Application>;

export interface ApplicationParams {
  page?: number;
  limit?: number;
  status?: ApplicationStatus;
}

export type ReviewStatus = Extract<ApplicationStatus, "APPROVED" | "REJECTED">;

export interface ReviewApplicationPayload {
  applicationId: string;
  status: ReviewStatus;
  rejectionReason?: string;
}

export interface TechnicianUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  avatarPublicId?: string | null;
}

export interface TechnicianProfile {
  id: string;
  userId: string;
  bio: string | null;
  experience: number;
  specialization: string;
  hourlyRate: string;
  rating: string;
  totalReviews: number;
  isAvailable: boolean;
  user: TechnicianUser;
  createdAt: string;
  updatedAt: string;
}

export interface TechnicianParams {
  search?: string;
  specialization?: string;
  isAvailable?: boolean;
  minRate?: number;
  maxRate?: number;
  page?: number;
  limit?: number;
}

export type GetTechniciansResponse = ApiResponse<{
  meta: PaginationMeta;
  data: TechnicianProfile[];
}>;

export interface TechnicianAnalytics {
  totalAvailabilities: number;
  availableSlots: number;
  totalBookings: number;
  upcomingBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalEarnings: number;
  totalRefunded: number;
  rating: number;
  totalReviews: number;
}

export type GetTechnicianAnalyticsResponse = ApiResponse<TechnicianAnalytics>;

export type TechnicianBooking = Omit<Booking, "technician">;

export type GetTechnicianBookingsResponse = ApiResponse<{
  meta: PaginationMeta;
  data: TechnicianBooking[];
}>;

export type GetBookingDetailResponse = ApiResponse<Booking>;

export type UpdatableBookingStatus = Exclude<BookingStatus, "PENDING">;

export interface UpdateBookingStatusPayload {
  status: UpdatableBookingStatus;
}

export type UpdateBookingStatusResponse = ApiResponse<Booking>;

export type GetMyAvailabilityResponse = ApiResponse<{
  meta: PaginationMeta;
  data: Availability[];
}>;

export interface CreateAvailabilityPayload {
  date: string;
  startTime: string;
  endTime: string;
}

export type UpdateAvailabilityPayload = Partial<CreateAvailabilityPayload>;

export type GetMyTechnicianProfileResponse = ApiResponse<TechnicianProfile>;

export interface UpdateTechnicianProfilePayload {
  bio?: string;
  experience?: number;
  specialization?: string;
  hourlyRate?: number;
}

export interface TechnicianReview {
  id: string;
  bookingId: string;
  customerId: string;
  technicianId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
}

export type GetTechnicianReviewsResponse = ApiResponse<{
  meta: PaginationMeta;
  data: TechnicianReview[];
}>;

export interface ReviewParams {
  page?: number;
  limit?: number;
}
