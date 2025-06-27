
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
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  ← Back
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">🏢</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{wing.name}</h1>
                  <p className="text-sm text-gray-600">{wing.description}</p>
                </div>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              👥 {wing.availableSeats}/{wing.totalSeats} Available
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="available-seats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="available-seats" className="flex items-center space-x-2">
              <span>📅</span>
              <span>Available Seats</span>
            </TabsTrigger>
            <TabsTrigger value="employee-directory" className="flex items-center space-x-2">
              <span>👥</span>
              <span>Employee Directory</span>
            </TabsTrigger>
            <TabsTrigger value="wing-layout" className="flex items-center space-x-2">
              <span>🗺️</span>
              <span>Wing Layout</span>
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
