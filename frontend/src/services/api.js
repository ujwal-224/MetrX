const API_BASE_URL = 'http://127.0.0.1:5000/api';

/**
 * Universal fetch wrapper for MetrX backend API
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('metrx_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `HTTP Error ${response.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`[API Request Failed: ${endpoint}]`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  getInspectors: () => request('/auth/inspectors'),
  createInspector: (inspectorData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...inspectorData,
        role: 'inspector'
      })
    }),
  deleteUser: (id) =>
    request(`/auth/users/${id}`, {
      method: 'DELETE'
    }),
  getMe: () => request('/auth/me'),

  // Shops
  getShops: () => request('/shops'),
  getShopById: (id) => request(`/shops/${id}`),
  createShop: (shopData) =>
    request('/shops', {
      method: 'POST',
      body: JSON.stringify(shopData)
    }),
  assignInspector: (shopId, inspectorData) =>
    request(`/shops/${shopId}/assign-inspector`, {
      method: 'PATCH',
      body: JSON.stringify(inspectorData)
    }),
  uploadShopDocuments: (shopId, docsData) =>
    request(`/shops/${shopId}/documents`, {
      method: 'POST',
      body: JSON.stringify(docsData)
    }),
  updateDocumentStatus: (shopId, statusData) =>
    request(`/shops/${shopId}/document-status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData)
    }),

  // Instruments
  getInstruments: (shopId) =>
    request(`/instruments${shopId ? `?shopId=${encodeURIComponent(shopId)}` : ''}`),
  registerInstrument: (instrumentData) =>
    request('/instruments', {
      method: 'POST',
      body: JSON.stringify(instrumentData)
    }),

  // Verifications
  getVerifications: (shopId) =>
    request(`/verifications${shopId ? `?shopId=${encodeURIComponent(shopId)}` : ''}`),
  createVerification: (verificationData) =>
    request('/verifications', {
      method: 'POST',
      body: JSON.stringify(verificationData)
    }),
  updateVerificationStep: (id, step, status) =>
    request(`/verifications/${id}/step`, {
      method: 'PATCH',
      body: JSON.stringify({ step, status })
    }),

  // Certificates
  getCertificates: (shopId) =>
    request(`/certificates${shopId ? `?shopId=${encodeURIComponent(shopId)}` : ''}`),
  lookupCertificate: (certId) =>
    request(`/certificates/lookup/${encodeURIComponent(certId)}`),
  verifyCertificate: (certId) =>
    request(`/certificates/verify/${encodeURIComponent(certId)}`),
  issueCertificate: (certData) =>
    request('/certificates/issue', {
      method: 'POST',
      body: JSON.stringify(certData)
    }),

  // Verification Rules & Standards Engine
  getVerificationRules: (activeOnly) =>
    request(`/verification-rules${activeOnly ? '?activeOnly=true' : ''}`),
  getVerificationRuleById: (id) =>
    request(`/verification-rules/${id}`),
  createVerificationRule: (ruleData) =>
    request('/verification-rules', {
      method: 'POST',
      body: JSON.stringify(ruleData)
    }),
  updateVerificationRule: (id, ruleData) =>
    request(`/verification-rules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ruleData)
    }),
  toggleVerificationRuleStatus: (id) =>
    request(`/verification-rules/${id}/status`, {
      method: 'PATCH'
    }),
  deleteVerificationRule: (id) =>
    request(`/verification-rules/${id}`, {
      method: 'DELETE'
    }),
  matchVerificationRule: (params = {}) =>
    request(
      `/verification-rules/match?type=${encodeURIComponent(params.type || '')}&capacity=${encodeURIComponent(params.capacity || '')}&instrumentClass=${encodeURIComponent(params.class || '')}`
    ),
  evaluateInspection: (ruleId, inspectionInput) =>
    request('/verification-rules/evaluate', {
      method: 'POST',
      body: JSON.stringify({ ruleId, inspectionInput })
    }),
  submitInspection: (inspectionPayload) =>
    request('/verification-rules/submit-inspection', {
      method: 'POST',
      body: JSON.stringify(inspectionPayload)
    }),

  // Database Seeding
  seedDemoDatabase: () =>
    request('/seed', {
      method: 'POST'
    })
};
