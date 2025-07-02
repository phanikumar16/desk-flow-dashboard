import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, isWeekend } from 'date-fns';
import { toZonedTime, format as formatTz } from 'date-fns-tz';
import { cn } from '@/lib/utils';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    name: string;
    seatNumber: string;
    cluster: string;
    status: string;
  };
  onStatusUpdated?: () => void;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({ isOpen, onClose, currentUser, onStatusUpdated }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentUser.status);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const { toast } = useToast();

  const statusOptions = [
    { value: 'Present', label: 'Present', color: 'bg-green-500', icon: '✅' },
    { value: 'Leave', label: 'Leave', color: 'bg-red-500', icon: '🏖️' },
    { value: 'Work From Home', label: 'Work From Home', color: 'bg-yellow-500', icon: '🏠' }
  ];

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    if (status === 'Present') {
      setSelectedDates([]);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      // Update the user's status in Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ status: selectedStatus })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Profile update error:', updateError);
          toast({ 
            title: 'Error', 
            description: 'Failed to update status. Please try again.',
            variant: 'destructive'
          });
          return;
        }

        // If status is Leave or WFH, insert leave dates
        if ((selectedStatus === 'Leave' || selectedStatus === 'Work From Home') && selectedDates.length > 0) {
          // Fetch user's seat_number from profile
          const { data: profile } = await supabase.from('profiles').select('seat_number').eq('id', user.id).single();
          if (profile && profile.seat_number) {
            // Fetch seat_id (BIGINT) from seats table using seat_number
            const { data: seatRow } = await supabase.from('seats').select('id').eq('seat_number', profile.seat_number).single();
            const seat_id = seatRow?.id;
            if (!seat_id) {
              toast({ title: 'Error', description: 'Could not find your seat. Please contact admin.', variant: 'destructive' });
              return;
            }
            // Clear existing future leave dates for this seat
            const today = new Date().toISOString().slice(0, 10);
            await supabase
              .from('user_leaves')
              .delete()
              .eq('seat_id', seat_id)
              .gte('date', today);

            // Insert new leave dates
            const leaveRows = selectedDates.map(date => ({
              user_id: user.id,
              seat_id: seat_id,
              date: formatTz(toZonedTime(date, 'Asia/Kolkata'), 'yyyy-MM-dd', { timeZone: 'Asia/Kolkata' }),
              type: selectedStatus
            }));
            console.log('Inserting user_leaves:', leaveRows);
            const { error: leaveError } = await supabase.from('user_leaves').insert(leaveRows);
            if (leaveError) {
              console.error('user_leaves insert error:', leaveError);
              toast({ 
                title: 'Warning', 
                description: 'Status updated but failed to save leave dates.',
                variant: 'destructive'
              });
            }
          }
        } else if ((selectedStatus === 'Leave' || selectedStatus === 'Work From Home') && selectedDates.length === 0) {
          toast({ title: 'Error', description: 'Please select at least one date for leave or work from home.', variant: 'destructive' });
          return;
        } else if (selectedStatus === 'Present') {
          // Clear all future leave dates when status is set to Present
          const { data: profile } = await supabase.from('profiles').select('seat_number').eq('id', user.id).single();
          if (profile && profile.seat_number) {
            const { data: seatRow } = await supabase.from('seats').select('id').eq('seat_number', profile.seat_number).single();
            const seat_id = seatRow?.id;
            if (seat_id) {
              const today = new Date().toISOString().slice(0, 10);
              await supabase
                .from('user_leaves')
                .delete()
                .eq('seat_id', seat_id)
                .gte('date', today);
            }
          }
        }

        toast({ 
          title: 'Success', 
          description: 'Your status has been updated successfully.'
        });

        // Trigger refresh of parent components
        if (onStatusUpdated) {
          onStatusUpdated();
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update status. Please try again.',
        variant: 'destructive'
      });
    }
    
    onClose();
  };

  const IST_TIMEZONE = 'Asia/Kolkata';
  const today = new Date();
  const todayIST = toZonedTime(today, IST_TIMEZONE);
  const todayISTMidnight = new Date(todayIST.getFullYear(), todayIST.getMonth(), todayIST.getDate());

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Your Status</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Current Status</h3>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">{currentUser.status}</span>
            </div>
          </div>

          {/* Status Options */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Select New Status</h3>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    selectedStatus === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 ${option.color} rounded-full`}></div>
                    <span className="text-lg">{option.icon}</span>
                    <span className="font-medium text-gray-900">{option.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date Selection for Leave/WFH */}
          {(selectedStatus === 'Leave' || selectedStatus === 'Work From Home') && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Select Dates (Weekdays Only)</h3>
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
                    disabled={date => date < todayISTMidnight || isWeekend(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {selectedDates.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-3 mt-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Selected Dates:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {selectedDates.sort((a, b) => a.getTime() - b.getTime()).map((date, index) => (
                      <div key={index} className="text-sm text-blue-700">
                        {format(date, 'EEEE, MMMM dd, yyyy')}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Impact Notice */}
          {(selectedStatus === 'Leave' || selectedStatus === 'Work From Home') && selectedDates.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <h4 className="text-sm font-medium text-yellow-800 mb-1">Impact Notice:</h4>
              <p className="text-sm text-yellow-700">
                Your seat ({currentUser.seatNumber}) will be available for reservation by remote employees 
                during the selected dates.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={(selectedStatus === 'Leave' || selectedStatus === 'Work From Home') && selectedDates.length === 0}
            >
              Update Status
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatusUpdateModal;
