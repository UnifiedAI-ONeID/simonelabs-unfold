
// CSRF Protection utilities
export class CSRFProtection {
  private static token: string | null = null;
  private static readonly TOKEN_HEADER = 'X-CSRF-Token';
  private static readonly TOKEN_STORAGE_KEY = 'csrf_token';

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    this.token = token;
    sessionStorage.setItem(this.TOKEN_STORAGE_KEY, token);
    return token;
  }

  static getToken(): string | null {
    if (!this.token) {
      this.token = sessionStorage.getItem(this.TOKEN_STORAGE_KEY);
    }
    return this.token;
  }

  static getHeaders(): Record<string, string> {
    const token = this.getToken() || this.generateToken();
    return {
      [this.TOKEN_HEADER]: token
    };
  }

  static validateToken(receivedToken: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === receivedToken;
  }

  static clearToken(): void {
    this.token = null;
    sessionStorage.removeItem(this.TOKEN_STORAGE_KEY);
  }
}

// Enhanced request wrapper with CSRF protection
export const secureRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    ...CSRFProtection.getHeaders(),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};
