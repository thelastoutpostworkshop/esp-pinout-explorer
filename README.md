# ESPSocsExplorer

Vue 3 + TypeScript + Vite MVP for exploring the ESP32-S3 SoC pinout with Vuetify 4 and Pinia.

The ESP32-S3 pin metadata is in `src/data/socs/esp32s3.ts` and is based on the official Espressif ESP32-S3 Series Datasheet v2.2:
https://documentation.espressif.com/esp32-s3_datasheet_en.pdf

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

- `src/components/SocPinoutView.vue` - page composition for the explorer
- `src/components/ChipSvg.vue` - data-driven clickable SVG package drawing
- `src/components/PinInfoDrawer.vue` - selected pin details and warnings
- `src/components/PinSearch.vue` - search and quick filters
- `src/data/socs/esp32s3.ts` - ESP32-S3 pin metadata
- `src/stores/socStore.ts` - Pinia selected SoC, selected pin, and search state
