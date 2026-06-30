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
- ESP32-H SoC product table entries: https://www.espressif.com/en/products/socs
- ESP32-H module product table entries: https://www.espressif.com/en/products/modules
- ESP32-H dev kit product table entries: https://www.espressif.com/en/products/devkits
- ESP32-P4 datasheet: https://documentation.espressif.com/esp32-p4_datasheet_en.html
- ESP32-P4 dev kits documentation index: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/index.html
- ESP32-S3 dev kits documentation index: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/index.html

## Done

- [x] ESP32
  - [x] Chip package profile: ESP32 QFN48, 6 x 6 mm
  - [x] Board profile: ESP32-DevKitC V4
  - [x] Board profile: ESP32-DevKitM-1
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
- [x] ESP32-H2
  - [x] Chip package profile: ESP32-H2 QFN32, 4 x 4 mm
  - [x] Board profile: ESP32-H2-DevKitM-1

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

- [ ] ESP32-H4 chip package profiles
  - Source: https://www.espressif.com/en/products/socs/esp32-h4
  - [ ] Chip package profile: ESP32-H4 QFN, 6 x 6 mm
    - Variants: ESP32-H4HR2 / ESP32-H4HF4
    - Product table: dual-core RISC-V, 40 GPIO, 384 KB SRAM, 128 KB ROM, 4 MB flash / 2 MB PSRAM variant coverage.
  - Note: new/early entry. Confirm the public datasheet and complete pin tables before implementation; the SoC product page is not enough for raw pinout data.
- [ ] ESP32-H4 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP32-H4-WROOM-1
    - Product table: ESP32-H4HR2, 18.0 x 25.5 x 3.1 mm, 33 GPIO, 4 MB flash, 2 MB PSRAM, PCB antenna.
  - Note: implement from the official module datasheet/footprint when publicly available, not only from the product table.
- [ ] ESP32-H4 board profiles
  - Source: https://www.espressif.com/en/products/devkits
  - [ ] Board profile: ESP32-H4-DevKitC-1
    - Product table: ESP32-H4-WROOM-1 board, 8 MB flash + 2 MB PSRAM, I/O, USB, buttons, LEDs.
  - Blocked as of 2026-06-29: the dev-kit product table lists the board, but no public official user guide, header tables, pin layout, or schematic source was found. Do not implement from the product table alone.
- [ ] ESP32-H21 chip package profiles
  - Source: https://www.espressif.com/en/products/socs/esp32-h21
  - [ ] Chip package profile: ESP32-H21 QFN, 4 x 4 mm
    - Variant: ESP32-H21HF4
    - Product table: single-core RISC-V, 19 GPIO, 128 KB ROM, 320 KB HP SRAM, 4 KB LP SRAM, 4 MB flash, no PSRAM.
  - Note: new/early entry. Confirm the public datasheet and complete pin tables before implementation.
- [ ] ESP32-H21 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP32-H21-MINI-1
    - Product table: ESP32-H21HF4, 13.2 x 16.6 x 2.4 mm, 19 GPIO, 4 MB flash, no PSRAM, PCB antenna.
  - Note: implement from the official module datasheet/footprint when publicly available.
- [ ] ESP32-H21 board profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Board profile: ESP32-H21-DevKitM-1
    - Product table: paired with ESP32-H21-MINI-1.
  - Note: the module product table lists this dev board pairing, but confirm the official user guide, header tables, pin layout, or schematics before implementation.
- [x] ESP32-H2 chip package profiles
  - Source: https://documentation.espressif.com/esp32-h2_datasheet_en.html
  - [x] Chip package profile: ESP32-H2 QFN32, 4 x 4 mm
    - Variants: ESP32-H2FH2S / ESP32-H2FH4S
    - Datasheet/product table: 19 GPIO, 320 KB SRAM, 128 KB ROM, 4 KB LP memory, 2 MB or 4 MB in-package flash, no PSRAM.
- [ ] ESP32-H2 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP32-H2-MINI-1
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-h2-mini-1_mini-1u_datasheet_en.pdf
    - Product table: 13.2 x 16.6 x 2.4 mm, 19 GPIO, 1 MB / 2 MB / 4 MB flash options, no PSRAM, PCB antenna.
  - [ ] Module profile: ESP32-H2-MINI-1U
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-h2-mini-1_mini-1u_datasheet_en.pdf
    - Product table: 13.2 x 12.5 x 2.4 mm, external antenna connector, 2 MB / 4 MB flash options, no PSRAM.
  - [ ] Module profile: ESP32-H2-WROOM-02C
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-h2-wroom-02c_datasheet_en.pdf
    - Product table/datasheet: 18.0 x 20.0 x 3.2 mm, 19 GPIOs, 2 MB / 4 MB flash, no PSRAM, PCB antenna.
  - Note: module profiles should use official module pad definitions and memory tables. Do not copy the bare QFN32 pinout directly.
