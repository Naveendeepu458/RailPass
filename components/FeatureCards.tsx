import React from 'react';
import { TrainIcon } from './icons/TrainIcon';
import { ClockIcon } from './icons/ClockIcon';
import { LocationPinIcon } from './icons/LocationPinIcon';
import { Card } from './ui/Card';

const features = [
  {
    icon: <TrainIcon className="w-8 h-8 text-indigo-600" />,
    bgColor: 'bg-accent-blue-light',
    title: 'Easy Booking',
    description: 'Book your train tickets in just a few simple steps.',
  },
  {
    icon: <ClockIcon className="w-8 h-8 text-green-600" />,
    bgColor: 'bg-accent-green-light',
    title: 'Real-time Updates',
    description: 'Check live seat availability and book instantly.',
  },
  {
    icon: <LocationPinIcon className="w-8 h-8 text-purple-600" />,
    bgColor: 'bg-accent-purple-light',
    title: 'Wide Network',
    description: 'Access trains across multiple routes and destinations.',
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <section className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="text-center p-8 transition-transform transform hover:-translate-y-2">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ${feature.bgColor}`}>
              {feature.icon}
            </div>
            <h3 className="mt-6 text-xl font-bold text-brand-dark">{feature.title}</h3>
            <p className="mt-2 text-gray-600">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};
