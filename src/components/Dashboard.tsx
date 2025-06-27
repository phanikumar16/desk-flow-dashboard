
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StatusUpdateModal from './StatusUpdateModal';

const Dashboard = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  
  // Mock current user data - in real app would come from auth
  const currentUser = {
    name: "Farhan Akthar",
    seatNumber: "A03",
    cluster: "Cloud Eng",
    status: "Present"
  };

  const wings = [
    {
      id: 'a-tech',
      name: 'A-Tech',
      description: 'Technology & Development Teams',
      totalSeats: 64,
      availableSeats: 5,
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      id: 'b-finance',
      name: 'B-Finance',
      description: 'Finance & Operations Teams',
      totalSeats: 48,
      availableSeats: 8,
      gradient: 'from-green-500 to-blue-600'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏢</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">DeskSpace</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>FA</AvatarFallback>
              </Avatar>
              <span className="text-gray-700 font-medium">{currentUser.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Greeting Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="text-xl">FA</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {getGreeting()}, {currentUser.name}!
                </h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center">
                    <span className="mr-2">👤</span>
                    {currentUser.name}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">📍</span>
                    Seat {currentUser.seatNumber}
                  </span>
                  <span className="flex items-center">
                    <span className="mr-2">🏢</span>
                    {currentUser.cluster} Team
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-4">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
                  {currentUser.status}
                </Badge>
              </div>
              <Button 
                onClick={() => setShowStatusModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                ⚙️ Update Status
              </Button>
            </div>
          </div>
        </div>

        {/* Wings Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          {wings.map((wing) => (
            <Link key={wing.id} to={`/wing/${wing.id}`} className="group block">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
                {/* Wing Header Card */}
                <div className={`bg-gradient-to-r ${wing.gradient} p-8 text-white`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-3xl font-bold mb-2">{wing.name}</h3>
                      <p className="text-white/90">{wing.description}</p>
                    </div>
                    <div className="text-4xl opacity-80 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </div>

                {/* Wing Stats */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">📍 Wing Details</h4>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {wing.availableSeats}/{wing.totalSeats} Available
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Seats</span>
                      <span className="font-medium">{wing.totalSeats}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available Now</span>
                      <span className="font-medium text-green-600">{wing.availableSeats}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                        style={{ width: `${(wing.availableSeats / wing.totalSeats) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <span className="text-gray-600 font-medium">
                      Explore {wing.name} →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <StatusUpdateModal 
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Dashboard;
