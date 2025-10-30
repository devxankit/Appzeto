const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test Cloudinary connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder = 'appzeto') => {
  try {
    let result;
    
    if (file.buffer) {
      // Memory storage - upload from buffer using data URI format
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      result = await cloudinary.uploader.upload(dataUri, {
        folder: folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      });
    } else if (file.path) {
      // Disk storage - upload from path
      result = await cloudinary.uploader.upload(file.path, {
        folder: folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      });
    } else {
      throw new Error('File must have either buffer or path property');
    }
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: result.original_filename || file.originalname,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height
      }
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      data: result
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Get file info from Cloudinary
const getFileInfo = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('Cloudinary get info error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  cloudinary,
  testCloudinaryConnection,
  uploadToCloudinary,
  deleteFromCloudinary,
  getFileInfo
};
