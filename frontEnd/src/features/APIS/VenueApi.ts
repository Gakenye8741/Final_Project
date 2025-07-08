import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../App/store';

export const venueApi = createApi({
  reducerPath: 'venueApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: true,

  tagTypes: ['venues', 'venue'],
  endpoints: (builder) => ({
    // ➕ Create Venue
    createVenue: builder.mutation({
      query: (createVenuePayload) => ({
        url: 'venues',
        method: 'POST',
        body: createVenuePayload,
      }),
      invalidatesTags: ['venues'],
    }),

    // 🔄 Update Venue
    updateVenue: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `venues/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['venues'],
    }),

    // 🗑️ Delete Venue
    deleteVenue: builder.mutation({
      query: (id) => ({
        url: `venues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['venues'],
    }),

    // 📥 Get All Venues
    getAllVenues: builder.query({
      query: () => 'venues',
      providesTags: ['venues'],
    }),

    // 🔍 Get Venue By Name
    getVenueByName: builder.query({
      query: (name) => `venues/${name}`,
      providesTags: ['venue'],
    }),
  }),
});
