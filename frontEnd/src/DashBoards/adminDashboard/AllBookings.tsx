import  { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { PuffLoader } from "react-spinners";
import { bookingApi } from "../../features/APIS/BookingsApi";
import { eventApi } from "../../features/APIS/EventsApi";
import { FaEdit } from "react-icons/fa";
import { FaDeleteLeft, FaX } from "react-icons/fa6";

const MySwal = withReactContent(Swal);

 interface Booking {
  bookingId: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalAmount: string; // Assuming it's a string from your service
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  ticketTypeId: number;
  nationalId: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// 🎨 Status helpers
const bookingStatusEnum = ["Pending", "Confirmed", "Cancelled"] as const;
type BookingStatus = (typeof bookingStatusEnum)[number];

export const AllBookings: React.FC = () => {
  // 📡 Queries & Mutations
  const {
    data: bookings = [],
    isLoading,
    error,
  } = bookingApi.useGetAllBookingsQuery(undefined, {
    pollingInterval: 30_000,
  });

  const { data: events = [] } = eventApi.useGetAllEventsQuery(undefined);

  const [updateStatus] = bookingApi.useUpdateBookingStatusMutation();
  const [cancelBooking] = bookingApi.useCancelBookingMutation();
  const [deleteBooking] = bookingApi.useDeleteBookingMutation();

  // Build a quick lookup: eventId → title
  const eventMap = new Map<number, string>(events.map((e: any) => [e.eventId, e.title]));

  // 🔎 Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [eventFilter, setEventFilter] = useState("");

  const filteredBookings = bookings.filter((b: Booking) => {
    const eventTitle = eventMap.get(b.eventId) ?? "";
    return (
      (searchTerm
        ? b.bookingId.toString().includes(searchTerm) ||
          b.nationalId.toString().includes(searchTerm)
        : true) &&
      (statusFilter ? b.bookingStatus === statusFilter : true) &&
      (eventFilter ? eventTitle.toLowerCase().includes(eventFilter.toLowerCase()) : true)
    );
  });

  // 🔧 Helpers
  const openStatusModal = async (booking: Booking) => {
    const { value: newStatus } = await MySwal.fire({
      title: `Update status for Booking #${booking.bookingId}`,
      input: "select",
      inputOptions: bookingStatusEnum.reduce(
        (acc, status) => ({ ...acc, [status]: status }),
        {} as Record<string, string>
      ),
      inputValue: booking.bookingStatus,
      showCancelButton: true,
      confirmButtonText: "Update",
      width: "400px",
      customClass: { popup: "glass-modal" },
    });

    if (newStatus && newStatus !== booking.bookingStatus) {
      try {
        await updateStatus({ bookingId: booking.bookingId, status: newStatus as BookingStatus }).unwrap();
        MySwal.fire("Success", "Booking status updated.", "success");
      } catch {
        MySwal.fire("Error", "Failed to update status.", "error");
      }
    }
  };

  const handleCancel = async (bookingId: number) => {
    const confirm = await MySwal.fire({
      title: "Cancel booking?",
      text: "This will mark the booking as Cancelled and refund tickets.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, cancel it!",
      customClass: { popup: "glass-modal" },
    });

    if (confirm.isConfirmed) {
      try {
        await cancelBooking(bookingId).unwrap();
        MySwal.fire("Cancelled!", "Booking has been cancelled.", "success");
      } catch {
        MySwal.fire("Error", "Failed to cancel booking.", "error");
      }
    }
  };

  const handleDelete = async (bookingId: number) => {
    const confirm = await MySwal.fire({
      title: "Delete booking?",
      text: "This booking will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Delete",
      customClass: { popup: "glass-modal" },
    });

    if (confirm.isConfirmed) {
      try {
        await deleteBooking(bookingId).unwrap();
        MySwal.fire("Deleted!", "Booking has been removed.", "success");
      } catch {
        MySwal.fire("Error", "Failed to delete booking.", "error");
      }
    }
  };

  const getStatusBadge = (status: BookingStatus) => {
    const colorMap: Record<BookingStatus, string> = {
      Pending: "bg-yellow-500",
      Confirmed: "bg-green-500",
      Cancelled: "bg-red-500",
    };
    return (
      <span className={`px-2 py-1 text-xs rounded text-white ${colorMap[status]}`}>{status}</span>
    );
  };

  // 🖼️ UI RENDERING
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <PuffLoader color="#14b8a6" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400">Error loading bookings.</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat text-white relative" style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1950&h=1300&q=80')",
    }}>
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-teal-400">All Bookings</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search Booking / National ID"
              className="px-4 py-2 w-full sm:w-48 rounded-md bg-slate-700 text-white placeholder-white/70"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded bg-slate-700 text-white"
            >
              <option value="">All Statuses</option>
              {bookingStatusEnum.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Filter by Event Name"
              className="px-4 py-2 w-full sm:w-48 rounded-md bg-slate-700 text-white placeholder-white/70"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            />
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center text-cyan-200">No bookings match your filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-white">
              <thead>
                <tr className="bg-white/10 text-teal-300 uppercase text-xs">
                  <th className="px-4 py-2 text-left">Booking ID</th>
                  <th className="px-4 py-2 text-left">National ID</th>
                  <th className="px-4 py-2 text-left">Event</th>
                  <th className="px-4 py-2 text-left">Quantity</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Created</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b: Booking) => (
                  <tr key={b.bookingId} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-4 py-2">{b.bookingId}</td>
                    <td className="px-4 py-2">{b.nationalId}</td>
                    <td className="px-4 py-2">{eventMap.get(b.eventId) ?? "Unknown"}</td>
                    <td className="px-4 py-2">{b.quantity}</td>
                    <td className="px-4 py-2">${Number(b.totalAmount).toFixed(2)}</td>
                    <td className="px-4 py-2">{getStatusBadge(b.bookingStatus)}</td>
                    <td className="px-4 py-2">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => openStatusModal(b)}
                        className="text-xs px-2 py-1 bg-blue-600 rounded hover:bg-blue-700"
                      ><FaEdit/></button>
                      <button
                        onClick={() => handleCancel(b.bookingId)}
                        className="text-xs px-2 py-1 bg-yellow-600 rounded hover:bg-yellow-700"
                      ><FaX/></button>
                      <button
                        onClick={() => handleDelete(b.bookingId)}
                        className="text-xs px-2 py-1 bg-red-600 rounded hover:bg-red-700"
                      ><FaDeleteLeft/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};