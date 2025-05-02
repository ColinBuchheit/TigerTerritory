const mongoose = require('mongoose');
const Comment = require('../models/Comment');
const User = require('../models/User');
const config = require('../config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI);
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
    
    // Sample post IDs mapping to different sports categories
    const postIds = [
      // Football posts
      'football-news-1',
      'football-news-2',
      'football-news-3',
      'football-news-4',
      // Basketball posts
      'basketball-news-1',
      'basketball-news-2',
      'basketball-news-3',
      'basketball-news-4',
      // Baseball posts
      'baseball-news-1',
      'baseball-news-2',
      'baseball-news-3',
      'baseball-news-4',
      // Wrestling posts
      'wrestling-news-1',
      'wrestling-news-2',
      'wrestling-news-3',
      'wrestling-news-4'
    ];
    
    // Generate comments
    const comments = [];
    
    // Generate comments for each post
    for (const postId of postIds) {
      // Determine category from postId
      let category = 'Other';
      if (postId.includes('basketball')) category = 'Basketball';
      if (postId.includes('football')) category = 'Football';
      if (postId.includes('baseball')) category = 'Baseball';
      if (postId.includes('wrestling')) category = 'Wrestling';
      
      // Add 3-5 comments per post
      const commentCount = Math.floor(Math.random() * 3) + 3;
      
      for (let i = 0; i < commentCount; i++) {
        // Random user for each comment
        const user = users[Math.floor(Math.random() * users.length)];
        
        // Random date within the last week
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 7));
        
        comments.push({
          text: generateCommentText(category, i),
          user: user._id,
          postId: postId,
          date: date
        });
      }
    }
    
    // Insert comments
    const savedComments = await Comment.insertMany(comments);
    console.log(`${savedComments.length} comments seeded successfully`);
    
    // Log a few sample comments
    console.log('Sample comments:');
    for (let i = 0; i < Math.min(5, savedComments.length); i++) {
      const comment = savedComments[i];
      const user = await User.findById(comment.user);
      console.log(`- "${comment.text.substring(0, 30)}..." by ${user.name} on ${comment.postId}`);
    }
    
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (err) {
    console.error('Error seeding comments:', err.message);
    process.exit(1);
  }
};

// Helper function to generate sample comments based on post category
function generateCommentText(category, index) {
  const commentsByCategory = {
    Basketball: [
      "Great analysis! I think the key matchup will be in the backcourt.",
      "Looking forward to seeing how the team develops this season!",
      "That three-pointer in the final seconds was incredible!",
      "Defense needs to improve if we want to make a tournament run.",
      "Coach made some smart adjustments in the second half.",
      "The bench really stepped up when we needed them.",
      "Can't wait for the next game. M-I-Z!",
      "This recruiting class looks incredible. Future is bright!",
      "That's exactly the type of win we needed to build momentum."
    ],
    Football: [
      "The offensive line is really starting to gel together.",
      "Our defense came up huge when it mattered most.",
      "That touchdown pass was perfectly thrown!",
      "We need better play calling in the red zone.",
      "I'm impressed with how the freshmen are performing.",
      "Great to see us finally beat a top-ranked team!",
      "Hope the quarterback's ankle injury isn't serious.",
      "The secondary played their best game of the season.",
      "This coaching staff has completely transformed the program."
    ],
    Baseball: [
      "That pitching performance was masterful. Complete command of the strike zone.",
      "We need more consistent hitting with runners in scoring position.",
      "The double play in the 8th inning saved the game.",
      "Great series win against a tough conference opponent.",
      "The bullpen has been lights out this season.",
      "That diving catch in center field was SportsCenter worthy!",
      "The freshman shortstop is playing like a veteran.",
      "Perfect execution on that hit and run play.",
      "Weather conditions made pitching difficult today."
    ],
    Wrestling: [
      "Great technique on display in that final match.",
      "Looking like a serious contender for the conference championship.",
      "The heavyweight division is so competitive this year.",
      "That comeback victory showed incredible heart and determination.",
      "Coach has really built this program back to national prominence.",
      "The freshman class is already making a huge impact.",
      "That takedown in the final seconds was clutch!",
      "Need more consistency in the middle weight classes.",
      "So proud of our All-American selections this year!"
    ],
    Other: [
      "Great article! Thanks for the coverage.",
      "Really informative analysis. Keep it up!",
      "Looking forward to more updates on this story.",
      "This is why I follow Tiger Territory for my Mizzou sports news.",
      "Appreciate the in-depth reporting.",
      "Thanks for keeping us fans in the loop!",
      "Couldn't agree more with this take.",
      "Excited to see how this develops.",
      "You always have the best Mizzou coverage!"
    ]
  };
  
  const comments = commentsByCategory[category] || commentsByCategory.Other;
  return comments[index % comments.length];
}

// Run seeder
seedComments();