import apiClient from "@/lib/apiClient";

export function technicianApply(payload: FormData) {
  return apiClient("/technicians/application", {
    method: "POST",
    body: payload,
  });
}
