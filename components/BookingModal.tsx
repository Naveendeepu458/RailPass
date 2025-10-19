import React, { useState, useMemo } from 'react';
import type { Train, Passenger, Booking } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { SeatLayout } from './SeatLayout';

interface BookingModalProps {
  train: Train;
  onClose: () => void;
  addBooking: (newBooking: Omit<Booking, 'id' | 'bookingDate'>) => Promise<void>;
}

export const BookingModal: React.FC<BookingModalProps> = ({ train, onClose, addBooking }) => {
  const [passengers, setPassengers] = useState<Passenger[]>([{ name: '', age: 0, gender: 'Male', seat: null }]);
  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePassengerChange = <T extends keyof Passenger,>(index: number, field: T, value: Passenger[T]) => {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  };
  
  const addPassenger = () => {
    setPassengers([...passengers, { name: '', age: 0, gender: 'Male', seat: null }]);
    setActivePassengerIndex(passengers.length); // Activate the new passenger
  };

  const removePassenger = (index: number) => {
    if (passengers.length > 1) {
      const newPassengers = passengers.filter((_, i) => i !== index);
      setPassengers(newPassengers);
      if (activePassengerIndex === index) {
        setActivePassengerIndex(0);
      } else if (activePassengerIndex > index) {
        setActivePassengerIndex(activePassengerIndex - 1);
      }
    }
  };

  const handleSeatSelect = (seatNumber: string) => {
    const newPassengers = [...passengers];
    const currentPassenger = newPassengers[activePassengerIndex];
    
    if (currentPassenger.seat === seatNumber) {
        currentPassenger.seat = null;
    } else {
        // Unselect seat if another passenger has it
        const seatTakenIndex = newPassengers.findIndex(p => p.seat === seatNumber);
        if (seatTakenIndex !== -1) {
            newPassengers[seatTakenIndex].seat = null;
        }
        currentPassenger.seat = seatNumber;
    }
    
    setPassengers(newPassengers);
  }

  const totalFare = useMemo(() => train.price * passengers.length, [train.price, passengers]);
  
  const isFormValid = useMemo(() => {
    return passengers.every(p => p.name.trim() !== '' && p.age > 0 && p.seat !== null);
  }, [passengers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
        alert("Please fill all passenger details and select a seat for each passenger.");
        return;
    }
    setIsSubmitting(true);
    const newBooking: Omit<Booking, 'id' | 'bookingDate'> = {
        train,
        passengers,
        totalFare
    };
    await addBooking(newBooking);
    setIsSubmitting(false);
    onClose();
  };

  const selectedSeats = useMemo(() => passengers.map(p => p.seat), [passengers]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-brand-dark">Confirm Booking</h2>
          <p className="text-gray-600">{train.name} ({train.from} to {train.to})</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-bold text-brand-dark mb-4">Passenger Details</h3>
            <div className="space-y-4">
              {passengers.map((p, index) => (
                <div 
                  key={index} 
                  className={`border p-4 rounded-md relative transition-all duration-200 ${index === activePassengerIndex ? 'border-brand-primary ring-2 ring-brand-primary' : 'border-gray-200'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Passenger {index + 1}</h4>
                    {passengers.length > 1 && (
                      <button type="button" onClick={() => removePassenger(index)} className="text-red-500 hover:text-red-700 text-2xl leading-none">&times;</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-3">
                      <Input label="Full Name" id={`name-${index}`} value={p.name} onChange={(e) => handlePassengerChange(index, 'name', e.target.value)} required/>
                    </div>
                    <Input label="Age" id={`age-${index}`} type="number" value={p.age > 0 ? p.age.toString() : ''} onChange={(e) => handlePassengerChange(index, 'age', parseInt(e.target.value, 10) || 0)} required min="1"/>
                    <div>
                      <label htmlFor={`gender-${index}`} className="block text-sm font-medium text-gray-700">Gender</label>
                      <select id={`gender-${index}`} value={p.gender} onChange={(e) => handlePassengerChange(index, 'gender', e.target.value as Passenger['gender'])} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm rounded-md">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                      </select>
                    </div>
                     <div className="flex items-end">
                       <Button 
                         type="button" 
                         variant={index === activePassengerIndex ? 'primary' : 'secondary'}
                         onClick={() => setActivePassengerIndex(index)} 
                         className="w-full"
                       >
                         {p.seat ? `Seat: ${p.seat}` : 'Select Seat'}
                       </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="secondary" onClick={addPassenger} className="mt-4">Add Another Passenger</Button>
          </div>
          
          <div>
            <SeatLayout 
              totalSeats={train.totalSeats}
              bookedSeats={train.bookedSeats}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              activePassengerIndex={activePassengerIndex}
            />
          </div>

        </form>

        <div className="p-6 border-t bg-gray-50 flex justify-between items-center">
            <div>
                <p className="text-gray-600">Total Fare:</p>
                <p className="text-2xl font-bold text-brand-dark">₹{totalFare.toLocaleString()}</p>
            </div>
            <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                <Button type="submit" onClick={handleSubmit} disabled={!isFormValid || isSubmitting}>
                  {isSubmitting ? 'Booking...' : 'Confirm & Pay'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};
