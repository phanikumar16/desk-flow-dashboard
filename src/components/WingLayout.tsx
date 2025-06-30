import React from 'react';

interface WingLayoutProps {
  wingId: string | undefined;
}

const WingLayout: React.FC<WingLayoutProps> = ({ wingId }) => {
  if (wingId === 'a-tech') {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6 rounded-2xl">
          <style>{`
            .office-container {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            .office-layout {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            /* Top Section: Meeting Rooms and Server */
            .top-section {
              display: flex;
              justify-content: space-around;
              margin-bottom: 10px;
            }

            .meeting-room, .server {
              background-color: #e9ecef;
              border: 1px solid #ced4da;
              padding: 10px;
              border-radius: 5px;
              text-align: center;
              width: 120px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .server {
              background-color: #adb5bd;
              color: white;
            }

            /* Walking Area */
            .walking-area {
              background-color: #d1d1d1;
              color: #555;
              text-align: center;
              padding: 5px;
              border-radius: 3px;
            }

            .walking-horizontal {
              width: 100%;
            }

            /* Main Work Area */
            .main-work-area {
              display: flex;
              justify-content: space-between;
            }

            .left-section, .middle-section, .right-section {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            /* Desks */
            .desk-block {
              display: flex;
              gap: 10px;
            }

            .desk {
              background-color: #fff;
              border: 1px solid #ced4da;
              padding: 8px;
              border-radius: 5px;
              text-align: center;
              width: 50px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            /* Specific Desk Configurations */
            .desk-block-2v-small {
              flex-direction: column;
            }

            .desk-block-4 {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              grid-gap: 10px;
              width: 120px;
            }

            .desk-block-3l {
              width: 170px;
            }

            .desk-block-2h {
              flex-direction: column;
              align-items: flex-start;
            }

            /* Middle Section */
            .middle-section {
              flex-grow: 1;
              margin: 0 20px;
            }

            .middle-row {
              display: flex;
              justify-content: space-between;
            }

            .middle-left, .middle-right {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            /* Right Section */
            .right-section {
              align-items: flex-end;
            }

            .pantry {
              background-color: #a7c957;
              color: white;
              padding: 8px;
              border-radius: 5px;
              text-align: center;
              width: 80px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            /* Bottom Section */
            .bottom-section {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }

            .bottom-desks {
              display: flex;
              justify-content: space-around;
            }

            .desk-block-single {
              width: 50px;
            }

            .desk-block-3 {
              width: 170px;
            }
          `}
          </style>
          
          <div className="office-container">
            <h1 style={{textAlign: 'center', color: '#333', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold'}}>
              A-TECH WING OFFICE LAYOUT
            </h1>
            <div className="office-layout">
              {/* Top Section - Meeting Rooms */}
              <div className="top-section">
                <div className="meeting-room">LILAC</div>
                <div className="meeting-room">TULIP</div>
                <div className="meeting-room">ORCHID</div>
                <div className="meeting-room server">SERVER</div>
              </div>

              {/* Walking Area */}
              <div className="walking-area walking-horizontal">Walking Area</div>

              {/* Main Work Area */}
              <div className="main-work-area">
                {/* Left Section */}
                <div className="left-section">
                  <div className="left-top-row">
                    <div className="desk-block desk-block-2v-small">
                      <div className="desk">A01</div>
                      <div className="desk">A02</div>
                    </div>
                    <div className="desk-block desk-block-4">
                      <div className="desk">A03</div>
                      <div className="desk">A04</div>
                      <div className="desk">A05</div>
                      <div className="desk">A06</div>
                    </div>
                  </div>
                  <div className="desk-block desk-block-4" style={{marginLeft: '75px'}}>
                    <div className="desk">A07</div>
                    <div className="desk">A08</div>
                    <div className="desk">A09</div>
                    <div className="desk">A10</div>
                  </div>
                  <div className="desk-block desk-block-3l" style={{marginLeft: '75px'}}>
                    <div className="desk">A11</div>
                    <div className="desk">A12</div>
                    <div className="desk">A13</div>
                  </div>
                </div>

                {/* Middle Section */}
                <div className="middle-section">
                  <div className="middle-row">
                    {/* Middle Left: Desks A14–A25 */}
                    <div className="middle-left">
                      <div className="desk-block desk-block-4">
                        <div className="desk">A14</div>
                        <div className="desk">A15</div>
                        <div className="desk">A16</div>
                        <div className="desk">A17</div>
                      </div>
                      <div className="desk-block desk-block-4">
                        <div className="desk">A18</div>
                        <div className="desk">A19</div>
                        <div className="desk">A20</div>
                        <div className="desk">A21</div>
                      </div>
                      <div className="desk-block desk-block-4">
                        <div className="desk">A22</div>
                        <div className="desk">A23</div>
                        <div className="desk">A24</div>
                        <div className="desk">A25</div>
                      </div>
                    </div>

                    {/* Middle Right: Desks A26–A36 */}
                    <div className="middle-right">
                      <div className="desk-block" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '140px', height: '120px', gap: '8px'}}>
                        <div className="desk" style={{gridColumn: 1, gridRow: 1}}>A26</div>
                        <div className="desk" style={{gridColumn: 1, gridRow: 2}}>A27</div>
                        <div className="desk" style={{gridColumn: 2, gridRow: 2}}>A28</div>
                      </div>
                      <div className="desk-block desk-block-4">
                        <div className="desk">A29</div>
                        <div className="desk">A30</div>
                        <div className="desk">A31</div>
                        <div className="desk">A32</div>
                      </div>
                      <div className="desk-block desk-block-4">
                        <div className="desk">A33</div>
                        <div className="desk">A34</div>
                        <div className="desk">A35</div>
                        <div className="desk">A36</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section: Desks A37–A48 */}
                <div className="right-section">
                  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <div className="pantry" style={{marginRight: '10px'}}>PANTRY</div>
                  </div>
                  <div className="desk-block desk-block-2h">
                    <div className="desk">A37</div>
                    <div className="desk">A38</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">A39</div>
                    <div className="desk">A40</div>
                    <div className="desk">A41</div>
                    <div className="desk">A42</div>
                  </div>
                  <div className="desk-block desk-block-2h">
                    <div className="desk">A43</div>
                    <div className="desk">A44</div>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Desks A49–A64 */}
              <div className="bottom-section">
                <div className="walking-area walking-horizontal">Walking Area</div>
                <div className="bottom-desks">
                  <div className="desk-block desk-block-single">
                    <div className="desk">A49</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">A50</div>
                    <div className="desk">A51</div>
                    <div className="desk">A52</div>
                    <div className="desk">A53</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">A54</div>
                    <div className="desk">A55</div>
                    <div className="desk">A56</div>
                    <div className="desk">A57</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">A58</div>
                    <div className="desk">A59</div>
                    <div className="desk">A60</div>
                    <div className="desk">A61</div>
                  </div>
                  <div className="desk-block desk-block-3">
                    <div className="desk">A62</div>
                    <div className="desk">A63</div>
                    <div className="desk">A64</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // B-Finance Wing Layout
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6 rounded-2xl">
        <style>{`
          body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 20px;
            padding: 0;
          }
          .office-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border: 3px solid #333;
            border-radius: 10px;
            padding: 20px 0px 10px 20px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .office-layout {
            display: flex;
            flex-direction: column;
            gap: 20px;
            position: relative;
          }
          .top-section {
            display: flex;
            gap: 15px;
            align-items: stretch;
          }
          .meeting-room {
            flex: 1;
            padding: 25px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            border-radius: 8px;
            border: 2px solid #333;
            background: linear-gradient(135deg, #FFE4B5, #F4A460);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .meeting-room:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            border-color: #FF8C00;
          }
          .server {
            background: linear-gradient(135deg, #E6E6FA, #DDA0DD);
          }
          .server:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 6px 12px rgba(0,0,0,0.15);
            border-color: #9370DB;
          }
          .main-work-area {
            display: flex;
            gap: 0px;
            align-items: flex-start;
          }
          .left-section {
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-width: 200px;
            align-items: flex-start;
            margin-left: -20px;
          }
          .left-top-row {
            display: flex;
            gap: 0px;
            align-items: flex-start;
          }
          .middle-section {
            display: flex;
            flex-direction: column;
            gap: 10x;
            flex: 1;
            margin-left: 120px;
          }
          .middle-row {
            display: flex;
            gap: 5px;
            width: 100%;
          }
          .middle-left, .middle-right {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }
          .right-section {
            display: flex;
            flex-direction: column;
            gap: 5px;
            min-width: 350px;
          }
          .pantry {
            background: #f0f0f0;
            border: 2px solid #999;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 80px;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .pantry:hover {
            transform: translateY(-2px) scale(1.02);
            background: #e8e8e8;
            border-color: #666;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .desk-block {
            background: linear-gradient(135deg, #E6F3FF, #B3D9FF);
            border: 2px solid #0066CC;
            border-radius: 8px;
            padding: 12px;
            display: grid;
            gap: 8px;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .desk-block:hover {
            transform: translateY(-2px) scale(1.01);
            box-shadow: 0 4px 8px rgba(0,102,204,0.2);
            border-color: #004499;
          }
          .desk-block-2v-small {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            width: 50px;
          }
          .desk-block-4 {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            width: 140px;
          }
          .desk-block-2h {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
            width: 140px;
            height: 60px;
          }
          .desk-block-3l, .desk-block-3l-normal {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            width: 140px;
            height: 120px;
          }
          .desk-block-3l .desk:nth-child(1),
          .desk-block-3l-normal .desk:nth-child(1) { grid-column: 1; grid-row: 1; }
          .desk-block-3l .desk:nth-child(2),
          .desk-block-3l-normal .desk:nth-child(2) { grid-column: 2; grid-row: 1; }
          .desk-block-3l .desk:nth-child(3) { grid-column: 1; grid-row: 2; }
          .desk-block-3l-normal .desk:nth-child(3) { grid-column: 2; grid-row: 2; }

          .desk {
            background: white;
            border: 1px solid #0066CC;
            border-radius: 4px;
            padding: 8px;
            text-align: center;
            font-size: 12px;
            font-weight: bold;
            color: #0066CC;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 35px;
            transition: all 0.2s ease;
            cursor: pointer;
          }
          .desk:hover {
            transform: translateY(-1px) scale(1.05);
            background: #E6F3FF;
            border-color: #004499;
            color: #004499;
            box-shadow: 0 2px 4px rgba(0,102,204,0.3);
          }
          .walking-area {
            background: linear-gradient(135deg, #f8f8f8, #e8e8e8);
            border: 1px dashed #ccc;
            border-radius: 5px;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #666;
            font-style: italic;
            transition: all 0.3s ease;
            cursor: pointer;
          }
          .walking-area:hover {
            transform: translateY(-1px);
            background: linear-gradient(135deg, #f0f0f0, #e0e0e0);
            border-color: #999;
            color: #333;
          }
          .walking-horizontal {
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .walking-vertical {
            width: 30px;
          }
        `}
        </style>
        
        <div className="office-container">
          <h1 style={{textAlign: 'center', color: '#333', marginBottom: '30px'}}>B-WING OFFICE LAYOUT</h1>
          <div className="office-layout">
            {/* Top Section */}
            <div className="top-section">
              <div className="meeting-room">LOTUS</div>
              <div className="meeting-room">PEONY</div>
              <div className="meeting-room">IRIS</div>
              <div className="meeting-room server">SERVER</div>
            </div>
            
            {/* Walking Area */}
            <div className="walking-area walking-horizontal">Walking Area</div>
            {/* Main Work Area */}
            <div className="main-work-area">
              {/* Left Section */}
              <div className="left-section">
                <div className="left-top-row">
                  <div className="desk-block desk-block-2v-small">
                    <div className="desk">1</div>
                    <div className="desk">2</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">3</div>
                    <div className="desk">4</div>
                    <div className="desk">5</div>
                    <div className="desk">6</div>
                  </div>
                </div>
                <div className="desk-block desk-block-4" style={{marginLeft: '75px'}}>
                  <div className="desk">7</div>
                  <div className="desk">8</div>
                  <div className="desk">9</div>
                  <div className="desk">10</div>
                </div>
                <div className="desk-block desk-block-3l"  style={{marginLeft: '75px'}}>
                  <div className="desk">11</div>
                  <div className="desk">12</div>
                  <div className="desk">13</div>
                </div>
              </div>
              {/* Middle Section */}
              <div className="middle-section">
                <div className="middle-row">
                  {/* Middle Left: Desks 14–25 */}
                  <div className="middle-left">
                    <div className="desk-block desk-block-4">
                      <div className="desk">14</div>
                      <div className="desk">15</div>
                      <div className="desk">16</div>
                      <div className="desk">17</div>
                    </div>
                    <div className="desk-block desk-block-4">
                      <div className="desk">18</div>
                      <div className="desk">19</div>
                      <div className="desk">20</div>
                      <div className="desk">21</div>
                    </div>
                    <div className="desk-block desk-block-4">
                      <div className="desk">22</div>
                      <div className="desk">23</div>
                      <div className="desk">24</div>
                      <div className="desk">25</div>
                    </div>
                  </div>
                  {/* Middle Right: Desks 26–36 */}
                  <div className="middle-right">
                    <div className="desk-block" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: '140px', height: '120px', gap: '8px'}}>
                      <div className="desk" style={{gridColumn: 1, gridRow: 1}}>26</div>
                      <div className="desk" style={{gridColumn: 1, gridRow: 2}}>27</div>
                      <div className="desk" style={{gridColumn: 2, gridRow: 2}}>28</div>
                    </div>
                    <div className="desk-block desk-block-4">
                      <div className="desk">29</div>
                      <div className="desk">30</div>
                      <div className="desk">31</div>
                      <div className="desk">32</div>
                    </div>
                    <div className="desk-block desk-block-4">
                      <div className="desk">33</div>
                      <div className="desk">34</div>
                      <div className="desk">35</div>
                      <div className="desk">36</div>
                    </div>
                  </div>
                  {/* Right Section: Desks 37–44 (aligned directly beside middle) */}
                  <div className="right-section">
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                      <div className="pantry" style={{marginRight: '10px'}}>PANTRY</div>
                    </div>
                    <div className="desk-block desk-block-2h">
                      <div className="desk">37</div>
                      <div className="desk">38</div>
                    </div>
                    <div className="desk-block desk-block-4">
                      <div className="desk">39</div>
                      <div className="desk">40</div>
                      <div className="desk">41</div>
                      <div className="desk">42</div>
                    </div>
                    <div className="desk-block desk-block-2h">
                      <div className="desk">43</div>
                      <div className="desk">44</div>
                    </div>
                  </div>
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
