import ResetPasswordForm from "@/components/form/auth/reset-password-form";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function ResetPasswordPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        FieldOps
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Suspense fallback={<p>Loading...</p>}>
                            <ResetPasswordForm />
                        </Suspense>
                    </div>
                </div>
            </div>
            <div className="relative hidden lg:block">
                <Image
                    height={500}
                    width={500}
                    src="/assets/login.jpg"
                    alt="Image"
                    loading="eager"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