- [x] ESP32-H2 board profiles
  - Source index: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/index.html
  - [x] Board profile: ESP32-H2-DevKitM-1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/esp32-h2-devkitm-1/user_guide.html
    - Note: active Espressif board based on ESP32-H2-MINI-1 or ESP32-H2-MINI-1U. Implemented from the official Header Block tables and Pin Layout; standalone MINI module pad profiles remain separate TODO items.
  - [ ] Board profile: ESP Thread Border Router/Zigbee Gateway
    - Source: https://docs.espressif.com/projects/esp-thread-br/en/latest/dev-board-guide.html
    - Note: gateway board combines ESP32-S3 with ESP32-H2 RCP. Treat as a specialized connector/peripheral board profile only if the official guide/schematic provides enough pin allocation detail.

### ESP32-P Series

- [ ] ESP32-P4 chip package profiles
  - Source: https://documentation.espressif.com/esp32-p4_datasheet_en.html
  - [ ] Chip package profile: ESP32-P4 QFN104, 10 x 10 mm
    - Datasheet/product table: dual-core RISC-V HP CPU, LP RISC-V core, 55 GPIO, USB 2.0 High-Speed, MIPI-CSI/DSI, H.264 encoder, external flash/PSRAM support.
    - Variants: confirm the current ESP32-P4 part-number table, memory options, NRND/EOL markings, and chip-revision notes directly from the latest datasheet before implementation.
  - Note: large pinout; implement after `ChipSvg.vue` can comfortably handle 100+ package pins with readable labels and mobile behavior. Pay special attention to ESP32-P4 power domains and voltage-sensitive pins.
- [ ] ESP32-P4 board profiles
  - Source index: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/index.html
  - [ ] Board profile: ESP32-P4X-Function-EV-Board
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4x-function-ev-board/user_guide.html
    - Note: active multimedia development board. User guide says most I/O pins are broken out to pin headers and the board includes an ESP32-C6-MINI-1 wireless module, 7-inch display, MIPI CSI camera, USB, and rich on-board peripherals. Treat as a board profile with header pins plus strong maker warnings for on-board display, camera, USB, SDIO, audio, C6 host link, and power-domain constraints.
  - [ ] Board profile: ESP32-P4X-EYE
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4x-eye/user_guide.html
    - Note: active vision board based on ESP32-P4 with ESP32-C6-MINI-1U wireless module, camera, display, microphone, MicroSD, USB 2.0 High-Speed device port, debug port, battery connector, and 2 x 10P female header. Treat as a compact board/peripheral allocation profile, not a generic two-header dev board.
  - [ ] Board profile: ESP32-P4-Function-EV-Board v1.5.2
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4-function-ev-board/user_guide.html
    - Note: EOL board. Add only after active P4X boards unless a user needs legacy hardware. It is still valuable because the guide documents header breakout and on-board ESP32-C6-MINI-1 connectivity.
  - [ ] Board profile: ESP32-P4-EYE
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4-eye/user_guide.html
    - Note: EOL vision board. Add after ESP32-P4X-EYE if legacy coverage is needed. Use the official schematic/PCB layout links from the user guide for the camera, display, MicroSD, microphone, rotary encoder, C6 module, and female header mapping.
  - Note: ESP32-P4 board profiles are peripheral-heavy. Prefer a connector/peripheral allocation layout over forcing every board into the simple dual-header drawing.
- [ ] ESP32-P4 module profiles
  - Source: https://www.espressif.com/en/products/modules
  - Note: no standalone official Espressif ESP32-P4 module profile is currently listed in the module product table. Do not add third-party ESP32-P4 modules or Waveshare/Olimex boards as official profiles unless the project scope expands beyond Espressif official hardware.

### ESP32-E Series

- [ ] ESP32-E22
  - [ ] QFN, 9 x 9 mm
  - Note: new/early entry; confirm public datasheet status and pin tables before implementation.

### Classic ESP32 Series

- [ ] ESP32 classic chip package profiles
  - Source: https://documentation.espressif.com/esp32_datasheet_en.html
  - [ ] Chip package profile: ESP32 QFN48, 5 x 5 mm
    - Covers ESP32-D0WD-V3, ESP32-U4WDH, ESP32-S0WD, ESP32-D0WD, and related QFN 5 x 5 mm variants.
  - [x] Chip package profile: ESP32 QFN48, 6 x 6 mm
    - Covers ESP32-D0WDQ6-V3 and ESP32-D0WDQ6 variants.
    - Note: implemented as the base Classic ESP32 package profile from the ESP32 Series Datasheet v5.2.
  - Note: the ESP32 Series Datasheet v5.2 has separate top-view drawings for QFN 6 x 6 mm and QFN 5 x 5 mm. Treat in-package flash/PSRAM variants as package constraints, not separate maker boards. Flag NRND/EOL variants in profile metadata where applicable.
