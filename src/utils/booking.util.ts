import type { Availability } from "@/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const pad = (value: number) => String(value).padStart(2, "0");

export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function getSlotDateKey(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function formatDateKey(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return dateKey;
  }

  const date = new Date(year, month - 1, day);

  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[month - 1]} ${day}, ${year}`;
}

export function isSlotPast(dateKey: string, endTime: string): boolean {
  const now = new Date();
  const todayKey = toDateKey(now);

  if (dateKey !== todayKey) {
    return dateKey < todayKey;
  }

  const [hours, minutes] = endTime.split(":").map(Number);
  const endMinutes = (hours ?? 0) * 60 + (minutes ?? 0);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return endMinutes <= nowMinutes;
}

export interface DateOption {
  key: string;
  slots: Availability[];
}

export function groupSlotsByDate(slots: Availability[]): DateOption[] {
  const grouped = new Map<string, Availability[]>();

  for (const slot of slots) {
    const key = getSlotDateKey(slot.date);
    const existing = grouped.get(key);

    if (existing) {
      existing.push(slot);
    } else {
      grouped.set(key, [slot]);
    }
  }

  return Array.from(grouped.entries()).map(([key, dateSlots]) => ({
    key,
    slots: dateSlots,
  }));
}
