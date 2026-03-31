/**
 * @file app/api/auth/[...nextauth]/route.ts
 * @description Auth.js v5 catch-all handler.
 */

import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
