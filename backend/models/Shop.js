import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    id: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    ownerName: {
      type: String,
      required: true
    },
    branchType: {
      type: String,
      default: 'Main Commercial Branch'
    },
    merchantUid: {
      type: String,
      required: true
    },
    tradeLicense: {
      type: String,
      default: () => `BBMP/TL/2025/${Math.floor(1000 + Math.random() * 9000)}`
    },
    gstin: {
      type: String,
      default: ''
    },
    shopActReg: {
      type: String,
      default: ''
    },
    zone: {
      type: String,
      default: 'Ward 4 (Commercial Circle)'
    },
    address: {
      type: String,
      default: 'Market Road, Commercial Circle, Bengaluru - 560001'
    },
    phone: {
      type: String,
      default: '+91 98000 00000'
    },
    email: {
      type: String,
      default: ''
    },
    assignedInspector: {
      type: String,
      default: 'Pending Admin Allocation'
    },
    inspectorBadge: {
      type: String,
      default: 'LM-PENDING'
    },
    status: {
      type: String,
      default: 'Active Commercial Establishment'
    },
    complianceStatus: {
      type: String,
      default: 'Pending Inspector Assignment'
    },
    documentStatus: {
      type: String,
      enum: ['verified', 'pending', 'pending_review', 'not_uploaded', 'rejected', 'fraud', 'unverified'],
      default: 'not_uploaded'
    },
    registeredScalesCount: {
      type: Number,
      default: 1
    },
    documentsRemarks: {
      type: String,
      default: ''
    },
    reviewedBy: {
      type: String,
      default: ''
    },
    documentSubmissionData: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    },
    documents: [
      {
        docType: String,
        fileName: String,
        fileUrl: String,
        status: { type: String, default: 'Pending Verification' },
        uploadedAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Shop = mongoose.model('Shop', shopSchema);
