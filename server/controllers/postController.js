const slugify = require('slugify');
const Post = require('../models/Post');
const { validationResult } = require('express-validator');

// GET /api/posts  — public, with search + tag filter
exports.getPosts = async (req, res) => {
  try {
    const { search, tag, author, page = 1, limit = 9 } = req.query;
    const filter = { published: true };

    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
    ];
    if (tag) filter.tags = tag.toLowerCase();
    if (author) filter.author = author;

    const total = await Post.countDocuments(filter);
    const posts = await Post.find(filter)
      .populate('author', 'name avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ posts, total, pages: Math.ceil(total / limit), page: Number(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/posts/:slug
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate('author', 'name avatar bio github website skills');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  try {
    const { title, content, excerpt, tags, published } = req.body;
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;
    while (await Post.findOne({ slug })) { slug = `${baseSlug}-${count++}`; }

    const coverImage = req.file
      ? (req.file.path || `/uploads/${req.file.filename}`)
      : '';

    const post = await Post.create({
      title, content, slug,
      excerpt: excerpt || content.substring(0, 200) + '...',
      tags: tags ? JSON.parse(tags) : [],
      coverImage,
      published: published !== 'false',
      author: req.user._id,
    });

    await post.populate('author', 'name avatar');
    res.status(201).json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) return res.status(404).json({ message: 'Post not found or not yours' });

    const { title, content, excerpt, tags, published } = req.body;
    if (title) { post.title = title; post.slug = slugify(title, { lower: true, strict: true }); }
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    if (tags) post.tags = JSON.parse(tags);
    if (published !== undefined) post.published = published !== 'false';
    if (req.file) post.coverImage = req.file.path || `/uploads/${req.file.filename}`;

    await post.save();
    await post.populate('author', 'name avatar');
    res.json({ post });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user._id });
    if (!post) return res.status(404).json({ message: 'Post not found or not yours' });
    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/posts/:id/like  — toggle
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const uid = req.user._id.toString();
    const liked = post.likes.map(l => l.toString()).includes(uid);
    if (liked) post.likes = post.likes.filter(l => l.toString() !== uid);
    else post.likes.push(req.user._id);
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/posts/tags  — top tags
exports.getTags = async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
