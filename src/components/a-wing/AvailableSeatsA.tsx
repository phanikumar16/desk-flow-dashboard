import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '../../lib/supabaseClient';
import { format, isWeekend, addDays } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface AvailableSeatsAProps {
  wingId: string;
}

const AvailableSeatsA: React.FC<AvailableSeatsAProps> = ({ wingId }) => {
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();

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
      
      // Skip weekends
      if (isWeekend(today)) {
        setAvailableSeats([]);
        setLoading(false);
        return;
      }

      console.log('Fetching available seats...');

      // Get all seats for A-Tech wing
      const { data: seats } = await supabase
        .from('seats')
        .select('*')
        .eq('wing', 'A-Tech')
        .order('seat_number');

      // Get current user leaves for assigned seats
      const { data: userLeaves } = await supabase
        .from('user_leaves')
        .select('*')
        .gte('date', format(today, 'yyyy-MM-dd'));

      // Get all reservations
      const { data: reservations } = await supabase
        .from('reservations')
        .select('*')
        .eq('status', 'active')
        .gte('date', format(today, 'yyyy-MM-dd'));

      console.log('Fetched data:', { seats, userLeaves, reservations });

      if (seats) {
        const UNASSIGNED_SEATS = ['A01', 'A02'];
        const available = [];

        for (const seat of seats) {
          const isUnassigned = UNASSIGNED_SEATS.includes(seat.seat_number);
          
          if (isUnassigned) {
            // For unassigned seats, show for all weekdays (next 30 days)
            const availableDates = [];
            for (let i = 0; i < 30; i++) {
              const checkDate = addDays(today, i);
              if (!isWeekend(checkDate)) {
                const dateStr = format(checkDate, 'yyyy-MM-dd');
                // Check if this seat is not reserved on this date
                const isReserved = reservations?.some(r => 
                  r.seat_id === seat.id && r.date === dateStr
                );
                if (!isReserved) {
                  availableDates.push(dateStr);
                }
              }
            }

            // Add seat if it has any available dates
            if (availableDates.length > 0) {
              available.push({
                ...seat,
                type: 'unassigned',
                team: 'Available Team',
                availableDates
              });
            }
          } else {
            // Debug: log seat and user seat number before ownership check
            console.log('Comparing seat:', seat.seat_number, 'with user seat:', userProfile?.seat_number);
            if (
              userProfile &&
              seat.seat_number.trim().toLowerCase() === String(userProfile.seat_number).trim().toLowerCase()
            ) continue;

            // For assigned seats, check if user is on leave or WFH
            const seatLeaves = userLeaves?.filter(l => 
              String(l.seat_id) === String(seat.id) && 
              (l.type === 'Leave' || l.type === 'Work From Home')
            ) || [];
            
            const availableDates = [];
            for (const leave of seatLeaves) {
              const leaveDate = typeof leave.date === 'string' ? leave.date.slice(0, 10) : format(new Date(leave.date), 'yyyy-MM-dd');
              // Only add if not reserved and not weekend
              if (!isWeekend(new Date(leaveDate))) {
                const isReserved = reservations?.some(r => 
                  String(r.seat_id) === String(seat.id) && r.date === leaveDate
                );
                if (!isReserved) {
                  availableDates.push(leaveDate);
                }
              }
            }
            if (availableDates.length > 0) {
              available.push({
                ...seat,
                type: 'leave',
                team: 'Available Team',
                availableDates
              });
            }
          }
        }

        console.log('Available seats:', available);
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

  useEffect(() => {
    fetchUserProfile();
  }, [wingId]);

  useEffect(() => {
    if (userProfile) {
      fetchAvailableSeats();
    }
  }, [wingId, userProfile]);

  // Set up real-time subscriptions
  useEffect(() => {
    const leavesSubscription = supabase
      .channel('leaves-changes-available')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_leaves' }, () => {
        console.log('User leaves changed, refetching available seats');
        fetchAvailableSeats();
      })
      .subscribe();

    const reservationsSubscription = supabase
      .channel('reservations-changes-available')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        console.log('Reservations changed, refetching available seats');
        fetchAvailableSeats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(leavesSubscription);
      supabase.removeChannel(reservationsSubscription);
    };
  }, [wingId]);

  const handleReserve = async (seatId: string, selectedDates: string[]) => {
    if (!userProfile) {
      toast({
        title: "Error",
        description: "Please log in to reserve a seat",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert reservations for selected dates
      const reservationPromises = selectedDates.map(date => 
        supabase.from('reservations').insert({
          user_id: userProfile.id,
          seat_id: seatId,
          date: date,
          status: 'active'
        })
      );

      const results = await Promise.all(reservationPromises);
      
      // Check if any insertions failed
      const hasErrors = results.some(result => result.error);
      
      if (hasErrors) {
        throw new Error('Some reservations failed');
      }

      toast({
        title: "Success",
        description: `Seat reserved successfully for ${selectedDates.length} date(s)!`,
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
              Includes unassigned seats (available all weekdays) and seats where employees are on leave or working from home
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
            <p className="text-gray-600">All seats are currently occupied or reserved</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSeats.map((seat) => (
              <SeatCard 
                key={seat.id} 
                seat={seat} 
                onReserve={handleReserve}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Separate component for seat card to handle date selection
const SeatCard: React.FC<{ seat: any; onReserve: (seatId: string, dates: string[]) => void }> = ({ seat, onReserve }) => {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [showDateSelection, setShowDateSelection] = useState(false);

  const handleDateToggle = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleReserve = () => {
    if (selectedDates.length > 0) {
      onReserve(seat.id, selectedDates);
      setSelectedDates([]);
      setShowDateSelection(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
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
          <span className="text-gray-500">Available Dates</span>
          <span className="font-medium text-green-600">{seat.availableDates.length} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Status</span>
          <span className="font-medium text-green-600">
            {seat.type === 'unassigned' ? 'Ready to book' : 'Employee on leave'}
          </span>
        </div>
      </div>

      {!showDateSelection ? (
        <Button 
          onClick={() => setShowDateSelection(true)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Select Dates
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-700">Select dates to reserve:</div>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {seat.availableDates.map((date: string) => (
              <label key={date} className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded">
                <input
                  type="checkbox"
                  checked={selectedDates.includes(date)}
                  onChange={() => handleDateToggle(date)}
                  className="rounded"
                />
                <span className="text-sm">{format(new Date(date), 'EEEE, MMM dd, yyyy')}</span>
              </label>
            ))}
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => {
                setShowDateSelection(false);
                setSelectedDates([]);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleReserve}
              disabled={selectedDates.length === 0}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Reserve ({selectedDates.length})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableSeatsA;
