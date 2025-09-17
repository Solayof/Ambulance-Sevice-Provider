
"use client";
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL or key not found in .env.local');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default function AssignmentPage() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [ambulances, setAmbulances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
        if (profile && profile.role === 'admin') {
          setUser(user);
          fetchRequests();
          fetchAmbulances();
        } else {
          router.push('/dashboard');
        }
      } else {
        router.push('/signup');
      }
      setLoading(false);
    };
    getUser();
  }, [router]);

  const fetchRequests = async () => {
    const { data, error } = await supabase.from('requests').select('*').eq('status', 'pending');
    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data);
    }
  };

  const fetchAmbulances = async () => {
    const { data, error } = await supabase.from('ambulances').select('*').eq('status', 'available');
    if (error) {
      console.error('Error fetching ambulances:', error);
    } else {
      setAmbulances(data);
    }
  };

  const handleAssign = async (requestId: string, ambulanceId: string) => {
    if (!user) return;

    const { data, error } = await supabase.from('assignments').insert([
      {
        request_id: requestId,
        ambulance_id: ambulanceId,
        assigned_by: user.id,
      },
    ]);

    if (error) {
      console.error('Error creating assignment:', error);
    } else {
      console.log('Assignment created:', data);
      await supabase.from('requests').update({ status: 'assigned' }).eq('id', requestId);
      await supabase.from('ambulances').update({ status: 'en_route' }).eq('id', ambulanceId);
      fetchRequests();
      fetchAmbulances();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assign Ambulances</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="p-4 border rounded-md">
            <h2 className="text-lg font-bold">{request.caller_name}</h2>
            <p>{request.address}</p>
            <p>{request.emergency_description}</p>
            <p>Priority: {request.priority}</p>
            <div className="mt-2">
              <select
                onChange={(e) => handleAssign(request.id, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select an ambulance</option>
                {ambulances.map((ambulance) => (
                  <option key={ambulance.id} value={ambulance.id}>
                    {ambulance.identifier}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
