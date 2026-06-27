# ESP Pinout Explorer Package TODO

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
  - [x] QFN56, 7 x 7 mm
  - [x] ESP32-S3-DevKitC-1 v1.1 board profile
  - [x] ESP32-S3-DevKitM-1 board profile
  - [x] ESP32-S3-USB-OTG connector-group board profile
- [x] ESP32-C6
  - [x] QFN40, 5 x 5 mm
  - [x] QFN32, 5 x 5 mm

## To Do

### ESP32-S Series

- [ ] ESP32-S3 board profiles
  - [x] ESP32-S3-DevKitC-1 v1.1
  - [x] ESP32-S3-USB-OTG
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-otg/user_guide.html
    - Note: active Espressif board. Implemented as connector groups from the official Function pin and Extended pin tables instead of fake J1/J3 headers.
  - [ ] ESP32-S3-LCD-EV-Board v1.5
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-lcd-ev-board/user_guide.html
    - Note: active Espressif board. User guide has GPIO Allocation and I/O Expander GPIO Allocation tables. Treat as a board allocation profile, not a simple maker header, unless official schematics clarify external connector pin identities.
  - [x] ESP32-S3-DevKitM-1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitm-1/user_guide.html
    - Note: EOL board, but official user guide has J1/J3 Header Block tables and should fit the existing `BoardSvg.vue` model. Useful as a low-risk second header-style board profile.
  - [ ] ESP32-S3-USB-Bridge
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-bridge/user_guide.html
    - Note: EOL board. Official GPIO Allocation table covers the 12-pin expansion connector and on-board bridge functions; likely needs a compact connector layout rather than the current two-side header drawing.
  - [ ] ESP-VoCat v1.2
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-vocat/user_guide_v1.2.html
    - Note: active Espressif board. User guide documents hardware blocks, magnetic connector, LCD, SD card, microphone, and revision pin changes; use official schematic for full pin mapping before implementation.
  - [ ] ESP-DualKey
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-dualkey/user_guide.html
    - Note: active Espressif board. User guide identifies major components and HY2.0-4P ports, but detailed pin mapping should come from the official schematic before implementation.
- [ ] ESP32-S31
  - [ ] QFN, 8 x 8 mm
  - Note: new/early entry; confirm datasheet pin tables before implementation.
- [ ] ESP32-S3-PICO-1
  - [ ] LGA, 7 x 7 mm
  - Note: separate package/pinout from ESP32-S3 QFN56.
- [ ] ESP32-S2
  - [ ] QFN56, 7 x 7 mm

### ESP32-C Series

- [ ] ESP32-C6 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] ESP32-C6-MINI-1
  - [ ] ESP32-C6-MINI-1U
  - [ ] ESP32-C6-WROOM-1
  - [ ] ESP32-C6-WROOM-1U
  - Note: raw ESP32-C6 QFN40/QFN32 packages are implemented. Module profiles should come from official module datasheets/footprints because MINI and WROOM modules expose different pad counts, dimensions, antenna variants, flash sizes, and dev-kit pairings than the bare chip packages.
- [ ] ESP32-C61
  - [ ] QFN, 5 x 5 mm
  - [ ] Official module profiles
    - Source: https://www.espressif.com/en/products/modules
    - [ ] ESP32-C61-WROOM-1
    - [ ] ESP32-C61-WROOM-1U
    - [ ] ESP32-C61-MINI-1
    - [ ] ESP32-C61-MINI-1U
    - Note: new/early module family; verify latest module datasheets and dev-kit user guides before implementation.
- [ ] ESP32-C5
  - [ ] QFN, 6 x 6 mm
  - [ ] Official module profiles
    - Source: https://www.espressif.com/en/products/modules
    - [ ] ESP32-C5-WROOM-1
    - [ ] ESP32-C5-WROOM-1U
    - [ ] ESP32-C5-MINI-1
    - [ ] ESP32-C5-MINI-1U
    - Note: verify module datasheets because C5 module variants differ by antenna connector, flash/PSRAM options, exposed pad count, and dimensions.
- [ ] ESP32-C3
  - [ ] QFN32, 5 x 5 mm
  - [ ] Official module profiles
    - Source: https://www.espressif.com/en/products/modules
    - [ ] ESP32-C3-MINI-1
    - [ ] ESP32-C3-MINI-1U
    - [ ] ESP32-C3-WROOM-02
    - [ ] ESP32-C3-WROOM-02U
    - Note: module profiles should use official module datasheets/footprints; do not copy the bare ESP32-C3 QFN32 pinout directly.
- [ ] ESP8685
  - [ ] QFN, 4 x 4 mm
  - [ ] Official module profiles
    - Source: https://www.espressif.com/en/products/modules
    - [ ] ESP8685-WROOM-01
    - [ ] ESP8685-WROOM-03
    - [ ] ESP8685-WROOM-04
    - [ ] ESP8685-WROOM-05
    - [ ] ESP8685-WROOM-06
    - [ ] ESP8685-WROOM-07
    - Note: these modules expose different available GPIO counts and mounting styles. Implement each from official module datasheets/footprints rather than treating ESP8685 as only a smaller ESP32-C3-class QFN package.
  - Note: ESP32-C3-class product with a smaller package and different exposed GPIO count.
- [ ] ESP8684 / ESP32-C2-class
  - [ ] QFN, 4 x 4 mm
  - [ ] Official module profiles
    - Source: https://www.espressif.com/en/products/modules
    - [ ] ESP8684-MINI-1
    - [ ] ESP8684-MINI-1U
    - [ ] ESP8684-WROOM-01C
    - [ ] ESP8684-WROOM-02C
    - [ ] ESP8684-WROOM-02UC
    - [ ] ESP8684-WROOM-03
    - [ ] ESP8684-WROOM-04C
    - [ ] ESP8684-WROOM-05
    - [ ] ESP8684-WROOM-06C
    - [ ] ESP8684-WROOM-07
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
