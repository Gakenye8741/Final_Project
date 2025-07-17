import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Tag,
  XCircle,
  ShoppingCart,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import { eventApi } from "../../features/APIS/EventsApi";
import { useCreateBookingMutation } from "../../features/APIS/BookingsApi";
import { useGetTicketTypesByEventIdQuery } from "../../features/APIS/ticketsType.Api";
import { mediaApi } from "../../features/APIS/mediaApi";

import { Navbar } from "../../components/Navbar";
import { Footer } from "../../components/Footer";

import type { RootState } from "../../App/store";

type BookingPayload = {
  nationalId: number;
  eventId: number;
  quantity: number;
  ticketTypeName: string;
  totalAmount: string;
};

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const { data: event, isLoading, error } = eventApi.useGetEventByIdQuery(id!);
  const { data: ticketTypes, isLoading: isTicketTypesLoading, error: ticketTypesError } =
    useGetTicketTypesByEventIdQuery(id!);
  const { data: mediaData } = mediaApi.useGetMediaByEventIdQuery(id!);

  const [createBooking, { isLoading: isBooking }] = useCreateBookingMutation();

  const [quantity, setQuantity] = useState(1);
  const [ticketTypeName, setTicketTypeName] = useState("");
  const [bookingResult, setBookingResult] = useState<any>(null);

  useEffect(() => {
    if (ticketTypes && ticketTypes.length > 0) {
      setTicketTypeName(ticketTypes[0].name);
    }
  }, [ticketTypes]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to book tickets.");
      return;
    }

    if (!user?.nationalId || quantity < 1) {
      toast.error("Invalid National ID or quantity");
      return;
    }

    const selectedTicket = ticketTypes?.find((t: any) => t.name === ticketTypeName);

    if (!selectedTicket) {
      toast.error("Invalid ticket type selected");
      return;
    }

    const payload: BookingPayload = {
      nationalId: Number(user.nationalId),
      eventId: Number(id),
      quantity,
      ticketTypeName,
      totalAmount: (quantity * Number(selectedTicket.price)).toString(),
    };

    try {
      const result = await createBooking(payload as any).unwrap();
      setBookingResult(result);
      toast.success("Booking successful!");
    } catch (err) {
      console.error(err);
      toast.error("Booking failed");
    }
  };

  if (isLoading)
    return <p className="text-white text-center mt-10 text-xl">Loading...</p>;

  if (error || !event)
    return (
      <p className="text-red-500 text-center mt-10 text-xl">Event not found.</p>
    );

  const selectedTicket = ticketTypes?.find((t: any) => t.name === ticketTypeName);
  const ticketPrice = selectedTicket?.price ?? 0;
  const total = quantity * ticketPrice;

  return (
    <>
      <Navbar />
      <div className="mt-20 min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-12 px-4">
        <div className="max-w-7xl mx-auto bg-[#1f2937] shadow-xl rounded-2xl p-8 text-white">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 rounded-full shadow-md hover:shadow-lg transition duration-200 group mb-6"
          >
            <ArrowLeft size={18} className="transition-transform duration-200 group-hover:-translate-x-1" />
            Go Back
          </button>

          <h1 className="text-4xl font-extrabold mb-4 text-center">{event.title}</h1>
          <p className="text-gray-300 text-center mb-8 text-lg">{event.description}</p>

          {mediaData && mediaData.length > 0 && (
            <div className="mb-8">
              <Carousel
                showThumbs={false}
                infiniteLoop
                useKeyboardArrows
                autoPlay
                dynamicHeight={false}
              >
                {mediaData.map((media: any) => (
                  <div key={media.mediaId}>
                    {media.type === "image" ? (
                      <img src={media.url} alt="event media" className="object-fit h-96 min-w-0.5" />
                    ) : (
                      <video controls className="object-cover h-96 w-full bg-black">
                        <source src={media.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                ))}
              </Carousel>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-4 text-lg leading-relaxed">
              <Info icon={<Tag className="text-indigo-400" />} label="Category" value={event.category} />
              <Info icon={<Calendar className="text-green-400" />} label="Date" value={event.date} />
              <Info icon={<Clock className="text-blue-400" />} label="Time" value={event.time} />
              <Info icon={<MapPin className="text-yellow-400" />} label="Venue" value={event.venue?.name ?? "Unknown"} />
              <Info icon={<DollarSign className="text-purple-400" />} label="Base Price" value={`$${event.ticketPrice}`} />
              <Info
                icon={event.status === "Active" ? <CheckCircle className="text-emerald-400" /> : <XCircle className="text-rose-400" />}
                label="Status"
                value={event.status}
              />
            </div>

            <div className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-600 pt-8 lg:pt-0 lg:pl-8">
              <h2 className="text-2xl font-bold mb-4">Book Your Ticket</h2>

              <div className="space-y-4">
                <input
                  type="text"
                  value={user?.nationalId || ""}
                  className="input input-bordered w-full bg-[#111827] text-white"
                  readOnly
                  disabled
                />

                <input
                  type="number"
                  min={1}
                  placeholder="Quantity"
                  className="input input-bordered w-full bg-[#111827] text-white"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  disabled={!isAuthenticated}
                />

                {isTicketTypesLoading ? (
                  <p className="text-gray-400">Loading ticket types...</p>
                ) : ticketTypesError || !ticketTypes?.length ? (
                  <p className="text-red-400">No ticket types available.</p>
                ) : (
                  <select
                    className="select select-bordered w-full bg-[#111827] text-white"
                    value={ticketTypeName}
                    onChange={(e) => setTicketTypeName(e.target.value)}
                    disabled={!isAuthenticated}
                  >
                    {ticketTypes.map((type: any) => (
                      <option key={type.id} value={type.name}>
                        {type.name} - ${type.price}
                      </option>
                    ))}
                  </select>
                )}

                {ticketTypes && ticketTypes.length > 0 && (
                  <div className="space-y-2 text-sm text-gray-300 bg-[#111827] p-4 rounded-lg border border-gray-600">
                    <p>💵 <strong>Selected Ticket Price:</strong> ${ticketPrice}</p>
                    <p>#️⃣ <strong>Quantity:</strong> {quantity}</p>
                    <p>🧮 <strong>Total Amount:</strong> ${total.toFixed(2)}</p>
                  </div>
                )}

                {isAuthenticated ? (
                  <button
                    onClick={handleBooking}
                    className="btn btn-primary w-full flex items-center justify-center gap-2"
                    disabled={isBooking}
                  >
                    <ShoppingCart size={18} />
                    {isBooking ? "Booking..." : "Book Ticket"}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      toast.error("Please log in to book tickets");
                      navigate("/login");
                    }}
                    className="btn w-full bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    🔒 Login to Book
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {bookingResult && (
          <Dialog
            open={true}
            onClose={() => setBookingResult(null)}
            className="relative z-50"
          >
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black backdrop-blur-sm"
            />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                key="modal"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full max-w-md rounded-xl bg-[#1f2937] p-6 shadow-xl border border-gray-700 text-white"
              >
                <Dialog.Title className="text-2xl font-bold text-green-400 mb-4 text-center">
                  ✅ Booking Successful
                </Dialog.Title>

                <p className="text-center text-gray-300">Your booking was confirmed successfully.</p>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setBookingResult(null)}
                    className="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

interface InfoProps {
  icon: React.ReactElement;
  label: string;
  value: string | number;
}

const Info = ({ icon, label, value }: InfoProps) => (
  <div className="flex items-center gap-3">
    {icon}
    <span>
      <strong>{label}:</strong> {value}
    </span>
  </div>
);
