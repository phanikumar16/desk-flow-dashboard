
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { employees } from '../data/employeeData';
import { supabase } from '../lib/supabaseClient';
import { format } from 'date-fns';

interface EmployeeDirectoryProps {
  wingId: string | undefined;
}

const UNASSIGNED_SEATS = ['A01', 'A02', 'A49'];

const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({ wingId }) => {
  if (wingId === 'b-finance') {
    return (
      <div className="mb-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded text-center">
        B wing employee details need to be added soon. No employees to display.
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [reservations, setReservations] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [userLeaves, setUserLeaves] = useState<any[]>([]);
  const [seats, setSeats] = useState<any[]>([]);
  const [unassignedModalOpen, setUnassignedModalOpen] = useState(false);
  const [modalSeat, setModalSeat] = useState<string | null>(null);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [todayStatuses, setTodayStatuses] = useState<{[key: string]: string}>({});

  const wingEmployees = employees.filter(emp => emp.wing !== 'B-finance');
  const onsiteEmployees = wingEmployees.filter(emp => emp.type === 'onsite');

  const filterEmployees = (employeeList: typeof employees) => {
    return employeeList.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           emp.seatNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCluster = clusterFilter === 'all' || emp.cluster === clusterFilter;
      return matchesSearch && matchesCluster;
    });
  };

  const filteredOnsite = filterEmployees(onsiteEmployees);

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Present': 'bg-green-100 text-green-800 border-green-200',
      'Leave': 'bg-red-100 text-red-800 border-red-200',
      'Work From Home': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Available': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return statusColors[status as keyof typeof statusColors] || statusColors['Available'];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const generateEmail = (employee: typeof employees[0]) => {
    if (employee.email) return employee.email;
    if (employee.name === 'Unassigned') return '';
    return employee.name.toLowerCase().replace(/\s+/g, '.') + '@cprime.com';
  };

  function stringToColor(str: string) {
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

  useEffect(() => {
    const fetchData = async () => {
      const { data: reservationsData } = await supabase.from('reservations').select('*');
      const { data: profilesData } = await supabase.from('profiles').select('*');
      const { data: seatsData } = await supabase.from('seats').select('*');
      const { data: userLeavesData } = await supabase.from('user_leaves').select('*');
      
      setReservations(reservationsData || []);
      setProfiles(profilesData || []);
      setSeats(seatsData || []);
      setUserLeaves(userLeavesData || []);
    };
    
    fetchData();
  }, []);

  // Fetch today's statuses for all employees
  useEffect(() => {
    const fetchTodayStatuses = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data: todayLeaves } = await supabase
        .from('user_leaves')
        .select('*')
        .eq('date', today);
      
      if (seats.length > 0 && todayLeaves) {
        const statusMap: {[key: string]: string} = {};
        
        // Map seat numbers to today's status
        seats.forEach(seat => {
          const todayLeave = todayLeaves.find(l => l.seat_id === seat.id);
          if (todayLeave) {
            statusMap[seat.seat_number] = todayLeave.type;
          } else {
            statusMap[seat.seat_number] = 'Present';
          }
        });
        
        setTodayStatuses(statusMap);
      }
    };
    
    if (seats.length > 0) {
      fetchTodayStatuses();
    }
  }, [seats, userLeaves]);

  const getNextAvailableDate = (employee: any) => {
    const todayStatus = todayStatuses[employee.seatNumber];
    if (todayStatus === 'Present') return null;
    
    // Find the seat from seats data
    const seat = seats.find(s => s.seat_number === employee.seatNumber);
    if (!seat) return null;

    const today = new Date().toISOString().slice(0, 10);
    const leaveDates = userLeaves.filter(l => l.seat_id === seat.id).map(l => typeof l.date === 'string' ? l.date.slice(0, 10) : format(new Date(l.date), 'yyyy-MM-dd'));
    const futureLeaveDates = leaveDates.filter(d => d >= today).sort();
    const reservedDates = reservations.filter(r => r.seat_id === seat.id && r.status === 'active').map(r => typeof r.date === 'string' ? r.date.slice(0, 10) : format(new Date(r.date), 'yyyy-MM-dd'));
    
    // Find the first available date
    for (const leaveDate of futureLeaveDates) {
      if (!reservedDates.includes(leaveDate)) {
        return leaveDate;
      }
    }
    return null;
  };

  const EmployeeCard = ({ employee }: { employee: typeof employees[0] }) => {
    const empColor = stringToColor(employee.name + employee.seatNumber);
    const nextAvailable = getNextAvailableDate(employee);
    
    // Get today's status for this employee
    const todayStatus = todayStatuses[employee.seatNumber] || employee.status;
    
    // Show reservation info for unassigned seats
    let reservationInfo = null;
    if (UNASSIGNED_SEATS.includes(employee.seatNumber)) {
      const todayStr = new Date().toISOString().slice(0, 10);
      const futureReservations = reservations
        .filter(r => {
          const seat = seats.find(s => s.seat_number === employee.seatNumber);
          return seat && r.seat_id === seat.id && r.status === 'active' && r.date >= todayStr;
        })
        .sort((a, b) => a.date.localeCompare(b.date));
      
      if (futureReservations.length > 0) {
        const userProfile = profiles.find(p => p.id === futureReservations[0].user_id);
        reservationInfo = (
          <div className="mt-1 text-xs text-blue-700">
            Reserved by {userProfile ? userProfile.full_name : 'User'} on {futureReservations[0].date}
          </div>
        );
      }
    }

    return (
      <div
        className="relative rounded-3xl border border-white/20 p-4 transition-all duration-300 flex items-stretch pl-3 overflow-hidden group shadow-xl backdrop-blur-md hover:shadow-2xl transform hover:scale-105 cursor-pointer"
        style={{
          borderLeft: `6px solid ${empColor}`,
          background: `${empColor}10`,
        }}
        onClick={() => {
          if (UNASSIGNED_SEATS.includes(employee.seatNumber)) {
            setModalSeat(employee.seatNumber);
            setUnassignedModalOpen(true);
          } else {
            setSelectedEmployee({...employee, status: todayStatus});
            setEmployeeModalOpen(true);
          }
        }}
      >
        <div className="flex items-center space-x-4 flex-1 relative z-20">
          <div className="relative">
            <Avatar className="w-14 h-14 shadow-lg ring-2 ring-white/50" style={{ backgroundColor: empColor }}>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-sm text-white font-bold" style={{ backgroundColor: empColor }}>
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-lg ${
              todayStatus === 'Present' ? 'bg-green-500' : 
              todayStatus === 'Leave' ? 'bg-red-500' : 
              todayStatus === 'Work From Home' ? 'bg-yellow-500' : 'bg-gray-400'
            }`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-gray-900 truncate text-lg">{employee.name}</h3>
                {employee.name !== 'Unassigned' && (
                  <p className="text-xs text-gray-500 truncate bg-gray-100 px-2 py-1 rounded-full mt-1">
                    {generateEmail(employee)}
                  </p>
                )}
              </div>
              <div className="text-right ml-2">
                <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700 shadow-sm">
                  {employee.seatNumber}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Seat</span>
                <span className="font-medium">{employee.seatNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Cluster</span>
                <span className="font-medium truncate ml-2">{employee.cluster}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-500">Today's Status</span>
                <Badge variant="outline" className={`text-xs ${getStatusBadge(todayStatus)}`}> 
                  {todayStatus === 'Available' ? 'Available for booking' : todayStatus}
                </Badge>
              </div>
              {nextAvailable && (
                <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-500">Next Available</span>
                  <span className="font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {format(new Date(nextAvailable), 'MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {reservationInfo}
      </div>
    );
  };

  const renderUnassignedModal = () => {
    if (!modalSeat) return null;
    const todayStr = new Date().toISOString().slice(0, 10);
    const seat = seats.find(s => s.seat_number === modalSeat);
    const futureReservations = reservations
      .filter(r => seat && r.seat_id === seat.id && r.status === 'active' && r.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    
    return (
      <Dialog open={unassignedModalOpen} onOpenChange={setUnassignedModalOpen}>
        <DialogContent className="max-w-md mx-4 bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Reservations for Seat {modalSeat}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {futureReservations.length === 0 ? (
              <div className="text-gray-500 text-center p-4 bg-gray-50 rounded-lg">This seat is available for all dates.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {futureReservations.map(res => {
                  const userProfile = profiles.find(p => p.id === res.user_id);
                  return (
                    <li key={res.id} className="py-3 flex items-center justify-between">
                      <span className="font-medium">{res.date}</span>
                      <span className="text-sm text-gray-600">Reserved by {userProfile ? userProfile.full_name : 'User'}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderEmployeeModal = () => {
    if (!selectedEmployee) return null;
    const nextAvailable = getNextAvailableDate(selectedEmployee);
    
    return (
      <Dialog open={employeeModalOpen} onOpenChange={setEmployeeModalOpen}>
        <DialogContent className="max-w-md mx-4 bg-white/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">{selectedEmployee.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16" style={{ backgroundColor: stringToColor(selectedEmployee.name) }}>
                <AvatarFallback className="text-white font-bold text-lg">
                  {getInitials(selectedEmployee.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold text-lg">{selectedEmployee.name}</h3>
                <p className="text-sm text-gray-600">{generateEmail(selectedEmployee)}</p>
                <Badge className={getStatusBadge(selectedEmployee.status)}>
                  {selectedEmployee.status}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-gray-600">Seat Number:</span>
                <span className="font-medium">{selectedEmployee.seatNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cluster:</span>
                <span className="font-medium">{selectedEmployee.cluster}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Wing:</span>
                <span className="font-medium">{selectedEmployee.wing}</span>
              </div>
              {nextAvailable && (
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600">Seat Next Available:</span>
                  <span className="font-medium text-green-600">
                    {format(new Date(nextAvailable), 'EEEE, MMM dd, yyyy')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div 
      className="space-y-4 sm:space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-4 rounded-3xl"
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Employee Directory</h2>
            <p className="text-sm sm:text-base text-gray-600">{wingEmployees.length} entries in A-Tech</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <Input
              placeholder="🔍 Search employees or seats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm sm:text-base bg-white/80 backdrop-blur-sm border-white/20"
            />
          </div>
          <Select value={clusterFilter} onValueChange={setClusterFilter}>
            <SelectTrigger className="w-full sm:w-48 text-sm sm:text-base bg-white/80 backdrop-blur-sm border-white/20">
              <SelectValue placeholder="🏷️ All Clusters" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-md">
              <SelectItem value="all">All Clusters</SelectItem>
              <SelectItem value="Cloud Eng">Cloud Eng</SelectItem>
              <SelectItem value="Full Stack">Full Stack</SelectItem>
              <SelectItem value="NextGen">NextGen</SelectItem>
              <SelectItem value="DevOps">DevOps</SelectItem>
              <SelectItem value="Atlassian">Atlassian</SelectItem>
              <SelectItem value="AI Eng">AI Eng</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Onsite Employees */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-4 sm:p-6 border border-white/20">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-xs sm:text-sm">🏢</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Onsite Employees</h3>
            <p className="text-xs sm:text-sm text-gray-600">{filteredOnsite.length} employees with assigned seats</p>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredOnsite.map((employee) => (
            <EmployeeCard key={employee.seatNumber} employee={employee} />
          ))}
        </div>

        {filteredOnsite.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-8">
              <p className="text-sm sm:text-base">No onsite employees found matching your criteria.</p>
            </div>
          </div>
        )}
      </div>
      {renderUnassignedModal()}
      {renderEmployeeModal()}
    </div>
  );
};

export default EmployeeDirectory;
