import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Pencil, Trash2, Flame, Trophy, CheckCircle2, User as UserIcon, BookOpen, Dumbbell, Brain, Mic, Camera } from 'lucide-react';
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
  if (h > 0 && m > 0) return `${h}H ${m}M`;
  if (h > 0) return `${h}H`;
  return `${m}M`;
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
};

const JournalEntryCard = ({ entry, navigate, handleDelete }: { entry: JournalEntry, navigate: any, handleDelete: (id: string) => void }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="immersive-card cursor-pointer group"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="absolute top-2 left-2 w-full h-full bg-brand-tertiary -z-10 -translate-x-2 -translate-y-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute -top-3 -right-3 w-6 h-6 bg-brand-quaternary rounded-full shadow-hard-sm border-2 border-border-strong opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="font-black text-3xl tracking-tight uppercase block">{formatDate(entry.date)}</span>
          <span className="text-base font-bold uppercase mt-1 block">Activity Log</span>
        </div>
        
        <div className="flex gap-2 relative z-10" onClick={e => e.stopPropagation()}>
          <button 
            onClick={() => navigate('/new', { state: { entry } })}
            className="p-2 border-2 border-border-strong hover:bg-brand-quaternary hover:text-white transition-colors shadow-hard-sm"
            title="Edit Entry"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => handleDelete(entry.id)}
            className="p-2 border-2 border-border-strong bg-danger text-white hover:bg-white hover:text-danger transition-colors shadow-hard-sm"
            title="Delete Entry"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entry.meditation_mins > 0 && (
          <div className="border-[3px] border-border-strong p-4 flex items-center gap-4 bg-brand-tertiary text-white">
            <div className="p-2 border-2 border-white">
              <Brain size={28} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide mb-1">Meditation</p>
              <p className="font-black text-xl">{formatDuration(entry.meditation_mins)}</p>
            </div>
          </div>
        )}

        {(entry.sport_mins > 0 || entry.sport_type) && (
          <div className="border-[3px] border-border-strong p-4 flex flex-col justify-center gap-2 bg-success text-white">
            <div className="flex items-center gap-4">
              <div className="p-2 border-2 border-white">
                <Dumbbell size={28} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide mb-1">Sport</p>
                <p className="font-black text-xl">{formatDuration(entry.sport_mins)}</p>
              </div>
            </div>
            {expanded && entry.sport_type && (
              <div className="mt-2 border-t-2 border-white pt-2 text-base font-medium">
                {entry.sport_type}
              </div>
            )}
          </div>
        )}

        {(entry.oral_mins > 0 || entry.oral_type) && (
          <div className="border-[3px] border-border-strong p-4 flex flex-col justify-center gap-2 bg-warning text-border-strong">
            <div className="flex items-center gap-4">
              <div className="p-2 border-2 border-border-strong">
                <Mic size={28} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide mb-1">Oral Ex</p>
                <p className="font-black text-xl">{formatDuration(entry.oral_mins)}</p>
              </div>
            </div>
            {expanded && entry.oral_type && (
              <div className="mt-2 border-t-2 border-border-strong pt-2 text-base font-medium">
                {entry.oral_type}
              </div>
            )}
          </div>
        )}

        {entry.reading_mins > 0 && (
          <div className={`col-span-1 ${expanded && (entry.reading_book || entry.reading_notes) ? 'sm:col-span-2' : ''} border-[3px] border-border-strong p-4 flex flex-col justify-center gap-2 bg-brand-quaternary text-white`}>
            <div className="flex items-center gap-4">
              <div className="p-2 border-2 border-white">
                <BookOpen size={28} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wide mb-1">Reading</p>
                <p className="font-black text-xl">{formatDuration(entry.reading_mins)}</p>
              </div>
            </div>
            {expanded && (entry.reading_book || entry.reading_notes) && (
              <div className="mt-2 border-t-2 border-white pt-2">
                {entry.reading_book && (
                  <p className="font-bold text-lg mb-2">
                    {entry.reading_book}
                  </p>
                )}
                {entry.reading_notes && (
                  <div className="bg-white text-text p-4 font-medium border-[3px] border-border-strong mt-2">
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
          <span className="text-sm font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity bg-warning px-2 py-1 border-2 border-border-strong">Click to expand details</span>
        </div>
      )}
    </div>
  );
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
    if (!window.confirm('Reset this journey step? Your progress will be lost.')) return;
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
    <div className="min-h-screen bg-canvas pb-24">
      
      {/* Navbar */}
      <nav className="bg-canvas border-b-[4px] border-border-strong sticky top-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 immersive-card !p-2 !shadow-hard-sm">
              <div className="w-10 h-10 bg-border-strong text-white flex items-center justify-center font-black text-xl">
                LP
              </div>
              <span className="font-black text-2xl uppercase tracking-widest pr-4">LogPulse</span>
            </div>
            <div className="flex items-center gap-6">
              <Link 
                to="/profile" 
                className="flex items-center gap-3 immersive-card !p-2 !shadow-hard-sm hover:-translate-y-1 transition-transform"
              >
                {user?.profile_picture_url ? (
                  <img src={user.profile_picture_url} alt="Profile" className="w-10 h-10 object-cover border-[3px] border-border-strong" />
                ) : (
                  <div className="w-10 h-10 bg-brand-tertiary text-white border-[3px] border-border-strong flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                )}
                <span className="hidden sm:inline font-bold uppercase pr-2">{user?.pseudo || 'Profile'}</span>
              </Link>
              <button 
                onClick={logout} 
                className="immersive-card !p-3 !shadow-hard-sm hover:bg-danger hover:text-white transition-colors"
                title="Logout"
              >
                <LogOut size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        {/* Hero Welcome */}
        <div className="relative mb-16">
          <div className="absolute w-full h-full bg-brand-tertiary translate-x-4 translate-y-4 border-[4px] border-border-strong"></div>
          <div className="immersive-card bg-surface !p-12 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tight mb-4 leading-none">
                HELLO, <span className="text-brand-quaternary">{user?.pseudo || user?.email.split('@')[0]}</span>
              </h1>
              <p className="text-xl sm:text-2xl font-medium max-w-xl">
                EVERY STEP BUILDS YOUR JOURNEY
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link 
                to="/new" 
                className="immersive-btn bg-brand-quaternary text-white text-xl !py-4 !px-8"
              >
                <span>LOG NEW ACTIVITY</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="immersive-card flex items-center gap-6">
            <div className="w-16 h-16 border-[3px] border-border-strong bg-warning flex items-center justify-center text-border-strong shadow-hard-sm">
              <Flame size={32} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-1">Current Streak</p>
              <h3 className="text-4xl font-black">{stats.current_streak} <span className="text-xl">DAYS</span></h3>
            </div>
          </div>
          <div className="immersive-card flex items-center gap-6">
            <div className="w-16 h-16 border-[3px] border-border-strong bg-brand-tertiary flex items-center justify-center text-white shadow-hard-sm">
              <Trophy size={32} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-1">Longest Streak</p>
              <h3 className="text-4xl font-black">{stats.longest_streak} <span className="text-xl">DAYS</span></h3>
            </div>
          </div>
          <div className="immersive-card flex items-center gap-6">
            <div className="w-16 h-16 border-[3px] border-border-strong bg-success flex items-center justify-center text-white shadow-hard-sm">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <p className="text-sm font-bold uppercase tracking-widest mb-1">Total Entries</p>
              <h3 className="text-4xl font-black">{stats.total_entries}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Chart Section */}
          <div className="lg:col-span-1 h-fit relative group">
            <div className="absolute inset-0 bg-brand-tertiary translate-x-3 translate-y-3 border-[4px] border-border-strong -z-10"></div>
            <div className="immersive-card">
              <h2 className="text-3xl font-black uppercase mb-8 border-b-[4px] border-border-strong pb-4">
                Weekly Overview
              </h2>
              {chartData.length > 0 ? (
                <div className="h-72 w-full font-mono">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#000000" opacity={0.2} />
                      <XAxis dataKey="date" axisLine={{ stroke: '#000', strokeWidth: 3 }} tickLine={{ stroke: '#000', strokeWidth: 3 }} tick={{ fontSize: 14, fill: '#000', fontWeight: 'bold' }} dy={10} />
                      <YAxis axisLine={{ stroke: '#000', strokeWidth: 3 }} tickLine={{ stroke: '#000', strokeWidth: 3 }} tick={{ fontSize: 14, fill: '#000', fontWeight: 'bold' }} />
                      <Tooltip 
                        cursor={{ fill: '#f3f4f6' }} 
                        contentStyle={{ borderRadius: '0px', border: '3px solid #000', boxShadow: '6px 6px 0 #000', fontFamily: 'Oswald' }}
                      />
                      <Legend iconType="square" wrapperStyle={{ paddingTop: '20px', fontSize: '16px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                      <Bar dataKey="Meditation" stackId="a" fill="var(--color-brand-tertiary)" stroke="#000" strokeWidth={2} />
                      <Bar dataKey="Reading" stackId="a" fill="var(--color-brand-quaternary)" stroke="#000" strokeWidth={2} />
                      <Bar dataKey="Sport" stackId="a" fill="var(--color-success)" stroke="#000" strokeWidth={2} />
                      <Bar dataKey="Oral" stackId="a" fill="var(--color-warning)" stroke="#000" strokeWidth={2} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center border-[3px] border-dashed border-border-strong bg-gray-100">
                  <p className="font-bold text-xl uppercase text-center px-4">No artifacts collected yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* History Section */}
          <div className="lg:col-span-2">
            <h2 className="text-4xl font-black uppercase mb-8 text-white drop-shadow-[2px_2px_0_#000]">Your Journey</h2>
            
            {loading ? (
              <div className="immersive-card flex justify-center p-12">
                <div className="font-black text-2xl uppercase animate-pulse">
                  Preparing the next stop...
                </div>
              </div>
            ) : entries.length === 0 ? (
              <div className="immersive-card text-center p-16 flex flex-col items-center">
                <div className="w-24 h-24 border-[4px] border-border-strong bg-brand-quaternary text-white flex items-center justify-center mb-6 shadow-hard-sm">
                  <BookOpen size={48} />
                </div>
                <h3 className="text-3xl font-black uppercase mb-4">Your exhibit is empty.</h3>
                <p className="text-xl font-medium mb-8 max-w-sm mx-auto">Add the first item to begin tracking your evolution.</p>
                <Link to="/new" className="immersive-btn bg-brand-tertiary text-white text-lg">
                  <span>ENTER FIRST LOG</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-10">
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
          <div className="mt-24 pt-16 border-t-[6px] border-border-strong">
            <h2 className="text-5xl font-black text-white drop-shadow-[3px_3px_0_#000] uppercase mb-12 flex items-center gap-4">
              <div className="p-3 bg-surface text-border-strong border-[4px] border-border-strong shadow-hard-sm">
                <Camera size={40} />
              </div>
              Head Evolution
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {entries.filter(e => e.image_url).map(entry => (
                <div key={`img-${entry.id}`} className="immersive-card !p-2 group cursor-pointer hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute top-4 left-4 z-10 bg-brand-quaternary border-[3px] border-border-strong text-white text-sm font-black px-2 py-1 shadow-hard-sm uppercase">
                    {formatDate(entry.date).split(' ')[0]} {formatDate(entry.date).split(' ')[1]}
                  </div>
                  <img 
                    src={entry.image_url!} 
                    alt={`Evolution snapshot from ${entry.date}`} 
                    className="w-full aspect-[3/4] object-cover border-[3px] border-border-strong" 
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
