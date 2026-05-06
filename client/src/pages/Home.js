import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import PostCard from '../components/PostCard';

// Mock data for when backend is not connected
const MOCK_POSTS = [
  {
    _id: '1',
    title: 'Building Scalable APIs with Node.js and Express',
    slug: 'building-scalable-apis-nodejs',
    excerpt:
      'Learn how to architect production-ready REST APIs with proper error handling, validation, and middleware patterns.',
    content: 'Full content here...',
    coverImage:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    author: { _id: 'a1', name: 'Sarah Chen', avatar: '' },
    tags: ['nodejs', 'express', 'api'],
    likes: ['u1', 'u2', 'u3', 'u4', 'u5'],
    readTime: 8,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    _id: '2',
    title: 'React Hooks Deep Dive: useEffect Explained',
    slug: 'react-hooks-useeffect-explained',
    excerpt:
      'A comprehensive guide to understanding useEffect, cleanup functions, dependency arrays, and common pitfalls.',
    content: 'Full content here...',
    coverImage:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=400&fit=crop',
    author: { _id: 'a2', name: 'Alex Rivera', avatar: '' },
    tags: ['react', 'javascript', 'hooks'],
    likes: ['u1', 'u2', 'u3'],
    readTime: 12,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    _id: '3',
    title: 'MongoDB Aggregation Pipeline: A Practical Guide',
    slug: 'mongodb-aggregation-pipeline-guide',
    excerpt:
      'Master MongoDB aggregation with real-world examples — from basic grouping to complex multi-stage pipelines.',
    content: 'Full content here...',
    coverImage:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop',
    author: { _id: 'a3', name: 'Priya Patel', avatar: '' },
    tags: ['mongodb', 'database', 'backend'],
    likes: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6', 'u7'],
    readTime: 10,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    _id: '4',
    title: 'TypeScript Generics Made Simple',
    slug: 'typescript-generics-made-simple',
    excerpt:
      'Stop being confused by generics. This guide breaks down TypeScript generics with everyday analogies and practical code.',
    content: 'Full content here...',
    coverImage:
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    author: { _id: 'a4', name: 'Marcus Johnson', avatar: '' },
    tags: ['typescript', 'javascript', 'webdev'],
    likes: ['u1', 'u2'],
    readTime: 6,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    _id: '5',
    title: 'CSS Grid vs Flexbox: When to Use Which',
    slug: 'css-grid-vs-flexbox',
    excerpt:
      'End the debate once and for all. A visual decision guide with real layout examples for both CSS Grid and Flexbox.',
    content: 'Full content here...',
    coverImage:
      'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=600&h=400&fit=crop',
    author: { _id: 'a5', name: 'Emma Larsson', avatar: '' },
    tags: ['css', 'design', 'frontend'],
    likes: ['u1', 'u2', 'u3', 'u4'],
    readTime: 7,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
  {
    _id: '6',
    title: 'Authentication with JWT: The Complete Guide',
    slug: 'jwt-authentication-complete-guide',
    excerpt:
      'Implement secure authentication from scratch using JSON Web Tokens, bcrypt, and Express middleware.',
    content: 'Full content here...',
    coverImage:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
    author: { _id: 'a1', name: 'Sarah Chen', avatar: '' },
    tags: ['security', 'nodejs', 'jwt'],
    likes: ['u1', 'u2', 'u3', 'u4', 'u5', 'u6'],
    readTime: 15,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    published: true,
  },
];

// Calculate REAL tag counts from MOCK_POSTS
const calculateMockTags = () => {
  const tagMap = {};
  MOCK_POSTS.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap[tag] = (tagMap[tag] || 0) + 1;
    });
  });
  return Object.entries(tagMap)
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => b.count - a.count);
};

