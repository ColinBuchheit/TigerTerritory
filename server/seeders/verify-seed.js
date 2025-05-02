const mongoose = require('mongoose');
const config = require('./config/config');
const User = require('./models/user');
const Comment = require('./models/Comment');

const verifySeeding = async () => {
  try {
    await mongoose.connect(config.mongoURI);
    console.log('Connected to MongoDB');
    
    // Count users
    const userCount = await User.countDocuments();
    console.log(`Total users: ${userCount}`);
    
    // Show some user details
    const users = await User.find().limit(3);
    console.log('Sample users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}): ${user.role}`);
    });
    
    // Count comments
    const commentCount = await Comment.countDocuments();
    console.log(`Total comments: ${commentCount}`);
    
    // Show some comment details grouped by postId
    console.log('\nComments by Post:');
    const posts = await Comment.aggregate([
      {
        $group: {
          _id: "$postId",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    for (const post of posts) {
      console.log(`- ${post._id}: ${post.count} comments`);
    }
    
    // Show a few sample comments with likes
    console.log('\nSample comments with likes:');
    const comments = await Comment.find().limit(5).populate('user', 'name email').populate('likes', 'name');
    for (const comment of comments) {
      console.log(`- Post: ${comment.postId}`);
      console.log(`  Author: ${comment.user.name}`);
      console.log(`  Date: ${comment.date.toLocaleDateString()}`);
      console.log(`  Text: "${comment.text.substring(0, 50)}${comment.text.length > 50 ? '...' : ''}"`);
      console.log(`  Likes: ${comment.likes.length}`);
      
      // If there are likes, show the users who liked this comment
      if (comment.likes.length > 0) {
        console.log(`  Liked by: ${comment.likes.map(user => user.name).join(', ')}`);
      }
      
      console.log('');
    }
    
    // Get statistics about likes
    const likesStats = await Comment.aggregate([
      {
        $project: {
          likeCount: { $size: "$likes" }
        }
      },
      {
        $group: {
          _id: null,
          totalLikes: { $sum: "$likeCount" },
          avgLikes: { $avg: "$likeCount" },
          maxLikes: { $max: "$likeCount" },
          commentCount: { $sum: 1 }
        }
      }
    ]);
    
    if (likesStats.length > 0) {
      const stats = likesStats[0];
      console.log('\nLike Statistics:');
      console.log(`- Total likes across all comments: ${stats.totalLikes}`);
      console.log(`- Average likes per comment: ${stats.avgLikes.toFixed(2)}`);
      console.log(`- Maximum likes on a single comment: ${stats.maxLikes}`);
      console.log(`- Comments with at least one like: ${await Comment.countDocuments({ 'likes.0': { $exists: true } })}`);
    }
    
    // Find the most liked comments
    const mostLikedComments = await Comment.find()
      .sort({ 'likes.length': -1 })
      .limit(3)
      .populate('user', 'name')
      .select('text postId likes');
    
    console.log('\nMost liked comments:');
    for (const comment of mostLikedComments) {
      console.log(`- "${comment.text.substring(0, 50)}${comment.text.length > 50 ? '...' : ''}" on ${comment.postId}`);
      console.log(`  Likes: ${comment.likes.length}`);
    }
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (err) {
    console.error('Error:', err.message);
  }
};

verifySeeding();