import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const tag = searchParams.get('tag') || '';
  const page = Number(searchParams.get('page') || 1);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (search) params.set('search', search);
      if (tag) params.set('tag', tag);
      const { data } = await api.get(`/posts?${params}`);
      setPosts(data.posts);
      setTotal(data.total);
      setPages(data.pages);
    } catch {}
    finally { setLoading(false); }
  }, [search, tag, page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);
  useEffect(() => {
    api.get('/posts/tags').then(r => setTags(r.data.tags)).catch(() => {});
  }, []);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="page-home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">Developer Community</div>
          <h1 className="hero-title">Where Developers<br /><span className="gradient-text">Share & Grow</span></h1>
          <p className="hero-sub">Read, write, and explore dev articles. Share your knowledge with the world.</p>
          <div className="hero-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search posts, tags, topics..."
              defaultValue={search}
              onKeyDown={e => e.key === 'Enter' && setParam('search', e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      <div className="home-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Popular Tags</h3>
            <div className="tags-list">
              <button
                className={`tag-btn ${!tag ? 'active' : ''}`}
                onClick={() => setParam('tag', '')}
              >All Posts <span>{total}</span></button>
              {tags.map(t => (
                <button
                  key={t._id}
                  className={`tag-btn ${tag === t._id ? 'active' : ''}`}
                  onClick={() => setParam('tag', t._id)}
                >#{t._id} <span>{t.count}</span></button>
              ))}
            </div>
          </div>
          <div className="sidebar-card sidebar-cta">
            <h3>Start Writing</h3>
            <p>Share your knowledge with thousands of developers</p>
            <Link to="/register" className="btn-primary btn-sm">Get Started Free</Link>
          </div>
        </aside>

        {/* Feed */}
        <main className="feed">
          {search && <p className="search-result-label">Results for "<strong>{search}</strong>" — {total} posts</p>}
          {tag && <p className="search-result-label">Posts tagged <strong>#{tag}</strong> — {total} posts</p>}

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No posts found</h3>
              <p>Be the first to write about this!</p>
              <Link to="/write" className="btn-primary">Write a Post</Link>
            </div>
          ) : (
            <>
              <div className="posts-grid">
                {posts.map(p => <PostCard key={p._id} post={p} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${page === i+1 ? 'active' : ''}`}
                      onClick={() => setParam('page', i+1)}
                    >{i+1}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Home;
