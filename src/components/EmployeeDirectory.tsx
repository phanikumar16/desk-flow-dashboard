import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { employees } from '../data/employeeData';
import { supabase } from '../lib/supabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EmployeeDirectoryProps {
  wingId: string | undefined;
}

const UNASSIGNED_SEATS = ['A01', 'A02', 'A49'];

const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({ wingId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('all');
  const [reservations, setReservations] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [unassignedModalOpen, setUnassignedModalOpen] = useState(false);
  const [modalSeat, setModalSeat] = useState<string | null>(null);

  // Filter employees for A-Tech wing
  const wingEmployees = employees.filter(emp => emp.wing === 'A-Tech');
  
  // Only show onsite employees
  const onsiteEmployees = wingEmployees.filter(emp => emp.type === 'onsite');

  // Apply filters
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

  // Generate sample email from name
  const generateEmail = (name: string) => {
    if (name === 'Unassigned') return '';
    return name.toLowerCase().replace(/\s+/g, '.') + '@cprime.com';
  };

  // Generate a unique color for each employee based on their name
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
    const fetchReservations = async () => {
      const { data } = await supabase.from('reservations').select('*');
      setReservations(data || []);
    };
    const fetchProfiles = async () => {
      const { data } = await supabase.from('profiles').select('*');
      setProfiles(data || []);
    };
    fetchReservations();
    fetchProfiles();
  }, []);

  const EmployeeCard = ({ employee }: { employee: typeof employees[0] }) => {
    const empColor = stringToColor(employee.name + employee.seatNumber);
    // More visible, modern gradient with glassmorphism
    const gradientBg = `linear-gradient(135deg, ${empColor}33 0%, #fff8 100%)`;
    // Show reservation info for unassigned seats
    let reservationInfo = null;
    if (UNASSIGNED_SEATS.includes(employee.seatNumber)) {
      // Find future reservation for this seat
      const todayStr = new Date().toISOString().slice(0, 10);
      const futureReservations = reservations
        .filter(r => r.seat_id && employee.seatNumber && r.status === 'active' && r.date >= todayStr && employee.seatNumber === r.seat_number)
        .sort((a, b) => a.date.localeCompare(b.date));
      if (futureReservations.length > 0) {
        // Get user name from profiles
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
        className={
          `relative rounded-2xl border border-gray-200 p-3 sm:p-4 transition-transform duration-200 flex items-stretch pl-2 sm:pl-3 overflow-hidden group shadow-md backdrop-blur-[2px]`
        }
        style={{
          borderLeft: `8px solid ${empColor}`,
          background: gradientBg,
        }}
        onClick={() => { setModalSeat(employee.seatNumber); setUnassignedModalOpen(true); }}
      >
        {/* Radial gradient overlay for depth */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: `radial-gradient(circle at 20% 20%, ${empColor}22 0%, transparent 70%)`,
            opacity: 0.7,
          }}
        />
        {/* Animated color overlay on hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            background: `linear-gradient(90deg, ${empColor}33 0%, #fff0 100%)`,
          }}
        />
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 relative z-20">
          <div className={`relative`}>
            <Avatar className={`w-12 h-12 sm:w-14 sm:h-14 shadow`} style={{ backgroundColor: empColor, border: `2.5px solid #fff` }}>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="text-xs sm:text-sm text-white drop-shadow">{getInitials(employee.name)}</AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white ${
              employee.status === 'Present' ? 'bg-green-500' : 
              employee.status === 'Leave' ? 'bg-red-500' : 
              employee.status === 'Work From Home' ? 'bg-yellow-500' : 'bg-gray-400'
            }`}></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate text-base sm:text-lg">{employee.name}</h3>
                {employee.name !== 'Unassigned' && (
                  <p className="text-xs text-gray-500 truncate">{generateEmail(employee.name)}</p>
                )}
              </div>
              <div className="text-right ml-2">
                <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700">
                  {employee.seatNumber}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Seat</span>
                <span className="font-medium">{employee.seatNumber}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-500">Cluster</span>
                <span className="font-medium truncate ml-2">{employee.cluster}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm items-center">
                <span className="text-gray-500">Status</span>
                <Badge variant="outline" className={`text-xs ${getStatusBadge(employee.status)}`}> 
                  {employee.status === 'Available' ? 'Available for booking' : employee.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        {reservationInfo}
        {/* Card hover animation */}
        <style>{`
          .group:hover { transform: scale(1.035); box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13); }
        `}</style>
      </div>
    );
  };

  // Modal for unassigned seat reservations
  const renderUnassignedModal = () => {
    if (!modalSeat) return null;
    const todayStr = new Date().toISOString().slice(0, 10);
    const futureReservations = reservations
      .filter(r => r.seat_number === modalSeat && r.status === 'active' && r.date >= todayStr)
      .sort((a, b) => a.date.localeCompare(b.date));
    return (
      <Dialog open={unassignedModalOpen} onOpenChange={setUnassignedModalOpen}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Reservations for Seat {modalSeat}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {futureReservations.length === 0 ? (
              <div className="text-gray-500 text-center">This seat is available for all dates.</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {futureReservations.map(res => {
                  const userProfile = profiles.find(p => p.id === res.user_id);
                  return (
                    <li key={res.id} className="py-2 flex items-center justify-between">
                      <span>{res.date} - Reserved by {userProfile ? userProfile.full_name : 'User'}</span>
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Employee Directory</h2>
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
              className="w-full text-sm sm:text-base"
            />
          </div>
          <Select value={clusterFilter} onValueChange={setClusterFilter}>
            <SelectTrigger className="w-full sm:w-48 text-sm sm:text-base">
              <SelectValue placeholder="🏷️ All Clusters" />
            </SelectTrigger>
            <SelectContent>
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
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs sm:text-sm">🏢</span>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Onsite Employees</h3>
            <p className="text-xs sm:text-sm text-gray-600">{filteredOnsite.length} employees with assigned seats</p>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4">
          {filteredOnsite.map((employee) => (
            <EmployeeCard key={employee.seatNumber} employee={employee} />
          ))}
        </div>

        {filteredOnsite.length === 0 && (
          <div className="text-center py-6 sm:py-8 text-gray-500">
            <p className="text-sm sm:text-base">No onsite employees found matching your criteria.</p>
          </div>
        )}
      </div>
      {renderUnassignedModal()}
    </div>
  );
};

export default EmployeeDirectory;
