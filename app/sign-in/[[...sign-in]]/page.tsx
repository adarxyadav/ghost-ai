import { SignIn } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import {
  SIGN_IN_FALLBACK_REDIRECT_PATH,
  SIGN_IN_FORCE_REDIRECT_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from "@/lib/auth-routes";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <AuthPageShell>
      <SignIn
        appearance={clerkAppearance}
        fallbackRedirectUrl={SIGN_IN_FALLBACK_REDIRECT_PATH}
        forceRedirectUrl={SIGN_IN_FORCE_REDIRECT_PATH}
        path={SIGN_IN_PATH}
        routing="path"
        signUpUrl={SIGN_UP_PATH}
      />
    </AuthPageShell>
  );
}
