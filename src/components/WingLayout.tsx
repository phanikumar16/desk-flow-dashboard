
import React from 'react';

interface WingLayoutProps {
  wingId: string | undefined;
}

const WingLayout: React.FC<WingLayoutProps> = ({ wingId }) => {
  if (wingId === 'a-tech') {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6 rounded-2xl">
          <style>
            {`
            /* ===== BASE STYLES ===== */
            .office-container {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              border: 3px solid #333;
              padding: 20px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              border-radius: 8px;
              position: relative;
            }

            .page-title {
              text-align: center;
              color: #333;
              margin-bottom: 20px;
              font-size: 28px;
              font-weight: 600;
            }

            /* ===== GRID LAYOUT ===== */
            .office-layout {
              display: grid;
              grid-template-columns: 200px 1fr 150px;
              grid-template-rows: 80px 50px 1fr;
              gap: 15px;
              width: 100%;
              height: 650px;
              position: relative;
            }

            /* Walking bay between top cabins and main floor */
            .walking-bay {
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
            .top-section {
              grid-column: 1 / -1;
              display: flex;
              gap: 8px;
              align-items: stretch;
            }

            .personal-cabin {
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

            .personal-cabin:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(33, 150, 243, 0.2);
            }

            .meeting-room {
              background: linear-gradient(135deg, #fff3e0, #ffe0b2);
              border: 2px solid #FF9800;
              color: #e65100;
              flex: 2;
            }

            /* Door indicators */
            .personal-cabin::after,
            .meeting-room::after {
              content: '🚪';
              position: absolute;
              bottom: -8px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 14px;
            }

            /* ===== LEFT SECTION ===== */
            .left-section {
              display: flex;
              flex-direction: column;
              gap: 15px;
              height: 100%;
            }

            .meeting-hall {
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

            .meeting-hall:hover {
              transform: translateX(3px);
              box-shadow: -4px 0 8px rgba(255, 152, 0, 0.2);
            }

            .meeting-hall::after {
              content: '🚪';
              position: absolute;
              right: -10px;
              top: 50%;
              transform: translateY(-50%);
              font-size: 16px;
            }

            .group-cabin {
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

            .group-cabin:hover {
              transform: translateX(3px);
              box-shadow: -4px 0 8px rgba(156, 39, 176, 0.2);
            }

            .small-cabin {
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

            .small-cabin:hover {
              transform: translateX(3px);
              box-shadow: -4px 0 8px rgba(33, 150, 243, 0.2);
            }

            /* ===== CENTER SECTION (Work Area) ===== */
            .center-section {
              display: grid;
              grid-template-rows: 1fr auto 1fr;
              gap: 20px;
              padding: 15px;
              background: linear-gradient(135deg, #fafafa, #f0f0f0);
              border: 2px dashed #999;
              border-radius: 8px;
            }

            .desk-row {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 12px;
            }

            .work-table {
              background: linear-gradient(135deg, #f0f8ff, #e3f2fd);
              border: 2px solid #1976d2;
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 4px;
              padding: 6px;
              border-radius: 6px;
              transition: transform 0.2s ease;
            }

            .work-table:hover {
              transform: scale(1.02);
              box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
            }

            .table-side {
              display: grid;
              grid-template-rows: repeat(4, 1fr);
              gap: 3px;
            }

            .desk {
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

            .desk:hover {
              background: linear-gradient(135deg, #b3e5fc, #81d4fa);
              transform: scale(1.1);
              z-index: 10;
              position: relative;
            }

            /* Middle work desks */
            .middle-work-area {
              display: flex;
              flex-direction: column;
              gap: 8px;
              justify-content: center;
            }

            .middle-desk {
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

            .middle-desk:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
            }

            /* ===== RIGHT SECTION ===== */
            .right-section {
              display: flex;
              flex-direction: column;
              gap: 15px;
              height: 100%;
            }

            .pantry {
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

            .pantry:hover {
              transform: translateX(-3px);
              box-shadow: 4px 0 8px rgba(255, 193, 7, 0.2);
            }

            .small-meeting-room {
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

            .small-meeting-room:hover {
              transform: translateX(-3px);
              box-shadow: 4px 0 8px rgba(255, 152, 0, 0.2);
            }

            /* ===== LEGEND ===== */
            .legend {
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

            .legend-item {
              display: flex;
              align-items: center;
              gap: 10px;
              padding: 5px;
            }

            .legend-color {
              width: 24px;
              height: 24px;
              border-radius: 3px;
              flex-shrink: 0;
            }

            .legend-text {
              font-weight: 500;
              color: #333;
            }

            /* ===== RESPONSIVE DESIGN ===== */
            @media (max-width: 768px) {
              .office-layout {
                grid-template-columns: 1fr;
                grid-template-rows: auto auto auto auto;
                height: auto;
                gap: 10px;
              }

              .top-section {
                flex-direction: column;
                gap: 5px;
                height: auto;
              }

              .desk-row {
                grid-template-columns: repeat(2, 1fr);
              }

              .legend {
                grid-template-columns: 1fr;
              }
            }
            `}
          </style>
          
          <div className="office-container">
            <h1 className="page-title">Cprime Floor Plan A-Wing</h1>
            
            <div className="office-layout">
              {/* Top Section: Personal Cabins & Meeting Room */}
              <div className="top-section">
                <div className="personal-cabin">LILAC</div>
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
    );
  }

  // B-Finance Wing Layout - Restored to original simple design
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6 rounded-2xl">
        <div className="office-container" style={{
          fontFamily: 'Arial, sans-serif',
          backgroundColor: '#f4f4f4',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold'}}>
            B-WING OFFICE LAYOUT
          </h1>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {/* Top Section */}
            <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: '10px'}}>
              <div style={{backgroundColor: '#e9ecef', border: '1px solid #ced4da', padding: '10px', borderRadius: '5px', textAlign: 'center', width: '120px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>LOTUS</div>
              <div style={{backgroundColor: '#e9ecef', border: '1px solid #ced4da', padding: '10px', borderRadius: '5px', textAlign: 'center', width: '120px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>PEONY</div>
              <div style={{backgroundColor: '#e9ecef', border: '1px solid #ced4da', padding: '10px', borderRadius: '5px', textAlign: 'center', width: '120px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>IRIS</div>
              <div style={{backgroundColor: '#adb5bd', color: 'white', border: '1px solid #ced4da', padding: '10px', borderRadius: '5px', textAlign: 'center', width: '120px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>SERVER</div>
            </div>
            
            {/* Walking Area */}
            <div style={{backgroundColor: '#d1d1d1', color: '#555', textAlign: 'center', padding: '5px', borderRadius: '3px', width: '100%'}}>Walking Area</div>
            
            {/* Main Work Area */}
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              {/* Left Section */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{display: 'flex', gap: '10px'}}>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>1</div>
                    <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>2</div>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px'}}>
                    <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>3</div>
                    <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>4</div>
                    <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>5</div>
                    <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>6</div>
                  </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px', marginLeft: '75px'}}>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>7</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>8</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>9</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>10</div>
                </div>
                <div style={{display: 'flex', gap: '10px', width: '170px', marginLeft: '75px'}}>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>11</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>12</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>13</div>
                </div>
              </div>
              
              {/* Middle Section */}
              <div style={{flexGrow: 1, margin: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  {/* Middle Left: Desks 14–25 */}
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px'}}>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>14</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>15</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>16</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>17</div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px'}}>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>18</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>19</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>20</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>21</div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px'}}>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>22</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>23</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>24</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>25</div>
                    </div>
                  </div>
                  {/* Middle Right: Desks 26–36 */}
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '140px', height: '120px', gap: '8px'}}>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', gridColumn: 1, gridRow: 1}}>26</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', gridColumn: 1, gridRow: 2}}>27</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', gridColumn: 2, gridRow: 2}}>28</div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px'}}>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>29</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>30</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>31</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>32</div>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px'}}>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>33</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>34</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>35</div>
                      <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>36</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section: Desks 37–44 */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end'}}>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <div style={{backgroundColor: '#a7c957', color: 'white', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '80px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', marginRight: '10px'}}>PANTRY</div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px'}}>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>37</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>38</div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '10px', width: '120px'}}>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>39</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>40</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>41</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>42</div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '10px'}}>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>43</div>
                  <div style={{backgroundColor: '#fff', border: '1px solid #ced4da', padding: '8px', borderRadius: '5px', textAlign: 'center', width: '50px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'}}>44</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingLayout;
