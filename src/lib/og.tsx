import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

export function ogImage(title: string, subtitle?: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          backgroundColor: "#0a0a0a",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 20,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#888888",
            marginBottom: 24,
          }}
        >
          Timothy Ali
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 400,
            color: "#ededed",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "#888888",
              marginTop: 20,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    ),
    ogSize,
  );
}
