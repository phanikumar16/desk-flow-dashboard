import React from 'react';
export default function AvailableSeatsB() {
  return (
    <div className="space-y-4 sm:space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-4 rounded-3xl">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Available Seats</h2>
        <p className="text-sm sm:text-base text-gray-600">0 seats available for booking in B-Finance</p>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Employee details and seat booking for B wing will be available soon.</p>
      </div>
      <div className="col-span-full text-center text-gray-500 py-8">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          No seats are currently available for booking.
        </div>
      </div>
    </div>
  );
} 