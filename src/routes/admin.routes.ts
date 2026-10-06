const prefix = "/admin";

export const adminRoutes = [
  {
    title: "Management",
    items: [
      {
        title: "Overview",
        url: `${prefix}`,
      },
      {
        title: "Technician Approval",
        url: `${prefix}/approve-technician`,
      },
      {
        title: "Add Service",
        url: `${prefix}/add-service`,
      },
      {
        title: "All Services",
        url: `${prefix}/all-services`,
      },
    ],
  },
  {
    title: "Profile Settings",
    items: [
      {
        title: "Routing",
        url: "#",
      },
      {
        title: "Data Fetching",
        url: "#",
      },
    ],
  },
];
