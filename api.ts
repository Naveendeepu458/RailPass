
import type { Booking, Train, UserProfile } from './types';

const API_BASE_URL = 'http://localhost:5000/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
}

export async function searchTrains(params: { from: string; to: string; date: string }): Promise<Train[]> {
    const query = new URLSearchParams(params as any).toString();
    const response = await fetch(`${API_BASE_URL}/trains?${query}`);
    return handleResponse<Train[]>(response);
}

export async function getBookings(): Promise<Booking[]> {
    const response = await fetch(`${API_BASE_URL}/bookings`);
    return handleResponse<Booking[]>(response);
}

export async function createBooking(bookingData: Omit<Booking, 'id' | 'bookingDate'>): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
    });
    return handleResponse<Booking>(response);
}

export async function cancelBooking(bookingId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
    });
    await handleResponse(response);
}

export async function getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile`);
    return handleResponse<UserProfile>(response);
}

export async function updateProfile(profileData: UserProfile): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
    return handleResponse<UserProfile>(response);
}
