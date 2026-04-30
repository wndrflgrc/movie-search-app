// Hardcoded credentials for authentication
export const CREDENTIALS = {
  username: 'user001',
  password: 'DWpass123456',
} as const;

export function validateCredentials(
  username: string,
  password: string,
): boolean {
  return username === CREDENTIALS.username && password === CREDENTIALS.password;
}
