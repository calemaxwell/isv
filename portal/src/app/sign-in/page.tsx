"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Artwork } from "@/components/patterns";
import { Logo } from "@/components/features/app-shell";
import { Button, Text } from "@/components/primitives";

/**
 * Sign-in.
 *
 * Moved off the root once the public site took it. A member arriving at
 * is.vic.edu.au now passes through the public homepage, which is what
 * actually happens.
 *
 * Visual only. There is no authentication. Signing in always lands on the
 * Principal view, because Act 1 depends on that starting point.
 *
 * This is one of the four surfaces where imagery earns its place: nobody is
 * working yet, so atmosphere is the job.
 */
export default function SignInPage() {
  const router = useRouter();
  const [signingIn, setSigningIn] = useState(false);

  function signIn() {
    setSigningIn(true);
    setTimeout(() => router.push("/portal"), 620);
  }

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="flex flex-col justify-center px-gutter py-field">
        <div className="mx-auto w-full max-w-md">
          <a href="/" className="no-underline">
            <Logo />
          </a>

          <Text as="h1" size="mega" className="mt-14">
            Your ISV,
            <br />
            in one place
          </Text>

          <Text size="lede" tone="secondary" measure="narrow" className="mt-5">
            Resources, services, learning and advice, brought together for your
            school.
          </Text>

          <div className="mt-9">
            <Button onClick={signIn} disabled={signingIn}>
              {signingIn ? "Signing you in…" : "Sign in with your school account"}
            </Button>
          </div>

          <Text size="micro" tone="tertiary" className="mt-7">
            Trouble signing in? Contact ISV on 03 9825 7200
          </Text>

          <Text size="micro" tone="tertiary" className="mt-10">
            Prototype. No ISV system is connected and all data is illustrative.
          </Text>
        </div>
      </div>

      <Artwork
        variant="b"
        caption="Student artwork · isArtworks collection"
        className="hidden md:block"
      />
    </main>
  );
}
