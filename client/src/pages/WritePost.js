import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

const WritePost = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: '', content: '', excerpt: '', tags: '', published: true });
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/posts/${id}`).then(r => {
      const p = r.data.post;
      setForm({ title: p.title, content: p.content, excerpt: p.excerpt || '', tags: p.tags?.join(', ') || '', published: p.published });
      if (p.coverImage) setPreview(p.coverImage);
    }).catch(() => navigate('/dashboard'))
    .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) { toast.error('Title and content are required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('excerpt', form.excerpt);
      fd.append('published', form.published);
      const tagsArr = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      fd.append('tags', JSON.stringify(tagsArr));
      if (coverFile) fd.append('coverImage', coverFile);

      const { data } = isEdit
        ? await api.put(`/posts/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      toast.success(isEdit ? 'Post updated!' : 'Post published!');
      navigate(`/post/${data.post.slug}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally { setLoading(false); }
  };

  if (fetching) return <div className="full-loader"><div className="spinner" /></div>;

  return (
    <div className="write-page">
      <div className="write-inner">
        <div className="write-header">
          <h1>{isEdit ? 'Edit Post' : 'Write a New Post'}</h1>
          <p>{isEdit ? 'Update your article' : 'Share your knowledge with the dev community'}</p>
        </div>

        <form onSubmit={handleSubmit} className="write-form">
          {/* Cover image */}
          <div className="cover-upload-area">
            {preview ? (
              <div className="cover-preview">
                <img src={preview} alt="Cover" />
                <button type="button" className="cover-remove" onClick={() => { setPreview(''); setCoverFile(null); }}>✕ Remove</button>
              </div>
            ) : (
              <label className="cover-upload-label">
                <input type="file" accept="image/*" onChange={handleFile} hidden />
                <span className="upload-icon">🖼️</span>
                <span>Click to add a cover image</span>
                <span className="upload-hint">JPG, PNG, WebP — max 5MB</span>
              </label>
            )}
          </div>

          <div className="form-group">
            <input
              type="text"
              className="title-input"
              placeholder="Post title..."
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tags <span className="form-hint">(comma separated)</span></label>
            <input
              type="text"
              placeholder="react, nodejs, javascript..."
              value={form.tags}
              onChange={e => setForm({ ...form, tags: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Content <span className="form-hint">*</span></label>
            <textarea
              className="content-textarea"
              placeholder="Write your post here... Share what you know!"
              value={form.content}
              onChange={e => setForm({ ...form, content: e.target.value })}
              rows={20}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt <span className="form-hint">(short description shown on cards)</span></label>
            <textarea
              placeholder="Brief summary of your post..."
              value={form.excerpt}
              onChange={e => setForm({ ...form, excerpt: e.target.value })}
              rows={3}
            />
          </div>

          <div className="write-footer">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={form.published}
                onChange={e => setForm({ ...form, published: e.target.checked })}
              />
              <span>Publish immediately</span>
            </label>
            <div className="write-actions">
              <button type="button" className="btn-outline" onClick={() => navigate(-1)}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Post' : 'Publish Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default WritePost;
