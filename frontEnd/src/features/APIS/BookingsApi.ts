
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

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

export const bookingApi = createApi({
  reducerPath: 'bookingApi', // Changed to 'bookingApi'
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/', // Base URL remains the same as eventApi
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        // Add "Bearer " prefix if your backend expects it (consistent with eventApi)
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    }
  }),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,

  tagTypes: ['Bookings', 'Booking'], // Changed to 'Bookings' and 'Booking' for bookings-related tags

  endpoints: (builder) => ({
    // 📥 Get All Bookings
    getAllBookings: builder.query<Booking[], void>({
      query: () => 'bookings', // Matches backend route: GET /bookings
      providesTags: ['Bookings']
    }),

    // 🔍 Get Booking by ID
    getBookingById: builder.query<Booking, number>({
      query: (bookingId) => `bookings/${bookingId}`, // Matches backend route: GET /bookings/:id
      providesTags: (result, error, id) => [{ type: 'Booking', id }]
    }),

    // 👤 Get Bookings by User National ID
    getBookingsByUserNationalId: builder.query<Booking[], number>({
      query: (nationalId) => `bookings/user/national-id/${nationalId}`, // Matches backend route
      providesTags: ['Bookings']
    }),

    // 🎟️ Get Bookings by Event ID
    getBookingsByEventId: builder.query<Booking[], number>({
      query: (eventId) => `bookings/event/${eventId}`, // Matches backend route
      providesTags: ['Bookings']
    }),

    // ➕ Create a new Booking
    createBooking: builder.mutation<Booking, Omit<Booking, 'bookingId' | 'bookingStatus' | 'createdAt' | 'updatedAt'>>({
      query: (createBookingPayload) => ({
        url: 'bookings', // Matches backend route: POST /bookings
        method: 'POST',
        body: createBookingPayload,
      }),
      invalidatesTags: ['Bookings']
    }),

    // 🔄 Update an existing Booking
    updateBooking: builder.mutation<Booking, { bookingId: number; body: Partial<Omit<Booking, 'bookingId' | 'createdAt' | 'updatedAt'>> }>({
      query: ({ bookingId, body }) => ({
        url: `bookings/${bookingId}`, // Matches backend route: PUT /bookings/:id
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { bookingId }) => ['Bookings', { type: 'Booking', id: bookingId }]
    }),

    // 🔄 Update Booking Status
    updateBookingStatus: builder.mutation<{ message: string }, { bookingId: number; status: "Pending" | "Confirmed" | "Cancelled" }>({
      query: ({ bookingId, status }) => ({
        url: `bookings/${bookingId}/status`, // Matches backend route: PATCH /bookings/:id/status
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (result, error, { bookingId }) => ['Bookings', { type: 'Booking', id: bookingId }]
    }),

    // ❌ Cancel Booking
    cancelBooking: builder.mutation<{ message: string }, number>({
      query: (bookingId) => ({
        url: `bookings/${bookingId}/cancel`, // Matches backend route: PATCH /bookings/:id/cancel
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => ['Bookings', { type: 'Booking', id }]
    }),

    // 🗑️ Delete Booking
    deleteBooking: builder.mutation<{ message: string }, number>({
      query: (bookingId) => ({
        url: `bookings/${bookingId}`, // Matches backend route: DELETE /bookings/:id
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => ['Bookings', { type: 'Booking', id }]
    }),
  }),
});

// Export the auto-generated hooks for your endpoints
export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useGetBookingsByUserNationalIdQuery,
  useGetBookingsByEventIdQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useUpdateBookingStatusMutation,
  useCancelBookingMutation,
  useDeleteBookingMutation,
} = bookingApi;
