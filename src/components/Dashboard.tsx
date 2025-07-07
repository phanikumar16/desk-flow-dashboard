import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import StatusUpdateModal from './StatusUpdateModal';
import { supabase } from '../lib/supabaseClient';

function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showLeavesModal, setShowLeavesModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const [seatCounts, setSeatCounts] = useState({ atech: { total: 64, available: 0 }, bfinance: { total: 48, available: 0 } });
  const [todayStatus, setTodayStatus] = useState<string>('Present');
  const [userLeaves, setUserLeaves] = useState<any[]>([]);
  const { toast } = useToast();

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    if (data) {
      setCurrentUser(data);
      // Check today's status from user_leaves table
      await checkTodayStatus(data);
    }
  };

  const checkTodayStatus = async (userProfile: any) => {
    if (!userProfile?.seat_number) return;
    
    const today = new Date().toISOString().slice(0, 10);
    
    // Get seat_id from seats table using seat_number
    const { data: seatRow } = await supabase
      .from('seats')
      .select('id')
      .eq('seat_number', userProfile.seat_number)
      .single();
    
    if (seatRow?.id) {
      // Check if user has leave entry for today
      const { data: leaveData } = await supabase
        .from('user_leaves')
        .select('type')
        .eq('seat_id', seatRow.id)
        .eq('date', today)
        .single();
      
      if (leaveData) {
        setTodayStatus(leaveData.type);
      } else {
        setTodayStatus('Present');
      }
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    const fetchUserReservations = async () => {
      if (!currentUser) return;
      const { data } = await supabase.from('reservations').select('*').eq('user_id', currentUser.id);
      setUserReservations(data || []);
    };
    fetchUserReservations();
  }, [currentUser]);

  const fetchSeatCounts = async () => {
    const { data: seats } = await supabase.from('seats').select('*');
    const { data: reservations } = await supabase.from('reservations').select('*');
    const { data: userLeaves } = await supabase.from('user_leaves').select('*');
    
    if (seats && reservations && userLeaves) {
      const today = new Date().toISOString().slice(0, 10);
      const UNASSIGNED_SEATS = ['A01', 'A02', 'A49'];
      
      const atechSeats = seats.filter(seat => seat.wing === 'A-Tech');
      const reservedToday = reservations.filter(r => r.date === today && r.status === 'active');
      
      let availableAtech = 0;
      
      atechSeats.forEach(seat => {
        const isUnassigned = UNASSIGNED_SEATS.includes(seat.seat_number);
        const isReservedToday = reservedToday.some(r => r.seat_id === seat.id);
        
        if (isUnassigned && !isReservedToday) {
          availableAtech++;
        } else if (!isUnassigned) {
          const hasLeaveToday = userLeaves.some(l => l.seat_id == seat.id && l.date === today);
          if (hasLeaveToday && !isReservedToday) {
            availableAtech++;
          }
        }
      });
      
      setSeatCounts({
        atech: { total: 64, available: availableAtech },
        bfinance: { total: 48, available: Math.floor(Math.random() * 8) + 5 }
      });
    }
  };

  useEffect(() => {
    fetchSeatCounts();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate('/login');
  };

  const handleCancelReservation = async (reservationId: string) => {
    await supabase.from('reservations').delete().eq('id', reservationId);
    setUserReservations(userReservations.filter(r => r.id !== reservationId));
    toast({ title: 'Reservation cancelled', description: 'Your booking has been cancelled.' });
  };

  const handleStatusUpdated = () => {
    // Refresh user profile, seat counts, and user leaves after status update
    fetchProfile();
    fetchSeatCounts();
    fetchUserLeaves();
  };

  // Fetch user's leaves/WFH
  const fetchUserLeaves = async () => {
    if (!currentUser) return;
    // Get seat_id for this user
    const { data: seatRow } = await supabase
      .from('seats')
      .select('id, seat_number')
      .eq('seat_number', currentUser.seat_number)
      .single();
    if (!seatRow?.id) return;
    // Fetch all leaves for this seat (user)
    const { data: leaves } = await supabase
      .from('user_leaves')
      .select('id, date, type, seat_id')
      .eq('seat_id', seatRow.id)
      .order('date', { ascending: false });
    // Attach seat_number for display
    const leavesWithSeat = (leaves || []).map(l => ({ ...l, seat_number: seatRow.seat_number }));
    setUserLeaves(leavesWithSeat);
  };

  // Fetch user leaves when modal opens or user changes
  useEffect(() => {
    if (showLeavesModal && currentUser) {
      fetchUserLeaves();
    }
  }, [showLeavesModal, currentUser]);

  const handleCancelLeave = async (leaveId: string) => {
    const { error } = await supabase.from('user_leaves').delete().eq('id', leaveId);
    if (error) {
      toast({ title: 'Error', description: 'Failed to cancel leave/WFH.', variant: 'destructive' });
    } else {
      toast({ title: 'Cancelled', description: 'Leave/WFH entry cancelled.' });
      fetchUserLeaves();
    }
  };

  // Show loading while checking authentication
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100"
    >
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer space-x-2 bg-white/50 backdrop-blur-sm rounded-full px-3 py-2 hover:bg-white/70 transition-all">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10 ring-2 ring-white/50" style={{ backgroundColor: stringToColor((currentUser?.full_name || '') + (currentUser?.seat_number || '')) }}>
                      <AvatarFallback className="text-xs sm:text-sm text-white font-bold" style={{ backgroundColor: stringToColor((currentUser?.full_name || '') + (currentUser?.seat_number || '')) }}>
                        {getInitials(currentUser?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">{currentUser ? currentUser.full_name : 'Guest'}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/90 backdrop-blur-sm">
                  <DropdownMenuItem onClick={() => {}}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBookingsOpen(true)}>
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowLeavesModal(true)}>
                    My Leaves/WFH
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Greeting Card and Status */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 lg:p-8 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-gradient-to-r from-blue-400 to-purple-400" style={{ backgroundColor: stringToColor((currentUser?.full_name || '') + (currentUser?.seat_number || '')) }}>
                  <AvatarFallback className="text-lg sm:text-xl text-white font-bold" style={{ backgroundColor: stringToColor((currentUser?.full_name || '') + (currentUser?.seat_number || '')) }}>
                    {getInitials(currentUser?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 ${
                  todayStatus === 'Present' ? 'bg-green-500' : 
                  todayStatus === 'Leave' ? 'bg-red-500' : 
                  todayStatus === 'Work From Home' ? 'bg-yellow-500' : 'bg-green-500'
                } rounded-full border-2 border-white shadow-lg`}></div>
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  {getGreeting()}, {currentUser ? currentUser.full_name : 'Guest'}!
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 text-sm sm:text-base">
                  <span className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                    <span className="mr-2">👤</span>
                    {currentUser ? currentUser.full_name : 'Guest'}
                  </span>
                  <span className="flex items-center bg-purple-50 px-3 py-1 rounded-full">
                    <span className="mr-2">📍</span>
                    Seat {currentUser ? currentUser.seat_number : '-'}
                  </span>
                  <span className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                    <span className="mr-2">🏢</span>
                    {currentUser ? currentUser.cluster : '-'} Team
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="text-center">
                <span className="text-sm text-gray-500">Today's Status:</span>
                <Badge variant="outline" className={`ml-2 ${
                  todayStatus === 'Present' ? 'bg-green-100 text-green-800 border-green-200' :
                  todayStatus === 'Leave' ? 'bg-red-100 text-red-800 border-red-200' :
                  todayStatus === 'Work From Home' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                  'bg-green-100 text-green-800 border-green-200'
                }`}>
                  {todayStatus}
                </Badge>
              </div>
              <Button 
                onClick={() => setShowStatusModal(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-all"
              >
                ⚙️ Update Status
              </Button>
            </div>
          </div>
        </div>

        {/* Wings Section - Centered and Large */}
        <div className="flex flex-col items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Wing</h3>
          <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-8">
            <Link to="/wing/a-tech" className="group block w-full max-w-md transform hover:scale-105 transition-all duration-300">
              <div 
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border border-white/20 min-h-[270px] lg:min-h-[340px] flex flex-col justify-between"
              >
                <div className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-3xl font-bold mb-2">A Wing</h4>
                      <p className="text-white/90 text-lg">Tools and Technology</p>
                    </div>
                    <div className="text-4xl opacity-80 group-hover:opacity-100 transition-opacity group-hover:translate-x-2 transform transition-transform">
                      →
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-white/90 backdrop-blur-sm flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-semibold text-gray-800">📍 Wing Details</h5>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 font-semibold text-lg">
                      {seatCounts.atech.available}/{seatCounts.atech.total} Available
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Total Seats</span>
                      <span className="font-medium">{seatCounts.atech.total}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Available Now</span>
                      <span className="font-medium text-green-600">{seatCounts.atech.available}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(seatCounts.atech.available / seatCounts.atech.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/wing/b-finance" className="group block w-full max-w-md transform hover:scale-105 transition-all duration-300">
              <div 
                className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden border border-white/20 min-h-[270px] lg:min-h-[340px] flex flex-col justify-between"
              >
                <div className="bg-gradient-to-r from-green-500/90 to-blue-600/90 backdrop-blur-sm p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-3xl font-bold mb-2">B Wing</h4>
                      <p className="text-white/90 text-lg">Finance & Operations</p>
                    </div>
                    <div className="text-4xl opacity-80 group-hover:opacity-100 transition-opacity group-hover:translate-x-2 transform transition-transform">
                      →
                    </div>
                  </div>
                </div>
                <div className="p-8 bg-white/90 backdrop-blur-sm flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-xl font-semibold text-gray-800">📍 Wing Details</h5>
                    <Badge variant="outline" className="bg-green-50 text-green-700 font-semibold text-lg">
                      {seatCounts.bfinance.available}/{seatCounts.bfinance.total} Available
                    </Badge>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Total Seats</span>
                      <span className="font-medium">{seatCounts.bfinance.total}</span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Available Now</span>
                      <span className="font-medium text-green-600">{seatCounts.bfinance.available}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(seatCounts.bfinance.available / seatCounts.bfinance.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <StatusUpdateModal 
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentUser={{
          name: currentUser ? currentUser.full_name : 'Guest',
          seatNumber: currentUser ? currentUser.seat_number : '-',
          cluster: currentUser ? currentUser.cluster : '-',
          status: todayStatus,
        }}
        onStatusUpdated={handleStatusUpdated}
      />

      {/* My Leaves/WFH Modal */}
      <Dialog open={showLeavesModal} onOpenChange={setShowLeavesModal}>
        <DialogContent className="max-w-md mx-4 bg-white/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">My Leaves/WFH</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {userLeaves.length === 0 ? (
              <div className="text-gray-500 text-center">No leaves or WFH entries found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {userLeaves.map(l => (
                  <li key={l.id} className="py-2 flex items-center justify-between">
                    <span>
                      <span className={
                        l.type === 'Leave' ? 'text-red-600' : l.type === 'Work From Home' ? 'text-yellow-700' : 'text-gray-700'
                      }>
                        {l.type}
                      </span>
                      {` on ${l.date}`} (Seat {l.seat_number})
                    </span>
                    <button
                      className="ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                      onClick={() => handleCancelLeave(l.id)}
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* My Bookings Modal */}
      <Dialog open={bookingsOpen} onOpenChange={setBookingsOpen}>
        <DialogContent className="max-w-md mx-4 bg-white/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">My Bookings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {userReservations.length === 0 ? (
              <div className="text-gray-500 text-center">No bookings found.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {userReservations.map(res => (
                  <li key={res.id} className="py-2 flex items-center justify-between">
                    <span>Seat {res.seat_number || res.seat_id} on {res.date}</span>
                    <button
                      className="ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 transition-colors"
                      onClick={() => handleCancelReservation(res.id)}
                    >
                      Cancel
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
