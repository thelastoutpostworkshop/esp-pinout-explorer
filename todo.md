# ESPSocsExplorer SoC Package TODO

Source baseline:

- Espressif SoCs product table: https://www.espressif.com/en/products/socs
- ESP32 datasheet: https://documentation.espressif.com/esp32_datasheet_en.html
- ESP32-S2 datasheet/product entry: https://documentation.espressif.com/esp32-s2_datasheet_en.html
- ESP32-S3 datasheet/product entry: https://documentation.espressif.com/esp32-s3_datasheet_en.html
- ESP32-C3 datasheet/product entry: https://documentation.espressif.com/esp32-c3_datasheet_en.html
- ESP32-C6 datasheet/product entry: https://documentation.espressif.com/esp32-c6_datasheet_en.html
- ESP32-H2 datasheet/product entry: https://documentation.espressif.com/esp32-h2_datasheet_en.html
- ESP32-P4 datasheet: https://documentation.espressif.com/esp32-p4_datasheet_en.html

## Done

- [x] ESP32-S3
  - [x] QFN56, 7 x 7 mm
  - [x] ESP32-S3-DevKitC-1 v1.1 board profile
- [x] ESP32-C6
  - [x] QFN40, 5 x 5 mm
  - [x] QFN32, 5 x 5 mm

## To Do

### ESP32-S Series

- [ ] ESP32-S31
  - [ ] QFN, 8 x 8 mm
  - Note: new/early entry; confirm datasheet pin tables before implementation.
- [ ] ESP32-S3-PICO-1
  - [ ] LGA, 7 x 7 mm
  - Note: separate package/pinout from ESP32-S3 QFN56.
- [ ] ESP32-S2
  - [ ] QFN56, 7 x 7 mm

### ESP32-C Series

- [ ] ESP32-C61
  - [ ] QFN, 5 x 5 mm
- [ ] ESP32-C5
  - [ ] QFN, 6 x 6 mm
- [ ] ESP32-C3
  - [ ] QFN32, 5 x 5 mm
- [ ] ESP8685
  - [ ] QFN, 4 x 4 mm
  - Note: ESP32-C3-class product with a smaller package and different exposed GPIO count.
- [ ] ESP8684 / ESP32-C2-class
  - [ ] QFN, 4 x 4 mm

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
- Keep source links and datasheet version numbers inside each data file.
- For newer entries, verify the latest official datasheet immediately before implementation.
