const Schedule = require('../models/Schedule');
const { formatResponse } = require('../utils/responseFormatter');
const { validateRequest, asyncHandler, checkResourceNotFound } = require('../utils/controllerHelpers');
const { validationResult } = require('express-validator');
const moment = require('moment');

/**
 * @desc    Create a new schedule
 * @route   POST /api/schedules
 * @access  Private (Admin)
 */
exports.createSchedule = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
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
  });
});

/**
 * @desc    Get all schedules
 * @route   GET /api/schedules
 * @access  Public
 */
exports.getSchedules = asyncHandler(async (req, res) => {
  // Get query params for pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
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
  
  const schedules = await Schedule.find(query)
    .sort({ startTime: 1 })
    .skip(skip)
    .limit(limit)
    .select('sport league homeTeam awayTeam venue startTime status score'); // Select only needed fields
  
  // Get total count for pagination info
  const total = await Schedule.countDocuments(query);
  
  const paginationInfo = {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
  
  res.json(formatResponse(true, 'Schedules retrieved successfully', { schedules, pagination: paginationInfo }));
});

/**
 * @desc    Get schedule by ID
 * @route   GET /api/schedules/:id
 * @access  Public
 */
exports.getScheduleById = asyncHandler(async (req, res) => {
  const schedule = await Schedule.findById(req.params.id);
  
  if (checkResourceNotFound(schedule, res, 'Schedule')) return;
  
  res.json(formatResponse(true, 'Schedule retrieved successfully', schedule));
});

/**
 * @desc    Update a schedule
 * @route   PUT /api/schedules/:id
 * @access  Private (Admin)
 */
exports.updateSchedule = asyncHandler(async (req, res) => {
  return validateRequest(req, res, async () => {
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
    
    if (checkResourceNotFound(schedule, res, 'Schedule')) return;
    
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
  });
});

/**
 * @desc    Delete a schedule
 * @route   DELETE /api/schedules/:id
 * @access  Private (Admin)
 */
exports.deleteSchedule = asyncHandler(async (req, res) => {
  // Find schedule
  const schedule = await Schedule.findById(req.params.id);
  
  if (checkResourceNotFound(schedule, res, 'Schedule')) return;
  
  // Delete schedule - using deleteOne instead of deprecated remove()
  await Schedule.deleteOne({ _id: schedule._id });
  
  res.json(formatResponse(true, 'Schedule deleted successfully', {}));
});

/**
 * @desc    Get upcoming schedules
 * @route   GET /api/schedules/upcoming
 * @access  Public
 */
exports.getUpcomingSchedules = asyncHandler(async (req, res) => {
  const now = new Date();
  
  const schedules = await Schedule.find({
    startTime: { $gt: now },
    status: 'Scheduled'
  })
  .sort({ startTime: 1 })
  .limit(10)
  .select('sport league homeTeam awayTeam venue startTime status'); // Select only needed fields
  
  res.json(formatResponse(true, 'Upcoming schedules retrieved successfully', schedules));
});

/**
 * @desc    Get live schedules
 * @route   GET /api/schedules/live
 * @access  Public
 */
exports.getLiveSchedules = asyncHandler(async (req, res) => {
  const schedules = await Schedule.find({
    status: 'Live'
  })
  .sort({ startTime: 1 })
  .select('sport league homeTeam awayTeam venue startTime status score'); // Select only needed fields
  
  res.json(formatResponse(true, 'Live schedules retrieved successfully', schedules));
});