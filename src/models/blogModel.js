const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const BlogsSchema = new mongoose.Schema({
  title: { type: String, require: true, trim: true },
  body: { type: String, require: true, trim: true },
  author_id: {
    type: ObjectId, ref: "1st-projects"
  },
  tags: [{ type: String, trim: true }],
  category: { type: String, require: true, trim: true },
  subcategory: [{ type: String, trim: true }],
  createdAt: { type: Date, default: Date.now, },
  isDeleted: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  PublishedAt: { type: Date },
  isDeletedAt: { type: Date }
})


module.exports = mongoose.model('Blogs', BlogsSchema) //users





