import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';
import { User as UserIcon, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [pseudo, setPseudo] = useState(user?.pseudo || '');
  const [goals, setGoals] = useState(user?.goals || '');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [picPreview, setPicPreview] = useState(user?.profile_picture_url || null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      if (profilePic) {
        const formData = new FormData();
        formData.append('file', profilePic);
        await apiClient.post('/auth/me/picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      const response = await apiClient.put('/auth/me', { goals, pseudo: pseudo || null });
      updateUser(response.data);
      setMessage('PROGRESS SAVED.');
    } catch (err) {
      console.error('Failed to update profile', err);
      setMessage('The answer could not be submitted. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <Link to="/dashboard" className="immersive-btn bg-surface text-border-strong mb-8 border-[3px] border-border-strong shadow-hard-sm">
          <span><ArrowLeft size={20} className="inline mr-2 -mt-1" /> RETURN TO EXHIBIT</span>
        </Link>

        {message && (
          <div className={`p-4 font-bold border-[3px] border-border-strong mb-8 uppercase text-xl flex items-center gap-4 shadow-hard-sm ${message.includes('SAVED') ? 'bg-success text-white' : 'bg-danger text-white'}`}>
            {message}
          </div>
        )}

        <div className="immersive-card !p-8 md:!p-12 relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-tertiary -z-10 translate-x-4 -translate-y-4 border-[3px] border-border-strong"></div>

          <div className="flex flex-col sm:flex-row items-center gap-8 mb-12 pb-8 border-b-[4px] border-border-strong">
            <label className="relative cursor-pointer group flex-shrink-0 block">
              {picPreview || user?.profile_picture_url ? (
                <img src={picPreview || user?.profile_picture_url || ''} alt="Profile" className="w-32 h-32 object-cover border-[4px] border-border-strong shadow-hard-sm group-hover:shadow-hard-md transition-shadow" />
              ) : (
                <div className="w-32 h-32 bg-brand-tertiary text-white flex items-center justify-center border-[4px] border-border-strong shadow-hard-sm group-hover:shadow-hard-md transition-shadow">
                  <UserIcon size={48} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-white uppercase tracking-widest border-[4px] border-border-strong">
                EDIT
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProfilePic(e.target.files[0]);
                  setPicPreview(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </label>
            <div className="text-center sm:text-left">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">Your Profile</h1>
              <p className="text-lg font-bold text-gray-500 uppercase">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div>
              <label className="block text-xl font-black uppercase mb-3">Alias (Pseudo)</label>
              <input 
                type="text" 
                value={pseudo} 
                onChange={e => setPseudo(e.target.value)} 
                className="immersive-input"
                placeholder="What should we call you?"
              />
            </div>
            
            <div>
              <label className="block text-xl font-black uppercase mb-3">Your Journey Goals</label>
              <textarea 
                value={goals} 
                onChange={e => setGoals(e.target.value)} 
                className="immersive-input min-h-[160px] resize-y"
                placeholder="Declare your objectives here..."
              />
            </div>

            <button 
              type="submit" 
              disabled={saving}
              className="immersive-btn w-full bg-brand-quaternary text-white !text-2xl !py-5 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span>{saving ? 'UPDATING...' : 'SAVE PROGRESS'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
