import { SignUp } from "@clerk/nextjs";

import { AuthPageShell } from "@/components/auth/auth-page-shell";
import {
  SIGN_IN_PATH,
  SIGN_UP_FALLBACK_REDIRECT_PATH,
  SIGN_UP_FORCE_REDIRECT_PATH,
  SIGN_UP_PATH,
} from "@/lib/auth-routes";
import { clerkAppearance } from "@/lib/clerk-appearance";

export default function SignUpPage() {
  return (
    <AuthPageShell>
      <SignUp
        appearance={clerkAppearance}
        fallbackRedirectUrl={SIGN_UP_FALLBACK_REDIRECT_PATH}
        forceRedirectUrl={SIGN_UP_FORCE_REDIRECT_PATH}
        path={SIGN_UP_PATH}
        routing="path"
        signInUrl={SIGN_IN_PATH}
      />
    </AuthPageShell>
  );
}
