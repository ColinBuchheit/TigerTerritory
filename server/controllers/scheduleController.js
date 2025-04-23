const Schedule = require('../models/Schedule');
const { formatResponse } = require('../utils/responseFormatter');
const { validationResult } = require('express-validator');
const moment = require('moment');

/**
 * @desc    Create a new schedule
 * @route   POST /api/schedules
 * @access  Private (Admin)
 */
exports.createSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }
    
    const { 
      sport, 
      league, 
      homeTeam, 
      awayTeam, 
      venue, 
      startTime, 
      endTime, 
      status,
      score
    } = req.body;
    
    // Create new schedule
    const newSchedule = new Schedule({
      sport,
      league,
      homeTeam,
      awayTeam,
      venue,
      startTime,
      endTime,
      status,
      score
    });
    
    const schedule = await newSchedule.save();
    
    res.status(201).json(formatResponse(true, 'Schedule created successfully', schedule));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Get all schedules
 * @route   GET /api/schedules
 * @access  Public
 */
exports.getSchedules = async (req, res) => {
  try {
    // Get query params
    const { sport, league, date, status } = req.query;
    const query = {};
    
    // Add filters if provided
    if (sport) query.sport = sport;
    if (league) query.league = league;
    if (status) query.status = status;
    
    // Date filter
    if (date) {
      const startDate = moment(date).startOf('day');
      const endDate = moment(date).endOf('day');
      
      query.startTime = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate()
      };
    }
    
    const schedules = await Schedule.find(query).sort({ startTime: 1 });
    
    res.json(formatResponse(true, 'Schedules retrieved successfully', schedules));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Get schedule by ID
 * @route   GET /api/schedules/:id
 * @access  Public
 */
exports.getScheduleById = async (req, res) => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    
    if (!schedule) {
      return res.status(404).json(formatResponse(false, 'Schedule not found', null));
    }
    
    res.json(formatResponse(true, 'Schedule retrieved successfully', schedule));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Schedule not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Update a schedule
 * @route   PUT /api/schedules/:id
 * @access  Private (Admin)
 */
exports.updateSchedule = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(formatResponse(false, 'Validation error', errors.array()));
    }
    
    const { 
      sport, 
      league, 
      homeTeam, 
      awayTeam, 
      venue, 
      startTime, 
      endTime, 
      status,
      score 
    } = req.body;
    
    // Find schedule
    let schedule = await Schedule.findById(req.params.id);
    
    // Check if schedule exists
    if (!schedule) {
      return res.status(404).json(formatResponse(false, 'Schedule not found', null));
    }
    
    // Update schedule
    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { 
        sport, 
        league, 
        homeTeam, 
        awayTeam, 
        venue, 
        startTime, 
        endTime, 
        status,
        score
      },
      { new: true }
    );
    
    res.json(formatResponse(true, 'Schedule updated successfully', schedule));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Schedule not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Delete a schedule
 * @route   DELETE /api/schedules/:id
 * @access  Private (Admin)
 */
exports.deleteSchedule = async (req, res) => {
  try {
    // Find schedule
    const schedule = await Schedule.findById(req.params.id);
    
    // Check if schedule exists
    if (!schedule) {
      return res.status(404).json(formatResponse(false, 'Schedule not found', null));
    }
    
    // Delete schedule
    await schedule.remove();
    
    res.json(formatResponse(true, 'Schedule deleted successfully', {}));
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json(formatResponse(false, 'Schedule not found', null));
    }
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Get upcoming schedules
 * @route   GET /api/schedules/upcoming
 * @access  Public
 */
exports.getUpcomingSchedules = async (req, res) => {
  try {
    const now = new Date();
    
    const schedules = await Schedule.find({
      startTime: { $gt: now },
      status: 'Scheduled'
    })
    .sort({ startTime: 1 })
    .limit(10);
    
    res.json(formatResponse(true, 'Upcoming schedules retrieved successfully', schedules));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};

/**
 * @desc    Get live schedules
 * @route   GET /api/schedules/live
 * @access  Public
 */
exports.getLiveSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({
      status: 'Live'
    }).sort({ startTime: 1 });
    
    res.json(formatResponse(true, 'Live schedules retrieved successfully', schedules));
  } catch (err) {
    console.error(err.message);
    res.status(500).json(formatResponse(false, 'Server error', null));
  }
};