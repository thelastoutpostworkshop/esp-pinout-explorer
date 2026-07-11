# ESP Pinout Explorer

[![ESP Board Vault banner](https://github.com/thelastoutpostworkshop/images/blob/main/ESP%20Pinout%20Explorer%20banner.png)](https://www.youtube.com/channel/UCnnU_HGvTr8ewpqvHe2llDw)

<a href="https://www.buymeacoffee.com/thelastoutpostworkshop" target="_blank">
<img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee">
</a>

An interactive, bench-side reference for choosing ESP pins before wires, boot straps, USB signals, and on-board hardware get in the way.

[Open the ESP Pinout Explorer](https://thelastoutpostworkshop.github.io/ESPSocsExplorer/)

## What makers can do with it

- Match an ESP development board, module, or bare chip package to the view you need.
- Find GPIO, analog, bus, boot, USB, UART, JTAG, and power-related pins with search and quick filters.
- See the board header position, silkscreen label, GPIO number, main functions, and documented constraints for a selected pin.
- Spot practical conflicts such as boot/strapping pins, USB, UART0, flash, PSRAM, reset, voltage, and on-board hardware.
- Follow a pin or profile back to its official Espressif datasheet, user guide, schematic, or documentation page.

## Start at the bench

1. Choose the exact **ESP chip** and **Board / module / chip profile**. If the text printed on the module is what you can identify, use **Module marking** to find a matching profile.
2. Prefer an exact board revision and module variant before choosing a header pin. A GPIO that is usable on a bare chip may be tied to an LED, USB, flash, PSRAM, or a boot circuit on a board.
3. Search for a GPIO number, board label, function, or caution--for example `GPIO4`, `ADC`, `I2C`, `boot`, `USB`, or `RGB LED`. Search highlights matching pins and dims the rest.
4. Click a pin. Its detail panel gives a maker decision summary, header and silkscreen identity, functions, warnings, notes, and a link to the official source.
5. Open **Profile info & Variants** when you need help identifying a board or module, checking variant differences, or finding the profile's source material.

## Pick the right view

| View | Use it when | Keep in mind |
| --- | --- | --- |
| **Dev board** | You are wiring a development board or its exposed connectors. | This is the best starting point for most projects: it includes header labels and board-specific hardware conflicts. |
| **Module pads** | You are designing or wiring around an ESP module PCB. | These are module pads, not development-board headers. |
| **Chip package** | You are working from a bare SoC datasheet or designing a custom board. | Package pins can differ substantially from module pads and dev-board headers. |

## Read warnings before wiring

The yellow `!` marker identifies a **maker warning**: a documented caution that is likely to affect normal development-board use, such as boot or strapping behavior, USB, UART0, reset, flash, PSRAM, voltage, or on-board hardware. Less immediate board-design cautions remain visible in the pin details as **Board Design Notes**.

The **Safe use** quick filter is a first-pass shortlist of exposed board-header GPIOs with no recorded maker or flash warning. It is not an approval stamp: still confirm whether a pin is input-only, whether its voltage and pull requirements fit your circuit, and whether the selected peripheral or firmware configuration introduces another constraint.

When a pin looks surprising, use its source link and the profile information before connecting hardware. Do not assume that a similar-looking board, module, or package has the same usable pins.

## Supported hardware

The explorer currently covers these official Espressif board, module, and package views. Board profiles are the recommended starting point when you have a ready-made dev board in hand.

| Family | Development-board profiles | Module-pad and chip-package views |
| --- | --- | --- |
| **ESP32** | ESP32-DevKitC V4; ESP32-DevKitM-1; ESP32-Ethernet-Kit v1.2; ESP32-LCDKit; ESP-WROVER-KIT v4.1; ESP32-PICO-KIT v4/v4.1; ESP32-PICO-KIT-1; ESP32-PICO-DevKitM-2 | ESP32 QFN48, 6 x 6 mm |
| **ESP32-S3** | ESP32-S3-DevKitC-1 v1.1; ESP32-S3-DevKitM-1; ESP32-S3-USB-OTG; ESP32-S3-USB-Bridge; ESP Thread Border Router / Zigbee Gateway v1.2; ESP32-S3-LCD-EV-Board v1.5; ESP-VoCat v1.2; ESP-DualKey | ESP32-S3 QFN56 |
| **ESP32-C6** | ESP32-C6-DevKitM-1; ESP32-C6-DevKitC-1 v1.2 | ESP32-C6-MINI-1 and MINI-1U module pads; ESP32-C6 QFN40 and QFN32 |
| **ESP32-H2** | ESP32-H2-DevKitM-1 | ESP32-H2 QFN32, 4 x 4 mm |
| **ESP32-P4** | ESP32-P4X-Function-EV-Board; ESP32-P4X-EYE; ESP32-P4-Function-EV-Board v1.5.2; ESP32-P4-EYE | Board allocation views only; a complete bare ESP32-P4 package view is not yet included. |
| **ESP8266EX** | ESP8266-DevKitC; ESP8266-DevKitS; ESP-Launcher | ESP-WROOM-02D and ESP-WROOM-02U module pads; ESP8266EX QFN32, 5 x 5 mm |

## Data sources and limits

Accuracy is more important than coverage. Pin and board data is based on official Espressif datasheets, board user guides, schematics, and documentation. Each profile and selected pin links back to its source.

The SVG diagrams are interactive reference maps, not schematics or mechanically exact board layouts. The explorer does not infer a profile from a product photo, third-party pinout graphic, or a related board. If your exact hardware is not listed, check the official documentation rather than treating a close match as interchangeable. Planned coverage is tracked in [todo.md](todo.md).

## Run locally or contribute

For setup details, the data model, and contribution conventions, see [CONTRIBUTING.md](CONTRIBUTING.md).

## Support


