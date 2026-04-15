const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true, maxlength: 120 },
  slug:        { type: String, unique: true },
  content:     { type: String, required: true },
  excerpt:     { type: String, maxlength: 300 },
  coverImage:  { type: String, default: '' },
  tags:        [{ type: String, trim: true, lowercase: true }],
  author:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  published:   { type: Boolean, default: true },
  readTime:    { type: Number, default: 1 },
}, { timestamps: true });

// Auto-compute read time before save
postSchema.pre('save', function (next) {
  const words = this.content.split(/\s+/).length;
  this.readTime = Math.max(1, Math.ceil(words / 200));
  next();
});

module.exports = mongoose.model('Post', postSchema);
