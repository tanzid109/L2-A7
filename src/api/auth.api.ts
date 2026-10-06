import apiClient from "@/lib/apiClient";
import type {
  ApiResponse,
  GetMeResponse,
  RegistrationPayload,
  ResetPasswordPayload,
  VerifyAccountPayload,
} from "@/types";

export function userLogin(payload: { email: string; password: string }) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userForgotPassword(payload: { email: string }) {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
}
export function userResetPassword(payload: ResetPasswordPayload) {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
}

export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient<GetMeResponse>("/auth/me");
}

export function updateProfile(payload: FormData) {
  return apiClient<ApiResponse<null>>(`/auth/profile`, {
    method: "PATCH",
    body: payload,
  });
}

export function googleOAuth(payload: { idToken: string }) {
  return apiClient("/auth/google-login", { method: "POST", body: payload });
}
