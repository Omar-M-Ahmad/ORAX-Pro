/**
 * Extend built-in NextAuth types to include custom fields.
 * This file is automatically picked up by TypeScript because of the
 * "include" patterns in tsconfig.json.
 */

import "next-auth/jwt";

// Extend the User interface
declare module "next-auth" {
  interface User {
    /** Optional biography stored in the users table */
    bio?: string | null;
  }

  interface Session {
    /** Extend session.user with our custom fields */
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      bio?: string | null;
    };
  }
}

// Extend the JWT interface
declare module "next-auth/jwt" {
  interface JWT {
    /** Persist user biography in the JWT */
    bio?: string | null;
  }
}
