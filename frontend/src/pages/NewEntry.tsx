import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { Calendar, ArrowLeft, Camera } from 'lucide-react';

const DurationSelector = ({ value, onChange, disabled }: { value: number, onChange: (val: number) => void, disabled?: boolean }) => {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return (
    <div className="flex gap-4">
      <select 
        disabled={disabled}
        value={hours} 
        onChange={e => onChange(Number(e.target.value) * 60 + minutes)} 
        className="immersive-input !py-2"
      >
        {[...Array(13)].map((_, i) => <option key={`h-${i}`} value={i}>{i}H</option>)}
      </select>
      <select 
        disabled={disabled}
        value={minutes} 
        onChange={e => onChange(hours * 60 + Number(e.target.value))} 
        className="immersive-input !py-2"
      >
        {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => <option key={`m-${m}`} value={m}>{m}M</option>)}
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
        setError('The answer could not be submitted. Try again.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas p-6 md:p-12 relative">
      <div className="absolute w-64 h-64 bg-brand-quaternary left-10 bottom-10 rotate-12 z-0 hidden sm:block border-[4px] border-border-strong"></div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/dashboard" className="immersive-btn bg-brand-tertiary text-white mb-8 border-[3px] border-border-strong shadow-hard-sm">
          <span><ArrowLeft size={20} className="inline mr-2 -mt-1" /> RETURN TO EXHIBIT</span>
        </Link>

        <div className="immersive-card !p-8 md:!p-12">
          <div className="flex items-center gap-4 mb-10 border-b-[4px] border-border-strong pb-6">
            <div className="w-16 h-16 bg-brand-quaternary border-[3px] border-border-strong flex items-center justify-center text-white shadow-hard-sm">
              <Calendar size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              {entryToEdit ? 'Edit Your Stop' : 'Log New Activity'}
            </h1>
          </div>

          {error && (
            <div className="bg-danger text-white p-4 font-bold border-[3px] border-border-strong mb-8 uppercase text-xl flex items-center gap-4 shadow-hard-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="bg-gray-100 p-6 border-[3px] border-border-strong shadow-hard-sm">
              <label className="block text-xl font-black uppercase mb-4">When did you do this?</label>
              <input 
                type="date" 
                required
                disabled={!!entryToEdit}
                value={date}
                onChange={e => setDate(e.target.value)}
                className="immersive-input"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-brand-tertiary text-white p-6 border-[3px] border-border-strong shadow-hard-sm space-y-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Meditation Duration</label>
                  <DurationSelector value={meditation} onChange={setMeditation} />
                </div>
              </div>
              <div className="bg-brand-quaternary text-white p-6 border-[3px] border-border-strong shadow-hard-sm space-y-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Reading Duration</label>
                  <DurationSelector value={reading} onChange={setReading} />
                </div>
              </div>
            </div>

            {reading > 0 && (
              <div className="space-y-6 bg-brand-quaternary text-white p-8 border-[4px] border-border-strong shadow-hard-md">
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Book Name</label>
                  <input 
                    type="text" 
                    placeholder="What are you reading?"
                    value={readingBook} onChange={e => setReadingBook(e.target.value)}
                    className="immersive-input text-text"
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2">What I've Learned</label>
                  <textarea 
                    rows={3}
                    placeholder="Jot down key takeaways..."
                    value={readingNotes} onChange={e => setReadingNotes(e.target.value)}
                    className="immersive-input text-text resize-y"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-success text-white p-6 border-[3px] border-border-strong shadow-hard-sm space-y-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Sport Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Running, Gym"
                    value={sportType} onChange={e => setSportType(e.target.value)}
                    className="immersive-input text-text"
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Sport Duration</label>
                  <DurationSelector value={sportMins} onChange={setSportMins} />
                </div>
              </div>

              <div className="bg-warning text-border-strong p-6 border-[3px] border-border-strong shadow-hard-sm space-y-6">
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Oral Ex. Topic</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Speech, Shadowing"
                    value={oralType} onChange={e => setOralType(e.target.value)}
                    className="immersive-input text-text"
                  />
                </div>
                <div>
                  <label className="block text-xl font-black uppercase mb-2">Oral Duration</label>
                  <DurationSelector value={oralMins} onChange={setOralMins} />
                </div>
              </div>
            </div>

            <div className="bg-surface p-8 border-[4px] border-border-strong shadow-hard-md">
              <label className="block text-2xl font-black uppercase mb-6 flex items-center gap-3">
                <Camera size={28} /> Daily Snapshot
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <label className="w-full flex-1 cursor-pointer bg-brand-quaternary hover:bg-brand-tertiary text-white border-[3px] border-border-strong font-black uppercase py-4 px-6 text-center transition-colors flex items-center justify-center gap-3 shadow-hard-sm">
                  <Camera size={24} />
                  <span>{imageFile ? imageFile.name : 'TAKE A PHOTO OR BROWSE'}</span>
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
                  <div className="relative group flex-shrink-0">
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover border-[4px] border-border-strong shadow-hard-md" />
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="immersive-btn w-full bg-brand-tertiary text-white !text-2xl !py-5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              <span>{loading ? 'PREPARING THE NEXT STOP...' : entryToEdit ? 'SAVE PROGRESS' : 'LOCK IN ENTRY'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
