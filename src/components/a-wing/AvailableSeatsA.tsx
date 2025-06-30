import AvailableSeats from '../AvailableSeats';
export default function AvailableSeatsA(props) {
  // Only render for A wing
  return <AvailableSeats {...props} wingId="A-Tech" />;
} 