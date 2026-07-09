const exactDescriptions: Record<string, string> = {
  ANT: 'Antenna RF input/output pin. This is a dedicated RF analog connection, not a general GPIO.',
  BAT_VOL: 'Battery voltage monitoring signal on the development board.',
  BOOST_EN: 'Boost converter enable signal on the development board power circuit.',
  ADC: 'Analog-to-digital converter input. Use it only within the voltage range specified for this chip or board.',
  ADC_BAT: 'Battery voltage ADC monitor signal on the development board.',
  ADC_CHRG: 'Battery charge voltage ADC monitor signal on the development board.',
  ADC_VBUS: 'USB VBUS voltage ADC monitor signal on the development board.',
  Boot: 'Boot-mode control or strapping function. Holding the related signal at reset can enter download or alternate boot modes.',
  BOOT: 'Boot-mode control or strapping function. Holding the related signal at reset can enter download or alternate boot modes.',
  BUTTON_DW: 'Down button signal on the development board.',
  BUTTON_MENU: 'Menu button signal on the development board.',
  BUTTON_OK: 'OK button signal on the development board.',
  BUTTON_UP: 'Up button signal on the development board.',
  CAP1: 'External capacitor connection required by the ESP32 analog/RF circuitry. Not a GPIO.',
  CAP2: 'External capacitor/resistor connection required by the ESP32 analog/RF circuitry. Not a GPIO.',
  BOOT_TO_TARGET: 'Boot/download signal driven from the bridge board to the externally connected target chip.',
  BRIDGE_RX: 'UART receive path from the target chip TX pin into the bridge board.',
  BRIDGE_TX: 'UART transmit path from the bridge board to the target chip RX pin.',
  'BT clock input': 'Clock signal related to Bluetooth coexistence designs. It is not a general GPIO function.',
  CHIP_PU: 'Chip power-up and reset-enable input. Pulling this low resets or disables the chip.',
  CHIP_EN: 'Chip enable and reset input. High enables the chip; pulling it low resets or disables it.',
  CH_EN: 'Chip enable and reset input. High enables normal operation; pulling it low resets or disables the chip.',
  CH_PD: 'Chip enable and reset input used by ESP8266 boards that label the pin CH_PD. High enables the chip; pulling it low resets or disables it.',
  'Chip enable': 'Chip enable input. High enables normal chip operation; low disables the chip.',
  'Chip enable and reset': 'Chip enable/reset input. Pulling this signal low resets or disables the module.',
  CLK: 'SPI flash clock signal on classic ESP32 boards. This is normally reserved for the module flash.',
  CMD: 'SPI flash command signal on classic ESP32 boards. This is normally reserved for the module flash.',
  CODEC_PWR_CTRL: 'Audio codec power-control signal on the development board.',
  DAC_1: 'Digital-to-analog converter output channel 1.',
  DAC_2: 'Digital-to-analog converter output channel 2.',
  D0: 'SPI flash data 0 signal on classic ESP32 boards. This is normally reserved for the module flash.',
  D1: 'SPI flash data 1 signal on classic ESP32 boards. This is normally reserved for the module flash.',
  D2: 'SPI flash data 2 signal on classic ESP32 boards. This is normally reserved for the module flash.',
  D3: 'SPI flash data 3 signal on classic ESP32 boards. This is normally reserved for the module flash.',
  DEV_VBUS_EN: 'USB device VBUS power enable signal on the development board.',
  EN: 'Enable/reset signal for the ESP module. Pulling it low resets or disables the chip.',
  ESP_BOOT: 'Boot button or boot-mode control signal on the development board. Holding it during reset can enter download mode.',
  'External capacitor connection': 'External capacitor connection required by the chip reference circuit. Not a GPIO.',
  'External crystal input': 'External crystal oscillator input. Used with the external crystal circuit.',
  'External crystal output': 'External crystal oscillator output. Used with the external crystal circuit.',
  'Flash clock': 'SPI flash clock signal. Normally reserved for the chip or module flash memory path.',
  'Flash CS#': 'SPI flash chip-select signal. Normally reserved for the chip or module flash memory path.',
  'Flash CS0': 'SPI flash chip-select 0 signal. Normally reserved for the chip or module flash memory path.',
  'Flash DI/DQ0': 'SPI flash data input / DQ0 signal. Normally reserved for flash or wider SPI memory modes.',
  'Flash DO/DQ1': 'SPI flash data output / DQ1 signal. Normally reserved for flash or wider SPI memory modes.',
  'Flash HOLD#/DQ3': 'SPI flash hold / DQ3 signal. Normally reserved for quad or octal SPI memory.',
  'Flash HOLD#/SIO3': 'SPI flash hold / SIO3 signal. Normally reserved for quad SPI flash.',
  'Flash MISO/SIO1': 'SPI flash MISO / SIO1 signal. Normally reserved for SPI flash.',
  'Flash MOSI/SIO0': 'SPI flash MOSI / SIO0 signal. Normally reserved for SPI flash.',
  'Flash WP#/DQ2': 'SPI flash write-protect / DQ2 signal. Normally reserved for quad or octal SPI memory.',
  'Flash WP#/SIO2': 'SPI flash write-protect / SIO2 signal. Normally reserved for quad SPI flash.',
  Free: 'Free or currently unassigned board signal listed by the official guide. Confirm the board schematic before relying on it.',
  FREE_1: 'Extended board pin listed as idle/customizable in the official guide.',
  FREE_2: 'Extended board pin listed as idle/customizable in the official guide.',
  FREE_3: 'Extended board pin listed as idle/customizable in the official guide.',
  FREE_4: 'Extended board pin listed as idle/customizable in the official guide.',
  FREE_5: 'Extended board pin listed as idle/customizable in the official guide.',
  FREE_6: 'Extended board pin listed as idle/customizable in the official guide.',
  FSPICLK: 'Fast SPI clock signal. Often used for flash, PSRAM, or high-speed SPI connections.',
  FSPICS0: 'Fast SPI chip-select 0 signal. Commonly used as a chip-select line for SPI memory or peripherals.',
  FSPICS1: 'Fast SPI chip-select 1 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS2: 'Fast SPI chip-select 2 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS3: 'Fast SPI chip-select 3 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS4: 'Fast SPI chip-select 4 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS5: 'Fast SPI chip-select 5 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPID: 'Fast SPI data output signal, also commonly labeled MOSI or DQ0 depending on bus mode.',
  FSPIHD: 'Fast SPI HOLD or DQ3 signal, commonly used by quad/octal SPI memory.',
  FSPIQ: 'Fast SPI data input signal, also commonly labeled MISO or DQ1 depending on bus mode.',
  FSPIWP: 'Fast SPI write-protect or DQ2 signal, commonly used by quad/octal SPI memory.',
  FSPIDQS: 'Fast SPI data strobe or data-mask signal, commonly used by octal SPI memory.',
  HOST_VOL: 'USB device voltage monitoring signal on the development board.',
  HSPICS: 'ESP8266 HSPI chip-select signal for the secondary SPI interface.',
  CRS_DV: 'Ethernet RMII carrier-sense / receive-data-valid signal.',
  HREF: 'Camera horizontal reference signal.',
  IMU_INT1: 'Interrupt signal from the inertial measurement unit on the development board.',
  'Internal 1.1 V RTC power': 'Internal RTC-domain supply or no-connect style pin. Follow the official reference design instead of using it as GPIO.',
  'Deep-sleep wakeup': 'Wake-up signal used to bring the ESP8266 out of deep sleep, usually by wiring GPIO16 / XPD_DCDC to reset.',
  KEY_1: 'User key 1 signal on the development board.',
  KEY_2: 'User key 2 signal on the development board.',
  LED: 'On-board LED signal. Using this GPIO can also affect the board LED.',
  LCD_BL: 'LCD backlight control signal on the development board.',
  LCD_BLK: 'LCD backlight control signal on the development board.',
  LCD_CS: 'LCD chip-select signal on the development board.',
  LCD_DC: 'LCD data/command select signal on the development board.',
  LCD_EN: 'LCD enable signal on the development board.',
  LCD_DE: 'LCD data-enable signal on the development board display interface.',
  LCD_HSYNC: 'LCD horizontal sync signal on the development board display interface.',
  LCD_PCLK: 'LCD pixel clock signal on the development board display interface.',
  LCD_RET: 'LCD reset signal on the development board.',
  LCD_RST_CTRL: 'LCD reset control signal on the development board.',
  LCD_SCL: 'LCD serial clock signal on the development board display interface.',
  LCD_SCLK: 'LCD SPI clock signal on the development board.',
  LCD_SDA: 'LCD SPI MOSI/data signal on the development board.',
  LCD_SDO: 'LCD SPI MISO/data-out signal on the development board.',
  LCD_TE: 'LCD tearing-effect synchronization signal on the development board display interface.',
  LCD_VSYNC: 'LCD vertical sync signal on the development board display interface.',
  SD_CLK: 'SD card clock signal on the development board.',
  SD_CMD: 'SD card command signal on the development board.',
  SD_D0: 'SD card data 0 signal on the development board.',
  SD_DA0: 'SD card data 0 signal on the development board. The official table uses this label spelling.',
  LED_GREEN: 'On-board green LED signal.',
  LED_YELLOW: 'On-board yellow LED signal.',
  LIMIT_EN: 'Current-limiting circuit enable signal on the development board.',
  LNA_IN: 'Low-noise amplifier RF antenna interface. This is a dedicated RF analog connection, not a general GPIO.',
  LNA: 'Low-noise amplifier RF antenna interface. This is a dedicated RF analog connection, not a general GPIO.',
  MTCK: 'JTAG test clock signal. Also used by some boot/debug configurations on supported chips.',
  MTDI: 'JTAG test data input signal. Also used by some boot/debug configurations on supported chips.',
  MTDO: 'JTAG test data output signal. Also used by some boot/debug configurations on supported chips.',
  MTMS: 'JTAG test mode select signal. Also used by some boot/debug configurations on supported chips.',
  MODULE_BOOT: 'Module boot button signal on the bridge board. Holding it during power-up enters module download mode.',
  MDC: 'Ethernet PHY management clock signal.',
  MDIO: 'Ethernet PHY management data signal.',
  NC: 'No-connect pad or header position. The official table does not assign an electrical function to it.',
  'No connect': 'No-connect pad. The official module pin table does not assign an electrical function to it.',
  'No connection': 'No-connect header pin. The official board table does not assign an electrical function to it.',
  PA_CTRL: 'Power-amplifier control signal on the development board audio or RF-related circuit.',
  PCLK: 'Camera pixel clock signal.',
  POWER_CTRL: 'Power-control signal on the development board.',
  PWR_2812: 'Power-control signal for addressable RGB LEDs on the development board.',
  EXT_RSTB: 'External reset signal. Pulling this signal low resets the chip.',
  'External reset': 'External reset input. Pulling this signal low resets the chip.',
  RESET_TO_TARGET: 'Reset signal driven from the bridge board to the externally connected target chip.',
  RES12K: 'Bias/reference pin that must be connected through the datasheet-specified resistor to ground.',
  RESET: 'Reset signal. Pulling this signal low resets the related chip, module, or board circuit.',
  RST: 'Reset signal. Pulling this signal low resets the related chip, module, or board circuit.',
  Reset: 'Board reset function connected to the module enable/reset signal.',
  TRST_N: 'Active-low JTAG target reset signal.',
  'RGB LED': 'Addressable RGB LED on the development board. Using this GPIO can also affect the on-board LED.',
  '0VER_CURRENT': 'Current overrun signal on the development board. The official guide labels it with a leading zero.',
  SD_D1: 'SD card data 1 signal on the development board.',
  SD_D2: 'SD card data 2 signal on the development board.',
  SD_D3: 'SD card SPI chip-select or SDIO data 3 signal on the development board.',
  SD_DATA0: 'SD card or SDIO data 0 signal.',
  SD_DATA1: 'SD card or SDIO data 1 signal.',
  SD_DATA2: 'SD card or SDIO data 2 signal.',
  SD_DATA3: 'SD card or SDIO data 3 signal.',
  SD_DO: 'SD card SPI MISO or SDIO data 0 signal on the development board.',
  SD_SCK: 'SD card SPI or SDIO clock signal on the development board.',
  SD_DET: 'SD card detect signal on the development board.',
  SENSOR_CAPP: 'Analog sensor capacitor positive input on classic ESP32. This is input-only.',
  SENSOR_CAPN: 'Analog sensor capacitor negative input on classic ESP32. This is input-only.',
  SENSOR_VN: 'Analog sensor negative input on classic ESP32. This is input-only.',
  SENSOR_VP: 'Analog sensor positive input on classic ESP32. This is input-only.',
  S_VN: 'Analog sensor negative input on classic ESP32. This is input-only.',
  S_VP: 'Analog sensor positive input on classic ESP32. This is input-only.',
  SPICLK: 'SPI flash/PSRAM clock signal. Usually reserved when external flash or PSRAM uses this package pin.',
  SPICS0: 'SPI flash chip-select 0 signal. Usually reserved for external flash on many ESP32 packages.',
  SPICS1: 'SPI chip-select 1 signal. Often related to external PSRAM or an additional SPI memory device.',
  SPID: 'SPI flash data input/MOSI/DQ0 signal. Usually reserved when external flash uses this package pin.',
  SPIHD: 'SPI flash HOLD or DQ3 signal. Usually reserved when quad SPI flash or PSRAM uses this pin.',
  SPIQ: 'SPI flash data output/MISO/DQ1 signal. Usually reserved when external flash uses this package pin.',
  SPIWP: 'SPI flash write-protect or DQ2 signal. Usually reserved when quad SPI flash or PSRAM uses this pin.',
  SPIDQS: 'SPI data strobe or data-mask signal, commonly used by octal SPI memory.',
  SPICLK_N: 'Differential SPI clock negative signal used by high-speed SPI memory interfaces.',
  SPICLK_P: 'Differential SPI clock positive signal used by high-speed SPI memory interfaces.',
  SPICLK_N_DIFF: 'Differential SPI clock negative signal used by high-speed SPI memory interfaces.',
  SPICLK_P_DIFF: 'Differential SPI clock positive signal used by high-speed SPI memory interfaces.',
  'Supply voltage': 'Supply-voltage connection or monitor signal. Follow the board guide before wiring external power.',
  SWITCH_1: 'Mode-switch signal 1 on the development board.',
  SWITCH_2: 'Mode-switch signal 2 on the development board.',
  'TXD[0]': 'Ethernet RMII transmit-data bit 0 signal.',
  'TXD[1]': 'Ethernet RMII transmit-data bit 1 signal.',
  'RXD[0]': 'Ethernet RMII receive-data bit 0 signal.',
  'RXD[1]': 'Ethernet RMII receive-data bit 1 signal.',
  TX_EN: 'Ethernet RMII transmit-enable signal.',
  REF_CLK: 'Ethernet RMII reference clock signal.',
  Reset_N: 'Active-low Ethernet PHY reset signal.',
  '50M_CLKO': '50 MHz clock output from the Ethernet PHY for RMII reference-clock use.',
  TCK: 'JTAG target clock signal used by the bridge adapter.',
  TDI: 'JTAG target data-input signal used by the bridge adapter.',
  TDO: 'JTAG target data-output signal used by the bridge adapter.',
  TMS: 'JTAG target mode-select signal used by the bridge adapter.',
  T_CLK: 'Touch-controller clock signal on the development board.',
  T_CS: 'Touch-controller chip-select signal on the development board.',
  T_DIN: 'Touch-controller data-input signal on the development board.',
  T_DO: 'Touch-controller data-output signal on the development board.',
  T_IRQ: 'Touch-controller interrupt signal on the development board.',
  TOUT: 'ESP8266 analog ADC input. It can measure either external TOUT voltage or the chip supply voltage calibration path, not both at once.',
  TP_INT: 'Touch-panel interrupt signal on the development board.',
  UART0_CTS: 'UART0 clear-to-send flow-control signal.',
  UART0_RTS: 'UART0 request-to-send flow-control signal.',
  UART0_RXD: 'UART0 receive-data signal used for serial communication and ESP8266 download workflows.',
  UART0_TXD: 'UART0 transmit-data signal used for serial communication and ESP8266 download workflows.',
  UART1_TXD: 'UART1 transmit-data signal on ESP8266.',
  UART_RXD0: 'UART0 receive-data signal. Often used for serial console, flashing, or module communication.',
  UART_TXD0: 'UART0 transmit-data signal. Often used for serial console, flashing, or module communication.',
  'UART flash TX': 'UART transmit signal used during ESP8266 flashing or serial boot workflows.',
  UART1_RX: 'UART1 receive-data signal on the development board.',
  VSYNC: 'Camera vertical sync signal.',
  VDD_SPI: 'SPI flash or external-memory power-supply rail. Follow datasheet voltage requirements before connecting it.',
  'VDD_SPI flash power': 'SPI flash power-supply rail. Follow datasheet voltage requirements before connecting it.',
  'VDD_SPI voltage strapping': 'Strapping function that selects or constrains the VDD_SPI memory power voltage.',
  WS2812: 'Addressable RGB LED data signal on the development board.',
  WS2812_IN: 'Addressable RGB LED data input signal on the development board.',
  XCLK: 'Camera external clock signal.',
  XTAL_N: 'Main crystal negative clock input/output. Used with the external crystal oscillator circuit.',
  XTAL_P: 'Main crystal positive clock input/output. Used with the external crystal oscillator circuit.',
  XTAL_IN: 'Main crystal oscillator input. Used with the external crystal circuit.',
  XTAL_OUT: 'Main crystal oscillator output. Used with the external crystal circuit.',
  XTAL_32K_N: '32 kHz crystal negative input/output. Used for an optional low-power clock crystal.',
  XTAL_32K_P: '32 kHz crystal positive input/output. Used for an optional low-power clock crystal.',
  XPD_DCDC: 'ESP8266 deep-sleep wake signal and GPIO16 package pin. It is commonly connected to EXT_RSTB for timed wakeup.',
  USB_SEL: 'USB interface switch signal on the development board.',
  VBAT: 'Battery or backup power-supply input. Follow the board guide power options before connecting it.',
  VDET_1: 'Analog voltage-detection input on classic ESP32. This GPIO is input-only.',
  VDET_2: 'Analog voltage-detection input on classic ESP32. This GPIO is input-only.',
  ZCD0: 'Zero-cross or voltage-detection analog input channel.',
  ZCD1: 'Zero-cross or voltage-detection analog input channel.',
  '32K_XP': '32.768 kHz crystal oscillator positive pin. Used for an optional low-power timing crystal.',
  '32K_XN': '32.768 kHz crystal oscillator negative pin. Used for an optional low-power timing crystal.',
  Blue: 'Blue channel of an on-board RGB LED. Using this GPIO can also affect the board LED.',
  SIO_C: 'Camera SCCB clock signal.',
  SIO_D: 'Camera SCCB data signal.',
  CAM_SCCB_CLK: 'Camera SCCB clock signal.',
  CAM_SCCB_DAT: 'Camera SCCB data signal.',
  CAM_VSYNC: 'Camera vertical sync signal.',
  CAM_HREF: 'Camera horizontal reference signal.',
  CAM_PCLK: 'Camera pixel clock signal.',
  CAM_XCLK: 'Camera system clock signal.',
  CAM_RESET: 'Camera reset control signal.',
  CAM_PWDN: 'Camera power-down control signal.',
  Green: 'Green channel of an on-board RGB LED. Using this GPIO can also affect the board LED.',
  Red: 'Red channel of an on-board RGB LED. Using this GPIO can also affect the board LED.',
};

