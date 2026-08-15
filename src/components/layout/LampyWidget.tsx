"use client";

import { useState } from "react";
import { LampyButton } from "@/components/layout/LampyButton";
import { LampyChat } from "@/components/chat/LampyChat";

export function LampyWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <LampyButton onClick={() => setOpen((o) => !o)} />
      <LampyChat open={open} onClose={() => setOpen(false)} />
    </>
  );
}
