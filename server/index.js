const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// In-memory data
let employees = [
  // Unassigned seats
  { id: 'A01', seatNumber: 'A01', name: 'Unassigned', cluster: 'Available', status: 'Available', type: 'onsite', wing: 'A-Tech' },
  { id: 'A02', seatNumber: 'A02', name: 'Unassigned', cluster: 'Available', status: 'Available', type: 'onsite', wing: 'A-Tech' },
  { id: 'A49', seatNumber: 'A49', name: 'Unassigned', cluster: 'Available', status: 'Available', type: 'onsite', wing: 'A-Tech' },
  // Assigned employees
  { id: 'A03', seatNumber: 'A03', name: 'Farhan Akthar', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A04', seatNumber: 'A04', name: 'Suba Shree K B', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A05', seatNumber: 'A05', name: 'Harini R', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A06', seatNumber: 'A06', name: 'Phani Kumar', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A07', seatNumber: 'A07', name: 'Matcha Bhavana', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A08', seatNumber: 'A08', name: 'Viswa AK', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A09', seatNumber: 'A09', name: 'Yogesh Srivastava', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A10', seatNumber: 'A10', name: 'Karthikeyan K', cluster: 'Cloud Eng', status: 'Leave', type: 'onsite', wing: 'A-Tech' },
  { id: 'A11', seatNumber: 'A11', name: 'Vinoth Kumar S', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A12', seatNumber: 'A12', name: 'Ragavi N', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A13', seatNumber: 'A13', name: 'Pranav P', cluster: 'Full Stack', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A14', seatNumber: 'A14', name: 'Guhanandan', cluster: 'Full Stack', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A15', seatNumber: 'A15', name: 'Muhammad Yaashvin C', cluster: 'Full Stack', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A16', seatNumber: 'A16', name: 'Kamal Sekhar C', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A17', seatNumber: 'A17', name: 'Aakash', cluster: 'NextGen', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A18', seatNumber: 'A18', name: 'Santosh Kumar Dondapati', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A19', seatNumber: 'A19', name: 'A S Bashar Naieem', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A20', seatNumber: 'A20', name: 'Vasanti Ashwin Bendre', cluster: 'Cloud Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A21', seatNumber: 'A21', name: 'Jayanth T', cluster: 'NextGen', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A22', seatNumber: 'A22', name: 'Aravindh Baskar', cluster: 'Atl Migration', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A23', seatNumber: 'A23', name: 'Siddharth Natarajan', cluster: 'NextGen', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A24', seatNumber: 'A24', name: 'Divya S', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A25', seatNumber: 'A25', name: 'Divya Priya', cluster: 'NextGen', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A26', seatNumber: 'A26', name: 'Naadira Sahar N', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A27', seatNumber: 'A27', name: 'Rithiga Sri', cluster: 'NextGen', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A28', seatNumber: 'A28', name: 'Jeeva Abishake', cluster: 'NextGen', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A29', seatNumber: 'A29', name: 'Balaji S', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A30', seatNumber: 'A30', name: 'Bellapu Anil Kumar', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A31', seatNumber: 'A31', name: 'Hariharan E', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A32', seatNumber: 'A32', name: 'Nagaraj S', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A33', seatNumber: 'A33', name: 'Gabriel E', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A34', seatNumber: 'A34', name: 'Vinay', cluster: 'PM', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A35', seatNumber: 'A35', name: 'Sivanesh B', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A36', seatNumber: 'A36', name: 'Madhukiran Reddy', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A37', seatNumber: 'A37', name: 'Pavithra Murugan', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A38', seatNumber: 'A38', name: 'Mohamed Abdul Azeez', cluster: 'Security', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A39', seatNumber: 'A39', name: 'Janardhan Gupta', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A40', seatNumber: 'A40', name: 'Avinash Kumar', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A41', seatNumber: 'A41', name: 'Muhammed Suhaib', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A42', seatNumber: 'A42', name: 'Easwar J', cluster: 'DevOps', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A43', seatNumber: 'A43', name: 'Srimathi V', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A44', seatNumber: 'A44', name: 'Sudharshna Lakshmi S', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A45', seatNumber: 'A45', name: 'Janani Priya', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A46', seatNumber: 'A46', name: 'Arul Prasad', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A47', seatNumber: 'A47', name: 'Pavithra Seetharaman', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A48', seatNumber: 'A48', name: 'Mohamed Hariz', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A50', seatNumber: 'A50', name: 'Shaun Eliot Alex Nicholas', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A51', seatNumber: 'A51', name: 'Sai Jai Bhargav', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A52', seatNumber: 'A52', name: 'V Devendra Reddy', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A53', seatNumber: 'A53', name: 'Ajay Babu Mulakalapalli', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A54', seatNumber: 'A54', name: 'Sanjay Kumar Allam', cluster: 'Atlassian', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A55', seatNumber: 'A55', name: 'Pavan Prasad J', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A56', seatNumber: 'A56', name: 'Varsha', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A57', seatNumber: 'A57', name: 'Manoj', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A58', seatNumber: 'A58', name: 'Ashley Nivedha J', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A59', seatNumber: 'A59', name: 'Shaikha Sanju', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A60', seatNumber: 'A60', name: 'Sahana Sathyan', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A61', seatNumber: 'A61', name: 'Bhavadeep Reddy', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A62', seatNumber: 'A62', name: 'Avinash Pulavarthi', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A63', seatNumber: 'A63', name: 'Thirisha Babu', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' },
  { id: 'A64', seatNumber: 'A64', name: 'Joshna Acsha', cluster: 'AI Eng', status: 'Present', type: 'onsite', wing: 'A-Tech' }
];
let seats = [
  { id: 1, number: 'A1', occupied: false },
  { id: 2, number: 'A2', occupied: true },
];

// REST endpoints
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

app.get('/api/seats', (req, res) => {
  res.json(seats);
});

app.put('/api/seats/:id', (req, res) => {
  const seatId = parseInt(req.params.id);
  const { occupied } = req.body;
  const seat = seats.find((s) => s.id === seatId);
  if (seat) {
    seat.occupied = occupied;
    io.emit('seatUpdate', seat); // Real-time update
    res.json(seat);
  } else {
    res.status(404).json({ error: 'Seat not found' });
  }
});

// Legacy login route for demo/legacy support
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // For demo: accept password 'password123' for any user with matching email
  const user = employees.find(
    (emp) => emp.email === username && password === 'password123'
  );
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(403).json({ success: false, message: 'Invalid credentials' });
  }
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 