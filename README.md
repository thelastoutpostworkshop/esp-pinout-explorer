# ESP Pinout Explorer

Your atlas for ESP chips, modules, and boards.

Vue 3 + TypeScript + Vite MVP for exploring Espressif SoC, module, and development-board pinouts with Vuetify 4 and Pinia.

Current profiles:

- ESP32-S3-DevKitC-1 v1.1 board headers with WROOM module identity, based on the official Espressif ESP32-S3-DevKitC-1 User Guide v1.1: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html
- ESP32-S3-DevKitM-1 board headers with MINI module identity, based on the official Espressif ESP32-S3-DevKitM-1 User Guide: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitm-1/user_guide.html
- ESP32-S3-USB-OTG connector groups, based on the official Espressif ESP32-S3-USB-OTG User Guide: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-otg/user_guide.html
- ESP32-S3 QFN56, based on the official Espressif ESP32-S3 Series Datasheet v2.2: https://documentation.espressif.com/esp32-s3_datasheet_en.pdf
- ESP32-C6 QFN40 and QFN32, based on the official Espressif ESP32-C6 Series Datasheet v1.5: https://documentation.espressif.com/esp32-c6_datasheet_en.pdf

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
- `src/data/pinWarnings.ts` - warning presentation rules
- `src/data/socs/esp32s3.ts` - ESP32-S3 pin metadata
- `src/data/socs/esp32c6.ts` - ESP32-C6 pin and package metadata
- `src/stores/socStore.ts` - Pinia selected SoC, selected pin, and search state

When a SoC has multiple packages or board profiles, the app shows a profile selector beside the SoC selector.
