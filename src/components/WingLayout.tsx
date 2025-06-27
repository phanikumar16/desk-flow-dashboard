
import React from 'react';

interface WingLayoutProps {
  wingId: string | undefined;
}

const WingLayout: React.FC<WingLayoutProps> = ({ wingId }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Wing Layout</h2>
            <p className="text-gray-600">Interactive floor plan showing seat locations and availability</p>
          </div>
        </div>
      </div>

      {/* Layout Container */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="bg-gray-50 rounded-lg p-8 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Wing Layout Coming Soon</h3>
            <p className="text-gray-600 mb-4">
              Interactive floor plan with seat visualization will be integrated here
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
              <h4 className="font-medium text-blue-900 mb-2">Planned Features:</h4>
              <ul className="text-sm text-blue-800 text-left space-y-1">
                <li>• Visual seat map with real-time status</li>
                <li>• Color-coded availability indicators</li>
                <li>• Click-to-reserve functionality</li>
                <li>• Employee location tooltips</li>
                <li>• Reservation status overlays</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Occupied</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Reserved</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">On Leave</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingLayout;
