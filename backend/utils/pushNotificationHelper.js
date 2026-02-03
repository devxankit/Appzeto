const { sendPushNotification } = require('../services/firebaseAdmin');
const Admin = require('../models/Admin');
const PM = require('../models/PM');
const Sales = require('../models/Sales');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const ChannelPartner = require('../models/ChannelPartner');

/**
 * Send notification to a user by their ID and user type
 * @param {string} userId - User ID
 * @param {string} userType - User type (admin, project-manager, sales, employee, client, channel-partner)
 * @param {Object} payload - Notification payload
 * @param {string} payload.title - Notification title
 * @param {string} payload.body - Notification body
 * @param {Object} payload.data - Optional data payload (use data.icon for icon URL on client)
 * @param {boolean} includeMobile - Whether to include mobile tokens (default: true)
 * @returns {Promise<Object>} Response from Firebase
 */
async function sendNotificationToUser(userId, userType, payload, includeMobile = true) {
  try {
    let user;

    // Find user based on userType
    switch (userType) {
      case 'admin':
      case 'hr':
      case 'accountant':
      case 'pem':
        user = await Admin.findById(userId);
        break;
      case 'project-manager':
        user = await PM.findById(userId);
        break;
      case 'sales':
        user = await Sales.findById(userId);
        break;
      case 'employee':
        user = await Employee.findById(userId);
        break;
      case 'client':
        user = await Client.findById(userId);
        break;
      case 'channel-partner':
        user = await ChannelPartner.findById(userId);
        break;
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }

    if (!user) {
      throw new Error('User not found');
    }

    // Collect tokens
    let tokens = [];
    
    // Add web tokens
    if (user.fcmTokens && user.fcmTokens.length > 0) {
      tokens = [...tokens, ...user.fcmTokens];
    }
    if (includeMobile && user.fcmTokenMobile && user.fcmTokenMobile.length > 0) {
      tokens = [...tokens, ...user.fcmTokenMobile];
    }

    const uniqueTokens = [...new Set(tokens)];

    if (uniqueTokens.length === 0) {
      return {
        successCount: 0,
        failureCount: 0,
        responses: []
      };
    }

    // Send notification
    const response = await sendPushNotification(uniqueTokens, payload);

    // Handle invalid tokens - remove them from user's token arrays
    if (response.invalidTokens && response.invalidTokens.length > 0) {
      try {
        // Remove invalid tokens from web tokens
        if (user.fcmTokens) {
          user.fcmTokens = user.fcmTokens.filter(token => !response.invalidTokens.includes(token));
        }
        
        // Remove invalid tokens from mobile tokens
        if (user.fcmTokenMobile) {
          user.fcmTokenMobile = user.fcmTokenMobile.filter(token => !response.invalidTokens.includes(token));
        }
        
        await user.save();
      } catch (error) {
        console.error('Error removing invalid FCM tokens:', error.message);
      }
    }

    return response;
  } catch (error) {
    console.error('❌ Error sending notification to user:', error);
    // Don't throw - notifications are non-critical
    return {
      successCount: 0,
      failureCount: 0,
      responses: [],
      error: error.message
    };
  }
}

module.exports = { sendNotificationToUser };
