const constants = require('./constants');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = require('./post');

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, constants.nameRequiredMessage],
    validate: {
      validator: (name) => name.length > 2,
      message: constants.nameMinLengthMesssage
    }
  },
  posts: [PostSchema],
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'blogPost'
    }
  ]
});

UserSchema.virtual('postCount').get(function() {
  return this.posts.length;
});

UserSchema.pre('remove', function(next) {
  const BlogPost = mongoose.model('blogPost');
  BlogPost.remove({
    _id: {
      $in: this.blogPosts
    }
  })
    .then(() => next());
});

const User = mongoose.model('user', UserSchema);

module.exports = User;
