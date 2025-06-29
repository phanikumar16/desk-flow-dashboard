import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import StatusUpdateModal from './StatusUpdateModal';
import { supabase } from '../lib/supabaseClient';

const Dashboard = () => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [userReservations, setUserReservations] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setCurrentUser(data);
      } else {
        setCurrentUser(null);
      }
    };
    fetchProfile();
  }, []);

  // Fetch user reservations
  useEffect(() => {
    const fetchUserReservations = async () => {
      if (!currentUser) return;
      const { data } = await supabase.from('reservations').select('*').eq('user_id', currentUser.id);
      setUserReservations(data || []);
    };
    fetchUserReservations();
  }, [currentUser]);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    window.location.href = '/login';
  };

  const handleCancelReservation = async (reservationId: string) => {
    await supabase.from('reservations').delete().eq('id', reservationId);
    setUserReservations(userReservations.filter(r => r.id !== reservationId));
    toast({ title: 'Reservation cancelled', description: 'Your booking has been cancelled.' });
  };

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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center cursor-pointer space-x-2">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-xs sm:text-sm">
                        {currentUser && currentUser.full_name ? currentUser.full_name[0] : '?'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-700 font-medium text-sm sm:text-base">{currentUser ? currentUser.full_name : 'Guest'}</span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {}}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setBookingsOpen(true)}>
                    My Bookings
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

      {/* User Greeting Card */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-lg sm:text-xl">
                  {currentUser && currentUser.full_name ? currentUser.full_name[0] : '?'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {currentUser ? currentUser.full_name : 'Guest'}!
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-600 text-sm sm:text-base">
                <span className="flex items-center">
                  <span className="mr-2">👤</span>
                  {currentUser ? currentUser.full_name : 'Guest'}
                </span>
                <span className="flex items-center">
                  <span className="mr-2">📍</span>
                  Seat {currentUser ? currentUser.seat_number : '-'}
                </span>
                <span className="flex items-center">
                  <span className="mr-2">🏢</span>
                  {currentUser ? currentUser.cluster : '-'} Team
                </span>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <span className="text-sm text-gray-500">Status:</span>
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">
              {currentUser && currentUser.status ? currentUser.status : 'Present'}
            </Badge>
          </div>
          <Button 
            onClick={() => setShowStatusModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full sm:w-auto"
          >
            ⚙️ Update Status
          </Button>
        </div>
      </div>

      {/* Wings Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {wings.map((wing) => (
          <Link key={wing.id} to={`/wing/${wing.id}`} className="group block">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden">
              {/* Wing Header Card */}
              <div className={`bg-gradient-to-r ${wing.gradient} p-4 sm:p-6 lg:p-8 text-white`}>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">{wing.name}</h3>
                    <p className="text-white/90 text-sm sm:text-base">{wing.description}</p>
                  </div>
                  <div className="text-2xl sm:text-4xl opacity-80 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </div>
              {/* Wing Stats */}
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800">📍 Wing Details</h4>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs sm:text-sm">
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
                  <span className="text-gray-600 font-medium text-sm sm:text-base">
                    Explore {wing.name} →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <StatusUpdateModal 
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        currentUser={{
          name: currentUser ? currentUser.full_name : 'Guest',
          seatNumber: currentUser ? currentUser.seat_number : '-',
          cluster: currentUser ? currentUser.cluster : '-',
          status: currentUser && currentUser.status ? currentUser.status : 'Present',
        }}
      />

      {/* My Bookings Modal */}
      <Dialog open={bookingsOpen} onOpenChange={setBookingsOpen}>
        <DialogContent className="max-w-md mx-4">
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
                      className="ml-4 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
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
