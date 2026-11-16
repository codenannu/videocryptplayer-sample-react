# Videocrypt Player — React sample

Public playground for the Videocrypt DRM video player SDK. Vite + React + full control chrome.

| | |
|--|--|
| Port | **5173** |
| Repo | [videocryptplayer-sample-react](https://github.com/codenannu/videocryptplayer-sample-react) |
| SDK | `@codenkay/video-videocrypt-ui` · `react` · `core` (**0.1.0**) |
| Modes | **BFF DRM** · inline mock DRM · **clear MP4** (`drmMode="none"`) |

> This sample is **standalone**. It does **not** require cloning a private SDK monorepo. Prefer installing packages from **npm**. Local `file:` links are only for pre-publish development.

## SDK packages

| Package | Role | Used here |
|---------|------|-----------|
| [`@codenkay/video-videocrypt-core`](https://www.npmjs.com/package/@codenkay/video-videocrypt-core) | DRM / clear engine | Yes (peer) |
| [`@codenkay/video-videocrypt-react`](https://www.npmjs.com/package/@codenkay/video-videocrypt-react) | Headless React player | Yes (peer) |
| [`@codenkay/video-videocrypt-ui`](https://www.npmjs.com/package/@codenkay/video-videocrypt-ui) | Control chrome (`vc-player-*`) | **Primary** |
| [`@codenkay/video-videocrypt-angular`](https://www.npmjs.com/package/@codenkay/video-videocrypt-angular) | Angular headless | No — see [Angular sample](https://github.com/codenannu/videocryptplayer-sample-angular) |

## Related samples

| Sample | Repository | Port | Purpose |
|--------|------------|------|---------|
| **This repo** | [videocryptplayer-sample-react](https://github.com/codenannu/videocryptplayer-sample-react) | **5173** | Full React chrome · DRM / mock / clear |
| Next.js + BFF | [videocryptplayer-sample-nextjs](https://github.com/codenannu/videocryptplayer-sample-nextjs) | **3001** | Playback + DRM license/cert proxies |
| Angular | [videocryptplayer-sample-angular](https://github.com/codenannu/videocryptplayer-sample-angular) | **4200** | Headless Angular · same BFF contract |

## Quick start

```bash
git clone https://github.com/codenannu/videocryptplayer-sample-react.git
cd videocryptplayer-sample-react
npm install
npm run dev
```

Open http://localhost:5173

### BFF DRM mode

1. Run [videocryptplayer-sample-nextjs](https://github.com/codenannu/videocryptplayer-sample-nextjs) on port **3001** (or your demo BFF).
2. Select **BFF DRM**, enter a video id, click **Play**.

Optional env:

```bash
VITE_BFF_ORIGIN=http://localhost:3001
```

Wires `playback.getSource` → `POST /api/playback`, `licenseUrl` → `/api/drm/license`, `certUrlBuilder` → `/api/drm/cert`.

**Never** put Videocrypt access/secret keys in this React app — secrets stay on the BFF.

## Install peers (into your own app)

```bash
npm install @codenkay/video-videocrypt-ui @codenkay/video-videocrypt-react @codenkay/video-videocrypt-core video.js@^7.21.5 videojs-contrib-eme@^3.11.1 react react-dom
```

```tsx
import { VideocryptPlayerWithControls } from "@codenkay/video-videocrypt-ui";
import "@codenkay/video-videocrypt-ui/styles.css";
import "video.js/dist/video-js.css";
```

## Features demonstrated

- `VideocryptPlayerWithControls` (nsg-parity chrome)
- Single `playback.getSource` path (no preflight double-fetch)
- `onWatchTime`, watermark, `audioAvailable={false}`
- Clear mode via `drmMode="none"` + `protection: "none"`
