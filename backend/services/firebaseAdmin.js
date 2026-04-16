const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
let initialized = false;

function initializeFirebaseAdmin() {
  if (initialized) {
    return;
  }

  let serviceAccount;

  try {
    // Option 1: Service Account File Path
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
      serviceAccount = require(serviceAccountPath);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    // Option 2: Full JSON as Environment Variable (Production - Recommended)
    else if (process.env.FIREBASE_CONFIG) {
      serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    // Option 3: Default path (development)
    else {
      const defaultPath = path.join(__dirname, '../config/firebase-service-account.json');
      try {
        if (require('fs').existsSync(defaultPath)) {
          serviceAccount = require(defaultPath);
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
          });
        } else {
          console.warn('Firebase Admin: service account file not found at', defaultPath);
          return;
        }
      } catch (error) {
        console.warn('Firebase Admin init failed:', error.message);
        return;
      }
    }

    initialized = true;
    console.log('✅ Firebase Admin initialized:');
    if (serviceAccount) {
      console.log(`   - Project ID: ${serviceAccount.project_id}`);
      console.log(`   - Client Email: ${serviceAccount.client_email}`);
    }
  } catch (error) {
    console.error('❌ Firebase Admin init failed:', error.message);
    console.warn('   Push notifications will not work until Firebase is configured.');
    // Don't throw - allow app to continue without Firebase
  }
}

// Initialize on module load
initializeFirebaseAdmin();

/**
 * Send push notification to multiple FCM tokens
 * @param {Array<string>} tokens - Array of FCM tokens
 * @param {Object} payload - Notification payload
 * @param {string} payload.title - Notification title
 * @param {string} payload.body - Notification body
 * @param {Object} payload.data - Optional data payload (FCM only accepts string values; icon URL can be passed here for client use)
 * @returns {Promise<Object>} Response with success and failure counts
 */
async function sendPushNotification(tokens, payload) {
  try {
    // Check if Firebase Admin is initialized
    if (!initialized) {
      console.error('❌ Firebase Admin is not initialized. Cannot send push notification.');
      throw new Error('Firebase Admin is not initialized. Please configure Firebase service account.');
    }

    if (!tokens || tokens.length === 0) {
      return {
        successCount: 0,
        failureCount: 0,
        responses: []
      };
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Push] Attempting multicast send to ${tokens.length} tokens.`);
      // Forensic log: Check which project we are actually using
      const currentProject = admin.app().options.credential?.projectId || 'unknown';
      console.log(`[Push] Using Project Credentials: ${currentProject}`);
    }

    // Remove duplicates
    const uniqueTokens = [...new Set(tokens)];

    // FCM data payload requires ALL values to be strings (FCM v1 API restriction).
    const rawData = payload.data || {};
    const stringData = Object.fromEntries(
      Object.entries(rawData).map(([k, v]) => [k, v == null ? '' : String(v)])
    );

    const message = {
      tokens: uniqueTokens,
      notification: {
        title: payload.title,
        body: payload.body
      },
      data: stringData,
      // webpush.notification is what browsers actually use for icon/badge.
      // The top-level notification.icon is ignored on web.
      webpush: {
        notification: {
          icon: payload.data?.icon || '/vite.svg',
          badge: '/vite.svg'
        },
        fcmOptions: {
          link: payload.data?.link || '/'
        }
      }
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);

      // Handle results and log failures
      const invalidTokens = [];
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const token = uniqueTokens[idx];
            console.error(`❌ FCM send failed for token [${token.substring(0, 10)}...]:`, resp.error?.code, resp.error?.message);

            // Treat third-party-auth-error as an invalid token as it usually means a VAPID mismatch
            if (resp.error?.code === 'messaging/invalid-registration-token' ||
              resp.error?.code === 'messaging/registration-token-not-registered' ||
              resp.error?.code === 'messaging/third-party-auth-error') {
              invalidTokens.push(token);
            }
          }
        });
      }

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
        invalidTokens: invalidTokens
      };
    } catch (firebaseError) {
      console.error('❌ Firebase Admin sendEachForMulticast error:', firebaseError);
      console.error('   Error code:', firebaseError.code);
      console.error('   Error message:', firebaseError.message);
      throw firebaseError;
    }
  } catch (error) {
    console.error('❌ Error sending push notification:', error);
    throw error;
  }
}

/**
 * Check if Firebase Admin is initialized
 */
function isInitialized() {
  return initialized;
}

module.exports = { sendPushNotification, isInitialized };
