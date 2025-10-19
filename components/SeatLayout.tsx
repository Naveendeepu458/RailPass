import React from 'react';

interface SeatLayoutProps {
  totalSeats: number;
  bookedSeats: string[];
  selectedSeats: (string | null)[];
  onSeatSelect: (seatNumber: string) => void;
  activePassengerIndex: number;
}

const Seat: React.FC<{
  seatNumber: string;
  status: 'available' | 'booked' | 'selected-by-you' | 'selected-by-other';
  onClick: () => void;
}> = ({ seatNumber, status, onClick }) => {
  const baseClasses = 'w-8 h-8 md:w-10 md:h-10 border-2 rounded-md flex items-center justify-center text-xs font-semibold cursor-pointer transition-all duration-200';
  
  const statusClasses = {
    available: 'bg-white border-gray-300 hover:bg-blue-100 hover:border-brand-primary',
    booked: 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed',
    'selected-by-you': 'bg-yellow-300 border-brand-primary text-brand-dark ring-2 ring-yellow-400',
    'selected-by-other': 'bg-blue-300 border-blue-400 text-white cursor-not-allowed',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={status === 'booked' || status === 'selected-by-other'}
      className={`${baseClasses} ${statusClasses[status]}`}
      aria-label={`Seat ${seatNumber}, status: ${status}`}
    >
      {seatNumber}
    </button>
  );
};

export const SeatLayout: React.FC<SeatLayoutProps> = ({
  totalSeats,
  bookedSeats,
  selectedSeats,
  onSeatSelect,
  activePassengerIndex,
}) => {
  const SEATS_PER_ROW = 6;
  const rows = Math.ceil(totalSeats / SEATS_PER_ROW);
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  const renderSeats = () => {
    const layout = [];
    for (let i = 0; i < rows; i++) {
      const rowSeats = [];
      for (let j = 0; j < SEATS_PER_ROW; j++) {
        const seatNumber = `${i + 1}${seatLetters[j]}`;
        if ((i * SEATS_PER_ROW + j) >= totalSeats) continue;
        
        let status: 'available' | 'booked' | 'selected-by-you' | 'selected-by-other' = 'available';

        if (bookedSeats.includes(seatNumber)) {
          status = 'booked';
        } else {
          const selectedIndex = selectedSeats.indexOf(seatNumber);
          if (selectedIndex !== -1) {
            status = selectedIndex === activePassengerIndex ? 'selected-by-you' : 'selected-by-other';
          }
        }
        
        rowSeats.push(
          <Seat
            key={seatNumber}
            seatNumber={seatNumber}
            status={status}
            onClick={() => onSeatSelect(seatNumber)}
          />
        );
      }
      layout.push(
        <div key={i} className="flex items-center gap-2">
          <div className="w-6 text-sm font-medium text-gray-500">{i + 1}</div>
          <div className="flex gap-2">{rowSeats.slice(0, 3)}</div>
          <div className="w-4 md:w-8"></div> {/* Aisle */}
          <div className="flex gap-2">{rowSeats.slice(3, 6)}</div>
        </div>
      );
    }
    return layout;
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-bold text-brand-dark mb-4">Select Your Seat</h3>
        <div className="flex justify-center flex-wrap gap-x-6 gap-y-2 text-xs mb-4">
            <div className="flex items-center"><div className="w-4 h-4 rounded border-2 border-gray-300 mr-2"></div>Available</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-yellow-300 border-2 border-yellow-400 mr-2"></div>Your Selection</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-blue-300 border-2 border-blue-400 mr-2"></div>Others' Selection</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded bg-gray-300 border-2 border-gray-400 mr-2"></div>Booked</div>
        </div>
        <div className="flex flex-col items-center gap-2">
            {renderSeats()}
        </div>
    </div>
  );
};
