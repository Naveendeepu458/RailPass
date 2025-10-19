import React, { useState } from 'react';
import type { Train, Booking } from '../types';
import { searchTrains } from '../api';
import { TrainResults } from './TrainResults';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Card } from './ui/Card';
import { BookingModal } from './BookingModal';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { DatePicker } from './ui/DatePicker';

interface SearchTrainsProps {
  addBooking: (newBooking: Omit<Booking, 'id' | 'bookingDate'>) => Promise<void>;
}

export const SearchTrains: React.FC<SearchTrainsProps> = ({ addBooking }) => {
  const [from, setFrom] = useState('New Delhi');
  const [to, setTo] = useState('Mumbai');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchResults, setSearchResults] = useState<Train[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedTrain, setSelectedTrain] = useState<Train | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSearched(true);
    try {
      const results = await searchTrains({ from, to, date });
      setSearchResults(results);
    } catch (error) {
      console.error("Failed to search for trains:", error);
      alert("Could not fetch train data. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBookNow = (train: Train) => {
    setSelectedTrain(train);
  };
  
  const handleCloseModal = () => {
    setSelectedTrain(null);
  }

  return (
    <div>
      <Card className="shadow-lg">
        <div className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Input 
              label="From" 
              id="from" 
              value={from} 
              onChange={(e) => setFrom(e.target.value)} 
              placeholder="Enter source station"
              icon={<LocationPinIcon className="w-5 h-5 text-gray-400" />}
            />
            <Input 
              label="To" 
              id="to" 
              value={to} 
              onChange={(e) => setTo(e.target.value)} 
              placeholder="Enter destination station" 
              icon={<LocationPinIcon className="w-5 h-5 text-gray-400" />}
            />
            <DatePicker 
              label="Journey Date" 
              id="date" 
              value={date} 
              onChange={setDate} 
            />
            <div className="md:col-span-3">
              <Button type="submit" className="w-full text-lg py-3" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search Trains'}
              </Button>
            </div>
          </form>
        </div>
      </Card>

      {searched && (
        <div className="mt-12">
            <TrainResults trains={searchResults} onBookNow={handleBookNow} isLoading={isLoading}/>
        </div>
      )}
      
      {selectedTrain && (
        <BookingModal 
            train={selectedTrain} 
            onClose={handleCloseModal}
            addBooking={addBooking}
        />
      )}
    </div>
  );
};
