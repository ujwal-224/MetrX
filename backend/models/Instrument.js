import mongoose from 'mongoose';

const instrumentSchema = new mongoose.Schema(
  {
    shopId: {
      type: String,
      required: true,
      index: true
    },
    id: {
      type: String,
      unique: true,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    capacity: {
      type: String,
      required: true
    },
    serialNumber: {
      type: String,
      required: true,
      index: true
    },
    counter: {
      type: String,
      default: 'Billing Counter 1'
    },
    status: {
      type: String,
      default: 'Stamping Active'
    },
    verificationStatusText: {
      type: String,
      default: 'Holo Seal Valid'
    },
    daysRemaining: {
      type: Number,
      default: 365
    },
    totalDaysCycle: {
      type: Number,
      default: 365
    },
    expiresOn: {
      type: String,
      required: true
    },
    sealNumber: {
      type: String,
      default: ''
    },
    complianceRate: {
      type: String,
      default: '100%'
    },
    type: {
      type: String,
      default: 'counter_scale'
    },
    class: {
      type: String,
      default: 'Class III Commercial'
    },
    photoUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

export const Instrument = mongoose.model('Instrument', instrumentSchema);
