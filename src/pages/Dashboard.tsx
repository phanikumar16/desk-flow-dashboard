import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <p>Welcome, <b>{profile.full_name}</b>!</p>
      <p>Email: <b>{profile.email}</b></p>
      <p>Seat Number: <b>{profile.seat_number}</b></p>
      <p>Cluster: <b>{profile.cluster}</b></p>
      <p>Wing: <b>{profile.wing}</b></p>
      <button onClick={handleLogout} className="mt-6 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
};

export default Dashboard; 