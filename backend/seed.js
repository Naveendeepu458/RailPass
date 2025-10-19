
const mongoose = require('mongoose');
const Train = require('./models/train');
const UserProfile = require('./models/userProfile');
const Booking = require('./models/booking');

const initialTrains = [
    { id: 'T001', name: 'Capital Express', number: '12001', departureTime: '08:00', arrivalTime: '20:00', duration: '12h 0m', price: 2500, seatsAvailable: 72, totalSeats: 72, bookedSeats: [] },
    { id: 'T002', name: 'Coastal Voyager', number: '22003', departureTime: '10:30', arrivalTime: '23:00', duration: '12h 30m', price: 2200, seatsAvailable: 60, totalSeats: 60, bookedSeats: [] },
    { id: 'T003', name: 'MetroLink Superfast', number: '15005', departureTime: '14:00', arrivalTime: '01:00', duration: '11h 0m', price: 2800, seatsAvailable: 72, totalSeats: 72, bookedSeats: [] },
    { id: 'T004', name: 'Night Owl Flyer', number: '18007', departureTime: '21:00', arrivalTime: '08:00', duration: '11h 0m', price: 1900, seatsAvailable: 72, totalSeats: 72, bookedSeats: [] },
    { id: 'T005', name: 'Green Valley Limited', number: '11009', departureTime: '06:15', arrivalTime: '18:45', duration: '12h 30m', price: 2350, seatsAvailable: 60, totalSeats: 60, bookedSeats: [] }
];

const initialProfile = {
  name: 'Samuel B',
  email: 'samuel.b@example.com',
  phone: '123-456-7890',
  address: '123 Railfan Ave, Trainsville, India'
};

const seedDatabase = async () => {
    try {
        // Clear existing data
        await Train.deleteMany({});
        await UserProfile.deleteMany({});
        await Booking.deleteMany({});

        // Insert new data
        await Train.insertMany(initialTrains);
        console.log('Trains seeded successfully.');
        
        await UserProfile.create(initialProfile);
        console.log('User profile seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

module.exports = seedDatabase;
