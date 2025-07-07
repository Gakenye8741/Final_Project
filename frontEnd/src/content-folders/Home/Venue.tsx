import React, { useState } from "react";

type Venue = {
  id: number;
  name: string;
  county: string;
  location: string;
  image: string;
  status: "Available" | "Booked";
};

const initialVenues: Venue[] = [
  {
    id: 1,
    name: "KICC Convention Centre",
    county: "Nairobi",
    location: "Harambee Avenue, Nairobi",
    image: "https://images.unsplash.com/photo-1600585152914-698b9aeada2e",
    status: "Available",
  },
  {
    id: 2,
    name: "Mombasa Beach Arena",
    county: "Mombasa",
    location: "Nyali Beachfront, Mombasa",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    status: "Booked",
  },
  {
    id: 3,
    name: "Eldoret Sports Grounds",
    county: "Uasin Gishu",
    location: "Eldoret CBD",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    status: "Available",
  },
  {
    id: 4,
    name: "Kisumu Peace Hall",
    county: "Kisumu",
    location: "Oginga Odinga Street",
    image: "https://images.unsplash.com/photo-1564866657311-e9cc905d29b2",
    status: "Booked",
  },
];

export const VenueList: React.FC = () => {
  const [venues] = useState(initialVenues);

  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Event Venues in Kenya</h2>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <div
            key={venue.id}
            className="card w-full bg-base-100 shadow-xl border border-base-200"
          >
            <figure>
              <img
                src={venue.image}
                alt={venue.name}
                className="h-52 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title text-lg">{venue.name}</h3>
              <p className="text-sm text-gray-500">{venue.location}</p>
              <div className="badge badge-outline">{venue.county}</div>
              <div className="mt-2">
                <span
                  className={`badge ${
                    venue.status === "Available"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {venue.status}
                </span>
              </div>
              <div className="card-actions justify-end mt-4">
                <button
                  className={`btn ${
                    venue.status === "Booked"
                      ? "btn-disabled"
                      : "btn-primary"
                  }`}
                >
                  Book Venue
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
