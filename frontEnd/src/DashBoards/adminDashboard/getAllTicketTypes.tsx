import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { useGetAllTicketTypesQuery, useUpdateTicketTypeMutation, useDeleteTicketTypeMutation } from '../../features/APIS/ticketsType.Api'; 
import { eventApi } from '../../features/APIS/EventsApi'; 

import type { RootState } from '../../App/store';

export const TicketTypes = () => {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useSelector((state: RootState) => state.auth);

  // Fetching all ticket types
  const { data: ticketTypes, error, isLoading, refetch } = useGetAllTicketTypesQuery({});
  
  // Initialize mutation hooks for editing and deleting
  const [deleteTicketType, { isLoading: isDeleting }] = useDeleteTicketTypeMutation();
  const [updateTicketType, { isLoading: isUpdating }] = useUpdateTicketTypeMutation();

  // State for managing event names mapping
  const [eventNames, setEventNames] = useState<Record<number, string>>({});
  
  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<any>(null);
  
  // Updated editFormData state including eventId
  const [editFormData, setEditFormData] = useState({ 
    name: '', 
    price: '', 
    quantity: '',
    eventId: '' 
  });

  // Fetch event names (used for both display and the dropdown)
  const { data: allEvents, isLoading: isEventsLoading } = eventApi.useGetAllEventsQuery({});

  useEffect(() => {
    if (!isAuthenticated || role !== 'admin') {
      navigate('/login');
    }
  }, [isAuthenticated, role, navigate]);

  // Map eventId to event title
  useEffect(() => {
    if (allEvents) {
      const eventsMap: Record<number, string> = {};
      allEvents.forEach((event: any) => {
        // Ensure we are mapping event.title, assuming that's where the name is stored
        eventsMap[event.eventId] = event.title; 
      });
      setEventNames(eventsMap);
    }
  }, [allEvents]);

  // --- Functionalities for Edit and Delete ---

  const handleDeleteTicketType = async (id: number) => {
    // Swal for confirmation
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await deleteTicketType(id).unwrap();
        // Swal for success message
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Ticket type deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Failed to delete ticket type:', err);
        Swal.fire('Error!', 'Failed to delete ticket type.', 'error');
      }
    }
  };

  const handleEditClick = (ticket: any) => {
    setCurrentTicket(ticket);
    // Initialize form data including eventId from the current ticket
    setEditFormData({
      name: ticket.name,
      price: ticket.price,
      quantity: ticket.quantity,
      eventId: ticket.eventId.toString() // Convert ID to string for dropdown value
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateTicketType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTicket) return;

    // Prepare payload for update
    const payload = {
      id: currentTicket.ticketTypeId,
      name: editFormData.name,
      price: parseFloat(editFormData.price),
      quantity: parseInt(editFormData.quantity),
      eventId: parseInt(editFormData.eventId) // Parse selected eventId back to number
    };

    try {
      await updateTicketType(payload).unwrap();
      // Swal for success message
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Ticket type updated successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      setIsEditModalOpen(false);
      setCurrentTicket(null);
    } catch (err) {
      console.error('Failed to update ticket type:', err);
      Swal.fire('Error!', 'Failed to update ticket type.', 'error');
    }
  };

  // --- Render Section ---

  return (
    <div className="min-h-screen text-white py-10 px-5 bg-gray-900">
      <div className="max-w-4xl mx-auto rounded-lg shadow-lg p-5 bg-gray-800">
        <div className="mt-10">
          <h2 className="text-3xl font-bold text-orange-500 mb-4">Ticket Types</h2>

          {isLoading || isEventsLoading ? (
            <p className="text-gray-400">Loading ticket types...</p>
          ) : error ? (
            <p className="text-red-500">Failed to load ticket types</p>
          ) : (
            <div className="space-y-4">
              {ticketTypes?.map((ticket: any) => {
                const eventName = eventNames[ticket.eventId] || 'Unknown Event';

                return (
                  <div 
                    key={ticket.ticketTypeId} 
                    className="bg-white/5 backdrop-blur-xl border border-orange-400/20 p-4 rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-orange-400"
                  >
                    <h4 className="text-xl font-bold text-orange-400">{ticket.name}</h4>
                    <p className="text-gray-300">Price: ${ticket.price}</p>
                    <p className="text-gray-300">Quantity Available: {ticket.quantity}</p>
                    <p className="text-gray-400 font-semibold italic">Event Name: {eventName}</p>
                    
                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-4">
                      <button 
                        onClick={() => handleEditClick(ticket)}
                        className="btn bg-orange-500 text-white hover:bg-orange-600"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTicketType(ticket.ticketTypeId)}
                        className="btn bg-red-500 text-white hover:bg-red-600"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Ticket Modal */}
      {isEditModalOpen && (
        <dialog id="edit_ticket_modal" className="modal modal-open">
          <div className="modal-box bg-gray-800 text-white">
            <h3 className="font-bold text-lg text-orange-400">Edit Ticket Type</h3>
            <form onSubmit={handleUpdateTicketType} className="py-4 space-y-4">

              {/* Event Dropdown (Dynamically Populated) */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-400">Event</span>
                </label>
                <select
                  className="select select-bordered w-full bg-gray-700 text-white"
                  value={editFormData.eventId}
                  onChange={(e) => setEditFormData({ ...editFormData, eventId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select an Event</option>
                  {/* Populate dropdown with all events */}
                  {allEvents?.map((event: any) => (
                    <option key={event.eventId} value={event.eventId}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-400">Ticket Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-gray-700 text-white"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-400">Price ($)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="input input-bordered w-full bg-gray-700 text-white"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text text-gray-400">Quantity</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full bg-gray-700 text-white"
                  value={editFormData.quantity}
                  onChange={(e) => setEditFormData({ ...editFormData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="modal-action">
                <button type="submit" className="btn btn-success" disabled={isUpdating}>
                  {isUpdating ? 'Updating...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default TicketTypes;