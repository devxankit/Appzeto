const { cloudinary, uploadToCloudinary, deleteFromCloudinary, getFileInfo } = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'appzeto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    resource_type: 'auto'
  }
});

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and documents (PDF, DOC, DOCX) are allowed'));
    }
  }
});

// Universal upload function
const uploadFile = async (file, folder = 'appzeto', options = {}) => {
  try {
    const uploadOptions = {
      folder: folder,
      resource_type: 'auto',
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };

    const result = await cloudinary.uploader.upload(file.path, uploadOptions);
    
    return {
      success: true,
      data: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: result.original_filename,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        created_at: result.created_at
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

// Universal delete function
const deleteFile = async (publicId) => {
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

// Get file information
const getFileDetails = async (publicId) => {
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

// Upload multiple files
const uploadMultipleFiles = async (files, folder = 'appzeto', options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadFile(file, folder, options));
    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);
    
    return {
      success: failed.length === 0,
      data: {
        successful: successful.map(result => result.data),
        failed: failed.map(result => result.error)
      }
    };
  } catch (error) {
    console.error('Multiple files upload error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Delete multiple files
const deleteMultipleFiles = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteFile(publicId));
    const results = await Promise.all(deletePromises);
    
    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);
    
    return {
      success: failed.length === 0,
      data: {
        successful: successful.length,
        failed: failed.length
      }
    };
  } catch (error) {
    console.error('Multiple files delete error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Generate signed upload URL for frontend direct uploads
const generateSignedUploadUrl = (folder = 'appzeto', options = {}) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        folder: folder,
        ...options
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return {
      success: true,
      data: {
        signature: signature,
        timestamp: timestamp,
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        folder: folder
      }
    };
  } catch (error) {
    console.error('Generate signed URL error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  upload,
  uploadFile,
  deleteFile,
  getFileDetails,
  uploadMultipleFiles,
  deleteMultipleFiles,
  generateSignedUploadUrl,
  cloudinary
};
