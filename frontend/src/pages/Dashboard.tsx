import React, { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Calendar, Save, LogOut } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  meditation_mins: number;
  reading_mins: number;
  sport_type: string | null;
  sport_mins: number;
  oral_type: string | null;
  oral_mins: number;
  writing_mins: number;
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meditation, setMeditation] = useState(0);
  const [reading, setReading] = useState(0);
  const [sportType, setSportType] = useState('');
  const [sportMins, setSportMins] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await apiClient.get('/journals/');
      setEntries(response.data);
    } catch (err) {
      console.error('Failed to fetch entries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await apiClient.post('/journals/', {
        date,
        meditation_mins: meditation,
        reading_mins: reading,
        sport_type: sportType || null,
        sport_mins: sportMins,
        oral_mins: 0,
        writing_mins: 0
      });
      
      // Reset form and refresh list
      setMeditation(0);
      setReading(0);
      setSportType('');
      setSportMins(0);
      fetchEntries();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('You already have a journal entry for this date!');
      } else {
        setError('Failed to save entry. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Logged in as {user?.email}</p>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* New Entry Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              New Entry
            </h2>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meditation (m)</label>
                  <input 
                    type="number" min="0" 
                    value={meditation} onChange={e => setMeditation(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reading (m)</label>
                  <input 
                    type="number" min="0" 
                    value={reading} onChange={e => setReading(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport Type</label>
                <input 
                  type="text" 
                  placeholder="e.g. Running, Gym"
                  value={sportType} onChange={e => setSportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport Duration (m)</label>
                <input 
                  type="number" min="0" 
                  value={sportMins} onChange={e => setSportMins(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition"
              >
                <Save size={18} />
                Save Entry
              </button>
            </form>
          </div>

          {/* History Log */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Journal History</h2>
            
            {loading ? (
              <p className="text-gray-500">Loading entries...</p>
            ) : entries.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-300">
                <p className="text-gray-500">No journal entries yet. Start tracking your habits today!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map(entry => (
                  <div key={entry.id} className="p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition bg-white">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-blue-600">{entry.date}</span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="bg-gray-50 px-3 py-1 rounded-md">
                        <span className="font-medium text-gray-900">Meditation:</span> {entry.meditation_mins}m
                      </div>
                      <div className="bg-gray-50 px-3 py-1 rounded-md">
                        <span className="font-medium text-gray-900">Reading:</span> {entry.reading_mins}m
                      </div>
                      {(entry.sport_mins > 0 || entry.sport_type) && (
                        <div className="bg-gray-50 px-3 py-1 rounded-md">
                          <span className="font-medium text-gray-900">Sport:</span> {entry.sport_type || 'Yes'} ({entry.sport_mins}m)
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
