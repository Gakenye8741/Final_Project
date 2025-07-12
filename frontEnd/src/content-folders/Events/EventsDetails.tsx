import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PuffLoader } from "react-spinners";
import { CgShoppingCart } from "react-icons/cg";
import { FaSignInAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { eventApi } from "../../features/APIS/EventsApi";
import { useSelector } from "react-redux";
import type { RootState } from "../../App/store";
// Import the new ticketApi and its hooks
import { ticketApi, useGetTicketTypesByEventIdQuery } from '../../features/APIS/ticketsType.Api'; 

// Assume the bookingApi is defined in a separate RTK Query slice
// import { bookingApi } from "../../features/APIS/BookingsApi"; 
// Note: You must define 'bookingApi' and 'useCreateBookingMutation' in your actual project setup.

// Type definitions
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

// Define the type for the ticket types fetched from the backend
type TSelectTicketType = {
  ticketTypeId: number;
  eventId: number;
  name: string;
  price: string; // Price comes as a string (decimal) from the database
};

type PaymentMethod = "card" | "paypal" | "momo";
type StepType = "info" | "options";

export const EventDetailsPage = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [step, setStep] = useState<StepType>("info");
  
  // Update state to hold the selected ticketTypeId (number) instead of the hardcoded type name
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<number | null>(null); 
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [searchTitle, setSearchTitle] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  // New state for booking details
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [nationalId, setNationalId] = useState("");
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const {
    data: eventsByTitle = [],
    isFetching: isTitleSearching,
  } = eventApi.useGetEventsByTitleQuery(searchTitle, { skip: !searchTitle });

  const {
    data: eventsByCategory = [],
    isFetching: isCategorySearching,
  } = eventApi.useGetEventsByCategoryQuery(searchCategory, { skip: !searchCategory });

  const {
    data: allEvents = [],
    isLoading,
    error,
  } = eventApi.useGetAllEventsQuery(undefined, {
    skip: !!searchTitle || !!searchCategory,
  });

  // 📥 Fetch ticket types for the selected event dynamically
  const { 
    data: eventTicketTypes = [], 
    isLoading: isLoadingTicketTypes 
  } = useGetTicketTypesByEventIdQuery(selectedEvent?.eventId, {
    skip: !selectedEvent,
  });
  console.log(eventTicketTypes)

  // Set the default selected ticket type once data is loaded
  useEffect(() => {
    if (eventTicketTypes.length > 0 && selectedTicketTypeId === null) {
      // Set the default selected ticket type to the first one available
      setSelectedTicketTypeId(eventTicketTypes[0].ticketTypeId);
    }
  }, [eventTicketTypes, selectedTicketTypeId]);

  const eventsToDisplay = searchTitle
    ? eventsByTitle
    : searchCategory
    ? eventsByCategory
    : allEvents;

  const getEventStatus = (event: EventDetails) => {
    const eventDateTime = dayjs(`${event.date} ${event.time}`);
    const now = dayjs();
    if (eventDateTime.isBefore(now)) return "past";
    if (eventDateTime.isSame(now, "day")) return "ongoing";
    return "upcoming";
  };

  const ongoingEvents = eventsToDisplay.filter((e: EventDetails) => getEventStatus(e) === "ongoing");
  const upcomingEvents = eventsToDisplay.filter((e: EventDetails) => getEventStatus(e) === "upcoming");
  const pastEvents = eventsToDisplay.filter((e: EventDetails) => getEventStatus(e) === "past");

  const resetModal = () => {
    setSelectedEvent(null);
    setStep("info");
    setSelectedTicketTypeId(null); // Reset selected ticket type ID
    setPaymentMethod("card");
    setTicketQuantity(1); 
    setNationalId("");    
  };

  // --- Booking Logic ---

  // Placeholder for RTK Query mutation hook (replace with your actual bookingApi)
  const [createBooking, { isLoading: isBookingLoading }] = (eventApi as any).useCreateBookingMutation
    ? (eventApi as any).useCreateBookingMutation()
    : [() => Promise.resolve(), { isLoading: false }];

  // Memoized calculation of the price for the currently selected ticket type
  const currentPrice = useMemo(() => {
    if (!selectedTicketTypeId || eventTicketTypes.length === 0) return 0;
    
    // Find the selected ticket type object in the fetched data
    const selectedTicketType = eventTicketTypes.find(
      (type: TSelectTicketType) => type.ticketTypeId === selectedTicketTypeId
    );

    // Return the parsed price, or 0 if not found
    return selectedTicketType ? parseFloat(selectedTicketType.price) : 0;
  }, [selectedTicketTypeId, eventTicketTypes]);

  // Handle booking submission to the database
  const handleCreateBooking = async () => {
    // We now rely on selectedTicketTypeId being set
    if (!selectedEvent || !nationalId || ticketQuantity <= 0 || !selectedTicketTypeId) {
      alert("Please ensure National ID is entered, quantity is valid, and a ticket type is selected.");
      return;
    }

    const bookingPayload = {
      nationalId,
      eventId: selectedEvent.eventId,
      quantity: ticketQuantity,
      totalAmount: currentPrice * ticketQuantity,
      ticketTypeId: selectedTicketTypeId, // Use the dynamically selected ID
    };

    try {
      // Execute the mutation to create the booking
      await createBooking(bookingPayload).unwrap();
      alert(`Booking for ${selectedEvent.title} successful! Total: $${bookingPayload.totalAmount.toFixed(2)}`);
      resetModal();
    } catch (error) {
      console.error("Failed to create booking:", error);
      alert("Booking failed. Please try again.");
    }
  };

  // --- End Booking Logic ---

  const renderEventCard = (event: EventDetails) => {
    const price = parseFloat(event.ticketPrice as string);
    const status = getEventStatus(event);
    const isPast = status === "past";
    const statusText = status === "past" ? "Event Ended" : status === "ongoing" ? "Ongoing" : "Upcoming";
    const statusColor = status === "past" ? "bg-gray-600 text-gray-300" : status === "ongoing" ? "bg-yellow-500 text-black" : "bg-green-400 text-black";

    return (
      <div
        key={event.eventId}
        className="bg-white/5 backdrop-blur-md border border-cyan-400/20 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 transform hover:-translate-y-1 hover:scale-[1.02]"
      >
        <div className="mb-4">
          <h3 className="text-2xl font-bold text-cyan-300 mb-1 drop-shadow">{event.title}</h3>
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
              if (!isPast) {
                setSelectedEvent(event);
                setStep("info");
              }
            }}
            className={`w-full py-2 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition ${
              isPast
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700"
            }`}
            disabled={isPast}
          >
            <CgShoppingCart className="text-lg" />
            {status === "past" ? "Event Ended" : "Book Ticket"}
          </button>
        ) : (
          <a
            href="/login"
            className="w-full block text-center py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow hover:shadow-lg hover:from-cyan-600 hover:to-blue-700 transition flex items-center justify-center gap-2"
          >
            <FaSignInAlt className="text-lg" />
            Sign in to Book
          </a>
        )}

        {/* Status Badge */}
        <span className={`absolute top-2 right-2 py-1 px-3 rounded-full text-sm font-semibold ${statusColor}`}>
          {statusText}
        </span>
      </div>
    );
  };

  return (
    <section className="min-h-screen py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-950 to-black text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-cyan-400 mb-6 drop-shadow-[0_0_10px_#22d3ee]">
          Browse Events
        </h2>

        {/* Search Inputs */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          <input
            type="text"
            placeholder="Search by title..."
            className="input input-bordered w-full md:w-1/3 bg-gray-800 text-white border-cyan-400"
            value={searchTitle}
            onChange={(e) => {
              setSearchTitle(e.target.value);
              setSearchCategory("");
            }}
          />
          <input
            type="text"
            placeholder="Search by category..."
            className="input input-bordered w-full md:w-1/3 bg-gray-800 text-white border-cyan-400"
            value={searchCategory}
            onChange={(e) => {
              setSearchCategory(e.target.value);
              setSearchTitle("");
            }}
          />
          {(searchTitle || searchCategory) && (
            <button
              onClick={() => {
                setSearchTitle("");
                setSearchCategory("");
              }}
              className="btn btn-sm bg-red-500 text-white hover:bg-red-600"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Event Sections */}
        {error ? (
          <div className="text-red-400 text-center text-lg font-semibold">
            Something went wrong. Please try again.
          </div>
        ) : isLoading || isTitleSearching || isCategorySearching ? (
          <div className="flex justify-center items-center h-64">
            <PuffLoader color="#22d3ee" />
          </div>
        ) : eventsToDisplay.length === 0 ? (
          <div className="text-center text-cyan-200 text-lg">No events found.</div>
        ) : (
          <>
            {ongoingEvents.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-cyan-400 mb-2 mt-10">Ongoing Events</h3>
                <p className="text-slate-400 mb-6">
                  These events are currently taking place. You might still be able to attend if tickets are available!
                </p>
                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {ongoingEvents.map(renderEventCard)}
                </div>
              </>
            )}
            {upcomingEvents.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-green-400 mb-2 mt-10">Upcoming Events</h3>
                <p className="text-slate-400 mb-6">
                  Mark your calendar! These events are scheduled for the near future. Book your tickets early to reserve your spot.
                </p>
                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map(renderEventCard)}
                </div>
              </>
            )}
            {pastEvents.length > 0 && (
              <>
                <h3 className="text-2xl font-bold text-slate-400 mb-2 mt-10">Past Events</h3>
                <p className="text-slate-500 mb-6 italic">
                  These events have already taken place. Stay tuned for future editions or similar upcoming events.
                </p>
                <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.map(renderEventCard)}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modal */}
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
                  <button onClick={() => setStep("options")} className="btn btn-primary">Confirm Booking</button>
                  <button onClick={resetModal} className="btn">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-xl text-cyan-400 mb-4">Choose Ticket & Payment</h3>

                {/* National ID Input */}
                <div className="form-control mb-4">
                  <label className="label text-white font-semibold" htmlFor="nationalId">National ID</label>
                  <input
                    id="nationalId"
                    type="text"
                    placeholder="Enter your National ID"
                    className="input input-bordered w-full bg-gray-800 text-white"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                  />
                </div>

                {/* Quantity Input */}
                <div className="form-control mb-4">
                  <label className="label text-white font-semibold" htmlFor="quantity">Quantity</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedEvent.ticketsTotal - selectedEvent.ticketsSold}
                    value={ticketQuantity}
                    onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="input input-bordered w-full bg-gray-800 text-white"
                  />
                </div>
                
                {/* Dynamic Ticket Type Selection */}
                <div className="form-control mb-4">
                  <label className="label text-white font-semibold">Ticket Type</label>
                  {isLoadingTicketTypes ? (
                    <div className="text-cyan-400">Loading ticket types...</div>
                  ) : (
                    <select
                      className="select select-bordered bg-gray-800 text-white"
                      value={selectedTicketTypeId || ''} // Use the ID here
                      onChange={(e) => setSelectedTicketTypeId(parseInt(e.target.value))}
                    >
                      {/* Dynamically render options from fetched data */}
                      {eventTicketTypes.length > 0 ? (
                        eventTicketTypes.map((ticketType: TSelectTicketType) => (
                          <option 
                            key={ticketType.ticketTypeId} 
                            value={ticketType.ticketTypeId}
                          >
                            {ticketType.name} - ${parseFloat(ticketType.price).toFixed(2)}
                          </option>
                        ))
                      ) : (
                        <option disabled>No ticket types available</option>
                      )}
                    </select>
                  )}
                  <div className="text-xs text-slate-400 mt-2">
                    <ul className="list-disc list-inside">
                      {eventTicketTypes.length > 0 && (
                        <li>Ticket details loaded from backend. Prices may vary based on event configuration.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="form-control mb-6">
                  <label className="label text-white font-semibold">Payment Method</label>
                  <select
                    className="select select-bordered bg-gray-800 text-white"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  >
                    <option value="card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                    <option value="momo">Mobile Money</option>
                  </select>
                  <div className="text-xs text-slate-400 mt-2">
                    <ul className="list-disc list-inside">
                      <li><strong>Card:</strong> Pay with Visa, MasterCard etc.</li>
                      <li><strong>PayPal:</strong> Secure digital wallet</li>
                      <li><strong>Mobile Money:</strong> Available in supported countries</li>
                    </ul>
                  </div>
                </div>

                {/* Total Amount Display */}
                <div className="form-control mb-6">
                  <label className="label text-white font-semibold">Total Amount</label>
                  <span className="text-2xl font-bold text-green-400">
                    ${(currentPrice * ticketQuantity).toFixed(2)}
                  </span>
                </div>

                {/* Modal Actions - The "Create" button for booking */}
                <div className="modal-action">
                  <button
                    onClick={handleCreateBooking}
                    className="btn btn-success"
                    // Button is disabled if loading, National ID is missing, Quantity is invalid, or if no ticket type is selected
                    disabled={isBookingLoading || !nationalId || ticketQuantity <= 0 || !selectedTicketTypeId || isLoadingTicketTypes}
                  >
                    {isBookingLoading ? "Processing..." : "Create Booking"} 
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
