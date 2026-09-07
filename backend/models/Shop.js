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
      required: true
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
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    assignedInspector: {
      type: String,
      default: 'Insp. R. Deshmukh'
    },
    inspectorBadge: {
      type: String,
      default: 'LM-BLR-402'
    },
    status: {
      type: String,
      default: 'Active Commercial Establishment'
    },
    complianceStatus: {
      type: String,
      default: 'Documents Verified'
    },
    documentStatus: {
      type: String,
      enum: ['verified', 'pending', 'rejected', 'unverified'],
      default: 'verified'
    },
    registeredScalesCount: {
      type: Number,
      default: 0
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
