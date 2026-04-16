const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { sendPushNotification, isInitialized } = require('../services/firebaseAdmin');
const { sendNotificationToUser } = require('../utils/pushNotificationHelper');

const { getUserModel, findUserAndModelById, removeFCMTokensGlobally } = require('../utils/userHelper');
const Admin = require('../models/Admin');
const PM = require('../models/PM');
const Sales = require('../models/Sales');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const ChannelPartner = require('../models/ChannelPartner');

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
    
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[FCM] Saving ${platform} token for: ID=${userId}, Type=${userType}, Model=${UserModel?.modelName || 'Unknown'}`);
    }

    if (!UserModel) {
      console.error(`[FCM] Model not found for userType: ${userType}`);
      return res.status(400).json({
        success: false,
        message: 'Invalid user type'
      });
    }

    // Determine field based on platform
    const tokenField = platform === 'web' ? 'fcmTokens' : 'fcmTokenMobile';

    // Atomic update using $addToSet to avoid duplicates
    let updateResult = await UserModel.updateOne(
      { _id: userId },
      { $addToSet: { [tokenField]: token } }
    );

    // Fallback: If no document was matched, we might have misidentified the user collection
    if (updateResult.matchedCount === 0) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[FCM] Primary update failed for: ID=${userId}, Type=${userType}. Attempting recovery...`);
      }

      // Deep-search to find the correct model
      const recovery = await findUserAndModelById(userId);

      if (recovery) {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[FCM] Recovery successful! Re-saving for: Model=${recovery.type}`);
        }

        // Determine correct field for the recovered model
        const recoveryTokenField = platform === 'web' ? 'fcmTokens' : 'fcmTokenMobile';

        // Perform recovery update
        updateResult = await recovery.model.updateOne(
          { _id: userId },
          { $addToSet: { [recoveryTokenField]: token } }
        );
      } else {
        console.error(`[FCM] Recovery failed! User not found in any collection: ID=${userId}`);
        return res.status(404).json({
          success: false,
          message: 'User record not found to save FCM token'
        });
      }
    }

    res.json({
      success: true,
      message: 'FCM token saved successfully',
      platform: platform,
      alreadyExists: updateResult.modifiedCount === 0
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

    // Determine field based on platform
    const tokenField = platform === 'web' ? 'fcmTokens' : 'fcmTokenMobile';

    // Atomic removal using $pull
    await UserModel.updateOne(
      { _id: userId },
      { $pull: { [tokenField]: token } }
    );

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

// @route   DELETE /api/fcm-tokens/purge-all
// @desc    Purge ALL FCM tokens from every user collection (admin only, use after VAPID key rotation)
// @access  Admin only
router.delete('/purge-all', protect, async (req, res) => {
  try {
    if (req.userType !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const models = [Admin, PM, Sales, Employee, Client, ChannelPartner];
    let totalModified = 0;

    await Promise.all(models.map(async (Model) => {
      const result = await Model.updateMany(
        {},
        { $set: { fcmTokens: [], fcmTokenMobile: [] } }
      );
      totalModified += result.modifiedCount;
    }));

    console.log(`[FCM] Admin purged all FCM tokens. Records updated: ${totalModified}`);

    res.json({
      success: true,
      message: `All FCM tokens purged. ${totalModified} user records updated. Users will re-register on next login.`
    });
  } catch (error) {
    console.error('Error purging FCM tokens:', error);
    res.status(500).json({ success: false, message: 'Failed to purge tokens', error: error.message });
  }
});

module.exports = router;
