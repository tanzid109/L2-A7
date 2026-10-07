import {
  CalendarClock,
  CalendarDays,
  CircleUser,
  LayoutDashboard,
  Settings,
  Star,
} from "lucide-react";

const prefix = "/technician";

export const technicianRoutes = [
  {
    title: "Bookings",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "My Bookings",
        url: `${prefix}/bookings`,
        icon: CalendarDays,
      },
      {
        title: "Availability",
        url: `${prefix}/availability`,
        icon: CalendarClock,
      },
      {
        title: "Reviews",
        url: `${prefix}/reviews`,
        icon: Star,
      },
    ],
  },
  {
    title: "Profile Settings",
    items: [
      {
        title: "Profile",
        url: `${prefix}/profile`,
        icon: CircleUser,
      },
      {
        title: "Profile Update",
        url: `${prefix}/profile-update`,
        icon: Settings,
      },
    ],
  },
];
