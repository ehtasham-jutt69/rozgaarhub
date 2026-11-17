import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { site } from "@/site.config";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card generator: /og?title=...
 * Kept deliberately typographic — no stock photography, no gradients.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("title") ?? site.tagline;
  const title = raw.length > 110 ? `${raw.slice(0, 107)}…` : raw;
  const kicker = searchParams.get("kicker") ?? site.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f7f2",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        {/* Top rule */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 10,
            background: "#43a724",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 320,
            height: 10,
            background: "#43a724",
            display: "flex",
          }}
        />

        {/* Kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#43a724",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: 3,
              padding: 9,
            }}
          >
            <div
              style={{ width: 7, height: 10, background: "#b9ddae", display: "flex" }}
            />
            <div
              style={{ width: 7, height: 17, background: "#dcefd5", display: "flex" }}
            />
            <div
              style={{ width: 7, height: 25, background: "#fcfcf9", display: "flex" }}
            />
          </div>
          <div
            style={{
              fontSize: 27,
              fontWeight: 600,
              color: "#151a12",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            {kicker}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 70 ? 56 : title.length > 42 ? 66 : 78,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            fontWeight: 700,
            color: "#151a12",
            display: "flex",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #dfe3d5",
            paddingTop: 28,
          }}
        >
          <div
            style={{
              fontSize: 24,
              color: "#5e6651",
              display: "flex",
              letterSpacing: "-0.01em",
            }}
          >
            Internships &amp; graduate jobs · US · UK · Canada
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#7c856d",
              display: "flex",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {site.domain.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      // Rendering a card costs real CPU. Crawlers and social unfurlers hit
      // this repeatedly for the same title, so let the CDN keep it.
      headers: {
        "Cache-Control":
          "public, immutable, no-transform, max-age=31536000, s-maxage=31536000",
      },
    },
  );
}
