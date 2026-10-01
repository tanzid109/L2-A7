import apiClient from "@/lib/apiClient";
import { RegistrationPayload, VerifyAccountPayload } from "@/types";

export function userLogin(payload: { email: string; password: string }) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function verifyAccount(payload: VerifyAccountPayload) {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
}

export function userRegistration(payload: RegistrationPayload) {
  return apiClient("/auth/register", { method: "POST", body: payload });
}

export function userLogout() {
  return apiClient("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiClient("/auth/me");
}

export function googleOAuth(payload: { idToken: string }) {
  return apiClient("/auth/google-login", { method: "POST", body: payload });
}
