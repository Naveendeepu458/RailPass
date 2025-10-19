const express = require('express');
const router = express.Router();
const Train = require('../models/train');
const Booking = require('../models/booking');
const UserProfile = require('../models/userProfile');

// --- Train Routes ---
router.get('/trains', async (req, res) => {
    try {
        const { from, to } = req.query;
        // In a real app, you'd filter by from/to. Here we just add it for display.
        const trains = await Train.find({});
        const results = trains.map(train => ({...train.toObject(), from, to }));
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trains', error });
    }
});

// --- Booking Routes ---
router.get('/bookings', async (req, res) => {
    try {
        // Fetch bookings and populate train details, sort by most recent
        const bookings = await Booking.find().populate('train').sort({ bookingDate: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
});

router.post('/bookings', async (req, res) => {
    try {
        const { train, passengers, totalFare } = req.body;

        // Find the train document in the DB using its custom ID to get its actual _id
        const trainDoc = await Train.findOne({ id: train.id });
        if (!trainDoc) {
            return res.status(404).json({ message: `Train with custom id ${train.id} not found.` });
        }
        
        const newBooking = new Booking({
            train: trainDoc._id, // Use the correct MongoDB ObjectId for the reference
            passengers,
            totalFare,
            bookingDate: new Date()
        });
        
        const savedBooking = await newBooking.save();

        // Update the train's booked seats
        const seatsToBook = passengers.map(p => p.seat).filter(Boolean);
        if (seatsToBook.length > 0) {
            trainDoc.bookedSeats.push(...seatsToBook);
            trainDoc.seatsAvailable -= seatsToBook.length;
            await trainDoc.save();
        }
        
        // Populate train details for the response
        const populatedBooking = await Booking.findById(savedBooking._id).populate('train');
        res.status(201).json(populatedBooking);
    } catch (error) {
        console.error("Error during booking creation:", error); // Added detailed logging
        res.status(500).json({ message: 'Error creating booking', error: error.message });
    }
});

router.delete('/bookings/:id', async (req, res) => {
    try {
        const bookingId = req.params.id;
        const deletedBooking = await Booking.findByIdAndDelete(bookingId);

        if (!deletedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        
        // Release the seats
        const seatsToRelease = deletedBooking.passengers.map(p => p.seat).filter(Boolean);
        if (seatsToRelease.length > 0) {
             await Train.findByIdAndUpdate(deletedBooking.train, {
                $pull: { bookedSeats: { $in: seatsToRelease } },
                $inc: { seatsAvailable: seatsToRelease.length }
            });
        }
        
        res.status(200).json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling booking', error });
    }
});


// --- Profile Routes ---
router.get('/profile', async (req, res) => {
    try {
        // Find the first profile (since we have no user auth)
        const profile = await UserProfile.findOne({});
        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
});

router.put('/profile', async (req, res) => {
    try {
        const updatedData = req.body;
        // In a real app, you'd find by user ID. Here we update the first one we find.
        const updatedProfile = await UserProfile.findOneAndUpdate({}, updatedData, { new: true, upsert: true });
        res.json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
});

module.exports = router;