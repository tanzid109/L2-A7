import {
  CirclePlus,
  CircleUser,
  ClipboardCheck,
  LayoutDashboard,
  Settings,
  Wrench,
} from "lucide-react";

const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
        icon: LayoutDashboard,
      },
      {
        title: "Technician Approval",
        url: `${prefix}/approve-technician`,
        icon: ClipboardCheck,
      },
      {
        title: "Add Service",
        url: `${prefix}/add-service`,
        icon: CirclePlus,
      },
      {
        title: "All Services",
        url: `${prefix}/all-services`,
        icon: Wrench,
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
