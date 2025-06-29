import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    window.location.href = '/';
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full mb-4 p-2 border rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <button
        type="button"
        className="w-full bg-gray-500 text-white py-2 rounded font-semibold mt-2"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          setError('');
          try {
            const response = await fetch('http://localhost:4000/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: email, password }),
            });
            const data = await response.json();
            if (data.success) {
              window.location.href = '/dashboard';
            } else {
              setError(data.message || 'Legacy login failed');
            }
          } catch (err) {
            setError('Network error');
          }
          setLoading(false);
        }}
      >
        {loading ? 'Logging in...' : 'Legacy Login'}
      </button>
    </form>
  );
};

export default Login; 