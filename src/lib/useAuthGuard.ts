"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      const callbackUrl = window.location.pathname;
      signIn("credentials", { callbackUrl, redirect: false }).then((result) => {
        if (result?.error) {
          router.push("/login?error=invalid");
        }
      });
    }
  }, [status, router]);

  return { session, status };
}
