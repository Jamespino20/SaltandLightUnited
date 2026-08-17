"use client";

import { NextIntlClientProvider } from "next-intl";
import { useState, useCallback } from "react";
import { getLocale, getMessages } from "next-intl/server";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextIntlClientProvider>
      {children}
    </NextIntlClientProvider>
  );
}
