const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/user');
const config = require('../config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for seeding comments...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Seed comments
const seedComments = async () => {
  try {
    await connectDB();
    
    // Clear existing comments
    await Comment.deleteMany({});
    console.log('All comments removed');
    
    // Get user IDs
    const users = await User.find();
    
    if (users.length === 0) {
      console.error('No users found. Please run userSeeder first.');
      process.exit(1);
    }
    
    // Sample hardcoded post IDs (matching what you'll use in frontend)
    const postIds = [
      'basketball-news-1',
      'football-news-1',
      'tennis-news-1',
      'soccer-news-1',
      'baseball-news-1'
    ];
    
    // Sample comments data
    const comments = [];
    
    // Generate comments for each post
    for (const postId of postIds) {
      // Determine category from postId
      let category = 'Other';
      if (postId.includes('basketball')) category = 'Basketball';
      if (postId.includes('football')) category = 'Football';
      if (postId.includes('tennis')) category = 'Tennis';
      if (postId.includes('soccer')) category = 'Soccer';
      if (postId.includes('baseball')) category = 'Baseball';
      
      // Add 3-5 comments per post
      const commentCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < commentCount; i++) {
        // Random user for each comment
        const user = users[Math.floor(Math.random() * users.length)];
        
        comments.push({
          text: getSampleComment(category, i),
          user: user._id,
          postId: postId,
          date: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date within the last week
        });
      }
    }
    
    // Insert comments
    const savedComments = await Comment.insertMany(comments);
    console.log('Comments seeded successfully');
    
    // Get and log the created comments
    const seededComments = await Comment.find();
    console.log(`${seededComments.length} comments created`);
    
    process.exit();
  } catch (err) {
    console.error('Error seeding comments:', err.message);
    process.exit(1);
  }
};

// Helper function to generate sample comments based on post category
function getSampleComment(category, index) {
  const commentsByCategory = {
    Basketball: [
      "Great analysis! I think the key matchup will be in the backcourt.",
      "LeBron has been playing at an MVP level lately. Can't wait to watch!",
      "Warriors' bench needs to step up if they want to win this one.",
      "Home court advantage will be crucial in this matchup.",
      "Both teams need this win for playoff positioning."
    ],
    Football: [
      "I'm not sold on this QB class. None of them look like franchise players.",
      "The top prospect has a great arm but needs to work on decision making.",
      "Draft position is so important for QB development.",
      "I hope my team trades up to get the top prospect!",
      "Accuracy and leadership are more important than arm strength."
    ],
    Tennis: [
      "The clay court season is always so unpredictable.",
      "I'm excited to see if any newcomers can challenge the established stars.",
      "Injuries have really changed the landscape this year.",
      "The women's draw looks more competitive than the men's this time.",
      "Serving well will be key on these fast courts."
    ],
    Soccer: [
      "The English teams have a good chance this year.",
      "Away goals rule makes these matchups so strategic.",
      "Can't wait to see the tactical battles between these coaches.",
      "The underdogs have nothing to lose and that makes them dangerous.",
      "The atmosphere for these games is going to be incredible!"
    ],
    Baseball: [
      "It's still early in the season, but some trends are concerning.",
      "Pitching wins championships! The teams with depth will prevail.",
      "Injuries are already impacting several contenders.",
      "The rookie class this year is exceptional.",
      "Analytics are changing how we evaluate early season performance."
    ],
    Other: [
      "Great article! Thanks for the insights.",
      "I have a different perspective on this issue.",
      "Looking forward to more coverage on this topic.",
      "The analysis could be more in-depth, but good overview.",
      "I've been following this closely and agree with your take."
    ]
  };
  
  const comments = commentsByCategory[category] || commentsByCategory.Other;
  return comments[index % comments.length];
}

// Run seeder
seedComments();