# ESP Pinout Explorer Refactor TODO

This list tracks architecture work to finish before adding a large batch of development-board profiles.

## Before Adding Many More Boards

- [ ] Extract existing board profile literals into per-board files.
  - [x] `ESP32-S3-USB-Bridge` -> `src/data/boards/esp32s3/usbBridge.ts`
  - [x] `ESP32-S3-USB-OTG` -> `src/data/boards/esp32s3/usbOtg.ts`
  - [x] `ESP32-S3-DevKitC-1 v1.1` -> `src/data/boards/esp32s3/devkitC1V11.ts`
  - [ ] `ESP32-S3-DevKitM-1` -> `src/data/boards/esp32s3/devkitM1.ts`
  - [ ] `ESP32-DevKitC V4` -> `src/data/boards/esp32/devkitCV4.ts`
  - [ ] `ESP32-DevKitM-1` -> `src/data/boards/esp32/devkitM1.ts`
  - [ ] `ESP32-C6-DevKitM-1` -> `src/data/boards/esp32c6/devkitM1.ts`
  - [ ] `ESP32-C6-DevKitC-1` -> `src/data/boards/esp32c6/devkitC1.ts`
- [ ] Keep SoC files focused on raw chip/package/module data and profile registration.
- [ ] Move shared board module sources into family-level board source files.
  - [x] `ESP32-S3-MINI-1/1U` shared source
  - [ ] ESP32 WROOM/WROVER/SOLO shared sources
  - [ ] ESP32-C6 MINI/WROOM shared sources
- [ ] Add a small `createBoardProfiles(...)` registration pattern per SoC family so new board files are imported in one place.
- [ ] Standardize board profile factory signatures.
  - Recommended shape: `createBoardProfile(resolveSourcePinByGpio)`.
  - Keep source-pin resolution injected to avoid circular imports.
- [ ] Document the expected file template for a new board profile.

## Board Data Helpers

- [x] Centralize board pin construction in `src/data/boards/helpers.ts`.
- [x] Cover helper inheritance and omission behavior with unit tests.
- [ ] Add helper support for common dual-header board profile options.
  - Board id prefix
  - Header side mapping
  - Base keywords
  - Standard board header note text
- [ ] Add helper support for connector-group profile options.
  - Allocation table display-number format
  - Board group keywords
  - Optional source warning inheritance mode
- [ ] Add tests that catch accidental source metadata loss when a board pin has a GPIO.

## Validation

- [x] Keep explicit expected profile counts in `tests/data/socData.spec.ts`.
- [ ] Add a test that every board profile comes from `src/data/boards/<family>/` once extraction is complete.
- [ ] Add validation for board profile source figures by board layout.
  - Dual-header boards should include board photo/component layout/pin layout where official docs provide them.
  - Connector-group boards should include board photo/component layout and allocation-related source sections.
- [ ] Add a focused test for connector-group profile search terms.
- [ ] Add a focused test for dual-header profile function badge labels after extraction.

## UI Architecture

- [x] Keep `Functions` toggle hidden for connector-group profiles.
- [x] Keep dual-header function badges data-driven from `mainFunctions`.
- [ ] Split `BoardSvg.vue` geometry helpers by layout if connector-group artwork grows.
- [ ] Avoid one-off board-specific branches in `BoardSvg.vue`; prefer data-driven `boardLayout` or `boardArtwork` values.
- [ ] Consider a third board layout only when official documentation cannot fit `dual-header` or `connector-groups`.

## Scaling Later

- [ ] Revisit bundle size after several more board profiles are added.
- [ ] Consider lazy-loading profile data by SoC family if static data becomes a meaningful chunk-size problem.
- [ ] Consider generating profile validation reports from tests to make source review easier.
- [ ] Keep official-source notes close to each board file so future corrections are easy to audit.
