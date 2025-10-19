import React from 'react';
import type { Booking } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { View } from '../App';

interface BookingConfirmationProps {
    booking: Booking;
    onNavigate: (view: View) => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, onNavigate }) => {
    return (
        <Card className="max-w-3xl mx-auto">
            <div className="p-8 text-center">
                <CheckCircleIcon className="w-20 h-20 mx-auto text-green-500" />
                <h2 className="mt-4 text-3xl font-bold text-brand-dark">Booking Confirmed!</h2>
                <p className="mt-2 text-gray-600">Your ticket has been successfully booked. Have a safe journey!</p>
                <p className="mt-4 text-sm text-gray-500">
                    Booking ID: <span className="font-semibold text-brand-dark">{booking.id}</span>
                </p>
            </div>
            <div className="border-t border-b border-gray-200 bg-gray-50 p-6">
                <h3 className="font-bold text-lg text-brand-dark">{booking.train.name} ({booking.train.number})</h3>
                <div className="mt-4 flex justify-between items-center text-sm text-gray-700">
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
            </div>
            <div className="p-6">
                <div className="flex justify-between items-baseline border-b pb-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-800">Passenger Details:</h4>
                    <div className="text-lg">
                        <span className="text-gray-600 font-medium">Total Fare: </span>
                        <span className="font-bold text-brand-dark">₹{booking.totalFare.toLocaleString()}</span>
                    </div>
                </div>
                <ul className="divide-y divide-gray-200">
                    {booking.passengers.map((p, index) => (
                        <li key={index} className="py-3 flex justify-between items-center">
                            <div>
                                <p className="font-medium text-gray-800">{p.name}</p>
                                <p className="text-sm text-gray-500">Age: {p.age}, {p.gender}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-brand-dark">{p.seat}</p>
                                <p className="text-sm text-gray-500">Seat</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="p-6 bg-gray-50 border-t flex justify-center gap-4">
                <Button variant="secondary" onClick={() => onNavigate(View.Bookings)}>View All Bookings</Button>
                <Button onClick={() => onNavigate(View.Search)}>Book Another Ticket</Button>
            </div>
        </Card>
    );
};
