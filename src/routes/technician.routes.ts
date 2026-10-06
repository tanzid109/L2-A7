const prefix = "/technician";

export const technicianRoutes = [
  {
    title: "Bookings",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "My Bookings",
        url: `${prefix}/bookings`,
      },
      {
        title: "Availability",
        url: `${prefix}/availability`,
      },
      {
        title: "Reviews",
        url: `${prefix}/reviews`,
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
