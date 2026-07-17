import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Calendar, Save, LogOut, Pencil, Trash2, X, BarChart3, Flame, Trophy, CheckCircle2, User as UserIcon } from 'lucide-react';
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

const DurationSelector = ({ value, onChange, disabled }: { value: number, onChange: (val: number) => void, disabled?: boolean }) => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return (
    <div className="flex gap-2">
      <select 
        disabled={disabled}
        value={hours} 
        onChange={e => onChange(Number(e.target.value) * 60 + minutes)} 
        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 text-sm"
      >
        {[...Array(13)].map((_, i) => <option key={`h-${i}`} value={i}>{i}h</option>)}
      </select>
      <select 
        disabled={disabled}
        value={minutes} 
        onChange={e => onChange(hours * 60 + Number(e.target.value))} 
        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100 text-sm"
      >
        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => <option key={`m-${m}`} value={m}>{m}m</option>)}
      </select>
    </div>
  );
};

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
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [stats, setStats] = useState({ current_streak: 0, longest_streak: 0, total_entries: 0 });
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meditation, setMeditation] = useState(0);
  const [reading, setReading] = useState(0);
  const [readingBook, setReadingBook] = useState('');
  const [readingNotes, setReadingNotes] = useState('');
  const [sportType, setSportType] = useState('');
  const [sportMins, setSportMins] = useState(0);
  const [oralType, setOralType] = useState('');
  const [oralMins, setOralMins] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

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

  const handleEditClick = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setDate(entry.date);
    setMeditation(entry.meditation_mins);
    setReading(entry.reading_mins);
    setReadingBook(entry.reading_book || '');
    setReadingNotes(entry.reading_notes || '');
    setSportType(entry.sport_type || '');
    setSportMins(entry.sport_mins);
    setOralType(entry.oral_type || '');
    setOralMins(entry.oral_mins);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setDate(new Date().toISOString().split('T')[0]);
    setMeditation(0);
    setReading(0);
    setReadingBook('');
    setReadingNotes('');
    setSportType('');
    setSportMins(0);
    setOralType('');
    setOralMins(0);
    setImageFile(null);
    setImagePreview(null);
    setError('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const payload = {
      date,
      meditation_mins: meditation,
      reading_mins: reading,
      reading_book: readingBook || null,
      reading_notes: readingNotes || null,
      sport_type: sportType || null,
      sport_mins: sportMins,
      oral_type: oralType || null,
      oral_mins: oralMins,
      writing_mins: 0
    };

    try {
      let savedEntry;
      if (editingId) {
        const res = await apiClient.put(`/journals/${editingId}`, payload);
        savedEntry = res.data;
      } else {
        const res = await apiClient.post('/journals/', payload);
        savedEntry = res.data;
      }

      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        await apiClient.post(`/journals/${savedEntry.id}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      handleCancelEdit();
      fetchEntries();
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('You already have a journal entry for this date!');
      } else {
        setError('Failed to save entry. Please try again.');
      }
    }
  };

  // Prepare Chart Data (Last 7 Days)
  const chartData = [...entries]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7)
    .map(entry => ({
      date: entry.date.split('-').slice(1).join('/'), // Format as MM/DD
      Meditation: entry.meditation_mins,
      Reading: entry.reading_mins,
      Sport: entry.sport_mins
    }));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Logged in as <span className="font-semibold text-gray-700">{user?.pseudo || user?.email}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-medium transition"
            >
              {user?.profile_picture_url ? (
                <img src={user.profile_picture_url} alt="Profile" className="w-6 h-6 rounded-full object-cover" />
              ) : (
                <UserIcon size={18} />
              )}
              Profile
            </Link>
            <button 
              onClick={logout} 
              className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <Flame size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Current Streak</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.current_streak} Days</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Longest Streak</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.longest_streak} Days</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Entries</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.total_entries}</h3>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calendar size={20} className="text-blue-600" />
                {editingId ? 'Edit Entry' : 'New Entry'}
              </h2>
              {editingId && (
                <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              )}
            </div>

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
                  disabled={!!editingId}
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meditation Duration</label>
                  <DurationSelector value={meditation} onChange={setMeditation} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reading Duration</label>
                  <DurationSelector value={reading} onChange={setReading} />
                </div>
              </div>

              {reading > 0 && (
                <div className="space-y-4 bg-gray-50/80 p-4 rounded-xl border border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Book Name</label>
                    <input 
                      type="text" 
                      placeholder="What are you reading?"
                      value={readingBook} onChange={e => setReadingBook(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">What I've Learned</label>
                    <textarea 
                      rows={3}
                      placeholder="Jot down key takeaways or thoughts..."
                      value={readingNotes} onChange={e => setReadingNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-y text-sm"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sport Duration</label>
                  <DurationSelector value={sportMins} onChange={setSportMins} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oral Ex. Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Speech, Shadowing"
                    value={oralType} onChange={e => setOralType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Oral Duration</label>
                  <DurationSelector value={oralMins} onChange={setOralMins} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Picture</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 text-gray-600 font-medium py-3 px-4 rounded-xl text-center transition">
                    <span>{imageFile ? imageFile.name : 'Take a photo or choose image'}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageFile(e.target.files[0]);
                          setImagePreview(URL.createObjectURL(e.target.files[0]));
                        }
                      }}
                    />
                  </label>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-sm" />
                  )}
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition shadow-sm"
              >
                <Save size={18} />
                {editingId ? 'Update Entry' : 'Save Entry'}
              </button>
            </form>
          </div>

          {/* Right Column: Chart & History */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 size={20} className="text-blue-600" />
                Weekly Overview
              </h2>
              {chartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }} 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '14px' }} />
                      <Bar dataKey="Meditation" stackId="a" fill="#8b5cf6" radius={[0, 0, 4, 4]} />
                      <Bar dataKey="Reading" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="Sport" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-400">Not enough data for the chart.</p>
                </div>
              )}
            </div>

            {/* History Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Journal History</h2>
              
              {loading ? (
                <div className="flex justify-center p-8">
                  <p className="text-gray-500">Loading entries...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="bg-gray-50 p-8 rounded-xl text-center border border-dashed border-gray-300">
                  <p className="text-gray-500">No journal entries yet. Start tracking your habits today!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map(entry => (
                    <div key={entry.id} className="p-5 rounded-xl border border-gray-100 hover:border-blue-100 hover:shadow-sm transition bg-white group">
                      <div className="flex justify-between items-start mb-4">
                        <span className="font-bold text-blue-600 text-lg capitalize">{formatDate(entry.date)}</span>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEditClick(entry)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit Entry"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 text-sm text-gray-700 mt-2">
                        {entry.meditation_mins > 0 && (
                          <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 w-fit">
                            <span className="font-semibold text-gray-900">Meditation:</span> {formatDuration(entry.meditation_mins)}
                          </div>
                        )}
                        {(entry.sport_mins > 0 || entry.sport_type) && (
                          <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 w-fit">
                            <span className="font-semibold text-gray-900">Sport:</span> {entry.sport_type || 'Yes'} ({formatDuration(entry.sport_mins)})
                          </div>
                        )}
                        {(entry.oral_mins > 0 || entry.oral_type) && (
                          <div className="bg-gray-50 px-3 py-2 rounded-lg border border-gray-100 w-fit">
                            <span className="font-semibold text-gray-900">Oral Ex:</span> {entry.oral_type || 'Yes'} ({formatDuration(entry.oral_mins)})
                          </div>
                        )}
                        {entry.reading_mins > 0 && (
                          <div className="bg-blue-50/50 px-4 py-3 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">Reading:</span> 
                              <span>{formatDuration(entry.reading_mins)}</span>
                            </div>
                            {entry.reading_book && (
                              <p className="mt-2 font-medium text-blue-700 flex items-center gap-1">
                                📖 {entry.reading_book}
                              </p>
                            )}
                            {entry.reading_notes && (
                              <p className="mt-1 text-gray-600 italic leading-relaxed">
                                "{entry.reading_notes}"
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {entry.image_url && (
                        <div className="mt-4">
                          <img src={entry.image_url} alt="Daily snapshot" className="w-full max-w-sm rounded-xl border border-gray-100 object-cover shadow-sm" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
