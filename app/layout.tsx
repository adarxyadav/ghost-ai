import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  SIGN_IN_FALLBACK_REDIRECT_PATH,
  SIGN_IN_FORCE_REDIRECT_PATH,
  SIGN_IN_PATH,
  SIGN_UP_FALLBACK_REDIRECT_PATH,
  SIGN_UP_FORCE_REDIRECT_PATH,
  SIGN_UP_PATH,
} from "@/lib/auth-routes";
import { clerkAppearance } from "@/lib/clerk-appearance";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Ghost AI application workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignOutUrl={SIGN_IN_PATH}
      appearance={clerkAppearance}
      signInFallbackRedirectUrl={SIGN_IN_FALLBACK_REDIRECT_PATH}
      signInForceRedirectUrl={SIGN_IN_FORCE_REDIRECT_PATH}
      signInUrl={SIGN_IN_PATH}
      signUpFallbackRedirectUrl={SIGN_UP_FALLBACK_REDIRECT_PATH}
      signUpForceRedirectUrl={SIGN_UP_FORCE_REDIRECT_PATH}
      signUpUrl={SIGN_UP_PATH}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      >
        <body className="min-h-full flex flex-col" suppressHydrationWarning>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
