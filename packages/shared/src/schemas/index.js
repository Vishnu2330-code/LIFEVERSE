/**
 * Request validation schemas and rules
 */

export const ValidationRules = {
  username: {
    min: 3,
    max: 30,
    pattern: /^[a-zA-Z0-9_-]+$/,
    message: 'Username must be between 3 and 30 alphanumeric characters.',
  },
  password: {
    min: 8,
    max: 100,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message: 'Password must be at least 8 characters with at least one uppercase, one lowercase and one number.',
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Valid email address is required.',
  },
};

export function validateRegister(body) {
  const errors = [];
  if (!body.email || !ValidationRules.email.pattern.test(body.email)) {
    errors.push({ field: 'email', message: ValidationRules.email.message });
  }
  if (!body.username || body.username.length < 3 || body.username.length > 30) {
    errors.push({ field: 'username', message: ValidationRules.username.message });
  }
  if (!body.password || body.password.length < 8) {
    errors.push({ field: 'password', message: ValidationRules.password.message });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateLogin(body) {
  const errors = [];
  if (!body.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  }
  if (!body.password) {
    errors.push({ field: 'password', message: 'Password is required' });
  }
  return {
    isValid: errors.length === 0,
    errors,
  };
}
