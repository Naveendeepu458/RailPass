import React, { useState } from 'react';
import type { Booking } from '../types';
import { Card } from './ui/Card';
import { TicketIcon } from './icons/TicketIcon';
import { Button } from './ui/Button';
import { ConfirmationModal } from './ui/ConfirmationModal';

const BookingCard: React.FC<{ booking: Booking; onCancelClick: (id: string) => void; }> = ({ booking, onCancelClick }) => {
    return (
        <Card className="mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="bg-brand-dark text-white p-4 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-lg">{booking.train.name} ({booking.train.number})</h3>
                    <p className="text-sm text-gray-300">Booking ID: {booking.id}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm">Booked on: {booking.bookingDate}</p>
                    <p className="font-bold text-xl text-green-400">₹{booking.totalFare.toLocaleString()}</p>
                </div>
            </div>
            <div className="p-4 flex-grow">
                <div className="flex justify-between items-center text-sm text-gray-700 mb-4">
                    <div>
                        <p className="font-semibold text-lg">{booking.train.departureTime}</p>
                        <p>{booking.train.from}</p>
                    </div>
                    <div className="text-center text-gray-500">
                        <p>{booking.train.duration}</p>
                        <div className="w-full h-1 bg-gray-200 rounded-full my-1"></div>
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{booking.train.arrivalTime}</p>
                        <p>{booking.train.to}</p>
                    </div>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800">Passengers:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                        {booking.passengers.map((p, index) => (
                            <li key={index}>
                                {p.name} (Age: {p.age}, {p.gender}) - Seat: <span className="font-semibold">{p.seat}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="bg-gray-50 p-3 border-t flex justify-end">
                <Button variant="danger" onClick={() => onCancelClick(booking.id)}>
                    Cancel Booking
                </Button>
            </div>
        </Card>
    )
};

interface MyBookingsProps {
    bookings: Booking[];
    onCancelBooking: (bookingId: string) => void;
}

export const MyBookings: React.FC<MyBookingsProps> = ({ bookings, onCancelBooking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null);

  const handleCancelClick = (bookingId: string) => {
    setBookingToCancel(bookingId);
    setIsModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (bookingToCancel) {
      onCancelBooking(bookingToCancel);
    }
    setIsModalOpen(false);
    setBookingToCancel(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setBookingToCancel(null);
  };

  if (bookings.length === 0) {
    return (
        <Card>
            <div className="p-12 text-center text-gray-500">
                <TicketIcon className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                <h2 className="text-xl font-semibold">No Bookings Yet</h2>
                <p>Your confirmed bookings will appear here.</p>
            </div>
        </Card>
    );
  }

  return (
    <div>
        {bookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} onCancelClick={handleCancelClick} />
        ))}
        <ConfirmationModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onConfirm={handleConfirmCancel}
            title="Confirm Cancellation"
            message="Are you sure you want to cancel this booking? This action cannot be undone."
            confirmText="Yes, Cancel"
            cancelText="No, Keep It"
        />
    </div>
  );
};
