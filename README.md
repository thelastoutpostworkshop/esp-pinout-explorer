# ESP Pinout Explorer

[![ESP Board Vault banner](https://github.com/thelastoutpostworkshop/images/blob/main/ESP%20Pinout%20Explorer%20banner.png)](https://www.youtube.com/channel/UCnnU_HGvTr8ewpqvHe2llDw)

<a href="https://www.buymeacoffee.com/thelastoutpostworkshop" target="_blank">
<img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee">
</a>

Current profiles:

## Board Headers And Board Views

| Family | Profile | View | Coverage | Official source |
| --- | --- | --- | --- | --- |
| ESP32 | ESP32-DevKitC V4 | Board headers | WROOM/WROVER/SOLO module identity | [ESP32-DevKitC V4 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitc/user_guide.html) |
| ESP32 | ESP32-DevKitM-1 | Board headers | MINI module identity | [ESP32-DevKitM-1 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitm-1/user_guide.html) |
| ESP32 | ESP32-Ethernet-Kit v1.2 | Board headers | WROVER-E module identity, Ethernet PHY, FT2232H bridge, optional PoE board B | [ESP32-Ethernet-Kit v1.2 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-ethernet-kit/user_guide.html) |
| ESP32 | ESP32-LCDKit | Connector groups | HMI carrier board around an attached ESP32-DevKitC V4, display/SD-card/DAC modules | [ESP32-LCDKit User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-lcdkit/user_guide.html) |
| ESP32 | ESP-WROVER-KIT v4.1 | Connector groups | WROVER-E module identity, camera/LCD/RGB/flash/JTAG allocations | [ESP-WROVER-KIT v4.1 Getting Started Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp-wrover-kit/user_guide.html) |
| ESP32 | ESP32-PICO-KIT v4/v4.1 | Board headers | PICO-D4 module identity, USB-to-UART bridge, dual 20-pad headers | [ESP32-PICO-KIT v4/v4.1 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-kit/user_guide.html) |
| ESP32 | ESP32-PICO-KIT-1 | Board headers | PICO-V3 module identity, USB-to-UART bridge, dual 18-pin headers | [ESP32-PICO-KIT-1 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-kit-1/user_guide.html) |
| ESP32 | ESP32-PICO-DevKitM-2 | Board headers | PICO-MINI module identity | [ESP32-PICO-DevKitM-2 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-devkitm-2/user_guide.html) |
| ESP32-S3 | ESP32-S3-DevKitC-1 v1.1 | Board headers | WROOM module identity | [ESP32-S3-DevKitC-1 User Guide v1.1](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitc-1/user_guide_v1.1.html) |
| ESP32-S3 | ESP32-S3-DevKitM-1 | Board headers | MINI module identity | [ESP32-S3-DevKitM-1 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-devkitm-1/user_guide.html) |
| ESP32-S3 | ESP32-S3-USB-OTG | Connector groups | Board connectors and grouped GPIO allocation | [ESP32-S3-USB-OTG User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-otg/user_guide.html) |
| ESP32-S3 | ESP32-S3-USB-Bridge | GPIO allocation | MINI module identity | [ESP32-S3-USB-Bridge User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-bridge/user_guide.html) |
| ESP32-S3 | ESP32-S3-LCD-EV-Board v1.5 | GPIO allocation | WROOM module identity, LCD/audio/expander allocation | [ESP32-S3-LCD-EV-Board v1.5 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-lcd-ev-board/user_guide.html) |
| ESP32-S3 | ESP-VoCat v1.2 | Board allocation | WROOM module identity, voice/LCD/touch/SD allocation | [ESP-VoCat v1.2 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-vocat/user_guide_v1.2.html) |
| ESP32-S3 | ESP-DualKey | Board allocation | ESP32-S3FN8, keys/mode switch/RGB/power allocation | [ESP-DualKey User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-dualkey/user_guide.html) |
| ESP32-C6 | ESP32-C6-DevKitM-1 | Board headers | MINI module identity | [ESP32-C6-DevKitM-1 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitm-1/user_guide.html) |
| ESP32-C6 | ESP32-C6-DevKitC-1 v1.2 | Board headers | WROOM module identity | [ESP32-C6-DevKitC-1 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitc-1/user_guide.html) |
| ESP32-H2 | ESP32-H2-DevKitM-1 | Board headers | MINI module identity | [ESP32-H2-DevKitM-1 User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/esp32-h2-devkitm-1/user_guide.html) |
| ESP32-P4 | ESP32-P4X-Function-EV-Board | Connector groups | ESP32-C6-MINI-1 wireless module, J1 header block, LCD/camera accessories, audio, USB, Ethernet | [ESP32-P4X-Function-EV-Board User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4x-function-ev-board/user_guide.html) |
| ESP32-P4 | ESP32-P4X-EYE | Connector groups | ESP32-C6-MINI-1U wireless module, 2 x 10 female header, LCD, camera, MicroSD, USB debug/device, battery connector | [ESP32-P4X-EYE User Guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4x-eye/user_guide.html) |
| ESP8266 | ESP8266-DevKitC | I/O connector labels | WROOM-02D/U module identity, USB-UART, Boot/EN, power constraints | [ESP8266-DevKitC Getting Started Guide](https://docs.espressif.com/projects/esp8266-rtos-sdk/en/latest/get-started/get-started-devkitc.html) |
| ESP8266 | ESP8266-DevKitS | Board headers | WROOM-02 / WROOM-02D / WROOM-02U module identity, spring-pin carrier, USB-UART, Boot/EN | [ESP8266-DevKitS User Guide](https://documentation.espressif.com/ESP8266-DevKitS_user_guide__EN.pdf) |
| ESP8266 | ESP-Launcher | Board headers | ESP8266EX reference design, USB-UART bridge, boot/reset, LEDs, infrared remote control, HSPI/SDIO | [ESP8266 Hardware Design Guidelines v2.8](https://documentation.espressif.com/esp8266_hardware_design_guidelines_en.pdf) |

## Module Pads

| Family | Profile | View | Coverage | Official source |
| --- | --- | --- | --- | --- |
| ESP32-C6 | ESP32-C6-MINI-1 and MINI-1U | Module pads | MINI module pad profiles | [ESP32-C6-MINI-1 & ESP32-C6-MINI-1U Datasheet v1.5](https://documentation.espressif.com/esp32-c6-mini-1_mini-1u_datasheet_en.pdf) |
| ESP8266 | ESP-WROOM-02D and ESP-WROOM-02U | Module pads | WROOM module pad profiles | [ESP-WROOM-02D & ESP-WROOM-02U Datasheet v2.3](https://documentation.espressif.com/esp-wroom-02u_esp-wroom-02d_datasheet_en.pdf) |

## Chip Packages

| Family | Profile | View | Coverage | Official source |
| --- | --- | --- | --- | --- |
| ESP32 | ESP32 QFN48 6 x 6 mm | Chip package | Bare SoC package pinout | [ESP32 Series Datasheet v5.2](https://documentation.espressif.com/esp32_datasheet_en.pdf) |
| ESP32-S3 | ESP32-S3 QFN56 | Chip package | Bare SoC package pinout | [ESP32-S3 Series Datasheet v2.2](https://documentation.espressif.com/esp32-s3_datasheet_en.pdf) |
| ESP32-C6 | ESP32-C6 QFN40 and QFN32 | Chip packages | Bare SoC package pinouts | [ESP32-C6 Series Datasheet v1.5](https://documentation.espressif.com/esp32-c6_datasheet_en.pdf) |
| ESP32-H2 | ESP32-H2 QFN32 4 x 4 mm | Chip package | Bare SoC package pinout | [ESP32-H2 Series Datasheet v1.2](https://documentation.espressif.com/esp32-h2_datasheet_en.pdf) |
| ESP8266 | ESP8266EX QFN32 5 x 5 mm | Chip package | Bare SoC package pinout | [ESP8266EX Datasheet v7.1](https://documentation.espressif.com/0a-esp8266ex_datasheet_en.pdf) |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for local setup, project structure, and board profile conventions.
