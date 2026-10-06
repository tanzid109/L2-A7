const prefix = "/customer";

export const customerRoutes = [
  {
    title: "Bookings",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Payment History",
        url: `${prefix}`,
      },
    ],
  },
  {
    title: "App Settings",
    items: [
      {
        title: "Profile",
        url: `${prefix}/profile`,
      },
      {
        title: "Profile Update",
        url: `${prefix}/profile-update`,
      }
    ],
  },
];
