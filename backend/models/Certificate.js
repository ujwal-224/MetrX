import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certId: {
      type: String,
      unique: true,
      required: true,
      index: true
    },
    ruleForm: {
      type: String,
      default: 'Form XVII (Rule 14)'
    },
    actYear: {
      type: String,
      default: 'Legal Metrology Act, 2009'
    },
    shopId: {
      type: String,
      required: true
    },
    shopName: {
      type: String,
      required: true
    },
    instrumentModel: {
      type: String,
      required: true
    },
    serialNumber: {
      type: String,
      required: true
    },
    verifiedDate: {
      type: String,
      required: true
    },
    validUntil: {
      type: String,
      required: true
    },
    inspectorSeal: {
      type: String,
      required: true
    },
    inspectorName: {
      type: String,
      default: 'Insp. R. Deshmukh'
    },
    inspectorBadge: {
      type: String,
      default: 'LM-BLR-402'
    },
    statusBadge: {
      type: String,
      default: 'CERTIFIED & COMPLIANT'
    },
    workingStandardRef: {
      type: String,
      default: 'STD/KA/2024/0081 (Calibrated at NPL)'
    },
    remarks: {
      type: String,
      default: '4-Point MPE tested with Class M1 reference weights. Holographic wire seal applied.'
    },
    testObservations: [
      {
        load: String,
        indication: String,
        error: String,
        mpe: String,
        pass: Boolean
      }
    ]
  },
  {
    timestamps: true
  }
);

export const Certificate = mongoose.model('Certificate', certificateSchema);
