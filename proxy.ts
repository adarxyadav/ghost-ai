import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import {
  PUBLIC_ROUTE_PATTERNS,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from "@/lib/auth-routes";

const isPublicRoute = createRouteMatcher(PUBLIC_ROUTE_PATTERNS);

export default clerkMiddleware(
  async (auth, request) => {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  },
  {
    signInUrl: SIGN_IN_PATH,
    signUpUrl: SIGN_UP_PATH,
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
