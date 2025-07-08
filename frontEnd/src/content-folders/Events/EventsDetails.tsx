import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { CgShoppingCart } from "react-icons/cg";
import { FaSignInAlt } from "react-icons/fa";
import { eventApi } from "../../features/APIS/EventsApi";

type Venue = {
  name: string;
  address: string;
  capacity: number;
};

type EventDetails = {
  eventId: number;
  title: string;
  description?: string;
  venue?: Venue;
  category?: string;
  date: string;
  time: string;
  ticketPrice: number | string;
  ticketsTotal: number;
  ticketsSold: number;
};

const isAuthenticated = true;

export const EventDetailsPage = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [step, setStep] = useState<"info" | "options">("info");
  const [ticketType, setTicketType] = useState("regular");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const {
    data: allEvents = [],
    isLoading,
    error,
  } = eventApi.useGetAllEventsQuery({
    pollingInterval: 3000,
  });

  const resetModal = () => {
    setSelectedEvent(null);
    setStep("info");
    setTicketType("regular");
    setPaymentMethod("card");
  };

  return (
    <section className="min-h-screen py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-cyan-400 mb-6 drop-shadow-[0_0_10px_#22d3ee]">
          Upcoming Events
        </h2>

        <p className="text-lg text-slate-200 max-w-3xl mx-auto text-center mb-10">
          At <span className="text-cyan-400 font-semibold">TicketStream</span>, we bring you the best live entertainment experiences—from electrifying concerts and inspiring conferences to unforgettable festivals and shows. Explore our curated selection of upcoming events and secure your spot before they sell out!
        </p>

        {error ? (
          <div className="text-red-400 text-center text-lg font-semibold">
            Something went wrong. Please try again.
          </div>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-64">
            <PuffLoader color="#22d3ee" />
          </div>
        ) : allEvents.length === 0 ? (
          <div className="text-center text-cyan-200 text-lg">No events found.</div>
        ) : (
          <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {allEvents.map((event: EventDetails) => {
              const price = parseFloat(event.ticketPrice as string);

              return (
                <div
                  key={event.eventId}
                  className="bg-white/5 backdrop-blur-md border border-cyan-400/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-1 hover:scale-[1.02]"
                >
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-cyan-300 mb-1 drop-shadow">
                      {event.title}
                    </h3>
                    <span className="text-xl font-semibold text-green-400">
                      ${isNaN(price) ? "0.00" : price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-slate-300 mb-4 line-clamp-3">
                    {event.description || "No description available."}
                  </p>

                  <div className="text-sm text-slate-400 mb-4 space-y-1">
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>

                    {event.venue ? (
                      <>
                        <p><strong>Venue:</strong> {event.venue.name}</p>
                        <p><strong>Address:</strong> {event.venue.address}</p>
                        <p><strong>Capacity:</strong> {event.venue.capacity}</p>
                      </>
                    ) : (
                      <p><strong>Venue:</strong> Not specified</p>
                    )}

                    <p>
                      <strong>Category:</strong>{" "}
                      <button
                        disabled
                        className="ml-1 cursor-default bg-cyan-600/80 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-inner backdrop-blur-sm border border-cyan-400/40"
                      >
                        {event.category || "Uncategorized"}
                      </button>
                    </p>
                    <p><strong>Tickets Sold:</strong> {event.ticketsSold}</p>
                    <p><strong>Available:</strong> {event.ticketsTotal - event.ticketsSold}</p>
                  </div>

                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setStep("info");
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-cyan-600 hover:to-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <CgShoppingCart className="text-lg" />
                      Buy Ticket
                    </button>
                  ) : (
                    <a
                      href="/login"
                      className="w-full block text-center py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow hover:shadow-lg hover:from-cyan-600 hover:to-blue-700 transition flex items-center justify-center gap-2"
                    >
                      <FaSignInAlt className="text-lg" />
                      Sign in to Buy
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DaisyUI Modal */}
      {selectedEvent && (
        <dialog id="event_modal" className="modal modal-open">
          <div className="modal-box bg-gray-900 text-white border border-cyan-500 shadow-xl rounded-lg max-w-xl">
            {step === "info" ? (
              <>
                <h3 className="font-bold text-2xl text-cyan-400 mb-2">{selectedEvent.title}</h3>
                <p className="text-slate-300 mb-4">{selectedEvent.description || "No description provided."}</p>

                <div className="space-y-1 text-sm text-slate-400 mb-4">
                  <p><strong>Date:</strong> {selectedEvent.date}</p>
                  <p><strong>Time:</strong> {selectedEvent.time}</p>
                  <p><strong>Price:</strong> ${parseFloat(selectedEvent.ticketPrice as string).toFixed(2)}</p>
                  <p><strong>Available:</strong> {selectedEvent.ticketsTotal - selectedEvent.ticketsSold}</p>
                </div>

                <div className="modal-action">
                  <button
                    onClick={() => setStep("options")}
                    className="btn btn-primary"
                  >
                    Confirm Purchase
                  </button>
                  <button onClick={resetModal} className="btn">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-xl text-cyan-400 mb-4">Choose Ticket & Payment</h3>

                <div className="form-control mb-4">
                  <label className="label text-white font-semibold">Ticket Type</label>
                  <select
                    className="select select-bordered bg-gray-800 text-white"
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                  >
                    <option value="regular">Regular - ${selectedEvent.ticketPrice}</option>
                    <option value="vip">VIP - ${Number(selectedEvent.ticketPrice) + 20}</option>
                    <option value="student">Student - ${Number(selectedEvent.ticketPrice) - 10}</option>
                  </select>
                </div>

                <div className="form-control mb-6">
                  <label className="label text-white font-semibold">Payment Method</label>
                  <select
                    className="select select-bordered bg-gray-800 text-white"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="momo">Mobile Money</option>
                  </select>
                </div>

                <div className="modal-action">
                  <button
                    onClick={() => {
                      console.log("Selected:", ticketType, paymentMethod);
                      alert("This would proceed to payment gateway...");
                      resetModal();
                    }}
                    className="btn btn-success"
                  >
                    Proceed to Pay
                  </button>
                  <button onClick={resetModal} className="btn">Cancel</button>
                </div>
              </>
            )}
          </div>
        </dialog>
      )}
    </section>
  );
};
