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
  const raw = phone.trim();
  let cleanDigits = raw;
  if (cleanDigits.startsWith('+91')) {
    cleanDigits = cleanDigits.slice(3);
  } else if (cleanDigits.startsWith('91') && cleanDigits.length === 12) {
    cleanDigits = cleanDigits.slice(2);
  } else if (cleanDigits.startsWith('+')) {
    cleanDigits = cleanDigits.slice(1);
  }
  
  cleanDigits = cleanDigits.replace(/[\s-]/g, '');

  if (!/^\d+$/.test(cleanDigits)) {
    return { isValid: false, error: 'Mobile number must contain only numbers (no letters or symbols)' };
  }
  if (cleanDigits.length !== 10) {
    return { isValid: false, error: `Mobile number must be exactly 10 digits (currently ${cleanDigits.length} digits)` };
  }
  return { 
    isValid: true, 
    formatted: `+91 ${cleanDigits.slice(0, 5)} ${cleanDigits.slice(5)}`,
    digits: cleanDigits 
  };
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
