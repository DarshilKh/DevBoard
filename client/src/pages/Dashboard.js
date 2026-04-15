import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/posts?author=${user.id}&limit=50`)
      .then(r => setPosts(r.data.posts))
      .catch(() => toast.error('Failed to load posts'))
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(prev => prev.filter(p => p._id !== id));
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const avatar = user?.avatar
    ? user.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=6366f1&color=fff&bold=true`;

  const timeAgo = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="dashboard-page">
      <div className="dashboard-inner">
        {/* Profile summary */}
        <div className="dash-profile-card">
          <img src={avatar} alt={user.name} className="dash-avatar" />
          <div className="dash-profile-info">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.bio && <p className="dash-bio">{user.bio}</p>}
            <div className="dash-stats">
              <div className="dash-stat"><span>{posts.length}</span><label>Posts</label></div>
              <div className="dash-stat"><span>{posts.reduce((a, p) => a + (p.likes?.length || 0), 0)}</span><label>Likes</label></div>
            </div>
          </div>
          <Link to="/profile" className="btn-outline-sm dash-edit-btn">Edit Profile</Link>
        </div>

        {/* Posts list */}
        <div className="dash-posts-header">
          <h3>Your Posts</h3>
          <Link to="/write" className="btn-primary btn-sm">+ New Post</Link>
        </div>

        {loading ? (
          <div className="loading-list">
            {[1,2,3].map(i => <div key={i} className="skeleton-row" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✍️</div>
            <h3>No posts yet</h3>
            <p>Write your first post and share it with the community</p>
            <Link to="/write" className="btn-primary">Write Your First Post</Link>
          </div>
        ) : (
          <div className="dash-posts-list">
            {posts.map(post => (
              <div key={post._id} className="dash-post-row">
                {post.coverImage && <img src={post.coverImage} alt={post.title} className="dash-post-thumb" />}
                <div className="dash-post-info">
                  <Link to={`/post/${post.slug}`} className="dash-post-title">{post.title}</Link>
                  <div className="dash-post-meta">
                    <span>{timeAgo(post.createdAt)}</span>
                    <span>·</span>
                    <span>{post.readTime} min read</span>
                    <span>·</span>
                    <span>♥ {post.likes?.length || 0}</span>
                    <span className={`status-pill ${post.published ? 'published' : 'draft'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="dash-post-tags">
                    {post.tags?.slice(0, 3).map(t => <span key={t} className="tag-sm">#{t}</span>)}
                  </div>
                </div>
                <div className="dash-post-actions">
                  <Link to={`/edit/${post._id}`} className="btn-outline-sm">Edit</Link>
                  <button className="btn-danger-sm" onClick={() => handleDelete(post._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Dashboard;
