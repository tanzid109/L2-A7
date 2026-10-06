"use client";

import ProfileLoading from "@/components/shared/profile-loading";
import ProfileUpdateForm from "@/components/shared/profile-update-form";
import { useGetMe } from "@/hooks";

export default function ProfileUpdatePage() {
  const { data } = useGetMe();

  if (!data) return <ProfileLoading />;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">Update Profile</h1>
      <ProfileUpdateForm user={data.data} />
    </div>
  );
}
