const mongoose = require('mongoose');

const paymentReceiptSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true, min: 0 },
  account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
  method: { type: String, enum: ['bank_transfer', 'upi', 'cash', 'other'], default: 'upi' },
  referenceId: { type: String, trim: true },
  notes: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Sales', required: true },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  verifiedAt: { type: Date }
}, { timestamps: true });

paymentReceiptSchema.index({ status: 1, createdAt: -1 });

// Post-save hook to create finance transaction when PaymentReceipt is approved
paymentReceiptSchema.post('save', async function(doc) {
  // Only create transaction if status is 'approved'
  if (doc.status === 'approved') {
    try {
      const { createIncomingTransaction } = require('../utils/financeTransactionHelper');
      const { mapPaymentReceiptMethodToFinance } = require('../utils/paymentMethodMapper');
      const AdminFinance = require('./AdminFinance');
      const Project = require('./Project');
      
      // Check if transaction already exists
      const existing = await AdminFinance.findOne({
        recordType: 'transaction',
        'metadata.sourceType': 'paymentReceipt',
        'metadata.sourceId': doc._id.toString()
      });
      
      if (!existing) {
        // Get project name for description
        const project = await Project.findById(doc.project).select('name');
        const projectName = project ? project.name : 'Unknown Project';
        
        // Get Admin ID - use verifiedBy if available, otherwise find first admin
        const Admin = require('./Admin');
        let adminId = doc.verifiedBy;
        if (!adminId) {
          const admin = await Admin.findOne({ isActive: true }).select('_id');
          adminId = admin ? admin._id : null;
        }
        
        if (adminId) {
          await createIncomingTransaction({
            amount: doc.amount,
            category: 'Payment Receipt',
            transactionDate: doc.verifiedAt || new Date(),
            createdBy: adminId,
            client: doc.client,
            project: doc.project,
            account: doc.account,
            paymentMethod: mapPaymentReceiptMethodToFinance(doc.method),
            description: `Payment receipt approved for project "${projectName}" - ${doc.referenceId || 'N/A'}`,
            metadata: {
              sourceType: 'paymentReceipt',
              sourceId: doc._id.toString(),
              referenceId: doc.referenceId || null
            },
            checkDuplicate: true
          });
        }
      }
    } catch (error) {
      // Log error but don't fail the save
      console.error('Error creating finance transaction for payment receipt:', error);
    }
  }
});

module.exports = mongoose.model('PaymentReceipt', paymentReceiptSchema);


