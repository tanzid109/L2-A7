import { ApiResponse } from "./api.type";

export interface AdminAnalytics {
  totalTechnicians: number;
  totalCustomers: number;
  totalServices: number;
  totalActiveServices: number;
  totalBookings: number;
  totalPendingBookings: number;
  totalCompletedBookings: number;
  totalCancelledBookings: number;
  totalRevenue: number;
  totalRefunded: number;
}

export type GetAdminAnalyticsResponse = ApiResponse<AdminAnalytics>;
