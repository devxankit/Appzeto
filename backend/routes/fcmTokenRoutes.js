const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { sendPushNotification, isInitialized } = require('../services/firebaseAdmin');
const { sendNotificationToUser } = require('../utils/pushNotificationHelper');

// Import all user models
const Admin = require('../models/Admin');
const PM = require('../models/PM');
const Sales = require('../models/Sales');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const ChannelPartner = require('../models/ChannelPartner');

/**
 * Get user model based on userType
 */
function getUserModel(userType) {
  switch (userType) {
    case 'admin':
    case 'hr':
    case 'accountant':
    case 'pem':
      return Admin;
    case 'project-manager':
      return PM;
    case 'sales':
      return Sales;
    case 'employee':
      return Employee;
    case 'client':
      return Client;
    case 'channel-partner':
      return ChannelPartner;
    default:
      return null;
  }
}

// @route   POST /api/fcm-tokens/save
// @desc    Save FCM token for authenticated user
// @access  Private
router.post('/save', protect, async (req, res) => {
  try {
    const { token, platform = 'web' } = req.body;
    const userId = req.user.id;
    const userType = req.userType;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required'
      });
    }

    // Validate platform
    if (platform !== 'web' && platform !== 'mobile') {
      return res.status(400).json({
        success: false,
        message: 'Platform must be either "web" or "mobile"'
      });
    }

    // Get user model
    const UserModel = getUserModel(userType);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add token to appropriate array
    if (platform === 'web') {
      if (!user.fcmTokens) {
        user.fcmTokens = [];
      }
      if (!user.fcmTokens.includes(token)) {
        user.fcmTokens.push(token);
        if (user.fcmTokens.length > 10) {
          user.fcmTokens = user.fcmTokens.slice(-10);
        }
      }
    } else if (platform === 'mobile') {
      if (!user.fcmTokenMobile) {
        user.fcmTokenMobile = [];
      }
      if (!user.fcmTokenMobile.includes(token)) {
        user.fcmTokenMobile.push(token);
        if (user.fcmTokenMobile.length > 10) {
          user.fcmTokenMobile = user.fcmTokenMobile.slice(-10);
        }
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'FCM token saved successfully',
      platform: platform,
      tokenCount: platform === 'web' ? user.fcmTokens.length : user.fcmTokenMobile.length
    });
  } catch (error) {
    console.error('Error saving FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save FCM token',
      error: error.message
    });
  }
});

// @route   DELETE /api/fcm-tokens/remove
// @desc    Remove FCM token for authenticated user
// @access  Private
router.delete('/remove', protect, async (req, res) => {
  try {
    const { token, platform = 'web' } = req.body;
    const userId = req.user.id;
    const userType = req.userType;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required'
      });
    }

    // Validate platform
    if (platform !== 'web' && platform !== 'mobile') {
      return res.status(400).json({
        success: false,
        message: 'Platform must be either "web" or "mobile"'
      });
    }

    // Get user model
    const UserModel = getUserModel(userType);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    // Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove token from appropriate array
    if (platform === 'web' && user.fcmTokens) {
      user.fcmTokens = user.fcmTokens.filter(t => t !== token);
    } else if (platform === 'mobile' && user.fcmTokenMobile) {
      user.fcmTokenMobile = user.fcmTokenMobile.filter(t => t !== token);
    }

    await user.save();

    res.json({
      success: true,
      message: 'FCM token removed successfully',
      platform: platform
    });
  } catch (error) {
    console.error('Error removing FCM token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove FCM token',
      error: error.message
    });
  }
});

// @route   POST /api/fcm-tokens/test
// @desc    Send test notification to authenticated user
// @access  Private
router.post('/test', protect, async (req, res) => {
  try {
    // Check if Firebase Admin is initialized
    if (!isInitialized()) {
      return res.status(503).json({
        success: false,
        message: 'Firebase Admin is not initialized. Please check Firebase configuration.',
        error: 'Firebase Admin not initialized'
      });
    }

    const userId = req.user.id;
    const userType = req.userType;

    // Get user model to verify tokens exist
    const UserModel = getUserModel(userType);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Send test notification using helper function
    const response = await sendNotificationToUser(
      userId,
      userType,
      {
        title: 'Welcome to Appzeto! 🎉',
        body: 'Push notifications are working! You will receive important updates here.',
        data: {
          type: 'test',
          link: '/',
          timestamp: new Date().toISOString()
        }
      },
      true // Include mobile tokens
    );

    if (response.error) {
      console.error(`❌ Error in sendNotificationToUser:`, response.error);
      return res.status(400).json({
        success: false,
        message: response.error
      });
    }

    if (response.failureCount > 0 && response.responses) {
      response.responses.forEach((resp) => {
        if (!resp.success) {
          console.error('Test notification failed:', resp.error?.code, resp.error?.message);
        }
      });
    }

    res.json({
      success: true,
      message: 'Test notification sent',
      result: {
        successCount: response.successCount,
        failureCount: response.failureCount,
        invalidTokens: response.invalidTokens?.length || 0
      }
    });
  } catch (error) {
    console.error('Test notification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message
    });
  }
});

// @route   GET /api/fcm-tokens/status
// @desc    Get FCM token status for authenticated user
// @access  Private
router.get('/status', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userType = req.userType;

    // Get user model
    const UserModel = getUserModel(userType);
    if (!UserModel) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      tokens: {
        web: user.fcmTokens || [],
        mobile: user.fcmTokenMobile || [],
        webCount: user.fcmTokens?.length || 0,
        mobileCount: user.fcmTokenMobile?.length || 0
      }
    });
  } catch (error) {
    console.error('Error getting FCM token status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get token status',
      error: error.message
    });
  }
});

module.exports = router;
