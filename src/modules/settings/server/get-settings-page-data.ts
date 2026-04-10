/**
 * @file src/modules/settings/server/get-settings-page-data.ts
 * @description Server data loader for settings page.
 */

import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type SettingsPageData = {
  name: string;
  email: string;
  bio: string;
};

export async function getSettingsPageData(): Promise<SettingsPageData> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      name: "",
      email: "",
      bio: "",
    };
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: {
      name: true,
      email: true,
      bio: true,
    },
  });

  return {
    name: user?.name ?? "",
    email: user?.email ?? "",
    bio: user?.bio ?? "",
  };
}
