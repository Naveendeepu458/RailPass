import React, { useState } from 'react';
import type { UserProfile } from '../types';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ProfileProps {
    profile: UserProfile;
    onUpdate: (profile: UserProfile) => void;
}

export const Profile: React.FC<ProfileProps> = ({ profile, onUpdate }) => {
    const [formData, setFormData] = useState<UserProfile>(profile);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(formData);
    };

    return (
        <Card>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Your Profile</h2>
                <p className="text-gray-600 mb-6">Manage and maintain your user data, including personal profiles, booking history, and passenger information.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Full Name" id="name" value={formData.name} onChange={handleChange} />
                    <Input label="Email Address" id="email" type="email" value={formData.email} onChange={handleChange} />
                    <Input label="Phone Number" id="phone" type="tel" value={formData.phone} onChange={handleChange} />
                    <Input label="Address" id="address" value={formData.address} onChange={handleChange} />
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Update Profile</Button>
                    </div>
                </form>
            </div>
        </Card>
    );
};
