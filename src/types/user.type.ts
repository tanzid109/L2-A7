import type { ApiResponse } from "./api.type";

export type UserRole = "ADMIN" | "CUSTOMER" | "TECHNICIAN";

export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export type AuthProvider = "GOOGLE" | "EMAIL";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

export type GetMeResponse = ApiResponse<User>;

export type UpdateProfileResponse = ApiResponse<User>;
