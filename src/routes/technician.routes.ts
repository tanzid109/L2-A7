const prefix = "/technician";

export const technicianRoutes = [
  {
    title: "Schedule",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Create Schedule",
        url: `${prefix}`,
      },
    ],
  },
  {
    title: "Profile Settings",
    items: [
      {
        title: "Profile",
        url: `${prefix}/profile`,
      },
      {
        title: "Profile Update",
        url: `${prefix}/profile-update`,
      },
    ],
  },
];
