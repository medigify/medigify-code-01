export const USERNAME_PATTERN = /^[a-z0-9._]{3,24}$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function normalizeText(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

export function normalizeUsername(value: string): string {
  return value.trim().toLowerCase();
}

export function validateUsername(value: string): string | null {
  if (!value) {
    return 'Username is required.';
  }

  if (!USERNAME_PATTERN.test(value)) {
    return 'Use 3-24 lowercase letters, numbers, periods, or underscores.';
  }

  return null;
}

export function mapAuthErrorMessage(message: string): string {
  const normalized = message.trim();
  const lower = normalized.toLowerCase();

  if (lower.includes('user already registered')) {
    return 'An account with this email already exists. Log in instead.';
  }

  if (
    lower.includes('duplicate key value') ||
    (lower.includes('username') && lower.includes('already')) ||
    lower.includes('profiles_username_lower_unique')
  ) {
    return 'That username is already taken. Choose another one.';
  }

  if (lower.includes('invalid login credentials')) {
    return 'Invalid email or password.';
  }

  if (lower.includes('password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }

  if (lower.includes('rate limit')) {
    return 'Too many attempts. Please wait a moment and try again.';
  }

  if (lower.includes('database error')) {
    return 'We could not save your account right now. Please try again.';
  }

  return normalized || 'Something went wrong. Please try again.';
}