const phraseDescriptions: Array<[RegExp, string]> = [
  [/^3\.3 V power supply$/i, '3.3 V board power rail. Use according to the board guide power-supply options.'],
  [/^3\.3 V module power supply$/i, '3.3 V module power rail. Use according to the module datasheet or board guide.'],
  [/^5 V power supply$/i, '5 V board power rail. Use according to the board guide power-supply options.'],
  [/^(?:ground|gnd)$/i, 'Ground reference pin for the board or module.'],
  [/^3\.3 V .*power input$/i, 'Power-supply input pin for the named chip domain. Connect according to the datasheet power requirements.'],
  [/^analog power input$/i, 'Analog-domain power-supply input pin. This is not a GPIO.'],
  [/^analog power(?: supply| [\d.]+ V to [\d.]+ V)$/i, 'Analog-domain power-supply pin. This is not a GPIO.'],
  [/^amplifier power [\d.]+ V to [\d.]+ V$/i, 'RF or analog amplifier power-supply pin. This is not a GPIO.'],
  [/^battery power supply$/i, 'Battery power-supply input. Follow the datasheet or board guide before connecting it.'],
  [/^(?:cpu io|rtc io|vdd_sdio) power supply$/i, 'Chip I/O power-supply rail. Follow the datasheet power-domain requirements.'],
  [/^(?:hp digital|lp digital and analog pin) power input$/i, 'Chip power-domain input. Connect according to the datasheet power requirements.'],
  [/^io power domain input$/i, 'Chip I/O power-domain input. Connect according to the datasheet power requirements.'],
  [/^digital\/io power [\d.]+ V to [\d.]+ V$/i, 'Digital I/O power-supply pin. This is not a GPIO.'],
  [/^power supply$/i, 'Power-supply connection. Follow the official board guide before wiring external power.'],
  [/^exposed ground pad$/i, 'Exposed thermal/electrical ground pad. It should be connected to ground according to the package guidance.'],
  [/^flash\/psram/i, 'Function related to external flash or PSRAM memory. These pins may be reserved or constrained on boards using external memory.'],
  [/^boot mode strapping$/i, 'Boot strapping function sampled during reset to select a chip boot mode. Avoid external circuits that force the wrong level at boot.'],
  [/^jtag signal source strapping$/i, 'Strapping function that affects which JTAG signal source is selected during boot.'],
  [/^rom message control$/i, 'Boot ROM message-control function sampled during reset. It can affect startup serial logging behavior.'],
  [/^chip power-up and reset enable$/i, 'Chip enable/reset control. Pulling this signal low resets or disables the chip.'],
  [/^(?:rf|antenna rf|low noise amplifier).*input\/output$/i, 'Dedicated RF analog input/output connection for the radio path, not a general GPIO.'],
  [/^rf antenna interface$/i, 'Dedicated RF antenna interface for the radio path, not a general GPIO.'],
  [/^main crystal .*clock input\/output$/i, 'Main crystal oscillator connection used by the chip clock circuit.'],
  [/^32 kHz crystal/i, 'Optional 32 kHz crystal oscillator connection for low-power timing.'],
  [/^CAM_D[0-7]$/i, 'Camera pixel data bus bit signal.'],
];

