import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(plain, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

export async function verifyPassword(
  plain: string,
  stored: string,
): Promise<boolean> {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const keyBuf = Buffer.from(key, "hex");
  const buf = (await scryptAsync(plain, salt, 64)) as Buffer;
  return timingSafeEqual(keyBuf, buf);
}

export interface PasswordValidation {
  valid: boolean;
  errors: string[];
}

interface PasswordContext {
  name?: string;
  email?: string;
}

export function validatePasswordStrength(
  password: string,
  ctx?: PasswordContext,
): PasswordValidation {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (password.length > 128) {
    errors.push("Password must be no more than 128 characters long");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  const lower = password.toLowerCase();

  // Common passwords
  const commonPasswords = [
    "password", "password1", "password123",
    "123456", "12345678", "123456789", "1234567890",
    "qwerty", "qwerty123", "qwertyuiop",
    "abc123", "abcd1234",
    "letmein", "admin", "admin123", "administrator",
    "welcome", "welcome123", "login", "user", "guest",
    "root", "changeme", "default", "secret",
    "pass", "pass123", "iloveyou",
    "monkey", "dragon", "football", "baseball",
    "master", "sunshine", "princess", "superman",
    "michael", "ashley", "jessica", "charlie",
    "shadow", "hello", "trustno1", "batman",
  ];
  for (const pattern of commonPasswords) {
    if (lower === pattern || lower.startsWith(pattern)) {
      errors.push("Password is too common");
      break;
    }
  }

  // Repeated characters: 3+ of the same char in a row
  if (/(.)\1{2,}/.test(password)) {
    errors.push("Password contains repeated characters (e.g. aaa, 111)");
  }

  // Sequential digits: 3+ ascending or descending
  if (/(?:012|123|234|345|456|567|678|789|890|901)/.test(lower)) {
    errors.push("Password contains sequential digits (e.g. 123, 456)");
  }
  if (/(?:987|876|765|654|543|432|321|210|109|098)/.test(lower)) {
    errors.push("Password contains sequential digits (e.g. 321, 654)");
  }

  // Keyboard row sequences (3+ adjacent keys on QWERTY)
  const keyboardRows = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
    "1234567890",
  ];
  for (const row of keyboardRows) {
    for (let i = 0; i <= row.length - 3; i++) {
      const seq = row.slice(i, i + 3);
      const rev = seq.split("").reverse().join("");
      if (lower.includes(seq) || lower.includes(rev)) {
        errors.push("Password contains a keyboard sequence (e.g. asd, qwe)");
        break;
      }
    }
    if (errors.some((e) => e.includes("keyboard sequence"))) break;
  }

  // Name / email check
  if (ctx?.name) {
    const nameParts = ctx.name.toLowerCase().split(/\s+/).filter(Boolean);
    for (const part of nameParts) {
      if (part.length >= 3 && lower.includes(part)) {
        errors.push("Password should not contain your name");
        break;
      }
    }
  }
  if (ctx?.email) {
    const emailUser = ctx.email.split("@")[0]?.toLowerCase() ?? "";
    if (emailUser.length >= 3 && lower.includes(emailUser)) {
      errors.push("Password should not contain your email username");
    }
  }

  return { valid: errors.length === 0, errors };
}
