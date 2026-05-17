import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { isAuthenticated } = await auth();

  if (isAuthenticated) {
    // TODO: Redirect to your authenticated page, e.g., redirect("/dashboard");
    return (
      <div>
        <h1>Welcome!</h1>
        <p>You are signed in</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Please sign in to continue</p>
    </div>
  );
}
