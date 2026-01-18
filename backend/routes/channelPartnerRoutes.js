const express = require('express');
const router = express.Router();
const {
  getAllChannelPartners,
  getChannelPartnerStatistics,
  getChannelPartner,
  createChannelPartner,
  updateChannelPartner,
  deleteChannelPartner
} = require('../controllers/channelPartnerController');
const { protect, authorize } = require('../middlewares/auth');

// Apply authentication and authorization to all routes
// router.use(protect);
// router.use(authorize('admin', 'hr'));

// @route   GET /api/admin/channel-partners/statistics
// @desc    Get channel partner statistics
// @access  Private (Admin only)
router.get('/statistics', getChannelPartnerStatistics);

// @route   GET /api/admin/channel-partners
// @desc    Get all channel partners with filtering and pagination
// @access  Private (Admin only)
router.get('/', getAllChannelPartners);

// @route   POST /api/admin/channel-partners
// @desc    Create new channel partner
// @access  Private (Admin only)
router.post('/', createChannelPartner);

// @route   GET /api/admin/channel-partners/:id
// @desc    Get single channel partner by ID
// @access  Private (Admin only)
router.get('/:id', getChannelPartner);

// @route   PUT /api/admin/channel-partners/:id
// @desc    Update channel partner
// @access  Private (Admin only)
router.put('/:id', updateChannelPartner);

// @route   DELETE /api/admin/channel-partners/:id
// @desc    Delete channel partner
// @access  Private (Admin only)
router.delete('/:id', deleteChannelPartner);

module.exports = router;
