
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { availableSeats } from '../data/seatData';

interface AvailableSeatsProps {
  wingId: string | undefined;
}

const AvailableSeats: React.FC<AvailableSeatsProps> = ({ wingId }) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);

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

  const handleConfirmReservation = () => {
    if (selectedSeat && selectedDates.length > 0) {
      // Here you would typically save the reservation
      console.log(`Reserved seat ${selectedSeat} for dates:`, selectedDates);
      setReservationDialogOpen(false);
      setSelectedSeat(null);
      setSelectedDates([]);
    }
  };

  const getSeatStatusColor = (status: string) => {
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

  const getSeatStatusBadge = (status: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Available Seats</h2>
            <p className="text-gray-600">{availableSeats.length} seats available for booking in A-Tech</p>
            <p className="text-sm text-gray-500 mt-1">
              Includes unassigned seats and seats where employees are on leave or working from home
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>Today, {currentDateString}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Available Seats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableSeats.map((seat) => (
          <div key={seat.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getSeatStatusColor(seat.status)} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">📍</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Seat {seat.seatNumber}</h3>
                  <p className="text-sm text-gray-600">{seat.location}</p>
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${getSeatStatusColor(seat.status)}`}></div>
            </div>

            {/* Seat Type Info */}
            {seat.type === 'unassigned' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-600 font-medium text-sm">Unassigned Seat</span>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  This seat is not permanently assigned to anyone
                </p>
              </div>
            )}

            {seat.type === 'temporary' && seat.assignedTo && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-1">Usually assigned to {seat.assignedTo}</div>
                  {seat.availableUntil && (
                    <div className="text-green-600 text-xs">
                      Available until: {seat.availableUntil}
                    </div>
                  )}
                  <div className="text-green-600 text-xs mt-1">
                    {seat.reason}
                  </div>
                </div>
              </div>
            )}

            {seat.currentReservation && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Currently Reserved</div>
                  <div className="text-yellow-700 text-xs">
                    {seat.currentReservation.reservedBy}
                  </div>
                  <div className="text-yellow-600 text-xs">
                    Dates: {seat.currentReservation.dates}
                  </div>
                </div>
              </div>
            )}

            {/* Seat Details */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <Badge variant="outline" className={`text-xs ${getSeatStatusBadge(seat.status)}`}>
                  {seat.status}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Location</span>
                <span className="font-medium">{seat.location}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cluster</span>
                <span className="font-medium">{seat.cluster}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {seat.status === 'Available' && !seat.currentReservation && (
              <Button 
                onClick={() => handleSeatSelect(seat.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                📅 Reserve Seat
              </Button>
            )}

            {seat.currentReservation && (
              <div className="text-center py-2">
                <span className="text-sm text-gray-500">Reserved by Another User</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reservation Dialog */}
      <Dialog open={reservationDialogOpen} onOpenChange={setReservationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reserve Seat {selectedSeat}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select dates for reservation:
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDates.length > 0 
                      ? `${selectedDates.length} date${selectedDates.length > 1 ? 's' : ''} selected`
                      : 'Select dates'
                    }
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(dates) => setSelectedDates(dates || [])}
                    disabled={(date) => date < today}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {selectedDates.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Dates:</h4>
                <div className="space-y-1">
                  {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
                    <div key={index} className="text-sm text-blue-700">
                      {format(date, 'EEEE, MMMM dd, yyyy')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setReservationDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmReservation}
                disabled={selectedDates.length === 0}
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
