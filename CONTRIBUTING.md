# Contributor Guide

## Install

```bash
npm install
```

## Dev

```bash
npm run dev
```

The dev server is pinned to `http://127.0.0.1:5176` so it does not collide with other local Vite apps.

## Build

```bash
npm run build
```

## Structure

- `src/components/AppShell.vue` - compact app bar, responsive sidebar layout, and mobile control drawer
- `src/components/ExplorerSidebar.vue` - SoC/profile selectors, search, pin count, and legend
- `src/components/SocPinoutView.vue` - pinout stage and selected-pin drawer
- `src/components/ChipSvg.vue` - data-driven clickable SVG package drawing
- `src/components/BoardSvg.vue` - data-driven clickable SVG development-board header drawing
- `src/components/PinInfoDrawer.vue` - selected pin details, maker warnings, and board design notes
- `src/components/PinSearch.vue` - search and quick filters
- `src/data/boards/helpers.ts` - shared board pin builders for metadata inheritance, warnings, notes, and search keywords
- `src/data/boards/esp32s3/` - extracted ESP32-S3 board profiles and shared board source metadata
- `src/data/pinWarnings.ts` - warning presentation rules
- `src/data/socs/esp32.ts` - Classic ESP32 pin and board metadata
- `src/data/socs/esp32s3.ts` - ESP32-S3 pin metadata
- `src/data/socs/esp32c6.ts` - ESP32-C6 pin and package metadata
- `src/stores/socStore.ts` - Pinia selected SoC, selected pin, and search state

When a SoC has multiple packages or board profiles, the app shows a profile selector beside the SoC selector.

## Board Label Convention

Board profile data preserves official Espressif header and silkscreen labels in `boardLabel`, including labels such as `IO23` or `GPIO23`. `BoardSvg.vue` renders simple numeric GPIO labels as `23` for a consistent maker-facing board view. The official board label remains available in search and in the pin details drawer.
