import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { employees } from '../data/employeeData';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!email.toLowerCase().endsWith('@cprime.com')) {
      setError('Please use your @cprime.com email address.');
      return;
    }
    setLoading(true);
    // Sign up with Supabase
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }
    // Find seat assignment
    let seatInfo = null;
    // Generate the reference email from the employee name
    const generateEmail = (name: string) => {
      if (name === 'Unassigned') return '';
      return name.toLowerCase().replace(/\s+/g, '.') + '@cprime.com';
    };
    // Only allow signup if email matches a generated employee email
    seatInfo = employees.find(emp =>
      emp.name !== 'Unassigned' &&
      generateEmail(emp.name) === email.toLowerCase()
    );
    if (!seatInfo) {
      setError('This email is not recognized as a valid employee. Please use your official @cprime.com email.');
      setLoading(false);
      return;
    }
    // Insert into Supabase employees table
    await supabase.from('employees').insert([
      {
        name,
        email,
        seatNumber: seatInfo ? seatInfo.seatNumber : null,
        wing: seatInfo ? seatInfo.wing : null,
      }
    ]);
    setSuccess(
      seatInfo
        ? `Signup successful! Your seat: ${seatInfo.seatNumber} (${seatInfo.wing})`
        : 'Signup successful! No seat assigned (remote employee or not found).'
    );
    setLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200">
      <form onSubmit={handleSignup} className="max-w-sm mx-auto p-8 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
        <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Sign Up</h2>
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <div className="text-red-600 mt-3 text-center font-medium">{error}</div>}
        {success && <div className="text-green-600 mt-3 text-center font-medium">{success}</div>}
        <div className="mt-6 text-center">
          <a href="/login" className="text-blue-600 hover:underline font-medium">Already have an account? Sign In</a>
        </div>
      </form>
    </div>
  );
};

export default Signup; 