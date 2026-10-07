import { cn } from "cn";
import type { User } from "@/types";

export function UserAvatar({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (user.avatar) {
    return (
      // biome-ignore lint/performance/noImgElement: simple avatar
      <img
        src={user.avatar}
        alt={user.name}
        className={cn(
          "size-9 rounded-full border border-border object-cover",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground",
        className,
      )}
    >
      {initials}
    </div>
  );
}
