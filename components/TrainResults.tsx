import React from 'react';
import type { Train } from '../types';
import { Button } from './ui/Button';

interface TrainResultsProps {
  trains: Train[];
  onBookNow: (train: Train) => void;
  isLoading: boolean;
}

const TrainCard: React.FC<{ train: Train; onBookNow: (train: Train) => void }> = ({ train, onBookNow }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row">
        <div className="p-6 flex-grow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-brand-dark">{train.name} <span className="text-gray-500 font-medium text-sm">({train.number})</span></h3>
                    <p className="text-sm text-gray-600">{train.from} to {train.to}</p>
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">₹{train.price.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">per person</p>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-gray-700">
                <div>
                    <p className="font-semibold">{train.departureTime}</p>
                    <p className="text-xs">{train.from}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-gray-500">{train.duration}</p>
                    <div className="w-full h-1 bg-gray-200 rounded-full my-1">
                        <div className="h-1 bg-brand-primary rounded-full"></div>
                    </div>
                </div>
                <div>
                    <p className="font-semibold">{train.arrivalTime}</p>
                    <p className="text-xs">{train.to}</p>
                </div>
            </div>
        </div>
        <div className="bg-gray-50 p-4 flex flex-col justify-center items-center md:w-48">
             <p className="text-sm font-semibold text-green-700 mb-2">
                {train.seatsAvailable} Seats Available
            </p>
            <Button onClick={() => onBookNow(train)} className="w-full md:w-auto" variant="secondary">Book Now</Button>
        </div>
    </div>
);


const ShimmerCard: React.FC = () => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="p-6">
            <div className="flex justify-between items-start">
                <div className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="mt-6 flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-2 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
        </div>
    </div>
);


export const TrainResults: React.FC<TrainResultsProps> = ({ trains, onBookNow, isLoading }) => {
    if(isLoading) {
        return (
            <div className="space-y-4">
                <ShimmerCard />
                <ShimmerCard />
                <ShimmerCard />
            </div>
        )
    }

    if (trains.length === 0) {
        return (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">No trains found for this route.</h3>
            <p className="text-gray-500 mt-2">Please try a different search or check back later.</p>
          </div>
        );
      }

  return (
    <div className="space-y-4">
      {trains.map((train) => (
        <TrainCard key={train.id} train={train} onBookNow={onBookNow} />
      ))}
    </div>
  );
};
