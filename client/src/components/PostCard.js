import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const avatar = post.author?.avatar
    ? post.author.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=72383d&color=efe9e1&bold=true`;

  const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <article className="post-card">
      {post.coverImage && (
        <Link to={`/post/${post.slug}`}>
          <div className="post-card-image">
            <img src={post.coverImage} alt={post.title} loading="lazy" />
          </div>
        </Link>
      )}
      <div className="post-card-body">
        <div className="post-card-meta">
          <img src={avatar} alt={post.author?.name} className="author-avatar-sm" />
          <span className="author-name">{post.author?.name}</span>
          <span className="dot">●</span>
          <span className="post-time">{timeAgo(post.createdAt)}</span>
          {post.readTime && (
            <>
              <span className="dot">●</span>
              <span className="read-time">{post.readTime} min read</span>
            </>
          )}
        </div>

        <Link to={`/post/${post.slug}`} className="post-card-title-link">
          <h2 className="post-card-title">{post.title}</h2>
        </Link>

        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}

        <div className="post-card-footer">
          <div className="post-tags">
            {post.tags?.slice(0, 3).map((tag) => (
              <Link key={tag} to={`/?tag=${tag}`} className="tag">
                #{tag}
              </Link>
            ))}
          </div>
          <div className="post-likes">
            <span className="likes-icon">♥</span>
            <span>{post.likes?.length || 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;