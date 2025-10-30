const mongoose = require('mongoose');
const Account = require('../models/Account');
const PaymentReceipt = require('../models/PaymentReceipt');
const Project = require('../models/Project');

const safeId = (v) => { try { return new mongoose.Types.ObjectId(v) } catch { return v } }

// Accounts (admin)
const listAccounts = async (req, res) => {
  try {
    const items = await Account.find({}).sort({ createdAt: -1 })
    res.json({ success: true, data: items, message: 'Accounts fetched' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to fetch accounts' })
  }
}

const createAccount = async (req, res) => {
  try {
    const account = await Account.create({ ...req.body, createdBy: req.admin.id })
    res.status(201).json({ success: true, data: account, message: 'Account created' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to create account' })
  }
}

const updateAccount = async (req, res) => {
  try {
    const account = await Account.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' })
    res.json({ success: true, data: account, message: 'Account updated' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to update account' })
  }
}

const toggleAccount = async (req, res) => {
  try {
    const account = await Account.findById(req.params.id)
    if (!account) return res.status(404).json({ success: false, message: 'Account not found' })
    account.isActive = !account.isActive
    await account.save()
    res.json({ success: true, data: account, message: 'Account toggled' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to toggle account' })
  }
}

// Verify payment receipt
const verifyReceipt = async (req, res) => {
  try {
    const { status } = req.body // 'approved' | 'rejected'
    if (!['approved','rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }
    const receipt = await PaymentReceipt.findById(req.params.id)
    if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' })
    if (receipt.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Receipt already verified' })
    }

    receipt.status = status
    receipt.verifiedBy = req.admin.id
    receipt.verifiedAt = new Date()
    await receipt.save()

    if (status === 'approved') {
      const project = await Project.findById(receipt.project)
      if (project) {
        const fd = project.financialDetails || {}
        const newRemaining = Math.max(0, (fd.remainingAmount || 0) - receipt.amount)
        project.financialDetails = {
          totalCost: fd.totalCost || 0,
          advanceReceived: (fd.advanceReceived || 0) + receipt.amount,
          includeGST: !!fd.includeGST,
          remainingAmount: newRemaining
        }
        await project.save()
      }
    }

    res.json({ success: true, data: receipt, message: 'Receipt verified' })
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to verify receipt' })
  }
}

module.exports = {
  listAccounts,
  createAccount,
  updateAccount,
  toggleAccount,
  verifyReceipt
}


