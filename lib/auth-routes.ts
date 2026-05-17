export const EDITOR_PATH = "/editor";
export const HOME_PATH = "/";

const DEFAULT_SIGN_IN_PATH = "/sign-in";
const DEFAULT_SIGN_UP_PATH = "/sign-up";

function normalizePathFromEnv(value: string | undefined, fallback: string): string {
  if (!value) {
    return fallback;
  }

  let pathname = value;

  try {
    pathname = new URL(value).pathname;
  } catch {
    pathname = value;
  }

  if (!pathname.startsWith("/")) {
    return fallback;
  }

  const normalizedPathname = pathname.replace(/\/+$/, "");

  return normalizedPathname || "/";
}

export const SIGN_IN_PATH = normalizePathFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
  DEFAULT_SIGN_IN_PATH,
);

export const SIGN_UP_PATH = normalizePathFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
  DEFAULT_SIGN_UP_PATH,
);

export const SIGN_IN_FALLBACK_REDIRECT_PATH = normalizePathFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
  EDITOR_PATH,
);

export const SIGN_UP_FALLBACK_REDIRECT_PATH = normalizePathFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
  EDITOR_PATH,
);

export const SIGN_IN_FORCE_REDIRECT_PATH = normalizePathFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL,
  EDITOR_PATH,
);

export const SIGN_UP_FORCE_REDIRECT_PATH = normalizePathFromEnv(
  process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL,
  EDITOR_PATH,
);

export const PUBLIC_ROUTE_PATTERNS: string[] = [
  HOME_PATH,
  SIGN_IN_PATH,
  `${SIGN_IN_PATH}(.*)`,
  SIGN_UP_PATH,
  `${SIGN_UP_PATH}(.*)`,
];