- [ ] ESP32-PICO SiP package profiles
  - Source: https://documentation.espressif.com/esp32-pico_series_datasheet_en.pdf
  - [ ] SiP package profile: ESP32-PICO-D4, LGA 7 x 7 mm
  - [ ] SiP package profile: ESP32-PICO-V3, LGA 7 x 7 mm
  - [ ] SiP package profile: ESP32-PICO-V3-02, LGA 7 x 7 mm
  - Note: PICO is a System-in-Package profile, not a dev board. ESP32-PICO-D4 and ESP32-PICO-V3 are not 1:1 pin-compatible, and ESP32-PICO-V3-02 adds 8 MB flash plus 2 MB PSRAM.
- [ ] ESP32 classic module profiles
  - Source: https://www.espressif.com/en/products/modules
  - [ ] Module profile: ESP32-WROOM-32E
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf
  - [ ] Module profile: ESP32-WROOM-32UE
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-wroom-32e_esp32-wroom-32ue_datasheet_en.pdf
  - [ ] Module profile: ESP32-WROVER-E
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-wrover-e_esp32-wrover-ie_datasheet_en.pdf
  - [ ] Module profile: ESP32-WROVER-IE
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-wrover-e_esp32-wrover-ie_datasheet_en.pdf
  - [ ] Module profile: ESP32-MINI-1
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-mini-1_datasheet_en.pdf
  - [ ] Module profile: ESP32-MINI-1U
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-mini-1_datasheet_en.pdf
  - [ ] Module profile: ESP32-PICO-MINI-02
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-pico-mini-02_datasheet_en.pdf
  - [ ] Module profile: ESP32-PICO-MINI-02U
    - Source: https://www.espressif.com/sites/default/files/documentation/esp32-pico-mini-02_datasheet_en.pdf
  - [ ] Module profile: ESP32-SOLO-1
    - Source: https://documentation.espressif.com/esp32-solo-1_datasheet_en.html
  - Note: module profiles should use official module pad definitions and memory tables. Do not copy the bare ESP32 QFN pinout into WROOM/WROVER/MINI/PICO module profiles because module pads, antenna variants, flash/PSRAM, and unavailable flash pins differ.
- [ ] ESP32 classic board profiles
  - Source index: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/index.html
  - [x] Board profile: ESP32-DevKitC V4
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html
    - Note: high maker value. Implemented from the official J2/J3 Header Block tables with WROOM/WROVER/SOLO module identity and module-specific GPIO16/GPIO17 warnings.
  - [x] Board profile: ESP32-DevKitM-1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitm-1/user_guide.html
    - Note: active Espressif board based on ESP32-MINI-1. Implemented from the official Pin Descriptions table, Pin Layout, and schematic J1/J3 header numbering.
  - [x] Board profile: ESP32-PICO-DevKitM-2
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-devkitm-2/user_guide.html
    - Note: active Espressif board based on ESP32-PICO-MINI-02/02U. Implemented from the official J2/J3 header tables; standalone PICO-MINI module pad profiles remain separate TODO items.
  - [ ] Board profile: ESP32-PICO-KIT-1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-kit-1/user_guide.html
    - Note: PICO-D4-based development board. Useful for makers, but check whether the guide provides full header pin tables before implementation.
  - [ ] Board profile: ESP32-PICO-KIT v4/v4.1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-kit/user_guide.html
    - Note: EOL/older PICO-D4 mini board. Add after PICO-KIT-1 if its official guide provides enough header detail.
  - [ ] Board profile: ESP-WROVER-KIT v4.1
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp-wrover-kit/user_guide.html
    - Note: specialized board with ESP32-WROVER-E, LCD, and microSD. Treat as a GPIO-allocation/peripheral board profile rather than a simple maker header.
  - [ ] Board profile: ESP32-Ethernet-Kit
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-ethernet-kit/index.html
    - Note: specialized Ethernet board. Use only official user guide/schematic allocation data; Ethernet PHY pins should be maker warnings.
  - [ ] Board profile: ESP32-LCDKit
    - Source: https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-lcdkit/index.html
    - Note: specialized HMI board with ESP32-DevKitC at its core. Lower priority than direct header-style boards.

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
