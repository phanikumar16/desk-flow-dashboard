import React from 'react';

interface WingLayoutProps {
  wingId: string | undefined;
}

const WingLayout: React.FC<WingLayoutProps> = ({ wingId }) => {
  if (wingId === 'a-tech') {
    return (
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6 rounded-2xl">
          <style jsx>{`
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
        <style jsx>{`
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
                <div className="desk-block desk-block-3l" style={{marginLeft: '75px'}}>
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
                  {/* Right Section: Desks 37–44 */}
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
