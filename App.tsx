import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchTrains } from './components/SearchTrains';
import { MyBookings } from './components/MyBookings';
import { Profile } from './components/Profile';
import { FeatureCards } from './components/FeatureCards';
import { BookingConfirmation } from './components/BookingConfirmation';
import type { Booking, UserProfile } from './types';
import * as api from './api';

export enum View {
  Search = 'Search',
  Bookings = 'Bookings',
  Profile = 'Profile',
  Confirmation = 'Confirmation'
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>(View.Search);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lastBooking, setLastBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [bookingsData, profileData] = await Promise.all([
          api.getBookings(),
          api.getProfile(),
        ]);
        setBookings(bookingsData);
        setProfile(profileData);
        setError(null);
      } catch (err) {
        setError('Failed to load application data. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const addBooking = useCallback(async (newBooking: Omit<Booking, 'id' | 'bookingDate'>) => {
    try {
        const newlyCreatedBooking = await api.createBooking(newBooking);
        setBookings(prevBookings => [newlyCreatedBooking, ...prevBookings]);
        setLastBooking(newlyCreatedBooking);
        setActiveView(View.Confirmation);
    } catch (err) {
        alert('Failed to create booking. Please try again.');
        console.error(err);
    }
  }, []);

  const handleProfileUpdate = useCallback(async (updatedProfile: UserProfile) => {
    try {
        const savedProfile = await api.updateProfile(updatedProfile);
        setProfile(savedProfile);
        alert('Profile updated successfully!');
    } catch (err) {
        alert('Failed to update profile. Please try again.');
        console.error(err);
    }
  }, []);

  const handleCancelBooking = useCallback(async (bookingId: string) => {
    try {
        await api.cancelBooking(bookingId);
        setBookings(prev => prev.filter(b => b.id !== bookingId));
    } catch (err) {
        alert('Failed to cancel booking. Please try again.');
        console.error(err);
    }
  }, []);
  
  const renderContent = () => {
    if (isLoading) {
        return <div className="text-center p-12">Loading application...</div>;
    }
    if (error) {
        return <div className="text-center p-12 text-red-500">{error}</div>;
    }

    switch(activeView) {
      case View.Bookings:
        return <MyBookings bookings={bookings} onCancelBooking={handleCancelBooking} />;
      case View.Profile:
        return profile ? <Profile profile={profile} onUpdate={handleProfileUpdate} /> : <div>Loading profile...</div>;
      case View.Confirmation:
        if (!lastBooking) {
            setActiveView(View.Search);
            return null;
        }
        return <BookingConfirmation booking={lastBooking} onNavigate={setActiveView} />;
      case View.Search:
      default:
        return (
          <>
            <div className="text-center pt-8 pb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-brand-dark">Book Your Railway Journey</h1>
              <p className="mt-4 text-lg text-gray-600">Fast, reliable, and hassle-free train ticket booking</p>
            </div>
            <SearchTrains addBooking={addBooking} />
            <FeatureCards />
          </>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg font-sans">
      <Header 
        activeView={activeView} 
        onNavigate={setActiveView} 
      />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="w-full max-w-5xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
