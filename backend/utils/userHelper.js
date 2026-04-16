const Admin = require('../models/Admin');
const PM = require('../models/PM');
const Sales = require('../models/Sales');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const ChannelPartner = require('../models/ChannelPartner');

/**
 * Get user model based on userType
 * @param {string} userType - The type of user (e.g., 'admin', 'employee', 'client')
 * @returns {Object|null} The Mongoose model or null if not found
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

/**
 * Find user and their model name by ID alone.
 * Useful for recovery when req.userType might be incorrect.
 * @param {string} userId - The user ID to search for
 * @returns {Promise<Object|null>} { user, model, type } or null
 */
async function findUserAndModelById(userId) {
  const models = [
    { model: Admin, type: 'admin' },
    { model: PM, type: 'project-manager' },
    { model: Sales, type: 'sales' },
    { model: Employee, type: 'employee' },
    { model: Client, type: 'client' },
    { model: ChannelPartner, type: 'channel-partner' }
  ];

  for (const item of models) {
    try {
      const user = await item.model.findById(userId).select('_id name email role');
      if (user) {
        return { user, model: item.model, type: item.type };
      }
    } catch (e) {
      // Continue to next model on error
    }
  }
  return null;
}

/**
 * Remove invalid FCM tokens across all user collections.
 * Essential for pruning "third-party-auth-error" or defunct tokens after broadcast.
 * @param {Array<string>} tokens - Array of invalid tokens to remove
 */
async function removeFCMTokensGlobally(tokenArray) {
  if (!Array.isArray(tokenArray) || tokenArray.length === 0) return;

  const models = [Admin, PM, Sales, Employee, Client, ChannelPartner];
  const uniqueTokens = [...new Set(tokenArray)];

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[FCM] Pruning ${uniqueTokens.length} tokens globally from ${models.length} collections...`);
  }

  const results = await Promise.all(models.map(async (Model) => {
    try {
      const result = await Model.updateMany(
        {}, 
        { 
          $pull: { 
            fcmTokens: { $in: uniqueTokens },
            fcmTokenMobile: { $in: uniqueTokens }
          } 
        }
      );
      return { model: Model.modelName, matched: result.matchedCount, modified: result.modifiedCount };
    } catch (e) {
      console.error(`[FCM] Failed to prune tokens from ${Model.modelName}:`, e.message);
      return { model: Model.modelName, error: e.message };
    }
  }));

  if (process.env.NODE_ENV !== 'production') {
    const totalPruned = results.reduce((sum, r) => sum + (r.modified || 0), 0);
    console.log(`[FCM] Pruning complete. Total records updated: ${totalPruned}`);
  }
  
  return results;
}

module.exports = {
  getUserModel,
  findUserAndModelById,
  removeFCMTokensGlobally
};
