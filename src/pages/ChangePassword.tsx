import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useLocation } from 'react-router-dom';

const ChangePassword: React.FC = () => {
  const location = useLocation();
  const emailFromState = location.state && location.state.email ? location.state.email : '';
  const [email, setEmail] = useState(emailFromState);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP (send password reset email)
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!email) {
      setError('Email is required.');
      setLoading(false);
      return;
    }
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      setLoading(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep('verify');
      setSuccess('OTP sent to your email.');
    }
  };

  // Step 2: Verify OTP and set new password
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    });
    if (!error) {
      // Update password after successful OTP verification
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess('Password changed successfully! You can now log in.');
      }
    } else {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={step === 'request' ? handleRequestOtp : handleVerifyOtp} className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Change Password</h2>
        {emailFromState ? (
          <div className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-600">{emailFromState}</div>
        ) : (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        )}
        {step === 'request' && (
          <>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </>
        )}
        {step === 'verify' && (
          <>
            <input
              type="text"
              placeholder="OTP from email"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </>
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-600 text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : step === 'request' ? 'Send OTP' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
