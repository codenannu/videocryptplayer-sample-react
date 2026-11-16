import { useMemo, useState } from "react";
import { VideocryptPlayerWithControls } from "@codenkay/video-videocrypt-ui";
import "@codenkay/video-videocrypt-ui/styles.css";
import "video.js/dist/video-js.css";
import { BFF_ORIGIN, fetchPlayback } from "./shared/bffClient";

type Mode = "bff-drm" | "mock-drm" | "clear";

/**
 * Sample mirrors the latest SDK surface:
 * - VideocryptPlayerWithControls (nsg-parity chrome)
 * - Single credential path via playback.getSource (no preflight)
 * - Same-origin/BFF license + FairPlay cert proxies
 * - audioAvailable=false until audio-only exists
 * - Optional clear stream via drmMode="none" + protection:"none"
 */
export default function App() {
  const [videoId, setVideoId] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("bff-drm");
  const [error, setError] = useState("");
  const [watchTime, setWatchTime] = useState(0);
  const [watermark, setWatermark] = useState("");

  const playback = useMemo(
    () => ({
      getSource: async (ctx: {
        videoId: string;
        dType: 0 | 1 | 2 | 3;
        deviceId: string;
        deviceName: string;
        version: string;
      }) => {
        if (mode === "clear") {
          return {
            fileUrl: `https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4`,
            protection: "none" as const,
          };
        }
        if (mode === "mock-drm") {
          return {
            fileUrl: `https://example.com/mock/${ctx.videoId}.mpd`,
            token: "inline-mock",
            siteId: "MOCK",
            protection: "drm" as const,
          };
        }
        const json = await fetchPlayback({
          videoId: ctx.videoId,
          deviceType: ctx.dType,
          deviceId: ctx.deviceId,
          deviceName: ctx.deviceName,
          version: ctx.version,
        });
        return {
          fileUrl: json.fileUrl,
          token: json.token,
          siteId: json.siteId,
          protection: "drm" as const,
        };
      },
    }),
    [mode],
  );

  return (
    <div style={{ maxWidth: 960, margin: "2rem auto", fontFamily: "system-ui", padding: 16 }}>
      <h1>Videocrypt React sample</h1>
      <p style={{ color: "#64748b" }}>
        BFF: {BFF_ORIGIN}. Requires demo or nextjs BFF for DRM modes. Clear mode needs no BFF.
      </p>

      <label style={{ display: "block", marginBottom: 8 }}>
        Mode{" "}
        <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
          <option value="bff-drm">BFF DRM (Widevine/PlayReady/FairPlay)</option>
          <option value="mock-drm">Inline mock DRM credentials</option>
          <option value="clear">Clear progressive MP4 (drmMode=none)</option>
        </select>
      </label>

      <label style={{ display: "block", marginBottom: 8 }}>
        Watermark{" "}
        <input
          value={watermark}
          onChange={(e) => setWatermark(e.target.value)}
          placeholder="optional"
          style={{ width: "60%" }}
        />
      </label>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
          placeholder="Video ID (DRM modes)"
          style={{ flex: 1 }}
          disabled={mode === "clear"}
        />
        <button
          type="button"
          onClick={() => {
            setError("");
            const id = mode === "clear" ? "clear-demo" : videoId.trim();
            if (!id) {
              setError("Video ID is required");
              return;
            }
            setActive(id);
          }}
        >
          Play
        </button>
      </div>

      {error ? <p style={{ color: "crimson" }}>{error}</p> : null}
      {watchTime > 0 ? (
        <p style={{ color: "#64748b", fontSize: 13 }}>Last watchTime: {watchTime.toFixed(1)}s</p>
      ) : null}

      {active ? (
        <div style={{ marginTop: 16 }}>
          <VideocryptPlayerWithControls
            key={`${active}:${mode}`}
            videoId={active}
            playback={playback}
            audioAvailable={false}
            drmMode={mode === "clear" ? "none" : "auto"}
            watermarkText={watermark || null}
            licenseUrl={`${BFF_ORIGIN}/api/drm/license`}
            certUrlBuilder={(siteId) =>
              `${BFF_ORIGIN}/api/drm/cert?siteId=${encodeURIComponent(siteId)}`
            }
            config={{
              player: { autoplay: true, startMuted: true, startPosition: 0 },
              watermark: { enabled: Boolean(watermark), text: watermark },
            }}
            onWatchTime={setWatchTime}
            onError={(err) => setError(err.message)}
          />
        </div>
      ) : null}
    </div>
  );
}
