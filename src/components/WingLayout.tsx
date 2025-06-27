
import React from 'react';

interface WingLayoutProps {
  wingId: string | undefined;
}

const WingLayout: React.FC<WingLayoutProps> = ({ wingId }) => {
  if (wingId === 'a-tech') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">A-Tech Wing Layout</h2>
              <p className="text-gray-600">Interactive floor plan showing seat locations and availability</p>
            </div>
          </div>
        </div>

        {/* A Wing Layout Integration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <style dangerouslySetInnerHTML={{
            __html: `
              /* ===== BASE STYLES ===== */
              .wing-layout * {
                box-sizing: border-box;
              }

              .wing-layout {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.4;
                background-color: #f5f5f5;
                padding: 20px;
                border-radius: 8px;
              }

              .wing-layout .page-title {
                text-align: center;
                color: #333;
                margin-bottom: 20px;
                font-size: 28px;
                font-weight: 600;
              }

              /* ===== MAIN CONTAINER ===== */
              .wing-layout .office-container {
                background: white;
                border: 3px solid #333;
                padding: 20px;
                max-width: 1000px;
                margin: 0 auto;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border-radius: 8px;
                position: relative;
              }

              /* ===== GRID LAYOUT ===== */
              .wing-layout .office-layout {
                display: grid;
                grid-template-columns: 200px 1fr 150px;
                grid-template-rows: 80px 50px 1fr;
                gap: 15px;
                width: 100%;
                height: 650px;
                position: relative;
              }

              /* Walking bay between top cabins and main floor */
              .wing-layout .walking-bay {
                grid-column: 1 / -1;
                background: linear-gradient(90deg, #f0f0f0, #e8e8e8, #f0f0f0);
                border: 1px dashed #aaa;
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 11px;
                color: #666;
                font-style: italic;
              }

              /* ===== TOP SECTION (Cabins & Meeting Room) ===== */
              .wing-layout .top-section {
                grid-column: 1 / -1;
                display: flex;
                gap: 8px;
                align-items: stretch;
              }

              .wing-layout .personal-cabin {
                background: linear-gradient(135deg, #e8f4f8, #d1ebf5);
                border: 2px solid #2196F3;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                color: #1976d2;
                flex: 1;
                position: relative;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .wing-layout .personal-cabin:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(33, 150, 243, 0.2);
              }

              .wing-layout .meeting-room {
                background: linear-gradient(135deg, #fff3e0, #ffe0b2);
                border: 2px solid #FF9800;
                color: #e65100;
                flex: 2;
              }

              /* Door indicators */
              .wing-layout .personal-cabin::after,
              .wing-layout .meeting-room::after {
                content: '🚪';
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 14px;
              }

              /* ===== LEFT SECTION ===== */
              .wing-layout .left-section {
                display: flex;
                flex-direction: column;
                gap: 15px;
                height: 100%;
              }

              .wing-layout .meeting-hall {
                background: linear-gradient(135deg, #fff3e0, #ffe0b2);
                border: 2px solid #FF9800;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                color: #e65100;
                position: relative;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .wing-layout .meeting-hall:hover {
                transform: translateX(3px);
                box-shadow: -4px 0 8px rgba(255, 152, 0, 0.2);
              }

              .wing-layout .meeting-hall::after {
                content: '🚪';
                position: absolute;
                right: -10px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 16px;
              }

              .wing-layout .group-cabin {
                background: linear-gradient(135deg, #f3e5f5, #e1bee7);
                border: 2px solid #9C27B0;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                color: #6a1b9a;
                position: relative;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .wing-layout .group-cabin:hover {
                transform: translateX(3px);
                box-shadow: -4px 0 8px rgba(156, 39, 176, 0.2);
              }

              .wing-layout .small-cabin {
                background: linear-gradient(135deg, #e8f4f8, #d1ebf5);
                border: 2px solid #2196F3;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                color: #1976d2;
                position: relative;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .wing-layout .small-cabin:hover {
                transform: translateX(3px);
                box-shadow: -4px 0 8px rgba(33, 150, 243, 0.2);
              }

              /* ===== CENTER SECTION (Work Area) ===== */
              .wing-layout .center-section {
                display: grid;
                grid-template-rows: 1fr auto 1fr;
                gap: 20px;
                padding: 15px;
                background: linear-gradient(135deg, #fafafa, #f0f0f0);
                border: 2px dashed #999;
                border-radius: 8px;
              }

              .wing-layout .desk-row {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
              }

              .wing-layout .work-table {
                background: linear-gradient(135deg, #f0f8ff, #e3f2fd);
                border: 2px solid #1976d2;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4px;
                padding: 6px;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .wing-layout .work-table:hover {
                transform: scale(1.02);
                box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
              }

              .wing-layout .table-side {
                display: grid;
                grid-template-rows: repeat(4, 1fr);
                gap: 3px;
              }

              .wing-layout .desk {
                background: linear-gradient(135deg, #ffffff, #e1f5fe);
                border: 1px solid #0277bd;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 9px;
                font-weight: 600;
                color: #01579b;
                border-radius: 3px;
                transition: all 0.2s ease;
              }

              .wing-layout .desk:hover {
                background: linear-gradient(135deg, #b3e5fc, #81d4fa);
                transform: scale(1.1);
                z-index: 10;
                position: relative;
              }

              /* Middle work desks */
              .wing-layout .middle-work-area {
                display: flex;
                flex-direction: column;
                gap: 8px;
                justify-content: center;
              }

              .wing-layout .middle-desk {
                background: linear-gradient(135deg, #e8f5e8, #c8e6c8);
                border: 2px solid #4caf50;
                height: 25px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 11px;
                color: #2e7d32;
                border-radius: 5px;
                transition: transform 0.2s ease;
              }

              .wing-layout .middle-desk:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
              }

              /* ===== RIGHT SECTION ===== */
              .wing-layout .right-section {
                display: flex;
                flex-direction: column;
                gap: 15px;
                height: 100%;
              }

              .wing-layout .pantry {
                background: linear-gradient(135deg, rgba(31, 33, 31, 0.039));
                border: 2px solid #75746f;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                color: #201f1e;
                position: relative;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .wing-layout .pantry:hover {
                transform: translateX(-3px);
                box-shadow: 4px 0 8px rgba(255, 193, 7, 0.2);
              }

              .wing-layout .small-meeting-room {
                background: linear-gradient(135deg, #fff3e0, #ffe0b2);
                border: 2px solid #FF9800;
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                color: #e65100;
                position: relative;
                border-radius: 6px;
                transition: transform 0.2s ease;
              }

              .wing-layout .small-meeting-room:hover {
                transform: translateX(-3px);
                box-shadow: 4px 0 8px rgba(255, 152, 0, 0.2);
              }

              /* ===== LEGEND ===== */
              .wing-layout .legend {
                margin-top: 25px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 15px;
                font-size: 13px;
                padding: 15px;
                background: #f9f9f9;
                border-radius: 6px;
                border: 1px solid #ddd;
              }

              .wing-layout .legend-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 5px;
              }

              .wing-layout .legend-color {
                width: 24px;
                height: 24px;
                border-radius: 3px;
                flex-shrink: 0;
              }

              .wing-layout .legend-text {
                font-weight: 500;
                color: #333;
              }

              /* ===== RESPONSIVE DESIGN ===== */
              @media (max-width: 768px) {
                .wing-layout .office-layout {
                  grid-template-columns: 1fr;
                  grid-template-rows: auto auto auto auto;
                  height: auto;
                  gap: 10px;
                }

                .wing-layout .top-section {
                  flex-direction: column;
                  gap: 5px;
                  height: auto;
                }

                .wing-layout .desk-row {
                  grid-template-columns: repeat(2, 1fr);
                }

                .wing-layout .legend {
                  grid-template-columns: 1fr;
                }
              }
            `
          }} />
          
          <div className="wing-layout">
            <h1 className="page-title">Cprime Floor Plan A-Wing</h1>
            
            <div className="office-container">
              <div className="office-layout">
                {/* Top Section: Personal Cabins & Meeting Room */}
                <div className="top-section">
                  <div className="personal-cabin">S</div>
                  <div className="personal-cabin">TULIP</div>
                  <div className="personal-cabin">ORCHID</div>
                  <div className="personal-cabin">HIBISCUS</div>
                  <div className="personal-cabin meeting-room">CHERRY BLOSSOM</div>
                </div>

                {/* Walking Bay */}
                <div className="walking-bay">Walking Area</div>

                {/* Left Section: Meeting Hall & Cabins */}
                <div className="left-section">
                  <div className="meeting-hall">DENALI</div>
                  <div className="small-cabin">DAFFODIL</div>
                  <div className="group-cabin">MARIGOLD</div>
                </div>

                {/* Center Section: Work Tables & Desks (A1–A64) */}
                <div className="center-section">
                  {/* Top 4 Work Tables (A1-A32) */}
                  <div className="desk-row">
                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A1</div>
                        <div className="desk">A2</div>
                        <div className="desk">A3</div>
                        <div className="desk">A4</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A8</div>
                        <div className="desk">A7</div>
                        <div className="desk">A6</div>
                        <div className="desk">A5</div>
                      </div>
                    </div>

                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A9</div>
                        <div className="desk">A10</div>
                        <div className="desk">A11</div>
                        <div className="desk">A12</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A16</div>
                        <div className="desk">A15</div>
                        <div className="desk">A14</div>
                        <div className="desk">A13</div>
                      </div>
                    </div>

                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A17</div>
                        <div className="desk">A18</div>
                        <div className="desk">A19</div>
                        <div className="desk">A20</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A24</div>
                        <div className="desk">A23</div>
                        <div className="desk">A22</div>
                        <div className="desk">A21</div>
                      </div>
                    </div>

                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A25</div>
                        <div className="desk">A26</div>
                        <div className="desk">A27</div>
                        <div className="desk">A28</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A32</div>
                        <div className="desk">A31</div>
                        <div className="desk">A30</div>
                        <div className="desk">A29</div>
                      </div>
                    </div>
                  </div>

                  {/* Middle Work Desks */}
                  <div className="middle-work-area">
                    <div className="middle-desk">Work Desk A</div>
                    <div className="middle-desk">Work Desk B</div>
                  </div>

                  {/* Bottom 4 Work Tables (A33-A64) */}
                  <div className="desk-row">
                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A61</div>
                        <div className="desk">A62</div>
                        <div className="desk">A63</div>
                        <div className="desk">A64</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A60</div>
                        <div className="desk">A59</div>
                        <div className="desk">A58</div>
                        <div className="desk">A57</div>
                      </div>
                    </div>

                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A53</div>
                        <div className="desk">A54</div>
                        <div className="desk">A55</div>
                        <div className="desk">A56</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A52</div>
                        <div className="desk">A51</div>
                        <div className="desk">A50</div>
                        <div className="desk">A49</div>
                      </div>
                    </div>

                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A45</div>
                        <div className="desk">A46</div>
                        <div className="desk">A47</div>
                        <div className="desk">A48</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A44</div>
                        <div className="desk">A43</div>
                        <div className="desk">A42</div>
                        <div className="desk">A41</div>
                      </div>
                    </div>

                    <div className="work-table">
                      <div className="table-side">
                        <div className="desk">A37</div>
                        <div className="desk">A38</div>
                        <div className="desk">A39</div>
                        <div className="desk">A40</div>
                      </div>
                      <div className="table-side">
                        <div className="desk">A36</div>
                        <div className="desk">A35</div>
                        <div className="desk">A34</div>
                        <div className="desk">A33</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Pantry & Meeting Rooms */}
                <div className="right-section">
                  <div className="pantry">PANTRY</div>
                  <div className="small-meeting-room">LILY</div>
                  <div className="small-meeting-room">NESTLE</div>
                </div>
              </div>

              {/* Legend */}
              <div className="legend">
                <div className="legend-item">
                  <div className="legend-color" style={{background: 'linear-gradient(135deg, #e8f4f8, #d1ebf5)', border: '1px solid #2196F3'}}></div>
                  <span className="legend-text">Personal Cabins</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: 'linear-gradient(135deg, #fff3e0, #ffe0b2)', border: '1px solid #FF9800'}}></div>
                  <span className="legend-text">Meeting Rooms</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)', border: '1px solid #9C27B0'}}></div>
                  <span className="legend-text">Group Cabin</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: 'linear-gradient(135deg, #f0f8ff, #e3f2fd)', border: '1px solid #1976d2'}}></div>
                  <span className="legend-text">Work Tables (8 desks each)</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: 'linear-gradient(135deg, #e8f5e8, #c8e6c8)', border: '1px solid #4caf50'}}></div>
                  <span className="legend-text">Middle Work Desks</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{background: 'linear-gradient(135deg, rgba(31, 33, 31, 0.039))', border: '1px solid #5a5954'}}></div>
                  <span className="legend-text">Pantry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default layout for other wings (like B-Finance)
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
