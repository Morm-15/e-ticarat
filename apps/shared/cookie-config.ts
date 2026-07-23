export interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax' | 'strict' | 'none';
  maxAge: number;
  domain?: string;
}

export interface CookieConfig {
  name: string;
  options: CookieOptions;
}

const isProduction = process.env.NODE_ENV === 'production';

export const cookieConfig: Record<string, CookieConfig> = {
  access: {
    name: 'access_token',
    options: {
      httpOnly: true,
      secure: isProduction,
      // In production with different domains (Render + Vercel), use 'none'
      // In development with same origin, use 'lax'
      sameSite: isProduction ? 'none' as const : 'lax' as const,
      maxAge: 10 * 60 * 1000, // 10 minutes
    },
  },
  refresh: {
    name: 'refresh_token',
    options: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  },
} as const;
