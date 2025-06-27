
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { employees } from '../data/employeeData';

interface EmployeeDirectoryProps {
  wingId: string | undefined;
}

const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({ wingId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clusterFilter, setClusterFilter] = useState('all');

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

  const EmployeeCard = ({ employee }: { employee: typeof employees[0] }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-sm">{getInitials(employee.name)}</AvatarFallback>
          </Avatar>
          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
            employee.status === 'Present' ? 'bg-green-500' : 
            employee.status === 'Leave' ? 'bg-red-500' : 
            employee.status === 'Work From Home' ? 'bg-yellow-500' : 'bg-gray-400'
          }`}></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{employee.name}</h3>
              {employee.name !== 'Unassigned' && (
                <p className="text-xs text-gray-500 truncate">{generateEmail(employee.name)}</p>
              )}
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs font-mono bg-blue-50 text-blue-700">
                {employee.seatNumber}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Seat Number</span>
              <span className="font-medium">{employee.seatNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Cluster</span>
              <span className="font-medium">{employee.cluster}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className="text-gray-500">Status</span>
              <Badge variant="outline" className={`text-xs ${getStatusBadge(employee.status)}`}>
                {employee.status === 'Available' ? 'Available for booking' : employee.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Employee Directory</h2>
            <p className="text-gray-600">{wingEmployees.length} entries in A-Tech</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="🔍 Search employees or seats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={clusterFilter} onValueChange={setClusterFilter}>
            <SelectTrigger className="w-full sm:w-48">
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
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">🏢</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Onsite Employees</h3>
            <p className="text-sm text-gray-600">{filteredOnsite.length} employees with assigned seats</p>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredOnsite.map((employee) => (
            <EmployeeCard key={employee.seatNumber} employee={employee} />
          ))}
        </div>

        {filteredOnsite.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No onsite employees found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDirectory;
