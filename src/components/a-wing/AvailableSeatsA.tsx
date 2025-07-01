
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '../../lib/supabaseClient';
import { format, isWeekend } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface AvailableSeatsAProps {
  wingId: string;
}

const AvailableSeatsA: React.FC<AvailableSeatsAProps> = ({ wingId }) => {
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
    fetchAvailableSeats();
  }, [wingId]);

  const fetchUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(profile);
    }
  };

  const fetchAvailableSeats = async () => {
    try {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      
      // Skip weekends
      if (isWeekend(today)) {
        setAvailableSeats([]);
        setLoading(false);
        return;
      }

      // Get all seats for A-Tech wing
      const { data: seats } = await supabase
        .from('seats')
        .select('*')
        .eq('wing', 'A-Tech')
        .order('seat_number');

      // Get today's user leaves
      const { data: userLeaves } = await supabase
        .from('user_leaves')
        .select('*')
        .eq('date', todayStr);

      // Get today's reservations
      const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('date', todayStr)
        .eq('status', 'active');

      if (seats) {
        const UNASSIGNED_SEATS = ['A01', 'A02', 'A49'];
        const available = [];

        for (const seat of seats) {
          const isUnassigned = UNASSIGNED_SEATS.includes(seat.seat_number);
          
          if (isUnassigned) {
            // For unassigned seats, check if not reserved today
            const isReserved = reservations?.some(r => r.seat_id === seat.id);
            if (!isReserved) {
              available.push({
                ...seat,
                type: 'unassigned',
                team: 'Available Team'
              });
            }
          } else {
            // For assigned seats, check if user is on leave today
            const isOnLeave = userLeaves?.some(l => l.seat_id === seat.id);
            const isReserved = reservations?.some(r => r.seat_id === seat.id);
            
            if (isOnLeave && !isReserved) {
              available.push({
                ...seat,
                type: 'leave',
                team: 'Available Team'
              });
            }
          }
        }

        setAvailableSeats(available);
      }
    } catch (error) {
      console.error('Error fetching available seats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch available seats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (seatId: string) => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "Please log in to reserve a seat",
        variant: "destructive",
      });
      return;
    }

    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('reservations')
        .insert({
          user_id: userProfile.id,
          seat_id: seatId,
          date: today,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Seat reserved successfully!",
      });

      // Refresh available seats
      fetchAvailableSeats();
    } catch (error) {
      console.error('Error reserving seat:', error);
      toast({
        title: "Error",
        description: "Failed to reserve seat",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading available seats...</div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayStr = format(today, 'EEEE, MMMM dd, yyyy');

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6 rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-800">Available Seats</h2>
            <p className="text-gray-600">
              {availableSeats.length} seats available for booking in A-Tech
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Includes unassigned seats and seats where employees are on leave or working from home (weekdays only)
            </p>
          </div>
          <div className="text-right">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 shadow-sm">
              <div className="text-sm text-gray-600">📅 {todayStr}</div>
            </div>
          </div>
        </div>

        {isWeekend(today) ? (
          <div className="text-center py-12 bg-gray-50/80 backdrop-blur-sm rounded-2xl">
            <div className="text-6xl mb-4">🏖️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Weekend - Office Closed</h3>
            <p className="text-gray-600">Seat reservations are only available on weekdays</p>
          </div>
        ) : availableSeats.length === 0 ? (
          <div className="text-center py-12 bg-gray-50/80 backdrop-blur-sm rounded-2xl">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Available Seats</h3>
            <p className="text-gray-600">All seats are currently occupied or reserved for today</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSeats.map((seat) => (
              <div
                key={seat.id}
                className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {seat.seat_number}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Seat {seat.seat_number}</h3>
                      <p className="text-sm text-gray-600">{seat.team}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      seat.type === 'unassigned' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-orange-50 text-orange-700 border-orange-200'
                    }`}
                  >
                    {seat.type === 'unassigned' ? 'Unassigned' : 'Available'}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium">{seat.wing}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-green-600">
                      {seat.type === 'unassigned' ? 'Ready to book' : 'Employee on leave'}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleReserve(seat.id)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Reserve
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableSeatsA;
