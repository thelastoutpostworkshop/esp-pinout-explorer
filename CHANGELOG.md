# Changelog

All notable changes to ESP Pinout Explorer are documented here.

## 0.5.8

### Added

- Added the ESP8285 QFN32 chip profile with embedded-flash and NRND guidance from Espressif's v2.7 datasheet.

## 0.5.7

### Added

- Added the ESP32-S31 QFN80 package and ESP32-S31-Function-CoreBoard-1 J2 header profile from Espressif's preliminary v0.5 documentation.

## 0.5.6 

### Fixed

- Corrected the ESP8266EX QFN32 top-view pin order to match the official datasheet. ([#3](https://github.com/thelastoutpostworkshop/esp-pinout-explorer/issues/3))

## 0.5.5 

### Initial public release

- Released the interactive ESP pin, development-board header, module-pad, and chip-package explorer for public use.
- Added searchable, clickable SVG pinout views with selected-pin details, documented warnings, and links to official Espressif sources.
- Included maker-focused guidance for boot and strapping pins, USB, UART0, flash, PSRAM, reset, voltage, and on-board hardware constraints.
- Added board-profile quick filters, including a conservative **Safe use** shortlist for exposed board-header GPIOs.
- Published coverage for ESP32, ESP32-S3, ESP32-C6, ESP32-C5, ESP32-C3, ESP32-H2, ESP32-P4, and ESP8266EX profiles listed in the README.

[0.5.5]: https://github.com/thelastoutpostworkshop/esp-pinout-explorer/releases/tag/v0.5.5
