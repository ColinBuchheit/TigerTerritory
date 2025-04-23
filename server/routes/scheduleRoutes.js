const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const { scheduleValidation } = require('../middleware/validators');

/**
 * @swagger
 * /schedules:
 *   get:
 *     summary: Get all schedules
 *     tags: [Schedules]
 *     parameters:
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *         description: Filter by sport
 *       - in: query
 *         name: league
 *         schema:
 *           type: string
 *         description: Filter by league
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (Scheduled, Live, Completed, etc.)
 *     responses:
 *       200:
 *         description: List of schedules
 *       500:
 *         description: Server error
 */
router.get('/', scheduleController.getSchedules);

/**
 * @swagger
 * /schedules/upcoming:
 *   get:
 *     summary: Get upcoming schedules
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: List of upcoming schedules
 *       500:
 *         description: Server error
 */
router.get('/upcoming', scheduleController.getUpcomingSchedules);

/**
 * @swagger
 * /schedules/live:
 *   get:
 *     summary: Get live schedules
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: List of live schedules
 *       500:
 *         description: Server error
 */
router.get('/live', scheduleController.getLiveSchedules);

/**
 * @swagger
 * /schedules/{id}:
 *   get:
 *     summary: Get schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule retrieved successfully
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.get('/:id', scheduleController.getScheduleById);

/**
 * @swagger
 * /schedules:
 *   post:
 *     summary: Create a new schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.post('/', [auth, adminAuth, scheduleValidation], scheduleController.createSchedule);

/**
 * @swagger
 * /schedules/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Schedule'
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.put('/:id', [auth, adminAuth, scheduleValidation], scheduleController.updateSchedule);

/**
 * @swagger
 * /schedules/{id}:
 *   delete:
 *     summary: Delete a schedule
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', [auth, adminAuth], scheduleController.deleteSchedule);

module.exports = router;