const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://nazmlmiscsdnnuczfqtg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hem1sbWlzY3Nkbm51Y3pmcXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA4NTk5NTcsImV4cCI6MjA2NjQzNTk1N30.ki2wTgc9tC7nVTWaTIbBsK51sFzFNcEIlgkvpPZnjD0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const users = [
  { email: 'farhan.akthar@company.com', full_name: 'Farhan Akthar', seat_number: 'A03', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'suba.shree@company.com', full_name: 'Suba Shree K B', seat_number: 'A04', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'harini.r@company.com', full_name: 'Harini R', seat_number: 'A05', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'phani.kumar@company.com', full_name: 'Phani Kumar', seat_number: 'A06', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'matcha.bhavana@company.com', full_name: 'Matcha Bhavana', seat_number: 'A07', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'viswa.ak@company.com', full_name: 'Viswa AK', seat_number: 'A08', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'yogesh.srivastava@company.com', full_name: 'Yogesh Srivastava', seat_number: 'A09', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'karthikeyan.k@company.com', full_name: 'Karthikeyan K', seat_number: 'A10', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'vinoth.kumar@company.com', full_name: 'Vinoth Kumar S', seat_number: 'A11', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'ragavi.n@company.com', full_name: 'Ragavi N', seat_number: 'A12', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'pranav.p@company.com', full_name: 'Pranav P', seat_number: 'A13', cluster: 'Full Stack', wing: 'A-Tech' },
  { email: 'guhanandan@company.com', full_name: 'Guhanandan', seat_number: 'A14', cluster: 'Full Stack', wing: 'A-Tech' },
  { email: 'muhammad.yaashvin@company.com', full_name: 'Muhammad Yaashvin C', seat_number: 'A15', cluster: 'Full Stack', wing: 'A-Tech' },
  { email: 'kamal.sekhar@company.com', full_name: 'Kamal Sekhar C', seat_number: 'A16', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'aakash@company.com', full_name: 'Aakash', seat_number: 'A17', cluster: 'NextGen', wing: 'A-Tech' },
  { email: 'santosh.kumar@company.com', full_name: 'Santosh Kumar Dondapati', seat_number: 'A18', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'bashar.naieem@company.com', full_name: 'A S Bashar Naieem', seat_number: 'A19', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'vasanti.ashwin@company.com', full_name: 'Vasanti Ashwin Bendre', seat_number: 'A20', cluster: 'Cloud Eng', wing: 'A-Tech' },
  { email: 'jayanth.t@company.com', full_name: 'Jayanth T', seat_number: 'A21', cluster: 'NextGen', wing: 'A-Tech' },
  { email: 'aravindh.baskar@company.com', full_name: 'Aravindh Baskar', seat_number: 'A22', cluster: 'Atl Migration', wing: 'A-Tech' },
  { email: 'siddharth.natarajan@company.com', full_name: 'Siddharth Natarajan', seat_number: 'A23', cluster: 'NextGen', wing: 'A-Tech' },
  { email: 'divya.s@company.com', full_name: 'Divya S', seat_number: 'A24', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'divya.priya@company.com', full_name: 'Divya Priya', seat_number: 'A25', cluster: 'NextGen', wing: 'A-Tech' },
  { email: 'naadira.sahar@company.com', full_name: 'Naadira Sahar N', seat_number: 'A26', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'rithiga.sri@company.com', full_name: 'Rithiga Sri', seat_number: 'A27', cluster: 'NextGen', wing: 'A-Tech' },
  { email: 'jeeva.abishake@company.com', full_name: 'Jeeva Abishake', seat_number: 'A28', cluster: 'NextGen', wing: 'A-Tech' },
  { email: 'balaji.s@company.com', full_name: 'Balaji S', seat_number: 'A29', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'bellapu.anil@company.com', full_name: 'Bellapu Anil Kumar', seat_number: 'A30', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'hariharan.e@company.com', full_name: 'Hariharan E', seat_number: 'A31', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'nagaraj.s@company.com', full_name: 'Nagaraj S', seat_number: 'A32', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'gabriel.e@company.com', full_name: 'Gabriel E', seat_number: 'A33', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'vinay@company.com', full_name: 'Vinay', seat_number: 'A34', cluster: 'PM', wing: 'A-Tech' },
  { email: 'sivanesh.b@company.com', full_name: 'Sivanesh B', seat_number: 'A35', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'madhukiran.reddy@company.com', full_name: 'Madhukiran Reddy', seat_number: 'A36', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'pavithra.murugan@company.com', full_name: 'Pavithra Murugan', seat_number: 'A37', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'mohamed.abdul@company.com', full_name: 'Mohamed Abdul Azeez', seat_number: 'A38', cluster: 'Security', wing: 'A-Tech' },
  { email: 'janardhan.gupta@company.com', full_name: 'Janardhan Gupta', seat_number: 'A39', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'avinash.kumar@company.com', full_name: 'Avinash Kumar', seat_number: 'A40', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'muhammed.suhaib@company.com', full_name: 'Muhammed Suhaib', seat_number: 'A41', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'easwar.j@company.com', full_name: 'Easwar J', seat_number: 'A42', cluster: 'DevOps', wing: 'A-Tech' },
  { email: 'srimathi.v@company.com', full_name: 'Srimathi V', seat_number: 'A43', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'sudharshna.lakshmi@company.com', full_name: 'Sudharshna Lakshmi S', seat_number: 'A44', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'janani.priya@company.com', full_name: 'Janani Priya', seat_number: 'A45', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'arul.prasad@company.com', full_name: 'Arul Prasad', seat_number: 'A46', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'pavithra.seetharaman@company.com', full_name: 'Pavithra Seetharaman', seat_number: 'A47', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'mohamed.hariz@company.com', full_name: 'Mohamed Hariz', seat_number: 'A48', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'shaun.eliot@company.com', full_name: 'Shaun Eliot Alex Nicholas', seat_number: 'A50', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'sai.jai@company.com', full_name: 'Sai Jai Bhargav', seat_number: 'A51', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'devendra.reddy@company.com', full_name: 'V Devendra Reddy', seat_number: 'A52', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'ajay.babu@company.com', full_name: 'Ajay Babu Mulakalapalli', seat_number: 'A53', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'sanjay.kumar@company.com', full_name: 'Sanjay Kumar Allam', seat_number: 'A54', cluster: 'Atlassian', wing: 'A-Tech' },
  { email: 'pavan.prasad@company.com', full_name: 'Pavan Prasad J', seat_number: 'A55', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'varsha@company.com', full_name: 'Varsha', seat_number: 'A56', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'manoj@company.com', full_name: 'Manoj', seat_number: 'A57', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'ashley.nivedha@company.com', full_name: 'Ashley Nivedha J', seat_number: 'A58', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'shaikha.sanju@company.com', full_name: 'Shaikha Sanju', seat_number: 'A59', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'sahana.sathyan@company.com', full_name: 'Sahana Sathyan', seat_number: 'A60', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'bhavadeep.reddy@company.com', full_name: 'Bhavadeep Reddy', seat_number: 'A61', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'avinash.pulavarthi@company.com', full_name: 'Avinash Pulavarthi', seat_number: 'A62', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'thirisha.babu@company.com', full_name: 'Thirisha Babu', seat_number: 'A63', cluster: 'AI Eng', wing: 'A-Tech' },
  { email: 'joshna.acsha@company.com', full_name: 'Joshna Acsha', seat_number: 'A64', cluster: 'AI Eng', wing: 'A-Tech' }
];

const DUMMY_PASSWORD = 'DummyPassword123!';

(async () => {
  for (const user of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: user.email,
      password: DUMMY_PASSWORD,
      user_metadata: {
        full_name: user.full_name,
        seat_number: user.seat_number,
        cluster: user.cluster,
        wing: user.wing,
      }
    });
    if (error) {
      console.error('Error creating user:', user.email, error);
    } else {
      console.log(
        `('${data.user.id}', '${user.email}', '${user.full_name}', 'employee', '${user.cluster}', '${user.seat_number}', '${user.wing}', 'Present'),`
      );
    }
  }
})(); 