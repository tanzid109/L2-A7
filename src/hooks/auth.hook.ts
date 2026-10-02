import {
  getMe,
  googleOAuth,
  userForgotPassword,
  userLogin,
  userLogout,
  userRegistration,
  userResetPassword,
  verifyAccount,
} from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useLogin() {
  return useMutation({
    mutationFn: userLogin,
  });
}

export function useVerifyAccount() {
  return useMutation({
    mutationFn: verifyAccount,
  });
}

export function useRegistration() {
  return useMutation({
    mutationFn: userRegistration,
  });
}
export function useForgot() {
  return useMutation({
    mutationFn: userForgotPassword,
  });
}
export function useReset() {
  return useMutation({
    mutationFn: userResetPassword,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: userLogout,
  });
}

export function useGoogleOAuth() {
  return useMutation({
    mutationFn: googleOAuth,
  });
}

export function useGetMe() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}
