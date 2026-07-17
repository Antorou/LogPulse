import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Calendar, Save, ArrowLeft, Camera } from 'lucide-react';

const DurationSelector = ({ value, onChange, disabled }: { value: number, onChange: (val: number) => void, disabled?: boolean }) => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return (
    <div className="flex gap-2">
      <select 
        disabled={disabled}
        value={hours} 
        onChange={e => onChange(Number(e.target.value) * 60 + minutes)} 
        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white/50 backdrop-blur-sm disabled:bg-gray-100 text-gray-700 transition font-medium"
      >
        {[...Array(13)].map((_, i) => <option key={`h-${i}`} value={i}>{i}h</option>)}
      </select>
      <select 
        disabled={disabled}
        value={minutes} 
        onChange={e => onChange(hours * 60 + Number(e.target.value))} 
        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white/50 backdrop-blur-sm disabled:bg-gray-100 text-gray-700 transition font-medium"
      >
        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => <option key={`m-${m}`} value={m}>{m}m</option>)}
      </select>
    </div>
  );
};

export default function NewEntry() {
  const navigate = useNavigate();
  const location = useLocation();
  const entryToEdit = location.state?.entry;

  const [date, setDate] = useState(entryToEdit ? entryToEdit.date : new Date().toISOString().split('T')[0]);
  const [meditation, setMeditation] = useState(entryToEdit?.meditation_mins || 0);
  const [reading, setReading] = useState(entryToEdit?.reading_mins || 0);
  const [readingBook, setReadingBook] = useState(entryToEdit?.reading_book || '');
  const [readingNotes, setReadingNotes] = useState(entryToEdit?.reading_notes || '');
  const [sportType, setSportType] = useState(entryToEdit?.sport_type || '');
  const [sportMins, setSportMins] = useState(entryToEdit?.sport_mins || 0);
  const [oralType, setOralType] = useState(entryToEdit?.oral_type || '');
  const [oralMins, setOralMins] = useState(entryToEdit?.oral_mins || 0);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(entryToEdit?.image_url || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
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
      if (entryToEdit) {
        const res = await apiClient.put(`/journals/${entryToEdit.id}`, payload);
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

      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('You already have a journal entry for this date!');
      } else {
        setError('Failed to save entry. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold mb-6 transition">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <div className="bg-white/80 backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-xl border border-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Calendar size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {entryToEdit ? 'Edit Your Journey' : 'Log New Activity'}
            </h1>
          </div>

          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium mb-8">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
              <label className="block text-sm font-bold text-gray-700 mb-2">When did you do this?</label>
              <input 
                type="date" 
                required
                disabled={!!entryToEdit}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 font-medium text-gray-800 transition"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50/30 p-6 rounded-2xl border border-purple-100/50">
                <label className="block text-sm font-bold text-purple-900 mb-2">Meditation Duration</label>
                <DurationSelector value={meditation} onChange={setMeditation} />
              </div>
              <div className="bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50">
                <label className="block text-sm font-bold text-blue-900 mb-2">Reading Duration</label>
                <DurationSelector value={reading} onChange={setReading} />
              </div>
            </div>

            {reading > 0 && (
              <div className="space-y-4 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">Book Name</label>
                  <input 
                    type="text" 
                    placeholder="What are you reading?"
                    value={readingBook} onChange={e => setReadingBook(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-900 mb-2">What I've Learned</label>
                  <textarea 
                    rows={3}
                    placeholder="Jot down key takeaways or thoughts..."
                    value={readingNotes} onChange={e => setReadingNotes(e.target.value)}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white resize-y font-medium transition"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/30 p-6 rounded-2xl border border-emerald-100/50 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Sport Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Running, Gym"
                    value={sportType} onChange={e => setSportType(e.target.value)}
                    className="w-full px-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-2">Sport Duration</label>
                  <DurationSelector value={sportMins} onChange={setSportMins} />
                </div>
              </div>

              <div className="bg-orange-50/30 p-6 rounded-2xl border border-orange-100/50 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-orange-900 mb-2">Oral Ex. Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Speech, Shadowing"
                    value={oralType} onChange={e => setOralType(e.target.value)}
                    className="w-full px-4 py-3 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white font-medium transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-orange-900 mb-2">Oral Duration</label>
                  <DurationSelector value={oralMins} onChange={setOralMins} />
                </div>
              </div>
            </div>

            <div className="bg-pink-50/30 p-6 rounded-2xl border border-pink-100/50">
              <label className="block text-sm font-bold text-pink-900 mb-2">Daily Picture</label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="w-full flex-1 cursor-pointer bg-white hover:bg-pink-50/50 border-2 border-dashed border-pink-200 text-pink-600 font-semibold py-4 px-4 rounded-xl text-center transition flex items-center justify-center gap-2">
                  <Camera size={20} />
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
                  <div className="relative group">
                    <img src={imagePreview} alt="Preview" className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl object-cover border-2 border-white shadow-lg" />
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition shadow-xl shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
            >
              <Save size={24} />
              {loading ? 'Saving...' : entryToEdit ? 'Update Entry' : 'Save Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
