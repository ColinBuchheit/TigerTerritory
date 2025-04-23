const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment');

/**
 * @swagger
 * components:
 *   schemas:
 *     Schedule:
 *       type: object
 *       required:
 *         - sport
 *         - league
 *         - homeTeam
 *         - awayTeam
 *         - venue
 *         - startTime
 *         - status
 *       properties:
 *         sport:
 *           type: string
 *           description: Sport type (e.g., Football, Basketball)
 *         league:
 *           type: string
 *           description: League (e.g., NFL, NBA)
 *         homeTeam:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             logo:
 *               type: string
 *           description: Home team information
 *         awayTeam:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *             logo:
 *               type: string
 *           description: Away team information
 *         venue:
 *           type: string
 *           description: Game venue
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Scheduled start time
 *         endTime:
 *           type: string
 *           format: date-time
 *           description: Scheduled end time
 *         status:
 *           type: string
 *           enum: [Scheduled, Live, Completed, Postponed, Canceled]
 *           description: Game status
 *         score:
 *           type: object
 *           properties:
 *             home:
 *               type: number
 *             away:
 *               type: number
 *           description: Game score
 *         highlights:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of highlight URLs
 */
const ScheduleSchema = new Schema({
  sport: {
    type: String,
    required: [true, 'Sport is required'],
    enum: ['Football', 'Basketball', 'Baseball', 'Hockey', 'Soccer', 'Tennis', 'Golf', 'Other']
  },
  league: {
    type: String,
    required: [true, 'League is required']
  },
  homeTeam: {
    name: {
      type: String,
      required: [true, 'Home team name is required']
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/100'
    }
  },
  awayTeam: {
    name: {
      type: String,
      required: [true, 'Away team name is required']
    },
    logo: {
      type: String,
      default: 'https://via.placeholder.com/100'
    }
  },
  venue: {
    type: String,
    required: [true, 'Venue is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['Scheduled', 'Live', 'Completed', 'Postponed', 'Canceled'],
    default: 'Scheduled'
  },
  score: {
    home: {
      type: Number,
      default: 0
    },
    away: {
      type: Number,
      default: 0
    }
  },
  highlights: [
    {
      type: String
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updatedAt' field on save
ScheduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual to determine if game is in the future
ScheduleSchema.virtual('isUpcoming').get(function() {
  return new Date(this.startTime) > new Date();
});

// Virtual to determine if the home team is winning
ScheduleSchema.virtual('isHomeWinning').get(function() {
  return this.score.home > this.score.away;
});

// Virtual to determine if the away team is winning
ScheduleSchema.virtual('isAwayWinning').get(function() {
  return this.score.away > this.score.home;
});

// Virtual to determine if the game is tied
ScheduleSchema.virtual('isTied').get(function() {
  return this.score.home === this.score.away;
});

// Virtual to get the score difference
ScheduleSchema.virtual('scoreDifference').get(function() {
  return Math.abs(this.score.home - this.score.away);
});

// Virtual to get formatted start time
ScheduleSchema.virtual('formattedStartTime').get(function() {
  return moment(this.startTime).format('MMMM D, YYYY h:mm A');
});

// Virtual to get relative start time
ScheduleSchema.virtual('relativeStartTime').get(function() {
  return moment(this.startTime).fromNow();
});

// Virtual to get game duration in minutes (if both start and end times are available)
ScheduleSchema.virtual('durationMinutes').get(function() {
  if (this.startTime && this.endTime) {
    return moment(this.endTime).diff(moment(this.startTime), 'minutes');
  }
  return null;
});

// Virtual to create a display name for the match
ScheduleSchema.virtual('matchDisplay').get(function() {
  return `${this.homeTeam.name} vs ${this.awayTeam.name}`;
});

// Ensure virtuals are included when converting to JSON/Object
ScheduleSchema.set('toJSON', { virtuals: true });
ScheduleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Schedule', ScheduleSchema);