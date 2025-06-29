import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format, isWeekend } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

interface AvailableSeatsProps {
  wingId: string | undefined;
}

const AvailableSeats: React.FC<AvailableSeatsProps> = ({ wingId }) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  const [availableSeats, setAvailableSeats] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [bookingSeat, setBookingSeat] = useState<any | null>(null);
  const [bookingDates, setBookingDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userLeaves, setUserLeaves] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSeat, setModalSeat] = useState<any>(null);
  const [modalDates, setModalDates] = useState<Date[]>([]);
  const { toast } = useToast();

  const fetchReservations = async () => {
    const { data } = await supabase.from('reservations').select('*');
    setReservations(data || []);
  };

  useEffect(() => {
    // Fetch seats from Supabase
    const fetchSeats = async () => {
      const { data, error } = await supabase
        .from('seats')
        .select('*');
      if (!error && data) {
        setAvailableSeats(data);
      }
    };
    fetchSeats();

    // Fetch available users from Supabase
    const fetchAvailableUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*'); // No filter for debugging
      console.log('SUPABASE PROFILES DATA:', data);
      console.log('SUPABASE PROFILES ERROR:', error);
      if (!error && data) {
        setAvailableUsers(data);
      }
    };
    fetchAvailableUsers();

    // Get current user id
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });

    // Fetch user_leaves
    const fetchUserLeaves = async () => {
      const { data, error } = await supabase.from('user_leaves').select('*');
      if (!error && data) setUserLeaves(data);
    };
    fetchUserLeaves();

    // Subscribe to real-time changes in profiles
    const subscription = supabase
      .channel('public:profiles')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchAvailableUsers();
      })
      .subscribe();

    // Subscribe to reservation changes
    const subscriptionReservations = supabase
      .channel('public:reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, fetchReservations)
      .subscribe();

    // Subscribe to user_leaves changes
    const subscriptionLeaves = supabase
      .channel('public:user_leaves')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_leaves' }, fetchUserLeaves)
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
      supabase.removeChannel(subscriptionReservations);
      supabase.removeChannel(subscriptionLeaves);
    };
  }, []);

  const handleSeatSelect = (seatId: string) => {
    setSelectedSeat(seatId);
    setReservationDialogOpen(true);
    setSelectedDates([]);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    const dateExists = selectedDates.some(d => d.getTime() === date.getTime());
    if (dateExists) {
      setSelectedDates(selectedDates.filter(d => d.getTime() !== date.getTime()));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handleConfirmReservation = async () => {
    if (selectedSeat && selectedDates.length > 0) {
      // Send update to backend
      await fetch(`http://localhost:4000/api/seats/${selectedSeat}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occupied: true })
      });
      setReservationDialogOpen(false);
      setSelectedSeat(null);
      setSelectedDates([]);
    }
  };

  const getSeatStatusColor = (status: string | undefined) => {
    if (!status) return 'bg-gray-400';
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-500';
      case 'reserved':
        return 'bg-yellow-500';
      case 'on leave':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getSeatStatusBadge = (status: string | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    switch (status.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'on leave':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const today = new Date();
  const currentDateString = format(today, 'EEEE, dd/MM/yyyy');

  console.log('EMPLOYEES:', availableSeats);

  // Utility to generate a unique color for each seat (by id or cluster)
  function getColorFromString(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 60%)`;
  }

  // Helper: get reserved dates for a seat
  function getReservedDates(seatId: string) {
    return reservations.filter(r => r.seat_id === seatId && r.status === 'active').map(r => r.date);
  }
  // Helper: get reservations for this user
  function getUserReservations(seatId: string) {
    return reservations.filter(r => r.seat_id === seatId && r.user_id === userId && r.status === 'active');
  }

  // Helper: get available (leave) dates for a seat
  function getAvailableDatesForSeat(seatId: any) {
    return userLeaves.filter(l => l.seat_id == seatId).map(l => l.date);
  }

  // Booking handler
  async function handleBook(seat: any, dates: Date[]) {
    setLoading(true);
    for (const date of dates) {
      // Only book if not already reserved
      const already = reservations.find(r => r.seat_id === seat.id && r.date === format(date, 'yyyy-MM-dd') && r.status === 'active');
      if (!already) {
        await supabase.from('reservations').insert({ seat_id: seat.id, user_id: userId, date: format(date, 'yyyy-MM-dd') });
      }
    }
    setLoading(false);
    setBookingSeat(null);
    setBookingDates([]);
  }
  // Unbooking handler
  async function handleUnbook(seat: any, date: string) {
    setLoading(true);
    await supabase.from('reservations').delete().match({ seat_id: seat.id, user_id: userId, date });
    setLoading(false);
  }

  // Always include unassigned seats as available
  const UNASSIGNED_SEATS = ['A01', 'A02', 'A49'];
  const alwaysAvailableSeats = availableSeats.filter(seat => {
    if (!UNASSIGNED_SEATS.includes(seat.seat_number)) return false;
    // Generate next 30 days (or as needed)
    const days = Array.from({length: 30}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return d;
    });
    const reservedDates = reservations.filter(r => r.seat_id === seat.id && r.status === 'active').map(r => typeof r.date === 'string' ? r.date.slice(0, 10) : format(new Date(r.date), 'yyyy-MM-dd'));
    const availableDays = days.filter(d => {
      const dateStr = format(d, 'yyyy-MM-dd');
      return !isWeekend(d) && d >= new Date() && !reservedDates.includes(dateStr);
    });
    return availableDays.length > 0;
  });

  // For assigned seats, only show if there are future leave/WFH dates that are not fully reserved
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const assignedAvailableSeats = availableSeats.filter(seat => {
    if (UNASSIGNED_SEATS.includes(seat.seat_number)) return false;
    const leaveDates = userLeaves.filter(l => l.seat_id == seat.id).map(l => typeof l.date === 'string' ? l.date.slice(0, 10) : format(new Date(l.date), 'yyyy-MM-dd'));
    const futureLeaveDates = leaveDates.filter(d => d >= todayStr);
    const reservedDates = reservations.filter(r => r.seat_id === seat.id && r.status === 'active').map(r => typeof r.date === 'string' ? r.date.slice(0, 10) : format(new Date(r.date), 'yyyy-MM-dd'));
    const availableDates = futureLeaveDates.filter(d => !reservedDates.includes(d));
    return availableDates.length > 0;
  });

  // Combine unassigned and assigned available seats
  const displayedSeats = [
    ...alwaysAvailableSeats,
    ...assignedAvailableSeats
  ];

  console.log('displayedSeats:', displayedSeats);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Available Seats</h2>
            <p className="text-sm sm:text-base text-gray-600">{availableSeats.length} seats available for booking in A-Tech</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Includes unassigned seats and seats where employees are on leave or working from home
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
              <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Today, {currentDateString}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedSeats.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No users are currently present.
          </div>
        )}
        {displayedSeats.map((seat) => {
          const isUnassigned = UNASSIGNED_SEATS.includes(seat.seat_number);
          // Find available dates for assigned seats
          let availableDates: string[] = [];
          if (!isUnassigned) {
            const todayStr = format(new Date(), 'yyyy-MM-dd');
            const leaveDates = userLeaves.filter(l => l.seat_id == seat.id).map(l => typeof l.date === 'string' ? l.date.slice(0, 10) : format(new Date(l.date), 'yyyy-MM-dd'));
            const futureLeaveDates = leaveDates.filter(d => d >= todayStr);
            const reservedDates = reservations.filter(r => r.seat_id === seat.id && r.status === 'active').map(r => typeof r.date === 'string' ? r.date.slice(0, 10) : format(new Date(r.date), 'yyyy-MM-dd'));
            availableDates = futureLeaveDates.filter(d => !reservedDates.includes(d));
          }
          return (
            <div key={seat.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start space-y-2 border border-gray-100">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {seat.seat_number}
                </div>
                <div>
                  <div className="font-bold text-lg text-gray-900">Seat {seat.seat_number}</div>
                  <div className="text-xs text-gray-500">{seat.cluster} Team</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-gray-700 font-medium">{seat.location}</span>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
                onClick={async () => {
                  await fetchReservations(); // Ensure reservations are up-to-date
                  setModalSeat(seat);
                  setModalDates([]);
                  setModalOpen(true);
                }}
              >
                Reserve
              </button>
            </div>
          );
        })}
      </div>

      {/* Reservation Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) {
          setModalSeat(null);
          setModalDates([]);
        }
      }}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Reserve Seat {modalSeat?.seat_number}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select dates for reservation:
              </label>
              {/* List available dates instead of calendar */}
              {modalSeat && (() => {
                const isUnassigned = UNASSIGNED_SEATS.includes(modalSeat.seat_number);
                const today = new Date();
                const days = Array.from({length: 30}, (_, i) => {
                  const d = new Date();
                  d.setDate(today.getDate() + i);
                  return d;
                });
                const reservedDates = reservations
                  .filter(r => String(r.seat_id) === String(modalSeat.id) && r.status === 'active')
                  .map(r => typeof r.date === 'string' ? r.date.slice(0, 10) : format(new Date(r.date), 'yyyy-MM-dd'));
                // Debug logging
                console.log('modalSeat.id', modalSeat.id);
                console.log('reservedDates', reservedDates);
                console.log('reservations for seat', reservations.filter(r => String(r.seat_id) === String(modalSeat.id)));
                let availableDates: string[] = [];
                if (isUnassigned) {
                  availableDates = days
                    .filter(d => !isWeekend(d) && d >= today && !reservedDates.includes(format(d, 'yyyy-MM-dd')))
                    .map(d => format(d, 'yyyy-MM-dd'));
                } else {
                  const todayStr = format(today, 'yyyy-MM-dd');
                  const leaveDates = userLeaves.filter(l => l.seat_id == modalSeat.id).map(l => typeof l.date === 'string' ? l.date.slice(0, 10) : format(new Date(l.date), 'yyyy-MM-dd'));
                  const futureLeaveDates = leaveDates.filter(d => d >= todayStr);
                  availableDates = futureLeaveDates.filter(d => !reservedDates.includes(d));
                }
                if (availableDates.length === 0) {
                  return <div className="text-gray-500">No available dates for this seat.</div>;
                }
                return (
                  <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                    {availableDates.map(dateStr => (
                      <label key={dateStr} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={modalDates.some(d => format(d, 'yyyy-MM-dd') === dateStr)}
                          onChange={e => {
                            if (e.target.checked) {
                              setModalDates([...modalDates, new Date(dateStr)]);
                            } else {
                              setModalDates(modalDates.filter(d => format(d, 'yyyy-MM-dd') !== dateStr));
                            }
                          }}
                        />
                        <span>{format(new Date(dateStr), 'EEEE, MMMM dd, yyyy')}</span>
                      </label>
                    ))}
                  </div>
                );
              })()}
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!modalSeat || !userId || modalDates.length === 0) return;
                  let success = true;
                  let errorMsg = '';
                  for (const date of modalDates) {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    // Prevent booking if already reserved for this seat/date (by anyone, legacy or new)
                    const alreadyReserved = reservations.some(
                      r => String(r.seat_id) === String(modalSeat.id) && r.date === dateStr
                    );
                    if (alreadyReserved) {
                      success = false;
                      errorMsg = `This seat is already booked for ${dateStr}.`;
                      break;
                    }
                    const { error } = await supabase.from('reservations').insert({ seat_id: modalSeat.id, user_id: userId, date: dateStr });
                    if (error) {
                      success = false;
                      errorMsg = error.message;
                      break;
                    }
                  }
                  setModalOpen(false);
                  if (success) {
                    await fetchReservations();
                    toast({ title: 'Reservation successful!', description: 'Your seat has been reserved.' });
                  } else {
                    let userMessage = errorMsg;
                    if (errorMsg && (errorMsg.includes('unique_seat_date') || errorMsg.includes('unique_seat_user_date'))) {
                      userMessage = 'This seat is already booked for the selected date by another user.';
                    }
                    toast({ title: 'Reservation failed', description: userMessage || 'Could not reserve the seat.' });
                  }
                }}
                disabled={modalDates.length === 0}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Confirm Reservation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvailableSeats;