const MOCK_TAGS = calculateMockTags();

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
      const fetchedPosts = Array.isArray(data.posts) ? data.posts : [];

      if (fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      } else {
        // Use mock data when backend returns empty
        const filtered = tag
          ? MOCK_POSTS.filter((p) => p.tags.includes(tag))
          : search
          ? MOCK_POSTS.filter(
              (p) =>
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.tags.some((t) => t.includes(search.toLowerCase()))
            )
          : MOCK_POSTS;
        setPosts(filtered);
        setTotal(filtered.length);
        setPages(1);
      }
    } catch {
      // Backend unavailable — use mock data
      const filtered = tag
        ? MOCK_POSTS.filter((p) => p.tags.includes(tag))
        : search
        ? MOCK_POSTS.filter(
            (p) =>
              p.title.toLowerCase().includes(search.toLowerCase()) ||
              p.tags.some((t) => t.includes(search.toLowerCase()))
          )
        : MOCK_POSTS;
      setPosts(filtered);
      setTotal(filtered.length);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }, [search, tag, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    api
      .get('/posts/tags')
      .then((r) => {
        const fetchedTags = Array.isArray(r.data.tags) ? r.data.tags : [];
        setTags(fetchedTags.length > 0 ? fetchedTags : MOCK_TAGS);
      })
      .catch(() => setTags(MOCK_TAGS));
  }, []);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  return (
    <div className="page-home">
      {/* ==================== HERO ==================== */}
      <section className="hero">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
          <div className="hero-shape hero-shape-4" />
          <div className="hero-dots hero-dots-1" />
          <div className="hero-dots hero-dots-2" />
          <div className="hero-line hero-line-1" />
          <div className="hero-line hero-line-2" />
          <span className="hero-quote hero-quote-left">"</span>
          <span className="hero-quote hero-quote-right">"</span>
        </div>

        <div className="floating-tags" aria-hidden="true">
          <div className="floating-tag ft-1">react</div>
          <div className="floating-tag ft-2">typescript</div>
          <div className="floating-tag ft-3">design</div>
          <div className="floating-tag ft-4">nextjs</div>
          <div className="floating-tag ft-5">webdev</div>
          <div className="floating-tag ft-6">opensource</div>
        </div>

        <div className="hero-inner">
          <div className="hero-badge">Developer Community</div>
          <h1 className="hero-title">
            Where Developers
            <br />
            <em>Share & Grow</em>
          </h1>
          <p className="hero-sub">
            A refined space for engineers to publish thoughtful articles,
            discover ideas, and build their voice in the community.
          </p>
          <div className="hero-search">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search posts, tags, topics..."
              defaultValue={search}
              onKeyDown={(e) =>
                e.key === 'Enter' && setParam('search', e.target.value)
              }
              className="search-input"
            />
          </div>
        </div>
      </section>

      {/* ==================== STATS BAR (3 items) ==================== */}
      <div className="stats-bar">
        <div className="stats-inner stats-three">
          <div className="stat-item">
            <div className="stat-number">{total || MOCK_POSTS.length}</div>
            <div className="stat-label">Articles</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{tags.length}</div>
            <div className="stat-label">Topics</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">∞</div>
            <div className="stat-label">Ideas</div>
          </div>
        </div>
      </div>

      {/* ==================== TRENDING MARQUEE ==================== */}
      <div className="trending-strip">
        <div className="trending-track">
          {[...Array(2)].map((_, dup) => (
            <React.Fragment key={dup}>
              <span className="trending-item">
                Trending <span>#react</span>
              </span>
              <span className="trending-item">
                Hot <span>#nextjs</span>
              </span>
              <span className="trending-item">
                Popular <span>#typescript</span>
              </span>
              <span className="trending-item">
                New <span>#tailwind</span>
              </span>
              <span className="trending-item">
                Rising <span>#nodejs</span>
              </span>
              <span className="trending-item">
                Featured <span>#mongodb</span>
              </span>
              <span className="trending-item">
                Editor's Pick <span>#javascript</span>
              </span>
              <span className="trending-item">
                Trending <span>#webdev</span>
              </span>
              <span className="trending-item">
                Hot <span>#opensource</span>
              </span>
              <span className="trending-item">
                Popular <span>#design</span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ==================== FEATURED HEADER ==================== */}
      <div className="featured-section">
        <div className="section-eyebrow">Latest Stories</div>
        <h2 className="section-title">
          Fresh from the <em>community</em>
        </h2>
        <p className="section-sub">
          Hand-picked articles, tutorials, and deep dives written by developers
          like you.
        </p>
      </div>

      {/* ==================== MAIN LAYOUT ==================== */}
      <div className="home-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-card">
            <h3 className="sidebar-title">Popular Tags</h3>
            <div className="tags-list">
              <button
                className={`tag-btn ${!tag ? 'active' : ''}`}
                onClick={() => setParam('tag', '')}
              >
                All Posts <span>{total || MOCK_POSTS.length}</span>
              </button>
              {Array.isArray(tags) &&
                tags.map((t) => (
                  <button
                    key={t._id}
                    className={`tag-btn ${tag === t._id ? 'active' : ''}`}
                    onClick={() => setParam('tag', t._id)}
                  >
                    #{t._id} <span>{t.count}</span>
                  </button>
                ))}
            </div>
          </div>
          <div className="sidebar-card sidebar-cta">
            <h3>Start Writing</h3>
            <p>Share your knowledge with thousands of developers</p>
            <Link to="/register" className="btn-primary btn-sm">
              Get Started Free
            </Link>
          </div>
        </aside>

        {/* Feed */}
        <main className="feed">
          {search && (
            <p className="search-result-label">
              Results for "<strong>{search}</strong>" — {total} posts
            </p>
          )}
          {tag && (
            <p className="search-result-label">
              Posts tagged <strong>#{tag}</strong> — {total} posts
            </p>
          )}

          {loading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-card" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No posts found</h3>
              <p>Be the first to write about this!</p>
              <Link to="/write" className="btn-primary">
                Write a Post
              </Link>
            </div>
          ) : (
            <>
              <div className="posts-grid">
                {posts.map((p) => (
                  <PostCard key={p._id} post={p} />
                ))}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {[...Array(pages)].map((_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                      onClick={() => setParam('page', i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ==================== QUOTE CARD ==================== */}
      <section className="quote-section">
        <div className="quote-card">
          <p className="quote-text">
            Writing is the most powerful way to think clearly. DevBoard gave me
            the space to refine my ideas and share them with engineers I admire.
          </p>
          <div className="quote-author">
            — Sarah Chen · <span>Senior Engineer at Stripe</span>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-col">
            <div className="footer-brand">
              <span className="brand-icon">{'</>'}</span>
              DevBoard
            </div>
            <p className="footer-tagline">
              A refined publishing platform built for developers who care about
              craft.
            </p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li>
                <Link to="/">Explore</Link>
              </li>
              <li>
                <Link to="/write">Write</Link>
              </li>
              <li>
                <Link to="/register">Sign Up</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <ul>
              <li>
                <a href="#guidelines">Guidelines</a>
              </li>
              <li>
                <a href="#code-of-conduct">Code of Conduct</a>
              </li>
              <li>
                <a href="#discord">Discord</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#privacy">Privacy</a>
              </li>
              <li>
                <a href="#terms">Terms</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} DevBoard. Crafted with care.</span>
          <span>
            Built by <a href="https://github.com">@yourname</a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;