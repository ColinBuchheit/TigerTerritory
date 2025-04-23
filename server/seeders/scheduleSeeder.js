const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');
const config = require('../config/config');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected for seeding schedules...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

// Seed schedules
const seedSchedules = async () => {
  try {
    await connectDB();
    
    // Clear existing schedules
    await Schedule.deleteMany({});
    console.log('All schedules removed');
    
    // Current date for reference
    const now = new Date();
    
    // Sample schedule data
    const schedules = [
      // Past games (completed)
      {
        sport: 'Basketball',
        league: 'NBA',
        homeTeam: {
          name: 'Los Angeles Lakers',
          logo: 'https://via.placeholder.com/100?text=Lakers'
        },
        awayTeam: {
          name: 'Golden State Warriors',
          logo: 'https://via.placeholder.com/100?text=Warriors'
        },
        venue: 'Staples Center, Los Angeles',
        startTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endTime: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000),
        status: 'Completed',
        score: {
          home: 112,
          away: 104
        }
      },
      {
        sport: 'Football',
        league: 'NFL',
        homeTeam: {
          name: 'Kansas City Chiefs',
          logo: 'https://via.placeholder.com/100?text=Chiefs'
        },
        awayTeam: {
          name: 'Buffalo Bills',
          logo: 'https://via.placeholder.com/100?text=Bills'
        },
        venue: 'Arrowhead Stadium, Kansas City',
        startTime: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        endTime: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000 + 3.5 * 60 * 60 * 1000),
        status: 'Completed',
        score: {
          home: 28,
          away: 24
        }
      },
      
      // Today's games (live)
      {
        sport: 'Soccer',
        league: 'Champions League',
        homeTeam: {
          name: 'Real Madrid',
          logo: 'https://via.placeholder.com/100?text=RealMadrid'
        },
        awayTeam: {
          name: 'Bayern Munich',
          logo: 'https://via.placeholder.com/100?text=Bayern'
        },
        venue: 'Santiago Bernabéu, Madrid',
        startTime: new Date(now.getTime() - 1 * 60 * 60 * 1000), // 1 hour ago
        endTime: new Date(now.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
        status: 'Live',
        score: {
          home: 1,
          away: 1
        }
      },
      {
        sport: 'Baseball',
        league: 'MLB',
        homeTeam: {
          name: 'New York Yankees',
          logo: 'https://via.placeholder.com/100?text=Yankees'
        },
        awayTeam: {
          name: 'Boston Red Sox',
          logo: 'https://via.placeholder.com/100?text=RedSox'
        },
        venue: 'Yankee Stadium, New York',
        startTime: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        endTime: new Date(now.getTime() + 1.5 * 60 * 60 * 1000), // 1.5 hours from now
        status: 'Live',
        score: {
          home: 3,
          away: 2
        }
      },
      
      // Upcoming games (scheduled)
      {
        sport: 'Basketball',
        league: 'NBA',
        homeTeam: {
          name: 'Boston Celtics',
          logo: 'https://via.placeholder.com/100?text=Celtics'
        },
        awayTeam: {
          name: 'Miami Heat',
          logo: 'https://via.placeholder.com/100?text=Heat'
        },
        venue: 'TD Garden, Boston',
        startTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
        endTime: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000),
        status: 'Scheduled',
        score: {
          home: 0,
          away: 0
        }
      },
      {
        sport: 'Football',
        league: 'NFL',
        homeTeam: {
          name: 'San Francisco 49ers',
          logo: 'https://via.placeholder.com/100?text=49ers'
        },
        awayTeam: {
          name: 'Seattle Seahawks',
          logo: 'https://via.placeholder.com/100?text=Seahawks'
        },
        venue: 'Levi\'s Stadium, Santa Clara',
        startTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // In 3 days
        endTime: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000 + 3.5 * 60 * 60 * 1000),
        status: 'Scheduled',
        score: {
          home: 0,
          away: 0
        }
      },
      {
        sport: 'Tennis',
        league: 'Grand Slam',
        homeTeam: {
          name: 'Novak Djokovic',
          logo: 'https://via.placeholder.com/100?text=Djokovic'
        },
        awayTeam: {
          name: 'Rafael Nadal',
          logo: 'https://via.placeholder.com/100?text=Nadal'
        },
        venue: 'Roland Garros, Paris',
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // In 5 days
        endTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        status: 'Scheduled',
        score: {
          home: 0,
          away: 0
        }
      },
      {
        sport: 'Hockey',
        league: 'NHL',
        homeTeam: {
          name: 'Toronto Maple Leafs',
          logo: 'https://via.placeholder.com/100?text=MapleLeafs'
        },
        awayTeam: {
          name: 'Montreal Canadiens',
          logo: 'https://via.placeholder.com/100?text=Canadiens'
        },
        venue: 'Scotiabank Arena, Toronto',
        startTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // In 2 days
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        status: 'Scheduled',
        score: {
          home: 0,
          away: 0
        }
      }
    ];
    
    // Insert schedules
    await Schedule.insertMany(schedules);
    console.log('Schedules seeded successfully');
    
    // Get and log the created schedules
    const seededSchedules = await Schedule.find();
    console.log(`${seededSchedules.length} schedules created:`);
    
    // Log schedules by status
    const liveSchedules = seededSchedules.filter(s => s.status === 'Live');
    const upcomingSchedules = seededSchedules.filter(s => s.status === 'Scheduled');
    const completedSchedules = seededSchedules.filter(s => s.status === 'Completed');
    
    console.log(`- ${completedSchedules.length} completed games`);
    console.log(`- ${liveSchedules.length} live games`);
    console.log(`- ${upcomingSchedules.length} upcoming games`);
    
    process.exit();
  } catch (err) {
    console.error('Error seeding schedules:', err.message);
    process.exit(1);
  }
};

// Run seeder
seedSchedules();