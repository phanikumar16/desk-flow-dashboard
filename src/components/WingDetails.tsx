import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailableSeats from './AvailableSeats';
import EmployeeDirectory from './EmployeeDirectory';
import WingLayout from './WingLayout';

const WingDetails = () => {
  const { wingId } = useParams();
  
  const wingData = {
    'a-tech': {
      name: 'A-Tech',
      description: 'Technology & Development Teams',
      totalSeats: 64,
      availableSeats: 5
    },
    'b-finance': {
      name: 'B-Finance', 
      description: 'Finance & Operations Teams',
      totalSeats: 48,
      availableSeats: 8
    }
  };

  const wing = wingData[wingId as keyof typeof wingData];

  if (!wing) {
    return <div>Wing not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm sm:text-lg">🏢</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">DeskSpace</h1>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Wing Header */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{wing.name}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-0">{wing.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{wing.totalSeats}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Seats</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{wing.availableSeats}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="available-seats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-auto sm:h-10">
            <TabsTrigger value="available-seats" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2 sm:py-0">
              <span>📅</span>
              <span className="hidden sm:inline">Available Seats</span>
              <span className="sm:hidden">Seats</span>
            </TabsTrigger>
            <TabsTrigger value="employee-directory" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2 sm:py-0">
              <span>👥</span>
              <span className="hidden sm:inline">Employee Directory</span>
              <span className="sm:hidden">Directory</span>
            </TabsTrigger>
            <TabsTrigger value="wing-layout" className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm py-2 sm:py-0">
              <span>🗺️</span>
              <span className="hidden sm:inline">Wing Layout</span>
              <span className="sm:hidden">Layout</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available-seats">
            <AvailableSeats wingId={wingId} />
          </TabsContent>
          
          <TabsContent value="employee-directory">
            <EmployeeDirectory wingId={wingId} />
          </TabsContent>
          
          <TabsContent value="wing-layout">
            <WingLayout wingId={wingId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WingDetails;
