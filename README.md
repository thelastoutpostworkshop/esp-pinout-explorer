# ESPSocsExplorer

Vue 3 + TypeScript + Vite MVP for exploring Espressif SoC pinouts with Vuetify 4 and Pinia.

Current SoCs:

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

## Build

```bash
npm run build
```

## Structure

- `src/components/AppShell.vue` - compact app bar, responsive sidebar layout, and mobile control drawer
- `src/components/ExplorerSidebar.vue` - SoC/package selectors, search, pin count, and legend
- `src/components/SocPinoutView.vue` - pinout stage and selected-pin drawer
- `src/components/ChipSvg.vue` - data-driven clickable SVG package drawing
- `src/components/PinInfoDrawer.vue` - selected pin details, maker warnings, and board design notes
- `src/components/PinSearch.vue` - search and quick filters
- `src/data/pinWarnings.ts` - warning presentation rules
- `src/data/socs/esp32s3.ts` - ESP32-S3 pin metadata
- `src/data/socs/esp32c6.ts` - ESP32-C6 pin and package metadata
- `src/stores/socStore.ts` - Pinia selected SoC, selected pin, and search state

When a SoC has multiple packages, the app shows a package selector beside the SoC selector.
