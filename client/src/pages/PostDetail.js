import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PostDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    api.get(`/posts/${slug}`)
      .then(r => {
        setPost(r.data.post);
        setLikeCount(r.data.post.likes?.length || 0);
        if (user) setLiked(r.data.post.likes?.includes(user.id));
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [slug, user, navigate]);

  const handleLike = async () => {
    if (!user) { toast.error('Login to like posts'); return; }
    setLiking(true);
    try {
      const { data } = await api.post(`/posts/${post._id}/like`);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch { toast.error('Failed to like'); }
    finally { setLiking(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      toast.success('Post deleted');
      navigate('/dashboard');
    } catch { toast.error('Failed to delete'); }
  };

  const timeAgo = (date) => new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const avatar = post?.author?.avatar
    ? post.author.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post?.author?.name || 'U')}&background=6366f1&color=fff&bold=true`;

  if (loading) return <div className="full-loader"><div className="spinner" /></div>;
  if (!post) return null;

  const isOwner = user?.id === post.author?._id;

  return (
    <div className="post-detail-page">
      <div className="post-detail-inner">
        {/* Cover */}
        {post.coverImage && (
          <div className="post-cover">
            <img src={post.coverImage} alt={post.title} />
          </div>
        )}

        {/* Header */}
        <header className="post-header">
          <div className="post-tags-row">
            {post.tags?.map(tag => <Link key={tag} to={`/?tag=${tag}`} className="tag">#{tag}</Link>)}
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <img src={avatar} alt={post.author?.name} className="author-avatar-md" />
            <div>
              <div className="author-name-lg">{post.author?.name}</div>
              <div className="post-detail-date">{timeAgo(post.createdAt)} · {post.readTime} min read</div>
            </div>
            <div className="post-actions-row">
              <button
                className={`like-btn ${liked ? 'liked' : ''}`}
                onClick={handleLike}
                disabled={liking}
              >
                <span>{liked ? '❤️' : '🤍'}</span>
                <span>{likeCount}</span>
              </button>
              {isOwner && (
                <>
                  <Link to={`/edit/${post._id}`} className="btn-outline-sm">Edit</Link>
                  <button className="btn-danger-sm" onClick={handleDelete}>Delete</button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="post-content">
          {post.content.split('\n').map((para, i) =>
            para.trim() ? <p key={i}>{para}</p> : <br key={i} />
          )}
        </div>

        {/* Author Card */}
        <div className="author-card">
          <img src={avatar} alt={post.author?.name} className="author-avatar-lg" />
          <div className="author-info">
            <h3>{post.author?.name}</h3>
            {post.author?.bio && <p>{post.author.bio}</p>}
            <div className="author-links">
              {post.author?.github && <a href={`https://github.com/${post.author.github}`} target="_blank" rel="noreferrer" className="author-link">GitHub</a>}
              {post.author?.website && <a href={post.author.website} target="_blank" rel="noreferrer" className="author-link">Website</a>}
            </div>
            {post.author?.skills?.length > 0 && (
              <div className="author-skills">
                {post.author.skills.map(s => <span key={s} className="skill-badge">{s}</span>)}
              </div>
            )}
          </div>
        </div>

        <Link to="/" className="back-link">← Back to Explore</Link>
      </div>
    </div>
  );
};
export default PostDetail;
