import MyBookings from "@/components/modules/booking/my-bookings";

const MyBookingsPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold tracking-tight">My bookings</h1>
      <MyBookings />
    </div>
  );
};

export default MyBookingsPage;
