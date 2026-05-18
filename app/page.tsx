import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { EDITOR_PATH, SIGN_IN_PATH } from "@/lib/auth-routes";

export default async function Home() {
  const { isAuthenticated } = await auth();

  redirect(isAuthenticated ? EDITOR_PATH : SIGN_IN_PATH);
}
