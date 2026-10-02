import { technicianApply } from "@/api";
import { useMutation } from "@tanstack/react-query";

export function useTechnicianApply() {
  return useMutation({
    mutationFn: technicianApply,
  });
}