export function getFunctionDescription(name: string): string | null {
  const normalized = name.trim();

  if (exactDescriptions[normalized]) {
    return exactDescriptions[normalized];
  }

  if (/^GPIO\d+$/.test(normalized)) {
    return `${normalized} is a general-purpose digital I/O signal. Check this pin's maker warnings and board design notes before using it for a project.`;
  }

  if (/^RTC_GPIO\d+$/.test(normalized)) {
    return `${normalized} is a GPIO signal in the RTC/low-power domain, useful for some sleep and wake workflows.`;
  }

  if (/^LP_GPIO\d+$/.test(normalized)) {
    return `${normalized} is a low-power domain GPIO signal that can be used by LP peripherals on supported chips.`;
  }

  if (/^ADC\d_CH\d+$/.test(normalized)) {
    return `${normalized} is an analog-to-digital converter input channel. Use it to measure analog voltages within the chip's supported range.`;
  }

  if (/^TOUCH\d+$/.test(normalized)) {
    return `${normalized} is a capacitive touch-sensing channel.`;
  }

  if (/^U\d(TXD|RXD|RTS|CTS)$/.test(normalized)) {
    const [, signal] = normalized.match(/^U\d(TXD|RXD|RTS|CTS)$/) ?? [];
    const meanings: Record<string, string> = {
      TXD: 'transmit data',
      RXD: 'receive data',
      RTS: 'request-to-send flow control',
      CTS: 'clear-to-send flow control',
    };
    return `${normalized} is a UART ${meanings[signal]} signal.`;
  }

  if (/^H2 GPIO\d+$/.test(normalized)) {
    return `${normalized} is a GPIO signal on the ESP32-H2 radio co-processor side of this board.`;
  }

  if (/^H2 (?:RXD|TXD)\d$/.test(normalized)) {
    return `${normalized} is a UART signal on the ESP32-H2 radio co-processor side of this board.`;
  }

  if (/^UART\d?$/.test(normalized)) {
    return `${normalized} is a UART peripheral function family that can carry serial TX, RX, and flow-control signals.`;
  }

  if (/^LP_UART_/.test(normalized)) {
    return `${normalized} is a low-power UART signal.`;
  }

  if (/^LP_I2C_(SDA|SCL)$/.test(normalized)) {
    return `${normalized} is a low-power I2C ${normalized.endsWith('SDA') ? 'data' : 'clock'} signal.`;
  }

  if (/^SAR I2C (SDA|SCL)\d$/.test(normalized)) {
    return `${normalized} is an internal SAR ADC control-bus signal, not the usual application I2C peripheral.`;
  }

  if (/^sar_i2c_(sda|scl)_\d$/i.test(normalized)) {
    return `${normalized} is an internal SAR ADC control-bus signal, not the usual application I2C peripheral.`;
  }

  if (/^CLK_OUT\d$/.test(normalized)) {
    return `${normalized} is a configurable clock output signal.`;
  }

  if (/^USB_D[+-]$/.test(normalized)) {
    return `${normalized} is a native USB differential data signal. Keep USB routing and pin restrictions in mind.`;
  }

  if (/^EMAC_[A-Z0-9_]+$/.test(normalized)) {
    return 'Ethernet MAC signal used for an external Ethernet PHY. Check the board schematic and PHY wiring before reusing it.';
  }

  if (normalized === 'Ethernet') {
    return 'Ethernet peripheral function family. These signals are used with an external Ethernet PHY on supported chips or boards.';
  }

  if (/^SDIO_(CMD|CLK|DATA_?\d)$/.test(normalized)) {
    return `${normalized} is an SDIO interface signal.`;
  }

  if (/^SDIO$/.test(normalized)) {
    return 'SDIO peripheral function family, commonly used for SD cards or memory-style interfaces.';
  }

  if (/^SD\/MMC$/.test(normalized)) {
    return 'SD/MMC peripheral function family used for SD cards or eMMC-style storage interfaces.';
  }

  if (/^SPI_(CS\d|CLK|MISO|MOSI)$/.test(normalized)) {
    return `${normalized} is a general SPI signal. Check flash-memory warnings before reusing SPI pins.`;
  }

  if (/^SPI\d?$/.test(normalized)) {
    return `${normalized} is an SPI peripheral function family. Check flash and board warnings before reusing SPI-related pins.`;
  }

  if (/^HSPI(_CLK|_MISO|_MOSI|_CS|HD|WP)?$/.test(normalized)) {
    return `${normalized} is an ESP8266 HSPI signal for the secondary SPI interface.`;
  }

  if (/^HSPI(CLK|CS\d?|D|Q|HD|WP)$/.test(normalized)) {
    return `${normalized} is an HSPI signal for the secondary SPI interface on classic ESP chips.`;
  }

  if (/^HS[12]_(CLK|CMD|STROBE|DATA[0-7])$/.test(normalized)) {
    return `${normalized} is a high-speed SDIO/SPI-style signal used by classic ESP32 host interfaces.`;
  }

  if (/^VSPI(CLK|CS\d?|D|Q|HD|WP)$/.test(normalized)) {
    return `${normalized} is a VSPI signal for the classic ESP32 SPI peripheral.`;
  }

  if (/^I2C_(SDA|SCL)$/.test(normalized)) {
    return `${normalized} is an I2C ${normalized.endsWith('SDA') ? 'data' : 'clock'} signal.`;
  }

  if (/^I2C$/.test(normalized)) {
    return 'I2C peripheral function family for two-wire serial data and clock signals.';
  }

  if (/^I2S[IO]_(DATA|BCK|WS)$/.test(normalized)) {
    return `${normalized} is an I2S audio/data interface signal.`;
  }

  if (/^I2S$/.test(normalized)) {
    return 'I2S peripheral function family for digital audio or synchronous serial data signals.';
  }

  if (/^I2S_(MCLK|SCLK|BCK|WS|LRCK|DI|DO|ADC_SDOUT|CODEC_DSDIN)$/.test(normalized)) {
    return `${normalized} is an I2S digital audio interface signal.`;
  }

  if (/^PWM\d$/.test(normalized)) {
    return `${normalized} is a pulse-width modulation output signal.`;
  }

  if (normalized === 'PWM') {
    return 'PWM peripheral function family for pulse-width modulation outputs.';
  }

  if (normalized === 'LED PWM') {
    return 'LED PWM peripheral function family for dimming LEDs or generating PWM outputs.';
  }

  if (/^IR (TX|Rx)$/.test(normalized)) {
    return `${normalized} is an infrared remote-control ${normalized.endsWith('TX') ? 'transmit' : 'receive'} signal.`;
  }

  if (normalized === 'IR Remote Control') {
    return 'Infrared remote-control peripheral function family for IR transmit and receive signals.';
  }

  if (normalized === 'MCPWM') {
    return 'Motor-control PWM peripheral function family for multi-channel PWM drive signals.';
  }

  if (normalized === 'PCNT') {
    return 'Pulse-counter peripheral function family for counting input pulses.';
  }

  if (normalized === 'RMT') {
    return 'Remote-control timing peripheral function family, often used for precise pulse protocols such as addressable LEDs or IR.';
  }

  if (normalized === 'TWAI') {
    return 'TWAI is Espressif’s CAN-compatible controller peripheral function family.';
  }

  if (normalized === 'PARLIO') {
    return 'Parallel I/O peripheral function family for high-speed parallel data signals on supported chips.';
  }

  if (/^SPIIO\d$/.test(normalized)) {
    return `${normalized} is an extra SPI data line used by wider SPI memory modes such as octal SPI.`;
  }

  if (/^SUBSPI/.test(normalized)) {
    return `${normalized} is a secondary SPI signal available through the IO MUX on this pin.`;
  }

  if (/^FSPIIO\d$/.test(normalized)) {
    return `${normalized} is a Fast SPI data line used by wider SPI memory or peripheral modes.`;
  }

  if (/^Octal SPI DQ[4-7]$/.test(normalized)) {
    return `${normalized} is an octal SPI memory data line. It is usually reserved when octal flash or PSRAM is fitted.`;
  }

  if (normalized === 'Octal SPI DQS/DM') {
    return 'Octal SPI data-strobe or data-mask signal. It is usually reserved when octal flash or PSRAM is fitted.';
  }

  if (/^LCD$/.test(normalized)) {
    return 'LCD peripheral function family for display data, control, and timing signals.';
  }

  if (/^LCD_DATA\d+$/.test(normalized)) {
    return `${normalized} is a parallel LCD data bus signal on the development board display interface.`;
  }

  if (/^LCD_SDA[0-3]$/.test(normalized)) {
    return `${normalized} is an LCD QSPI data signal on the development board display interface.`;
  }

  if (/^LCD_SPI_(CS|MOSI|SCK)$/.test(normalized)) {
    return `${normalized} is an LCD SPI control or data signal on the development board.`;
  }

  if (normalized === 'Camera') {
    return 'Camera peripheral function family for pixel data, clocks, and synchronization signals.';
  }

  if (/^TOUCH_PAD\d+$/.test(normalized)) {
    return `${normalized} is a capacitive touch-pad signal on the development board.`;
  }

  for (const [pattern, description] of phraseDescriptions) {
    if (pattern.test(normalized)) {
      return description;
    }
  }

  return null;
}
