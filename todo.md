# ESP Pinout Explorer Profile TODO

Source baseline:

- Espressif SoCs product table: https://www.espressif.com/en/products/socs
- Espressif modules product table: https://www.espressif.com/en/products/modules
- ESP32 datasheet: https://documentation.espressif.com/esp32_datasheet_en.html
- ESP32-S2 datasheet/product entry: https://documentation.espressif.com/esp32-s2_datasheet_en.html
- ESP32-S3 datasheet/product entry: https://documentation.espressif.com/esp32-s3_datasheet_en.html
- ESP32-C3 datasheet/product entry: https://documentation.espressif.com/esp32-c3_datasheet_en.html
- ESP32-C6 datasheet/product entry: https://documentation.espressif.com/esp32-c6_datasheet_en.html
- ESP32-H2 datasheet/product entry: https://documentation.espressif.com/esp32-h2_datasheet_en.html
- ESP32-P4 datasheet: https://documentation.espressif.com/esp32-p4_datasheet_en.html
- ESP32-S3 dev kits documentation index: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/index.html

## Done

- [x] ESP32-S3
  - [x] Chip package profile: QFN56, 7 x 7 mm
  - [x] Board profile: ESP32-S3-DevKitC-1 v1.1
  - [x] Board profile: ESP32-S3-DevKitM-1
  - [x] Board profile: ESP32-S3-USB-OTG connector groups
- [x] ESP32-C6
  - [x] Chip package profile: QFN40, 5 x 5 mm
  - [x] Chip package profile: QFN32, 5 x 5 mm
  - [x] Module profile: ESP32-C6-MINI-1
  - [x] Module profile: ESP32-C6-MINI-1U
  - [x] Board profile: ESP32-C6-DevKitM-1

## To Do

### ESP32-S Series

- [ ] ESP32-S3 board profiles
  - [x] Board profile: ESP32-S3-DevKitC-1 v1.1
  - [x] Board profile: ESP32-S3-USB-OTG
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-otg/user_guide.html
    - Note: active Espressif board. Implemented as connector groups from the official Function pin and Extended pin tables instead of fake J1/J3 headers.
  - [ ] Board profile: ESP32-S3-LCD-EV-Board v1.5
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-lcd-ev-board/user_guide.html
    - Note: active Espressif board. User guide has GPIO Allocation and I/O Expander GPIO Allocation tables. Treat as a board allocation profile, not a simple maker header, unless official schematics clarify external connector pin identities.
  - [x] Board profile: ESP32-S3-DevKitM-1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitm-1/user_guide.html
    - Note: EOL board, but official user guide has J1/J3 Header Block tables and should fit the existing `BoardSvg.vue` model. Useful as a low-risk second header-style board profile.
  - [x] Board profile: ESP32-S3-USB-Bridge
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-bridge/user_guide.html
    - Note: EOL board. Implemented as a compact connector-group GPIO allocation profile from the official GPIO Allocation table, with the ESP32-S3-MINI-1-N4R2 module identity surfaced.
  - [ ] Board profile: ESP-VoCat v1.2
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-vocat/user_guide_v1.2.html
    - Note: active Espressif board. User guide documents hardware blocks, magnetic connector, LCD, SD card, microphone, and revision pin changes; use official schematic for full pin mapping before implementation.
  - [ ] Board profile: ESP-DualKey
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-dualkey/user_guide.html
    - Note: active Espressif board. User guide identifies major components and HY2.0-4P ports, but detailed pin mapping should come from the official schematic before implementation.
- [ ] ESP32-S31 chip package profiles
  - [ ] Chip package profile: QFN, 8 x 8 mm
  - Note: new/early entry; confirm datasheet pin tables before implementation.
- [ ] ESP32-S3-PICO-1 module profiles
  - [ ] Module profile: ESP32-S3-PICO-1, LGA 7 x 7 mm
  - Note: PICO is a module/SiP-style profile with a separate pad layout from the bare ESP32-S3 QFN56 chip package.
- [ ] ESP32-S2 chip package profiles
  - [ ] Chip package profile: QFN56, 7 x 7 mm

### ESP32-C Series

- [ ] ESP32-C6 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [x] Module profile: ESP32-C6-MINI-1
  - [x] Module profile: ESP32-C6-MINI-1U
  - [ ] Module profile: ESP32-C6-WROOM-1
  - [ ] Module profile: ESP32-C6-WROOM-1U
  - Note: ESP32-C6 QFN40/QFN32 chip package profiles are implemented. Module profiles should come from official module datasheets/footprints because MINI and WROOM modules expose different pad counts, dimensions, antenna variants, flash sizes, and dev-kit pairings than the bare chip packages.
- [x] ESP32-C6 board profiles
  - [x] Board profile: ESP32-C6-DevKitM-1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitm-1/user_guide.html
    - Note: active Espressif board based on ESP32-C6-MINI-1(U). Implemented from the official J1/J3 Header Block tables.
  - [x] Board profile: ESP32-C6-DevKitC-1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html
    - Note: active Espressif board based on ESP32-C6-WROOM-1(U). Implemented from the official v1.2 J1/J3 Header Block tables; standalone WROOM module profiles remain separate TODO items.
- [ ] ESP32-C61 chip package profiles
  - [ ] Chip package profile: QFN, 5 x 5 mm
