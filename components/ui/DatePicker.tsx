import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CalendarIcon } from '../icons/CalendarIcon';

interface DatePickerProps {
  label: string;
  id: string;
  value: string; // YYYY-MM-DD
  onChange: (date: string) => void;
}

const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    // Use UTC to avoid timezone issues when only date is relevant
    return new Date(Date.UTC(year, month - 1, day));
};

export const DatePicker: React.FC<DatePickerProps> = ({ label, id, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(parseDate(value));
    const datePickerRef = useRef<HTMLDivElement>(null);

    const selectedDate = useMemo(() => parseDate(value), [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    useEffect(() => {
        // When value changes from parent, update the view
        setViewDate(parseDate(value));
    }, [value]);

    const daysInMonth = useMemo(() => new Date(viewDate.getUTCFullYear(), viewDate.getUTCMonth() + 1, 0).getUTCDate(), [viewDate]);
    const firstDayOfMonth = useMemo(() => new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), 1)).getUTCDay(), [viewDate]);

    const handleDateSelect = (day: number) => {
        const newDate = new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), day));
        onChange(formatDate(newDate));
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(prev => {
            const newDate = new Date(prev);
            newDate.setUTCMonth(prev.getUTCMonth() + offset);
            return newDate;
        });
    };

    const today = new Date();
    today.setUTCHours(0,0,0,0);

    const renderDays = () => {
        const days = [];
        // Add blank days for the first week
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>);
        }
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(Date.UTC(viewDate.getUTCFullYear(), viewDate.getUTCMonth(), day));
            const isSelected = currentDate.getTime() === selectedDate.getTime();
            const isToday = currentDate.getTime() === today.getTime();
            
            const baseClasses = "w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-150";
            let dayClasses = "";
            if (isSelected) {
                dayClasses = "bg-brand-primary text-white font-bold";
            } else if (isToday) {
                dayClasses = "bg-accent-blue-light text-brand-primary font-semibold";
            } else {
                dayClasses = "text-gray-700 hover:bg-gray-100";
            }
            days.push(
                <button type="button" key={day} onClick={() => handleDateSelect(day)} className={`${baseClasses} ${dayClasses}`}>
                    {day}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="relative" ref={datePickerRef}>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <CalendarIcon className="w-5 h-5 text-gray-400" />
                </div>
                <button type="button" id={id} onClick={() => setIsOpen(!isOpen)} className="block w-full text-left pl-10 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm">
                    {value}
                </button>
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-80 bg-white shadow-xl border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                        <button type="button" onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors">&lt;</button>
                        <span className="font-semibold text-gray-800">{viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                        <button type="button" onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800 transition-colors">&gt;</button>
                    </div>
                    <div className="grid grid-cols-7 text-center text-sm text-gray-500 font-medium mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day}>{day}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {renderDays()}
                    </div>
                </div>
            )}
        </div>
    );
};