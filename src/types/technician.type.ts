import type { ApiResponse } from "./api.type";

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
