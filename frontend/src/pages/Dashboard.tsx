import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, LogOut, Pencil, Trash2, Flame, Trophy, CheckCircle2, User as UserIcon, BookOpen, Dumbbell, Brain, Mic, Camera } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface JournalEntry {
  id: string;
  date: string;
  meditation_mins: number;
  reading_mins: number;
  reading_book: string | null;
  reading_notes: string | null;
  sport_type: string | null;
  sport_mins: number;
  oral_type: string | null;
  oral_mins: number;
  writing_mins: number;
  image_url: string | null;
}

const formatDuration = (totalMins: number) => {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

const JournalEntryCard = ({ entry, navigate, handleDelete }: { entry: JournalEntry, navigate: any, handleDelete: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="p-6 md:p-8 rounded-3xl border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-lg transition bg-white group relative overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-black text-indigo-900 text-2xl tracking-tight capitalize block">{formatDate(entry.date)}</span>
          <span className="text-sm font-medium text-gray-400 mt-1 block">Activity Log</span>
        </div>
        
        <div className="flex gap-2 relative z-10" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => navigate('/new', { state: { entry } })}
            className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
            title="Edit Entry"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => handleDelete(entry.id)}
            className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
            title="Delete Entry"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entry.meditation_mins > 0 && (
          <div className="bg-purple-50/50 p-4 rounded-2xl border border-purple-100 flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
              <Brain size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Meditation</p>
              <p className="font-bold text-purple-900 text-lg">{formatDuration(entry.meditation_mins)}</p>
            </div>
          </div>
        )}

        {(entry.sport_mins > 0 || entry.sport_type) && (
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <Dumbbell size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Sport</p>
                <p className="font-bold text-emerald-900 text-lg">{formatDuration(entry.sport_mins)}</p>
              </div>
            </div>
            {expanded && entry.sport_type && (
              <div className="mt-2 bg-white/60 p-3 rounded-xl border border-emerald-100/50 text-emerald-800 text-sm font-medium">
                {entry.sport_type}
              </div>
            )}
          </div>
        )}

        {(entry.oral_mins > 0 || entry.oral_type) && (
          <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 flex flex-col justify-center gap-2">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Mic size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">Oral Ex</p>
                <p className="font-bold text-orange-900 text-lg">{formatDuration(entry.oral_mins)}</p>
              </div>
            </div>
            {expanded && entry.oral_type && (
              <div className="mt-2 bg-white/60 p-3 rounded-xl border border-orange-100/50 text-orange-800 text-sm font-medium">
                {entry.oral_type}
              </div>
            )}
          </div>
        )}

        {entry.reading_mins > 0 && (
          <div className={`col-span-1 ${expanded && (entry.reading_book || entry.reading_notes) ? 'sm:col-span-2' : ''} bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex flex-col justify-center gap-2`}>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Reading</p>
                <p className="font-bold text-blue-900 text-lg">{formatDuration(entry.reading_mins)}</p>
              </div>
            </div>
            {expanded && (entry.reading_book || entry.reading_notes) && (
              <div className="mt-2">
                {entry.reading_book && (
                  <p className="font-bold text-blue-900 text-lg mb-2 pl-1">
                    {entry.reading_book}
                  </p>
                )}
                {entry.reading_notes && (
                  <div className="bg-white/60 p-4 rounded-xl text-blue-800 italic text-sm leading-relaxed border border-blue-100/50">
                    "{entry.reading_notes}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {!expanded && (entry.reading_notes || entry.reading_book || entry.sport_type || entry.oral_type) && (
        <div className="mt-4 text-center">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Click to expand details</span>
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState({ current_streak: 0, longest_streak: 0, total_entries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await apiClient.get('/journals/');
      setEntries(response.data);
      const statsResponse = await apiClient.get('/journals/stats');
      setStats(statsResponse.data);
    } catch (err) {
      console.error('Failed to fetch entries', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      await apiClient.delete(`/journals/${id}`);
      fetchEntries();
    } catch (err) {
      console.error('Failed to delete entry', err);
      alert('Failed to delete entry.');
    }
  };

  const chartData = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(entry => ({
      date: entry.date.split('-').slice(1).join('/'),
      Meditation: entry.meditation_mins,
      Reading: entry.reading_mins,
      Sport: entry.sport_mins,
      Oral: entry.oral_mins
    }));

  return (
    <div className="min-h-screen bg-gray-50 pb-12 font-sans selection:bg-indigo-100">
      
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                L
              </div>
              <span className="font-extrabold text-xl tracking-tight text-gray-900">LogPulse</span>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                to="/profile" 
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-full font-medium transition"
              >
                {user?.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt="Profile" className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <UserIcon size={16} />
                  </div>
                )}
                <span className="hidden sm:inline">{user?.pseudo || 'Profile'}</span>
              </Link>
              <button 
                onClick={logout} 
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Hero Welcome */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                Hello, <span className="text-indigo-300">{user?.pseudo || user?.email.split('@')[0]}</span> 👋
              </h1>
              <p className="text-indigo-100 text-lg sm:text-xl max-w-xl font-medium">
                Ready to track your habits and conquer your goals? Every small step builds your journey.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link 
                to="/new" 
                className="group inline-flex items-center gap-3 bg-white text-indigo-900 font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:bg-indigo-50 transition transform hover:-translate-y-1 text-lg"
              >
                <PlusCircle className="text-indigo-600 group-hover:scale-110 transition-transform" size={24} />
                Log New Activity
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-orange-500 shadow-inner">
              <Flame size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Current Streak</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{stats.current_streak} <span className="text-lg text-gray-400 font-medium">Days</span></h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-500 shadow-inner">
              <Trophy size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Longest Streak</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{stats.longest_streak} <span className="text-lg text-gray-400 font-medium">Days</span></h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-500 shadow-inner">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Entries</p>
              <h3 className="text-3xl font-extrabold text-gray-900">{stats.total_entries}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              Weekly Overview
            </h2>
            {chartData.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip 
                      cursor={{ fill: '#f3f4f6' }} 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '13px', fontWeight: 500 }} />
                    <Bar dataKey="Meditation" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
                    <Bar dataKey="Reading" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Sport" stackId="a" fill="#10b981" />
                    <Bar dataKey="Oral" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                <p className="text-gray-400 font-medium text-center px-4">Log some activities to see your trends!</p>
              </div>
            )}
          </div>

          {/* History Section */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6">Your Journey</h2>
            
            {loading ? (
              <div className="flex justify-center p-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="animate-pulse flex gap-2 items-center text-indigo-500 font-medium">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                  Loading your journey...
                </div>
              </div>
            ) : entries.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-300 rounded-full flex items-center justify-center mb-4">
                  <BookOpen size={40} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No entries yet</h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">Your journal is empty. Take the first step and log today's activities!</p>
                <Link to="/new" className="bg-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  Create First Entry
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {entries.map(entry => (
                  <JournalEntryCard 
                    key={entry.id} 
                    entry={entry} 
                    navigate={navigate} 
                    handleDelete={handleDelete} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Head Evolution Section */}
        {entries.some(e => e.image_url) && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
              <div className="p-3 bg-pink-100 text-pink-600 rounded-2xl shadow-inner">
                <Camera size={28} />
              </div>
              Head Evolution
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {entries.filter(e => e.image_url).map(entry => (
                <div key={`img-${entry.id}`} className="group relative rounded-3xl overflow-hidden shadow-sm border-4 border-white hover:shadow-2xl hover:-translate-y-1 transition duration-500 cursor-pointer">
                  <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20">
                    {formatDate(entry.date)}
                  </div>
                  <img 
                    src={entry.image_url!} 
                    alt={`Evolution snapshot from ${entry.date}`} 
                    className="w-full aspect-[3/4] object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
