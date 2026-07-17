import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { User as UserIcon, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [pseudo, setPseudo] = useState(user?.pseudo || '');
  const [goals, setGoals] = useState(user?.goals || '');
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [picPreview, setPicPreview] = useState(user?.profile_picture_url || null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?.goals) setGoals(user.goals);
    if (user?.pseudo) setPseudo(user.pseudo);
  }, [user]);

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
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition">
            <ArrowLeft size={20} className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <label className="relative cursor-pointer group">
              {picPreview || user?.profile_picture_url ? (
                <img src={picPreview || user?.profile_picture_url || ''} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-blue-100" />
              ) : (
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-2 border-transparent">
                  <UserIcon size={36} />
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-medium">Edit</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setProfilePic(e.target.files[0]);
                  setPicPreview(URL.createObjectURL(e.target.files[0]));
                }
              }} />
            </label>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Display Name (Pseudo)</label>
              <input 
                type="text"
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                placeholder="What should we call you?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">My Goals</label>
              <textarea 
                rows={6}
                value={goals}
                onChange={e => setGoals(e.target.value)}
                placeholder="What are your journaling and habit goals? (e.g. Read 20 mins every day, Meditate every morning...)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-y"
              ></textarea>
            </div>
            
            {message && (
              <div className={`p-3 rounded-lg mb-6 text-sm font-medium ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-sm disabled:opacity-50"
            >
              <Save size={20} />
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
