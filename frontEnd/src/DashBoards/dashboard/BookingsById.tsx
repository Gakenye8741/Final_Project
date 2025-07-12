import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetBookingsByUserNationalIdQuery } from "../../features/APIS/BookingsApi";
import { PuffLoader } from "react-spinners";
import Swal from "sweetalert2";
import { useUpdateBookingMutation } from "../../features/APIS/BookingsApi";

interface BookingData {
  bookingId: number;
  eventId: number;
  quantity: number;
  totalAmount: string;
  bookingStatus: "Pending" | "Confirmed" | "Cancelled";
  ticketTypeId: number;
  createdAt: string;
}

const BookingsByNationalId: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);
  const [searchNationalId, setSearchNationalId] = useState<number | null>(null);

  const { data: bookings, error, isLoading, isFetching, isSuccess } = useGetBookingsByUserNationalIdQuery(searchNationalId!, {
    skip: searchNationalId === null,
  });

  const [updateBooking] = useUpdateBookingMutation();

  useEffect(() => {
    if (user?.nationalId) {
      setSearchNationalId(user.nationalId);
    }
  }, [user]);

  const handleEditClick = async (booking: BookingData) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Booking",
      html: `
        <input id="quantity" class="swal2-input" type="number" placeholder="Quantity" value="${booking.quantity}">
        <input id="totalAmount" class="swal2-input" type="number" placeholder="Total Amount" value="${booking.totalAmount}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Save Changes",
      customClass: { popup: "glass-modal" },
    });

    if (formValues) {
      const quantity = Number((document.getElementById("quantity") as HTMLInputElement).value);
      const totalAmount = (document.getElementById("totalAmount") as HTMLInputElement).value;

      // Ensure bookingStatus is one of the valid values
      const bookingStatus: "Pending" | "Confirmed" | "Cancelled" = booking.bookingStatus;

      const updatedBooking = {
        bookingId: booking.bookingId,
        body: {
          quantity,
          totalAmount,
          bookingStatus, // Keeping the current booking status
        },
      };

      try {
        await updateBooking(updatedBooking).unwrap();
        Swal.fire("Success", "Booking updated successfully.", "success");
      } catch (error) {
        Swal.fire("Error", "There was an issue updating the booking.", "error");
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1950&h=1300&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="relative z-10 max-w-7xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold text-teal-400">Bookings for National ID</h2>
          {isLoading && searchNationalId !== null && <p className="loading-message">Loading bookings...</p>}
          {isFetching && searchNationalId !== null && <p className="loading-message">Refreshing bookings...</p>}
        </div>

        {error && "status" in error && (
          <div className="text-red-400 text-center">Error loading bookings.</div>
        )}

        {isSuccess && searchNationalId !== null && (
          <div>
            <h3 className="text-xl mb-4 text-teal-200">Results for National ID: {searchNationalId}</h3>
            {bookings && bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-white">
                  <thead>
                    <tr className="bg-white/10 text-teal-300 uppercase text-xs">
                      <th className="px-4 py-2 text-left">Booking ID</th>
                      <th className="px-4 py-2 text-left">Event ID</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-left">Total Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Created</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking: BookingData) => (
                      <tr key={booking.bookingId} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-2">{booking.bookingId}</td>
                        <td className="px-4 py-2">{booking.eventId}</td>
                        <td className="px-4 py-2">{booking.quantity}</td>
                        <td className="px-4 py-2">${Number(booking.totalAmount).toFixed(2)}</td>
                        <td className="px-4 py-2">{booking.bookingStatus}</td>
                        <td className="px-4 py-2">{new Date(booking.createdAt).toLocaleString()}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEditClick(booking)}
                            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 rounded text-white text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              Swal.fire({
                                title: `Are you sure you want to delete booking ${booking.bookingId}?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#ef4444",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, delete it!",
                              }).then(async (result) => {
                                if (result.isConfirmed) {
                                  // Implement your delete functionality here
                                  Swal.fire("Deleted!", "Booking has been deleted.", "success");
                                }
                              });
                            }}
                            className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white text-xs"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-cyan-200">No bookings found for this National ID.</div>
            )}
          </div>
        )}
        {searchNationalId === null && (
          <p className="text-center text-teal-300">Loading bookings for the current logged-in user...</p>
        )}
      </div>
    </div>
  );
};

export default BookingsByNationalId;
