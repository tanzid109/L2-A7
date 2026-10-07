"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          padding: "2rem",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          color: "#211d2e",
          backgroundColor: "#f6f4fc",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: 700,
            fontSize: "1.25rem",
            letterSpacing: "-0.01em",
            marginBottom: "0.75rem",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              width: "2rem",
              height: "2rem",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "0.5rem",
              background: "oklch(0.44 0.18 270)",
              color: "#fff",
              fontSize: "0.9rem",
            }}
          >
            ⚙
          </span>
          FieldOps
        </div>

        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: 0,
          }}
        >
          Something went wrong
        </p>
        <p
          style={{
            fontSize: "0.9rem",
            color: "#6b6577",
            margin: 0,
            maxWidth: "28rem",
            lineHeight: 1.5,
          }}
        >
          We hit an unexpected issue while loading this page. Please try again
          or head back home.
        </p>

        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
          <button
            type="button"
            onClick={() => retry()}
            style={buttonStyle("oklch(0.44 0.18 270)", "#fff")}
          >
            Try again
          </button>
          <a href="/" style={buttonStyle("#fff", "#211d2e")}>
            Back to home
          </a>
        </div>

        {error.digest ? (
          <p
            style={{ fontSize: "0.7rem", color: "#6b6577", margin: "1rem 0 0" }}
          >
            Error ID:&nbsp;
            <code style={{ fontFamily: "ui-monospace, monospace" }}>
              {error.digest}
            </code>
          </p>
        ) : null}
      </body>
    </html>
  );
}

function buttonStyle(background: string, color: string) {
  return {
    padding: "0.5rem 1rem",
    fontSize: "0.9rem",
    fontWeight: 500,
    borderRadius: "0.5rem",
    border: background === "#fff" ? "1px solid #dcd6ea" : "none",
    background,
    color,
    cursor: "pointer",
    textDecoration: "none",
  } as const;
}
