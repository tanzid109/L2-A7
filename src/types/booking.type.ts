import type { Service } from "./admin.type";
import type { ApiResponse } from "./api.type";
import type { PaginationMeta, TechnicianProfile } from "./technician.type";

export type BookingStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentMethod = "BKASH" | "STRIPE" | "SSLCOMMERZ";

export type BookingState = {
  serviceId: string;
  technicianId: string;
  availabilityId: string;
};

export interface Availability {
  id: string;
  technicianId: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AvailabilityParams {
  date?: string;
  isBooked?: boolean;
  page?: number;
  limit?: number;
}

export type GetTechnicianAvailabilityResponse = ApiResponse<{
  technician: TechnicianProfile;
  meta: PaginationMeta;
  data: Availability[];
}>;

export interface CreateBookingPayload {
  technicianId: string;
  serviceId: string;
  availabilityId: string;
  address: string;
  problemDescription: string;
}

export interface BookingCustomer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar?: string | null;
}

export interface BookingReview {
  id: string;
  rating: number;
  comment: string | null;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionId: string | null;
  amount: string;
  method: PaymentMethod;
  status: PaymentStatus;
  gatewayResponse?: Record<string, unknown> | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  technicianId: string;
  serviceId: string;
  availabilityId: string;
  address: string;
  problemDescription: string;
  scheduledAt: string;
  status: BookingStatus;
  totalAmount: string;
  service: Service;
  technician: TechnicianProfile;
  customer: BookingCustomer;
  availability: Availability;
  payment?: Payment | null;
  review?: BookingReview | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookingParams {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export type GetMyBookingsResponse = ApiResponse<{
  meta: PaginationMeta;
  data: Booking[];
}>;

export type CancelBookingResponse = ApiResponse<
  Pick<Booking, "id" | "status" | "availabilityId">
>;

export interface CheckoutSessionData {
  checkoutUrl: string;
  sessionId: string;
  bookingId: string;
  amount: number;
  currency: string;
}

export type CreateCheckoutSessionResponse = ApiResponse<CheckoutSessionData>;

export interface PaymentParams {
  status?: PaymentStatus;
  page?: number;
  limit?: number;
}

export interface PaymentBooking {
  id: string;
  status: BookingStatus;
  service: Service;
  technician?: {
    id: string;
    user: { id: string; name: string; email: string };
  };
}

export interface PaymentWithBooking extends Payment {
  booking: PaymentBooking;
}

export type GetMyPaymentsResponse = ApiResponse<{
  meta: PaginationMeta;
  data: PaymentWithBooking[];
}>;

export interface CustomerAnalytics {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalAmountSpent: number;
  totalRefunded: number;
}

export type GetCustomerAnalyticsResponse = ApiResponse<CustomerAnalytics>;

export interface CreateReviewPayload {
  bookingId: string;
  rating: number;
  comment?: string;
}

export type CreateReviewResponse = ApiResponse<BookingReview>;
