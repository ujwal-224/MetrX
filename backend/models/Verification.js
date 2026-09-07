import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true
    },
    shopId: {
      type: String,
      required: true
    },
    shopName: {
      type: String,
      required: true
    },
    ownerName: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    instrumentId: {
      type: String,
      required: true
    },
    instrumentName: {
      type: String,
      required: true
    },
    serialNumber: {
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
    step: {
      type: Number,
      default: 1 // 1: Submitted, 2: Slot Confirmed, 3: Inspector En-Route, 4: Calibration Complete, 5: Certified
    },
    status: {
      type: String,
      default: 'Verification Scheduled'
    },
    requestedSlot: {
      date: { type: String, default: '' },
      time: { type: String, default: 'Morning (09:30 - 12:30)' },
      bookingRef: { type: String, default: '' }
    },
    payment: {
      isPaid: { type: Boolean, default: true },
      amount: { type: Number, default: 850 },
      method: { type: String, default: 'UPI' },
      reference: { type: String, default: '' }
    }
  },
  {
    timestamps: true
  }
);

export const Verification = mongoose.model('Verification', verificationSchema);