- [ ] ESP32-C61 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP32-C61-WROOM-1
  - [ ] Module profile: ESP32-C61-WROOM-1U
  - [ ] Module profile: ESP32-C61-MINI-1
  - [ ] Module profile: ESP32-C61-MINI-1U
  - Note: new/early module family; verify latest module datasheets and dev-kit user guides before implementation.
- [ ] ESP32-C5 chip package profiles
  - [ ] Chip package profile: QFN, 6 x 6 mm
- [ ] ESP32-C5 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP32-C5-WROOM-1
  - [ ] Module profile: ESP32-C5-WROOM-1U
  - [ ] Module profile: ESP32-C5-MINI-1
  - [ ] Module profile: ESP32-C5-MINI-1U
  - Note: verify module datasheets because C5 module variants differ by antenna connector, flash/PSRAM options, exposed pad count, and dimensions.
- [ ] ESP32-C3 chip package profiles
  - [ ] Chip package profile: QFN32, 5 x 5 mm
- [ ] ESP32-C3 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP32-C3-MINI-1
  - [ ] Module profile: ESP32-C3-MINI-1U
  - [ ] Module profile: ESP32-C3-WROOM-02
  - [ ] Module profile: ESP32-C3-WROOM-02U
  - Note: module profiles should use official module datasheets/footprints; do not copy the bare ESP32-C3 QFN32 pinout directly.
- [ ] ESP8685 chip package profiles
  - [ ] Chip package profile: QFN, 4 x 4 mm
  - Note: ESP32-C3-class product with a smaller chip package and different exposed GPIO count.
- [ ] ESP8685 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP8685-WROOM-01
  - [ ] Module profile: ESP8685-WROOM-03
  - [ ] Module profile: ESP8685-WROOM-04
  - [ ] Module profile: ESP8685-WROOM-05
  - [ ] Module profile: ESP8685-WROOM-06
  - [ ] Module profile: ESP8685-WROOM-07
  - Note: these modules expose different available GPIO counts and mounting styles. Implement each from official module datasheets/footprints rather than treating ESP8685 as only a smaller ESP32-C3-class QFN chip package.
- [ ] ESP8684 / ESP32-C2-class chip package profiles
  - [ ] Chip package profile: QFN, 4 x 4 mm
- [ ] ESP8684 / ESP32-C2-class module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP8684-MINI-1
  - [ ] Module profile: ESP8684-MINI-1U
  - [ ] Module profile: ESP8684-WROOM-01C
  - [ ] Module profile: ESP8684-WROOM-02C
  - [ ] Module profile: ESP8684-WROOM-02UC
  - [ ] Module profile: ESP8684-WROOM-03
  - [ ] Module profile: ESP8684-WROOM-04C
  - [ ] Module profile: ESP8684-WROOM-05
  - [ ] Module profile: ESP8684-WROOM-06C
  - [ ] Module profile: ESP8684-WROOM-07
  - Note: ESP8684 module variants include MINI, WROOM, castellated/header-capable, vertical solder, and external-antenna forms. Use official module datasheets/footprints for exact exposed pads and GPIO availability.

### ESP32-H Series

- [ ] ESP32-H4
  - [ ] QFN, 6 x 6 mm
  - Note: new/early entry; confirm datasheet pin tables before implementation.
- [ ] ESP32-H21
  - [ ] QFN, 4 x 4 mm
  - Note: new/early entry; confirm datasheet pin tables before implementation.
- [ ] ESP32-H2
  - [ ] QFN32, 4 x 4 mm

### ESP32-P Series

- [ ] ESP32-P4
  - [ ] QFN104, 10 x 10 mm
  - Note: large pinout; implement after the SVG/layout can comfortably handle 100+ package pins.

### ESP32-E Series

- [ ] ESP32-E22
  - [ ] QFN, 9 x 9 mm
  - Note: new/early entry; confirm public datasheet status and pin tables before implementation.

### Classic ESP32 Series

- [ ] ESP32 classic QFN variants
  - [ ] QFN48, 5 x 5 mm
  - [ ] QFN48, 6 x 6 mm
  - Covers ESP32-D0WD, ESP32-D0WD-V3, ESP32-D0WDQ6, ESP32-D0WDQ6-V3, ESP32-S0WD, ESP32-U4WDH, and related flash/PSRAM variants.
- [ ] ESP32 classic PICO variants
  - [ ] LGA, 7 x 7 mm
  - Covers ESP32-PICO-D4, ESP32-PICO-V3, and ESP32-PICO-V3-02 package families.

### ESP8266 Series

- [ ] ESP8266EX
  - [ ] QFN, 5 x 5 mm
- [ ] ESP8285
  - [ ] QFN, 5 x 5 mm

## Implementation Notes

- Prefer one data file per SoC family unless package pinouts diverge enough to justify separate files.
- Use `packageVariants` for alternate package pinouts under the same SoC.
- Use `boardProfiles` for official development-board header, connector, or GPIO-allocation views tied to an implemented SoC.
- Keep source links and datasheet version numbers inside each data file.
- For board profiles, include module identity metadata when makers may see module markings such as WROOM, MINI, or PICO instead of the dev-kit name.
- For development boards, prefer official user-guide Header Block, Pin Layout, GPIO Allocation, or schematic sections. Do not infer board profile pins from product photos or third-party pinout images.
- For newer entries, verify the latest official datasheet immediately before implementation.
