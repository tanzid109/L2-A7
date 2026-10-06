export interface RegistrationPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface VerifyAccountPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}



