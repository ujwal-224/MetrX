export const initialStoreInfo = {
  name: "",
  regNumber: "",
  merchantUid: "",
  location: "",
  division: "Karnataka Legal Metrology Division",
  contactPerson: "",
  phone: "",
  zone: "Ward 4 (Commercial Circle)",
  certificateId: ""
};

export const initialInstruments = [];

export const inspectorVisits = [];

export const defaultInspectionChecklist = [
  {
    id: "chk-1",
    title: "Physical Maker's Plate & Embossed Lead Wire Seal intact",
    desc: "Verified model approval markings, serial plate rivets, and unbroken municipal wire seal intact from previous audit.",
    checked: true
  },
  {
    id: "chk-2",
    title: "Standard Reference Weights Test passed (Zero error at 5kg, 10kg, 20kg calibration tests)",
    desc: "Executed corner eccentricity and linearity assessments using Class M1 calibrated reference working standards.",
    checked: true
  },
  {
    id: "chk-3",
    title: "Digital Display and Dual-Customer View operating clearly without flicker",
    desc: "Consumer-facing bright segment display is unobstructed, tare indicator triggers accurately, zero lock functions properly.",
    checked: true
  },
  {
    id: "chk-4",
    title: "Security Stamping Applied: 2025 State Metrology Holographic Stamp affixed to chassis",
    desc: "Affix tamper-evident tamper-proof iridescent foil stamp onto the joint of scale casing.",
    checked: false
  }
];

export const testCalibrationData = [
  { load: "5.000 kg", observed: "5.000 kg", mpe: "± 1.0 g", status: "Passed" },
  { load: "15.000 kg", observed: "15.001 kg", mpe: "± 1.5 g", status: "Passed" },
  { load: "30.000 kg (Full)", observed: "30.000 kg", mpe: "± 2.0 g", status: "Passed" }
];

export const stateComplianceRegistry = [];
