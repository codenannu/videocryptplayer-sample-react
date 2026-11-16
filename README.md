# videocryptplayer-react

Vite + React sample for `@codenkay/video-videocrypt-*` (port **5173**).

## Features demonstrated

- `VideocryptPlayerWithControls` (nsg-parity `vc-player-*` chrome)
- Modes: **BFF DRM**, **inline mock DRM**, **clear MP4** (`drmMode="none"`)
- Single `playback.getSource` path (no preflight)
- `licenseUrl` / `certUrlBuilder` → BFF DRM proxies
- `onWatchTime`, watermark, `audioAvailable={false}`

```bash
# build packages in ../videocrypt-player first
cd ../videocrypt-player && npm run build:packages
cd ../videocryptplayer-react
npm install
npm run dev
```

Set `VITE_BFF_ORIGIN=http://localhost:3001` (nextjs sample) or `http://localhost:3000` (demo).
DRM modes need a running BFF; clear mode does not.
