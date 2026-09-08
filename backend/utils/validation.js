// Backend Validation Utility for MetrX

export const validateName = (name) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  const clean = name.trim();
  if (clean.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  if (clean.length > 50) {
    return { isValid: false, error: 'Name cannot exceed 50 characters' };
  }
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(clean)) {
    return { isValid: false, error: 'Name must contain only letters and spaces' };
  }
  return { isValid: true };
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return { isValid: true }; // optional on some models if not provided
  }
  const clean = phone.trim();
  if (!clean.startsWith('+91')) {
    return { isValid: false, error: 'Mobile number must start with country code +91 (e.g. +91 9876543210)' };
  }
  const afterPrefix = clean.slice(3).replace(/[\s-]/g, '');
  if (!/^\d+$/.test(afterPrefix)) {
    return { isValid: false, error: 'Mobile number must contain only digits after +91' };
  }
  if (afterPrefix.length !== 10) {
    return { isValid: false, error: `Mobile number must have exactly 10 digits after +91 (got ${afterPrefix.length})` };
  }
  return { isValid: true, formatted: `+91 ${afterPrefix.slice(0, 5)} ${afterPrefix.slice(5)}` };
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  if (password.length > 32) {
    return { isValid: false, error: 'Password cannot exceed 32 characters' };
  }
  return { isValid: true };
};

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string' || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please provide a valid email address' };
  }
  return { isValid: true };
};
