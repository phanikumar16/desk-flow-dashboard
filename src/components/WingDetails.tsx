import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AvailableSeats from './AvailableSeats';
import EmployeeDirectory from './EmployeeDirectory';
import WingLayout from './WingLayout';
import { supabase } from '../lib/supabaseClient';
import { format, isWeekend } from 'date-fns';
import AvailableSeatsA from './a-wing/AvailableSeatsA';
import AvailableSeatsB from './b-wing/AvailableSeatsB';

const WingDetails = () => {
  const { wingId } = useParams();
  const [availableSeatsCount, setAvailableSeatsCount] = useState(0);
  const [totalSeatsCount, setTotalSeatsCount] = useState(0);
  
  const wingData = {
    'a-tech': {
      name: 'A-Tech',
      description: 'Technology & Development Teams'
    },
    'b-finance': {
      name: 'B-Finance', 
      description: 'Finance & Operations Teams'
    }
  };

  const wing = wingData[wingId as keyof typeof wingData];

  useEffect(() => {
    const fetchSeatCounts = async () => {
      if (wingId === 'b-finance') {
        setTotalSeatsCount(48);
        setAvailableSeatsCount(0);
        return;
      }
      const { data: seats, error } = await supabase
        .from('seats')
        .select('*');
      
      if (!error && seats) {
        // Filter seats for this wing (assuming wing prefix in seat number)
        const wingSeats = seats.filter(seat => 
          seat.seat_number.startsWith(wingId === 'a-tech' ? 'A' : 'B')
        );
        
        // Set total seats to 64 for A-Tech wing
        if (wingId === 'a-tech') {
          setTotalSeatsCount(64);
        } else {
          setTotalSeatsCount(wingSeats.length);
        }

        // Calculate available seats
        const { data: reservations } = await supabase
          .from('reservations')
          .select('*')
          .eq('status', 'active');

        const { data: userLeaves } = await supabase
          .from('user_leaves')
          .select('*');

        const today = new Date();
        const todayStr = format(today, 'yyyy-MM-dd');
        const UNASSIGNED_SEATS = ['A01', 'A02', 'A49'];

        let availableCount = 0;

        // For A-Tech wing, calculate available seats properly
        if (wingId === 'a-tech') {
          // Count unassigned seats that are not reserved today
          const unassignedAvailable = UNASSIGNED_SEATS.filter(seatNumber => {
            const seat = wingSeats.find(s => s.seat_number === seatNumber);
            if (!seat) return false;
            
            const reservedToday = reservations?.some(r => 
              r.seat_id === seat.id && r.date === todayStr
            );
            return !reservedToday;
          }).length;

          // Count assigned seats where employee is on leave today
          const assignedAvailable = wingSeats.filter(seat => {
            if (UNASSIGNED_SEATS.includes(seat.seat_number)) return false;
            
            const onLeaveToday = userLeaves?.some(l => 
              l.seat_id == seat.id && l.date === todayStr
            );
            const reservedToday = reservations?.some(r => 
              r.seat_id === seat.id && r.date === todayStr
            );
            return onLeaveToday && !reservedToday;
          }).length;

          availableCount = unassignedAvailable + assignedAvailable;
        } else {
          // For other wings, use the existing logic
          wingSeats.forEach(seat => {
            const isUnassigned = UNASSIGNED_SEATS.includes(seat.seat_number);
            
            if (isUnassigned) {
              // Check if seat is not reserved today
              const reservedToday = reservations?.some(r => 
                r.seat_id === seat.id && r.date === todayStr
              );
              if (!reservedToday) {
                availableCount++;
              }
            } else {
              // Check if assigned employee is on leave today
              const onLeaveToday = userLeaves?.some(l => 
                l.seat_id == seat.id && l.date === todayStr
              );
              const reservedToday = reservations?.some(r => 
                r.seat_id === seat.id && r.date === todayStr
              );
              if (onLeaveToday && !reservedToday) {
                availableCount++;
              }
            }
          });
        }

        setAvailableSeatsCount(availableCount);
      }
    };

    fetchSeatCounts();
  }, [wingId]);

  // Force 0 available seats for B-Finance
  const displayAvailableSeatsCount = wingId === 'b-finance' ? 0 : availableSeatsCount;
  const displayTotalSeatsCount = wingId === 'b-finance' ? 48 : totalSeatsCount;

  if (!wing) {
    return <div>Wing not found</div>;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100"
    >
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-500 to-black rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xs sm:text-sm">C</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold">
                <span className="text-pink-500">c</span>
                <span className="text-black">prime</span>
              </h1>
            </div>
            <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-white/90 transition-all border border-blue-200/50 shadow-sm">
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Wing Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">{wing.name}</h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-0">{wing.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-4">
                <div className="text-center bg-blue-50 p-3 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{wingId === 'b-finance' ? 48 : totalSeatsCount}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Total Seats</div>
                </div>
                <div className="text-center bg-green-50 p-3 rounded-xl">
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">{wingId === 'b-finance' ? 0 : availableSeatsCount}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Available</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                  {wingId === 'b-finance' ? '0/48 Available' : `${availableSeatsCount}/${totalSeatsCount} Available`}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="available-seats" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-16 sm:h-20 bg-white/80 backdrop-blur-md border-2 border-blue-200/50 shadow-xl rounded-2xl p-2">
            <TabsTrigger value="available-seats" className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-4 sm:px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/70 transition-all rounded-xl font-semibold">
              <span className="text-lg sm:text-xl">📅</span>
              <span className="hidden sm:inline">Available Seats</span>
              <span className="sm:hidden">Seats</span>
            </TabsTrigger>
            <TabsTrigger value="employee-directory" className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-4 sm:px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/70 transition-all rounded-xl font-semibold">
              <span className="text-lg sm:text-xl">👥</span>
              <span className="hidden sm:inline">Employee Directory</span>
              <span className="sm:hidden">Directory</span>
            </TabsTrigger>
            <TabsTrigger value="wing-layout" className="flex items-center space-x-2 text-sm sm:text-base lg:text-lg py-3 sm:py-4 px-4 sm:px-6 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-white/70 transition-all rounded-xl font-semibold">
              <span className="text-lg sm:text-xl">🗺️</span>
              <span className="hidden sm:inline">Wing Layout</span>
              <span className="sm:hidden">Layout</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available-seats">
            {wingId === 'a-tech' && <AvailableSeatsA wingId={wingId} />}
            {wingId === 'b-finance' && <AvailableSeatsB />}
          </TabsContent>
          
          <TabsContent value="employee-directory">
            {wingId === 'b-finance' && (
              <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded">
                B wing employee details are not available. This feature is temporarily not working.
              </div>
            )}
            <EmployeeDirectory wingId={wingId} />
          </TabsContent>
          
          <TabsContent value="wing-layout">
            <WingLayout wingId={wingId} />
          </TabsContent>
        </Tabs>

        {/* Progress Bar for Available Seats */}
        <div className="mt-4">
          {wingId === 'b-finance' ? (
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-green-400 rounded-full" style={{ width: '0%' }}></div>
            </div>
          ) : (
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-3 bg-green-400 rounded-full" style={{ width: `${Math.round((availableSeatsCount / totalSeatsCount) * 100)}%` }}></div>
            </div>
          )}
        </div>
        {/* Available Now for B-Finance */}
        {wingId === 'b-finance' && (
          <div className="mt-2 flex justify-between">
            <span className="text-gray-600">Available Now</span>
            <span className="text-green-600 font-bold">0</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WingDetails;
