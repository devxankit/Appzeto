const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  bankName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  ifsc: { type: String, trim: true },
  upiId: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

accountSchema.index({ isActive: 1 });

module.exports = mongoose.model('Account', accountSchema);


