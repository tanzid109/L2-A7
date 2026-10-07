"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useVerifyAccount } from "@/hooks";
import { Button } from "../../ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../ui/input-otp";
import { Spinner } from "../../ui/spinner";
import { toast } from "../../ui/toast";

const RESEND_COOLDOWN = 120;

export default function VerifyAccountForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);

  const { mutate: verify, isPending: verifyPending } = useVerifyAccount();

  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!email) {
      router.push("/");
    }
  }, [email, router.push]);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleOTP = () => {
    if (otp.length !== 6) {
      setIsInvalid(true);
      return;
    }

    const verifyData = {
      email,
      otp,
    };

    verify(verifyData, {
      onSuccess: (res) => {
        if (!res.success) {
          toast.add({
            title: "Server Failure",
            description: "Something went wrong. Please try again",
            type: "error",
          });
        }

        toast.add({
          title: "Verification Successful",
          description: "Welcome onboard",
          type: "success",
        });
        router.push("/");
      },
      onError: (err) => {
        toast.add({
          title: "Verification failure",
          description:
            (err as Error & { data?: { message?: string } }).data?.message ||
            err.message ||
            "Something went wrong. Please try again",
          type: "error",
        });
      },
    });
  };

  if (!email) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Verify Account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter the one-time code sent to your email to activate your account
        </p>
      </div>

      <form
        id="otp-form"
        className="flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOTP();
        }}
      >
        <Field data-invalid={isInvalid}>
          <FieldLabel htmlFor="otp">OTP</FieldLabel>
          <InputOTP
            maxLength={6}
            onChange={(value) => {
              setOtp(value);
              if (isInvalid) {
                setIsInvalid(false);
              }
            }}
            value={otp}
            autoComplete="off"
            name="otp"
            id="otp"
            pattern={REGEXP_ONLY_DIGITS}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {isInvalid && (
            <FieldError
              errors={[{ message: "Invalid Code. Please try again" }]}
            />
          )}
          <FieldDescription>
            Resend available in {resendTimer}s
          </FieldDescription>
        </Field>
        <Button disabled={verifyPending} type="submit">
          {verifyPending ? (
            <>
              <Spinner /> Submitting
            </>
          ) : (
            <>Submit</>
          )}
        </Button>
      </form>
    </div>
  );
}
