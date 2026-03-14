import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: 'Guest' | 'Admin' | 'SuperAdmin' | 'ResortOwner' | string;
    } & DefaultSession['user'];
  }

  interface JWT {
    accessToken?: string;
    role?: 'Guest' | 'Admin' | 'SuperAdmin' | 'ResortOwner' | string;
    id?: string;
    name?: string;
    email?: string;
  }
}