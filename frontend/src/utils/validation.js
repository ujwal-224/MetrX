// MetrX Form & Field Validation Utilities

/**
 * Validates a person's name (letters and spaces only, min 2 chars, max 50 chars).
 * @param {string} name 
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateName = (name) => {
  if (!name || !name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  const clean = name.trim();
  if (clean.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  if (clean.length > 50) {
    return { isValid: false, error: 'Name cannot exceed 50 characters' };
  }
  // Allow letters and spaces only
  const nameRegex = /^[A-Za-z\s]+$/;
  if (!nameRegex.test(clean)) {
    return { isValid: false, error: 'Name must contain only letters and spaces (no numbers or special characters)' };
  }
  return { isValid: true };
};

/**
 * Validates a mobile number: accepts exactly 10 numeric digits (or +91 followed by 10 digits).
 * Ensures only digits are allowed and exactly 10 numbers.
 * @param {string} phone 
 * @returns {{ isValid: boolean, error?: string, formatted?: string }}
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Mobile number is required' };
  }
  const raw = phone.trim();
  
  // Extract pure digits and remove leading +91 or +
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

/**
 * Validates password: min 8 and max 32 characters.
 * @param {string} password 
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validatePassword = (password) => {
  if (!password) {
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

/**
 * Validates email format.
 * @param {string} email 
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email address is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@example.com)' };
  }
  return { isValid: true };
};
