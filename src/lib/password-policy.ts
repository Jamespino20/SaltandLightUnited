interface PasswordPolicyResult {
  valid: boolean;
  errors: string[];
}

const MIN_LENGTH = 8;

export function validatePassword(password: string): PasswordPolicyResult {
  const errors: string[] = [];

  if (password.length < MIN_LENGTH) {
    errors.push(`Password must be at least ${MIN_LENGTH} characters long`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one symbol");
  }

  const lower = password.toLowerCase();
  const commonPasswords = [
    "password", "password1", "password123", "12345678",
    "qwerty123", "abc12345", "letmein1", "admin123",
    "welcome1", "changeme1", "iloveyou1", "monkey123",
  ];
  if (commonPasswords.includes(lower)) {
    errors.push("Password is too common. Please choose a stronger password.");
  }

  return { valid: errors.length === 0, errors };
}

export function validatePasswordStrength(password: string): 0 | 1 | 2 | 3 {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNum = /[0-9]/.test(password);
  const hasSym = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return [hasLower, hasUpper, hasNum, hasSym].filter(Boolean).length as 0 | 1 | 2 | 3;
}
