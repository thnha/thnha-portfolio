"use client";

import { useEffect, useState } from "react";

const RESET_MS = 1800;

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), RESET_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <>
      <button className="btn btn-ghost" type="button" onClick={copy}>
        {copied ? "Copied ✓" : "Copy email"}
      </button>
      <span className="sr-only" role="status">
        {copied ? "Email copied" : ""}
      </span>
    </>
  );
}
