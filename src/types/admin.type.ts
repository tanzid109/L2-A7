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

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: string;
  duration: number; // minutes
  imageUrl: string;
  imagePublicId: string;
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateServiceResponse = ApiResponse<Service>;
