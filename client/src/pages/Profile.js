import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: user?.name || '', bio: user?.bio || '',
    github: user?.github || '', website: user?.website || '',
    skills: user?.skills?.join(', ') || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio', form.bio);
      fd.append('github', form.github);
      fd.append('website', form.website);
      const skillsArr = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      fd.append('skills', JSON.stringify(skillsArr));
      if (avatarFile) fd.append('avatar', avatarFile);

      const { data } = await api.put('/users/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser(data.user);
      toast.success('Profile updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  const currentAvatar = preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&bold=true`;

  return (
    <div className="profile-page">
      <div className="profile-inner">
        <div className="profile-header">
          <h1>Edit Profile</h1>
          <p>Update your public developer profile</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {/* Avatar */}
          <div className="avatar-upload-section">
            <img src={currentAvatar} alt={user?.name} className="profile-avatar-preview" />
            <div>
              <label className="btn-outline-sm" style={{ cursor: 'pointer' }}>
                Change Photo
                <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
              </label>
              <p className="upload-hint">JPG, PNG, WebP — max 5MB</p>
            </div>
          </div>

          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Bio <span className="form-hint">(shown on your posts)</span></label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Tell people about yourself..." />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>GitHub Username</label>
              <input type="text" placeholder="yourusername" value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input type="url" placeholder="https://yoursite.com" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
            </div>
          </div>

          <div className="form-group">
            <label>Skills <span className="form-hint">(comma separated)</span></label>
            <input type="text" placeholder="React, Node.js, MongoDB..." value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
          </div>

          <div className="profile-form-footer">
            <button type="button" className="btn-outline" onClick={() => navigate('/dashboard')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Profile;
