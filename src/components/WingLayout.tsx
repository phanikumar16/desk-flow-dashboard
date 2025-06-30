
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
