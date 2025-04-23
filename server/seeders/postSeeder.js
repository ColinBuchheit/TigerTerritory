const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/user');
const config = require('../config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for seeding posts...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Seed posts
const seedPosts = async () => {
  try {
    await connectDB();
    
    // Clear existing posts
    await Post.deleteMany({});
    console.log('All posts removed');
    
    // Get user IDs for post authors
    const admin = await User.findOne({ email: 'admin@example.com' });
    const john = await User.findOne({ email: 'john@example.com' });
    const blogger = await User.findOne({ email: 'blogger@example.com' });
    
    if (!admin || !john || !blogger) {
      console.error('Required users not found. Please run userSeeder first.');
      process.exit(1);
    }
    
    // Sample post data
    const posts = [
      {
        title: 'Lakers vs. Warriors: Preview and Predictions',
        content: 'The Lakers and Warriors are set to face off in a crucial Western Conference matchup. Both teams are looking to secure their position in the playoff race. LeBron James is expected to play despite recent injury concerns, while Stephen Curry is coming off a 40-point performance against the Rockets.',
        category: 'Basketball',
        imageUrl: 'https://via.placeholder.com/800x400?text=Lakers+vs+Warriors',
        user: admin._id,
        views: 124,
        date: new Date('2023-04-15T20:00:00Z')
      },
      {
        title: 'NFL Draft: Top Quarterback Prospects',
        content: 'With the NFL Draft approaching, teams are evaluating the top quarterback prospects. This year\'s class features several promising talents, including players from top college programs who have demonstrated exceptional arm talent and football IQ. Scouts are particularly interested in mobility and ability to process defenses quickly.',
        category: 'Football',
        imageUrl: 'https://via.placeholder.com/800x400?text=NFL+Draft+QB+Prospects',
        user: john._id,
        views: 89,
        date: new Date('2023-04-10T14:30:00Z')
      },
      {
        title: 'Tennis: Upcoming Grand Slam Preview',
        content: 'The tennis world is gearing up for the next Grand Slam tournament. Top seeds are finalizing their preparations, with defending champions looking to retain their titles. Several players are returning from injuries, which could create opportunities for new challengers to make deep runs in the tournament.',
        category: 'Tennis',
        imageUrl: 'https://via.placeholder.com/800x400?text=Grand+Slam+Preview',
        user: blogger._id,
        views: 67,
        date: new Date('2023-04-05T09:15:00Z')
      },
      {
        title: 'Champions League: Quarterfinal Matchups',
        content: 'The Champions League quarterfinals are set, with several intriguing matchups. European powerhouses will clash in what promises to be exciting home-and-away fixtures. Recent form suggests some potential upsets, with several underdogs showing strong performances in their domestic leagues.',
        category: 'Soccer',
        imageUrl: 'https://via.placeholder.com/800x400?text=Champions+League',
        user: admin._id,
        views: 156,
        date: new Date('2023-04-01T16:45:00Z')
      },
      {
        title: 'MLB Season: Early Standouts and Disappointments',
        content: 'As the MLB season progresses, several teams and players have emerged as early standouts, while others have failed to meet expectations. Rookie pitchers have particularly impressed, with several making immediate impacts. Meanwhile, some preseason favorites are struggling with consistency in both hitting and pitching.',
        category: 'Baseball',
        imageUrl: 'https://via.placeholder.com/800x400?text=MLB+Season+Update',
        user: john._id,
        views: 42,
        date: new Date('2023-03-28T11:20:00Z')
      }
    ];
    
    // Insert posts
    await Post.insertMany(posts);
    console.log('Posts seeded successfully');
    
    // Get and log the created posts
    const seededPosts = await Post.find();
    console.log(`${seededPosts.length} posts created`);
    
    process.exit();
  } catch (err) {
    console.error('Error seeding posts:', err.message);
    process.exit(1);
  }
};

// Run seeder
seedPosts();
