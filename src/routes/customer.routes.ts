import {
  CalendarDays,
  CircleUser,
  CreditCard,
  LayoutDashboard,
  Settings,
} from "lucide-react";

const prefix = "/customer";

export const customerRoutes = [
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
        title: "Payment History",
        url: `${prefix}/payments`,
        icon: CreditCard,
      },
    ],
  },
  {
    title: "App Settings",
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
