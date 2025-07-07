import React from 'react';
import './BwingLayout.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { supabase } from '../lib/supabaseClient';
import { employees } from '../data/employeeData';

interface WingLayoutProps {
  wingId: string | undefined;
}

const WingLayout: React.FC<WingLayoutProps> = ({ wingId }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogSeat, setDialogSeat] = React.useState('');
  const [seats, setSeats] = React.useState<any[]>([]);
  const [reservations, setReservations] = React.useState<any[]>([]);
  const [leaves, setLeaves] = React.useState<any[]>([]);
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [booking, setBooking] = React.useState(false);

  // Add this debug log at the top of the WingLayout component (after state declarations):
  console.log('DEBUG: reservations', reservations, 'selectedDate', selectedDate);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user profile
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
          setUserProfile(profile);
        }
        // Fetch seats for the selected wing
        const wing = wingId === 'a-tech' ? 'A-Tech' : 'B-Finance';
        const { data: seatRows } = await supabase.from('seats').select('*').eq('wing', wing);
        setSeats(seatRows || []);
        // Fetch reservations for the selected date and future, join profiles for reserver name
        const { data: reservationRows } = await supabase.from('reservations').select('*').eq('date', selectedDate);
        setReservations(reservationRows || []);
        // Fetch leaves for the selected date and future
        const { data: leaveRows } = await supabase.from('user_leaves').select('*').gte('date', selectedDate);
        setLeaves(leaveRows || []);
      } catch (e) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [wingId, selectedDate]);

  // Add realtime subscription for user_leaves and reservations
  React.useEffect(() => {
    const leavesChannel = supabase
      .channel('winglayout-leaves')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_leaves' }, () => {
        // Re-fetch leaves and reservations
        const fetchLeaves = async () => {
          const { data: leaveRows } = await supabase.from('user_leaves').select('*').gte('date', selectedDate);
          setLeaves(leaveRows || []);
          const { data: reservationRows } = await supabase.from('reservations').select('*').eq('date', selectedDate);
          setReservations(reservationRows || []);
        };
        fetchLeaves();
      })
      .subscribe();
    const reservationsChannel = supabase
      .channel('winglayout-reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reservations' }, () => {
        // Re-fetch reservations
        const fetchReservations = async () => {
          const { data: reservationRows } = await supabase.from('reservations').select('*').eq('date', selectedDate);
          setReservations(reservationRows || []);
        };
        fetchReservations();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(leavesChannel);
      supabase.removeChannel(reservationsChannel);
    };
  }, [selectedDate]);

  const handleBook = async (seatNumber: string) => {
    if (!userProfile) return;
    setBooking(true);
    const normSeat = normalizeSeatNumber(seatNumber);
    const seat = seats.find(s => String(s.seat_number).toUpperCase() === normSeat);
    if (!seat) { setBooking(false); return; }
    // Insert reservation into Supabase
    const { error } = await supabase.from('reservations').insert({
      seat_id: seat.id,
      user_id: userProfile.id,
      date: selectedDate,
      status: 'active'
    });
    // Always re-fetch reservations and leaves to update UI
    const { data: reservationRows } = await supabase.from('reservations').select('*').eq('date', selectedDate);
    setReservations(reservationRows || []);
    const { data: leaveRows } = await supabase.from('user_leaves').select('*').gte('date', selectedDate);
    setLeaves(leaveRows || []);
    if (!error) {
      setDialogOpen(false);
    } else {
      alert('Failed to reserve seat: ' + error.message);
    }
    setBooking(false);
  };

  // Utility to normalize seat numbers (e.g., A3 -> A03)
  function normalizeSeatNumber(seatNumber: string) {
    const match = seatNumber.match(/([A-Za-z]+)(\d+)/);
    if (!match) return seatNumber;
    const prefix = match[1];
    const num = match[2].padStart(2, '0');
    return `${prefix.toUpperCase()}${num}`;
  }

  // Update getSeatStatus to use normalized seat numbers
  function getSeatStatus(seatNumber: string) {
    const normSeat = normalizeSeatNumber(seatNumber);
    const seat = seats.find(s => String(s.seat_number).toUpperCase() === normSeat);
    if (!seat) return 'onsite'; // fallback to blue
    // Check if reserved for the selected date (by any user)
    const isReserved = reservations.some(r => String(r.seat_id) === String(seat.id) && r.date === selectedDate);
    if (isReserved) return 'reserved';
    // Get employee info
    const emp = employees.find(e => e.seatNumber === normSeat);
    // Unassigned seat
    if (!emp || emp.name === 'Unassigned') return 'bookable';
    // Onsite employee
    if (emp.type === 'onsite') {
      // Check if on Leave/WFH for this date
      const leave = leaves.find(l => String(l.seat_id) === String(seat.id) && l.date === selectedDate && (l.type === 'Leave' || l.type === 'Work From Home'));
      if (leave) return 'bookable';
      return 'onsite';
    }
    // Default
    return 'bookable';
  }

  // Utility to get assigned employee name for a seat
  function getSeatEmployeeName(seatNumber: string) {
    const normSeat = normalizeSeatNumber(seatNumber);
    const seat = seats.find(s => String(s.seat_number).toUpperCase() === normSeat);
    return seat?.employee_name || '';
  }

  // Utility to get the booking employee name for a seat and date
  function getBookingEmployeeName(seatNumber: string) {
    const normSeat = normalizeSeatNumber(seatNumber);
    const seat = seats.find(s => String(s.seat_number).toUpperCase() === normSeat);
    if (!seat) return '';
    const reservation = reservations.find(r => String(r.seat_id) === String(seat.id) && r.date === selectedDate);
    if (reservation) {
      console.log('Reservation object:', reservation);
      // Prefer profile name if available
      if (reservation.profiles && reservation.profiles.full_name) {
        return reservation.profiles.full_name;
      }
      // Fallback to employees array
      const emp = employees.find(e => e.id === reservation.user_id);
      return emp ? emp.name : reservation.user_id;
    }
    // Not reserved, fallback to assigned employee or 'Unassigned'
    const emp = employees.find(e => e.seatNumber === normSeat);
    return emp ? emp.name : 'Unassigned';
  }

  // Utility to check if the current user is the assigned employee for a seat
  function isUserAssignedToSeat(seatNumber: string) {
    if (!userProfile) return false;
    const normSeat = normalizeSeatNumber(seatNumber);
    return userProfile.seat_number && userProfile.seat_number.toUpperCase() === normSeat;
  }

  if (wingId === 'a-tech') {
    return (
      <>
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-white/20">
        <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 p-6 rounded-2xl">
          <style>
            {`
            /* ===== BASE STYLES ===== */
            * {
              box-sizing: border-box;
            }

            .office-container {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background: white;
              border: 3px solid #333;
              padding: 20px;
              max-width: 1000px;
              margin: 0 auto;
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
            
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
                        <div className={`desk ${getSeatStatus('A1') === 'onsite' ? 'desk-onsite' : getSeatStatus('A1') === 'bookable' ? 'desk-bookable' : getSeatStatus('A1') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A1')} onClick={getSeatStatus('A1') === 'bookable' ? () => { setDialogSeat('A1'); setDialogOpen(true); } : undefined}>{'A1'}</div>
                        <div className={`desk ${getSeatStatus('A2') === 'onsite' ? 'desk-onsite' : getSeatStatus('A2') === 'bookable' ? 'desk-bookable' : getSeatStatus('A2') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A2')} onClick={getSeatStatus('A2') === 'bookable' ? () => { setDialogSeat('A2'); setDialogOpen(true); } : undefined}>{'A2'}</div>
                        <div className={`desk ${getSeatStatus('A3') === 'onsite' ? 'desk-onsite' : getSeatStatus('A3') === 'bookable' ? 'desk-bookable' : getSeatStatus('A3') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A3')} onClick={getSeatStatus('A3') === 'bookable' ? () => { setDialogSeat('A3'); setDialogOpen(true); } : undefined}>{'A3'}</div>
                        <div className={`desk ${getSeatStatus('A4') === 'onsite' ? 'desk-onsite' : getSeatStatus('A4') === 'bookable' ? 'desk-bookable' : getSeatStatus('A4') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A4')} onClick={getSeatStatus('A4') === 'bookable' ? () => { setDialogSeat('A4'); setDialogOpen(true); } : undefined}>{'A4'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A8') === 'onsite' ? 'desk-onsite' : getSeatStatus('A8') === 'bookable' ? 'desk-bookable' : getSeatStatus('A8') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A8')} onClick={getSeatStatus('A8') === 'bookable' ? () => { setDialogSeat('A8'); setDialogOpen(true); } : undefined}>{'A8'}</div>
                        <div className={`desk ${getSeatStatus('A7') === 'onsite' ? 'desk-onsite' : getSeatStatus('A7') === 'bookable' ? 'desk-bookable' : getSeatStatus('A7') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A7')} onClick={getSeatStatus('A7') === 'bookable' ? () => { setDialogSeat('A7'); setDialogOpen(true); } : undefined}>{'A7'}</div>
                        <div className={`desk ${getSeatStatus('A6') === 'onsite' ? 'desk-onsite' : getSeatStatus('A6') === 'bookable' ? 'desk-bookable' : getSeatStatus('A6') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A6')} onClick={getSeatStatus('A6') === 'bookable' ? () => { setDialogSeat('A6'); setDialogOpen(true); } : undefined}>{'A6'}</div>
                        <div className={`desk ${getSeatStatus('A5') === 'onsite' ? 'desk-onsite' : getSeatStatus('A5') === 'bookable' ? 'desk-bookable' : getSeatStatus('A5') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A5')} onClick={getSeatStatus('A5') === 'bookable' ? () => { setDialogSeat('A5'); setDialogOpen(true); } : undefined}>{'A5'}</div>
                    </div>
                  </div>

                  <div className="work-table">
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A9') === 'onsite' ? 'desk-onsite' : getSeatStatus('A9') === 'bookable' ? 'desk-bookable' : getSeatStatus('A9') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A9')} onClick={getSeatStatus('A9') === 'bookable' ? () => { setDialogSeat('A9'); setDialogOpen(true); } : undefined}>{'A9'}</div>
                        <div className={`desk ${getSeatStatus('A10') === 'onsite' ? 'desk-onsite' : getSeatStatus('A10') === 'bookable' ? 'desk-bookable' : getSeatStatus('A10') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A10')} onClick={getSeatStatus('A10') === 'bookable' ? () => { setDialogSeat('A10'); setDialogOpen(true); } : undefined}>{'A10'}</div>
                        <div className={`desk ${getSeatStatus('A11') === 'onsite' ? 'desk-onsite' : getSeatStatus('A11') === 'bookable' ? 'desk-bookable' : getSeatStatus('A11') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A11')} onClick={getSeatStatus('A11') === 'bookable' ? () => { setDialogSeat('A11'); setDialogOpen(true); } : undefined}>{'A11'}</div>
                        <div className={`desk ${getSeatStatus('A12') === 'onsite' ? 'desk-onsite' : getSeatStatus('A12') === 'bookable' ? 'desk-bookable' : getSeatStatus('A12') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A12')} onClick={getSeatStatus('A12') === 'bookable' ? () => { setDialogSeat('A12'); setDialogOpen(true); } : undefined}>{'A12'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A16') === 'onsite' ? 'desk-onsite' : getSeatStatus('A16') === 'bookable' ? 'desk-bookable' : getSeatStatus('A16') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A16')} onClick={getSeatStatus('A16') === 'bookable' ? () => { setDialogSeat('A16'); setDialogOpen(true); } : undefined}>{'A16'}</div>
                        <div className={`desk ${getSeatStatus('A15') === 'onsite' ? 'desk-onsite' : getSeatStatus('A15') === 'bookable' ? 'desk-bookable' : getSeatStatus('A15') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A15')} onClick={getSeatStatus('A15') === 'bookable' ? () => { setDialogSeat('A15'); setDialogOpen(true); } : undefined}>{'A15'}</div>
                        <div className={`desk ${getSeatStatus('A14') === 'onsite' ? 'desk-onsite' : getSeatStatus('A14') === 'bookable' ? 'desk-bookable' : getSeatStatus('A14') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A14')} onClick={getSeatStatus('A14') === 'bookable' ? () => { setDialogSeat('A14'); setDialogOpen(true); } : undefined}>{'A14'}</div>
                        <div className={`desk ${getSeatStatus('A13') === 'onsite' ? 'desk-onsite' : getSeatStatus('A13') === 'bookable' ? 'desk-bookable' : getSeatStatus('A13') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A13')} onClick={getSeatStatus('A13') === 'bookable' ? () => { setDialogSeat('A13'); setDialogOpen(true); } : undefined}>{'A13'}</div>
                    </div>
                  </div>

                  <div className="work-table">
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A17') === 'onsite' ? 'desk-onsite' : getSeatStatus('A17') === 'bookable' ? 'desk-bookable' : getSeatStatus('A17') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A17')} onClick={getSeatStatus('A17') === 'bookable' ? () => { setDialogSeat('A17'); setDialogOpen(true); } : undefined}>{'A17'}</div>
                        <div className={`desk ${getSeatStatus('A18') === 'onsite' ? 'desk-onsite' : getSeatStatus('A18') === 'bookable' ? 'desk-bookable' : getSeatStatus('A18') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A18')} onClick={getSeatStatus('A18') === 'bookable' ? () => { setDialogSeat('A18'); setDialogOpen(true); } : undefined}>{'A18'}</div>
                        <div className={`desk ${getSeatStatus('A19') === 'onsite' ? 'desk-onsite' : getSeatStatus('A19') === 'bookable' ? 'desk-bookable' : getSeatStatus('A19') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A19')} onClick={getSeatStatus('A19') === 'bookable' ? () => { setDialogSeat('A19'); setDialogOpen(true); } : undefined}>{'A19'}</div>
                        <div className={`desk ${getSeatStatus('A20') === 'onsite' ? 'desk-onsite' : getSeatStatus('A20') === 'bookable' ? 'desk-bookable' : getSeatStatus('A20') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A20')} onClick={getSeatStatus('A20') === 'bookable' ? () => { setDialogSeat('A20'); setDialogOpen(true); } : undefined}>{'A20'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A24') === 'onsite' ? 'desk-onsite' : getSeatStatus('A24') === 'bookable' ? 'desk-bookable' : getSeatStatus('A24') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A24')} onClick={getSeatStatus('A24') === 'bookable' ? () => { setDialogSeat('A24'); setDialogOpen(true); } : undefined}>{'A24'}</div>
                        <div className={`desk ${getSeatStatus('A23') === 'onsite' ? 'desk-onsite' : getSeatStatus('A23') === 'bookable' ? 'desk-bookable' : getSeatStatus('A23') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A23')} onClick={getSeatStatus('A23') === 'bookable' ? () => { setDialogSeat('A23'); setDialogOpen(true); } : undefined}>{'A23'}</div>
                        <div className={`desk ${getSeatStatus('A22') === 'onsite' ? 'desk-onsite' : getSeatStatus('A22') === 'bookable' ? 'desk-bookable' : getSeatStatus('A22') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A22')} onClick={getSeatStatus('A22') === 'bookable' ? () => { setDialogSeat('A22'); setDialogOpen(true); } : undefined}>{'A22'}</div>
                        <div className={`desk ${getSeatStatus('A21') === 'onsite' ? 'desk-onsite' : getSeatStatus('A21') === 'bookable' ? 'desk-bookable' : getSeatStatus('A21') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A21')} onClick={getSeatStatus('A21') === 'bookable' ? () => { setDialogSeat('A21'); setDialogOpen(true); } : undefined}>{'A21'}</div>
                    </div>
                  </div>

                  <div className="work-table">
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A25') === 'onsite' ? 'desk-onsite' : getSeatStatus('A25') === 'bookable' ? 'desk-bookable' : getSeatStatus('A25') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A25')} onClick={getSeatStatus('A25') === 'bookable' ? () => { setDialogSeat('A25'); setDialogOpen(true); } : undefined}>{'A25'}</div>
                        <div className={`desk ${getSeatStatus('A26') === 'onsite' ? 'desk-onsite' : getSeatStatus('A26') === 'bookable' ? 'desk-bookable' : getSeatStatus('A26') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A26')} onClick={getSeatStatus('A26') === 'bookable' ? () => { setDialogSeat('A26'); setDialogOpen(true); } : undefined}>{'A26'}</div>
                        <div className={`desk ${getSeatStatus('A27') === 'onsite' ? 'desk-onsite' : getSeatStatus('A27') === 'bookable' ? 'desk-bookable' : getSeatStatus('A27') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A27')} onClick={getSeatStatus('A27') === 'bookable' ? () => { setDialogSeat('A27'); setDialogOpen(true); } : undefined}>{'A27'}</div>
                        <div className={`desk ${getSeatStatus('A28') === 'onsite' ? 'desk-onsite' : getSeatStatus('A28') === 'bookable' ? 'desk-bookable' : getSeatStatus('A28') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A28')} onClick={getSeatStatus('A28') === 'bookable' ? () => { setDialogSeat('A28'); setDialogOpen(true); } : undefined}>{'A28'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A32') === 'onsite' ? 'desk-onsite' : getSeatStatus('A32') === 'bookable' ? 'desk-bookable' : getSeatStatus('A32') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A32')} onClick={getSeatStatus('A32') === 'bookable' ? () => { setDialogSeat('A32'); setDialogOpen(true); } : undefined}>{'A32'}</div>
                        <div className={`desk ${getSeatStatus('A31') === 'onsite' ? 'desk-onsite' : getSeatStatus('A31') === 'bookable' ? 'desk-bookable' : getSeatStatus('A31') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A31')} onClick={getSeatStatus('A31') === 'bookable' ? () => { setDialogSeat('A31'); setDialogOpen(true); } : undefined}>{'A31'}</div>
                        <div className={`desk ${getSeatStatus('A30') === 'onsite' ? 'desk-onsite' : getSeatStatus('A30') === 'bookable' ? 'desk-bookable' : getSeatStatus('A30') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A30')} onClick={getSeatStatus('A30') === 'bookable' ? () => { setDialogSeat('A30'); setDialogOpen(true); } : undefined}>{'A30'}</div>
                        <div className={`desk ${getSeatStatus('A29') === 'onsite' ? 'desk-onsite' : getSeatStatus('A29') === 'bookable' ? 'desk-bookable' : getSeatStatus('A29') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A29')} onClick={getSeatStatus('A29') === 'bookable' ? () => { setDialogSeat('A29'); setDialogOpen(true); } : undefined}>{'A29'}</div>
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
                        <div className={`desk ${getSeatStatus('A61') === 'onsite' ? 'desk-onsite' : getSeatStatus('A61') === 'bookable' ? 'desk-bookable' : getSeatStatus('A61') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A61')} onClick={getSeatStatus('A61') === 'bookable' ? () => { setDialogSeat('A61'); setDialogOpen(true); } : undefined}>{'A61'}</div>
                        <div className={`desk ${getSeatStatus('A62') === 'onsite' ? 'desk-onsite' : getSeatStatus('A62') === 'bookable' ? 'desk-bookable' : getSeatStatus('A62') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A62')} onClick={getSeatStatus('A62') === 'bookable' ? () => { setDialogSeat('A62'); setDialogOpen(true); } : undefined}>{'A62'}</div>
                        <div className={`desk ${getSeatStatus('A63') === 'onsite' ? 'desk-onsite' : getSeatStatus('A63') === 'bookable' ? 'desk-bookable' : getSeatStatus('A63') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A63')} onClick={getSeatStatus('A63') === 'bookable' ? () => { setDialogSeat('A63'); setDialogOpen(true); } : undefined}>{'A63'}</div>
                        <div className={`desk ${getSeatStatus('A64') === 'onsite' ? 'desk-onsite' : getSeatStatus('A64') === 'bookable' ? 'desk-bookable' : getSeatStatus('A64') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A64')} onClick={getSeatStatus('A64') === 'bookable' ? () => { setDialogSeat('A64'); setDialogOpen(true); } : undefined}>{'A64'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A60') === 'onsite' ? 'desk-onsite' : getSeatStatus('A60') === 'bookable' ? 'desk-bookable' : getSeatStatus('A60') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A60')} onClick={getSeatStatus('A60') === 'bookable' ? () => { setDialogSeat('A60'); setDialogOpen(true); } : undefined}>{'A60'}</div>
                        <div className={`desk ${getSeatStatus('A59') === 'onsite' ? 'desk-onsite' : getSeatStatus('A59') === 'bookable' ? 'desk-bookable' : getSeatStatus('A59') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A59')} onClick={getSeatStatus('A59') === 'bookable' ? () => { setDialogSeat('A59'); setDialogOpen(true); } : undefined}>{'A59'}</div>
                        <div className={`desk ${getSeatStatus('A58') === 'onsite' ? 'desk-onsite' : getSeatStatus('A58') === 'bookable' ? 'desk-bookable' : getSeatStatus('A58') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A58')} onClick={getSeatStatus('A58') === 'bookable' ? () => { setDialogSeat('A58'); setDialogOpen(true); } : undefined}>{'A58'}</div>
                        <div className={`desk ${getSeatStatus('A57') === 'onsite' ? 'desk-onsite' : getSeatStatus('A57') === 'bookable' ? 'desk-bookable' : getSeatStatus('A57') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A57')} onClick={getSeatStatus('A57') === 'bookable' ? () => { setDialogSeat('A57'); setDialogOpen(true); } : undefined}>{'A57'}</div>
                    </div>
                  </div>

                  <div className="work-table">
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A53') === 'onsite' ? 'desk-onsite' : getSeatStatus('A53') === 'bookable' ? 'desk-bookable' : getSeatStatus('A53') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A53')} onClick={getSeatStatus('A53') === 'bookable' ? () => { setDialogSeat('A53'); setDialogOpen(true); } : undefined}>{'A53'}</div>
                        <div className={`desk ${getSeatStatus('A54') === 'onsite' ? 'desk-onsite' : getSeatStatus('A54') === 'bookable' ? 'desk-bookable' : getSeatStatus('A54') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A54')} onClick={getSeatStatus('A54') === 'bookable' ? () => { setDialogSeat('A54'); setDialogOpen(true); } : undefined}>{'A54'}</div>
                        <div className={`desk ${getSeatStatus('A55') === 'onsite' ? 'desk-onsite' : getSeatStatus('A55') === 'bookable' ? 'desk-bookable' : getSeatStatus('A55') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A55')} onClick={getSeatStatus('A55') === 'bookable' ? () => { setDialogSeat('A55'); setDialogOpen(true); } : undefined}>{'A55'}</div>
                        <div className={`desk ${getSeatStatus('A56') === 'onsite' ? 'desk-onsite' : getSeatStatus('A56') === 'bookable' ? 'desk-bookable' : getSeatStatus('A56') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A56')} onClick={getSeatStatus('A56') === 'bookable' ? () => { setDialogSeat('A56'); setDialogOpen(true); } : undefined}>{'A56'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A52') === 'onsite' ? 'desk-onsite' : getSeatStatus('A52') === 'bookable' ? 'desk-bookable' : getSeatStatus('A52') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A52')} onClick={getSeatStatus('A52') === 'bookable' ? () => { setDialogSeat('A52'); setDialogOpen(true); } : undefined}>{'A52'}</div>
                        <div className={`desk ${getSeatStatus('A51') === 'onsite' ? 'desk-onsite' : getSeatStatus('A51') === 'bookable' ? 'desk-bookable' : getSeatStatus('A51') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A51')} onClick={getSeatStatus('A51') === 'bookable' ? () => { setDialogSeat('A51'); setDialogOpen(true); } : undefined}>{'A51'}</div>
                        <div className={`desk ${getSeatStatus('A50') === 'onsite' ? 'desk-onsite' : getSeatStatus('A50') === 'bookable' ? 'desk-bookable' : getSeatStatus('A50') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A50')} onClick={getSeatStatus('A50') === 'bookable' ? () => { setDialogSeat('A50'); setDialogOpen(true); } : undefined}>{'A50'}</div>
                        <div className={`desk ${getSeatStatus('A49') === 'onsite' ? 'desk-onsite' : getSeatStatus('A49') === 'bookable' ? 'desk-bookable' : getSeatStatus('A49') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A49')} onClick={getSeatStatus('A49') === 'bookable' ? () => { setDialogSeat('A49'); setDialogOpen(true); } : undefined}>{'A49'}</div>
                    </div>
                  </div>

                  <div className="work-table">
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A45') === 'onsite' ? 'desk-onsite' : getSeatStatus('A45') === 'bookable' ? 'desk-bookable' : getSeatStatus('A45') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A45')} onClick={getSeatStatus('A45') === 'bookable' ? () => { setDialogSeat('A45'); setDialogOpen(true); } : undefined}>{'A45'}</div>
                        <div className={`desk ${getSeatStatus('A46') === 'onsite' ? 'desk-onsite' : getSeatStatus('A46') === 'bookable' ? 'desk-bookable' : getSeatStatus('A46') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A46')} onClick={getSeatStatus('A46') === 'bookable' ? () => { setDialogSeat('A46'); setDialogOpen(true); } : undefined}>{'A46'}</div>
                        <div className={`desk ${getSeatStatus('A47') === 'onsite' ? 'desk-onsite' : getSeatStatus('A47') === 'bookable' ? 'desk-bookable' : getSeatStatus('A47') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A47')} onClick={getSeatStatus('A47') === 'bookable' ? () => { setDialogSeat('A47'); setDialogOpen(true); } : undefined}>{'A47'}</div>
                        <div className={`desk ${getSeatStatus('A48') === 'onsite' ? 'desk-onsite' : getSeatStatus('A48') === 'bookable' ? 'desk-bookable' : getSeatStatus('A48') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A48')} onClick={getSeatStatus('A48') === 'bookable' ? () => { setDialogSeat('A48'); setDialogOpen(true); } : undefined}>{'A48'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A44') === 'onsite' ? 'desk-onsite' : getSeatStatus('A44') === 'bookable' ? 'desk-bookable' : getSeatStatus('A44') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A44')} onClick={getSeatStatus('A44') === 'bookable' ? () => { setDialogSeat('A44'); setDialogOpen(true); } : undefined}>{'A44'}</div>
                        <div className={`desk ${getSeatStatus('A43') === 'onsite' ? 'desk-onsite' : getSeatStatus('A43') === 'bookable' ? 'desk-bookable' : getSeatStatus('A43') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A43')} onClick={getSeatStatus('A43') === 'bookable' ? () => { setDialogSeat('A43'); setDialogOpen(true); } : undefined}>{'A43'}</div>
                        <div className={`desk ${getSeatStatus('A42') === 'onsite' ? 'desk-onsite' : getSeatStatus('A42') === 'bookable' ? 'desk-bookable' : getSeatStatus('A42') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A42')} onClick={getSeatStatus('A42') === 'bookable' ? () => { setDialogSeat('A42'); setDialogOpen(true); } : undefined}>{'A42'}</div>
                        <div className={`desk ${getSeatStatus('A41') === 'onsite' ? 'desk-onsite' : getSeatStatus('A41') === 'bookable' ? 'desk-bookable' : getSeatStatus('A41') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A41')} onClick={getSeatStatus('A41') === 'bookable' ? () => { setDialogSeat('A41'); setDialogOpen(true); } : undefined}>{'A41'}</div>
                    </div>
                  </div>

                  <div className="work-table">
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A37') === 'onsite' ? 'desk-onsite' : getSeatStatus('A37') === 'bookable' ? 'desk-bookable' : getSeatStatus('A37') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A37')} onClick={getSeatStatus('A37') === 'bookable' ? () => { setDialogSeat('A37'); setDialogOpen(true); } : undefined}>{'A37'}</div>
                        <div className={`desk ${getSeatStatus('A38') === 'onsite' ? 'desk-onsite' : getSeatStatus('A38') === 'bookable' ? 'desk-bookable' : getSeatStatus('A38') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A38')} onClick={getSeatStatus('A38') === 'bookable' ? () => { setDialogSeat('A38'); setDialogOpen(true); } : undefined}>{'A38'}</div>
                        <div className={`desk ${getSeatStatus('A39') === 'onsite' ? 'desk-onsite' : getSeatStatus('A39') === 'bookable' ? 'desk-bookable' : getSeatStatus('A39') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A39')} onClick={getSeatStatus('A39') === 'bookable' ? () => { setDialogSeat('A39'); setDialogOpen(true); } : undefined}>{'A39'}</div>
                        <div className={`desk ${getSeatStatus('A40') === 'onsite' ? 'desk-onsite' : getSeatStatus('A40') === 'bookable' ? 'desk-bookable' : getSeatStatus('A40') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A40')} onClick={getSeatStatus('A40') === 'bookable' ? () => { setDialogSeat('A40'); setDialogOpen(true); } : undefined}>{'A40'}</div>
                    </div>
                    <div className="table-side">
                        <div className={`desk ${getSeatStatus('A36') === 'onsite' ? 'desk-onsite' : getSeatStatus('A36') === 'bookable' ? 'desk-bookable' : getSeatStatus('A36') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A36')} onClick={getSeatStatus('A36') === 'bookable' ? () => { setDialogSeat('A36'); setDialogOpen(true); } : undefined}>{'A36'}</div>
                        <div className={`desk ${getSeatStatus('A35') === 'onsite' ? 'desk-onsite' : getSeatStatus('A35') === 'bookable' ? 'desk-bookable' : getSeatStatus('A35') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A35')} onClick={getSeatStatus('A35') === 'bookable' ? () => { setDialogSeat('A35'); setDialogOpen(true); } : undefined}>{'A35'}</div>
                        <div className={`desk ${getSeatStatus('A34') === 'onsite' ? 'desk-onsite' : getSeatStatus('A34') === 'bookable' ? 'desk-bookable' : getSeatStatus('A34') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A34')} onClick={getSeatStatus('A34') === 'bookable' ? () => { setDialogSeat('A34'); setDialogOpen(true); } : undefined}>{'A34'}</div>
                        <div className={`desk ${getSeatStatus('A33') === 'onsite' ? 'desk-onsite' : getSeatStatus('A33') === 'bookable' ? 'desk-bookable' : getSeatStatus('A33') === 'reserved' ? 'desk-reserved' : ''}`} title={getBookingEmployeeName('A33')} onClick={getSeatStatus('A33') === 'bookable' ? () => { setDialogSeat('A33'); setDialogOpen(true); } : undefined}>{'A33'}</div>
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reserve Desk {dialogSeat}</DialogTitle>
            </DialogHeader>
            <div className="py-4 text-center">
              <div>
                Assigned to: {getBookingEmployeeName(dialogSeat)}
              </div>
              <div>
                Status: {getSeatStatus(dialogSeat)}
              </div>
              {getSeatStatus(dialogSeat) !== 'bookable' && getBookingEmployeeName(dialogSeat) ? (
                <div style={{ color: 'red', marginTop: 8 }}>
                  Reserved for {getBookingEmployeeName(dialogSeat)}
                </div>
              ) : null}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
              </DialogClose>
              <button
                className="px-4 py-2 rounded text-white bg-blue-600 hover:bg-blue-700"
                disabled={getSeatStatus(dialogSeat) !== 'bookable' || booking || isUserAssignedToSeat(dialogSeat)}
                onClick={() => dialogSeat && handleBook(dialogSeat)}
              >
                {booking ? 'Reserving...' : 'Reserve'}
              </button>
              {isUserAssignedToSeat(dialogSeat) && (
                <div style={{ color: 'red', marginTop: 8 }}>
                  You cannot book your own assigned seat.
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // B-Wing Layout (updated to match provided HTML/CSS)
  if (wingId === 'b-finance' || wingId === 'b-wing') {
    return (
      <div className="office-container">
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>B-WING OFFICE LAYOUT</h1>
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
              <div className="desk-block desk-block-4" style={{ marginLeft: 75 }}>
                <div className="desk">7</div>
                <div className="desk">8</div>
                <div className="desk">9</div>
                <div className="desk">10</div>
              </div>
              <div className="desk-block desk-block-3l" style={{ marginLeft: 75 }}>
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
                    <div className="desk">36</div>
                    <div className="desk">35</div>
                    <div className="desk">30</div>
                    <div className="desk">31</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">29</div>
                    <div className="desk">28</div>
                    <div className="desk">22</div>
                    <div className="desk">23</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">21</div>
                    <div className="desk">20</div>
                    <div className="desk">14</div>
                    <div className="desk">15</div>
                  </div>
                </div>
                {/* Middle Right: Desks 26–36 */}
                <div className="middle-right">
                  <div className="desk-block" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', width: 140, height: 120, gap: 8 }}>
                    <div className="desk" style={{ gridColumn: 1, gridRow: 1 }}>34</div>
                    <div className="desk" style={{ gridColumn: 1, gridRow: 2 }}>32</div>
                    <div className="desk" style={{ gridColumn: 2, gridRow: 2 }}>33</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">27</div>
                    <div className="desk">26</div>
                    <div className="desk">24</div>
                    <div className="desk">25</div>
                  </div>
                  <div className="desk-block desk-block-4">
                    <div className="desk">19</div>
                    <div className="desk">18</div>
                    <div className="desk">16</div>
                    <div className="desk">17</div>
                  </div>
                </div>
                {/* Right Section: Desks 37–44 (aligned directly beside middle) */}
                <div className="right-section">
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="pantry" style={{ marginRight: 10 }}>PANTRY</div>
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
    );
  }

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
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ padding: '4px 8px', borderRadius: 4, border: '1px solid #ccc' }}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
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
