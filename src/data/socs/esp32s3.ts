import type { PinPosition, PinType, PinWarning, SocDefinition, SocPin } from '@/types/soc';

const source = {
  title: 'ESP32-S3 Series Datasheet',
  version: 'v2.2',
  url: 'https://documentation.espressif.com/esp32-s3_datasheet_en.pdf',
  sections: [
    'Figure 2-1 ESP32-S3 Pin Layout (Top View)',
    'Table 2-1 Pin Overview',
    'Table 2-2 Power-Up Glitches on Pins',
    'Table 2-4 IO MUX Functions',
    'Table 2-6 RTC Functions',
    'Table 2-8 Analog Functions',
    'Section 2.3.4 Restrictions for GPIOs and RTC_GPIOs',
    'Table 2-14 Pin Mapping Between Chip and Flash or PSRAM',
    'Table 3-1 Default Configuration of Strapping Pins',
    'Table 3-3 Chip Boot Mode Control',
    'Table 3-4 VDD_SPI Voltage Control',
    'Table 3-5 JTAG Signal Source Control',
  ],
};

const gpioMatrixSignals = [
  'I2C',
  'UART2',
  'TWAI',
  'LED PWM',
  'I2S',
  'LCD',
  'Camera',
  'SPI3',
  'SD/MMC',
  'MCPWM',
  'RMT',
  'PCNT',
];

const lowGlitch = 'Power-up low-level glitch for about 60 us.';
const highGlitch = 'Power-up high-level glitch for about 60 us.';
const usbHighGlitch =
  'Power-up high-level glitches occur twice; Espressif lists about 3.2 ms total duration and about 2 ms delay.';

const flashPsramAllocated =
  'Allocated or recommended for SPI0/1 flash/PSRAM. Do not reuse if connected to in-package flash/PSRAM.';
const octalMemoryCaution =
  'Used by SPI0/1 as higher data or DQS in 8-line flash/PSRAM mode; usable as GPIO only when that memory mode is not used.';
const usbCaution =
  'USB_D pins are connected to USB Serial/JTAG by default and need IO MUX reconfiguration before regular GPIO use.';
const jtagCaution = 'JTAG debug signal; freeing these pins may require using USB Serial/JTAG instead.';
const uart0Caution = 'UART0 is commonly used for boot messages, flashing, and serial debugging.';

function id(number: number) {
  return `esp32s3-pin-${number}`;
}

function pin(
  number: number,
  name: string,
  type: PinType,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position'>> = {},
): SocPin {
  return {
    id: id(number),
    number,
    name,
    type,
    position,
    mainFunctions: [],
    ...details,
  };
}

function io(
  number: number,
  name: string,
  gpio: number,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position' | 'gpio'>> = {},
): SocPin {
  return pin(number, name, 'io', position, {
    gpio,
    matrixSignals: gpioMatrixSignals,
    ...details,
  });
}

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

export const esp32s3: SocDefinition = {
  id: 'esp32s3',
  name: 'ESP32-S3',
  family: 'ESP32',
  packageName: 'QFN56 (7 x 7 mm), top view',
  description: 'ESP32-S3 Wi-Fi + Bluetooth LE SoC pinout MVP.',
  source,
  pins: [
    pin(1, 'LNA_IN', 'analog', { side: 'left', order: 1 }, {
      mainFunctions: ['RF LNA input/output'],
      analog: ['Low Noise Amplifier input/output'],
      notes: ['Dedicated RF analog pin, not a GPIO.'],
      keywords: ['antenna', 'rf', 'lna', 'analog'],
    }),
    pin(2, 'VDD3P3', 'power', { side: 'left', order: 2 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(3, 'VDD3P3', 'power', { side: 'left', order: 3 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(4, 'CHIP_PU', 'analog', { side: 'left', order: 4 }, {
      mainFunctions: ['Chip power-up and reset enable'],
      notes: [
        'High enables the chip; low disables or resets it.',
        'Do not leave CHIP_PU floating.',
        'Hold CHIP_PU low for at least 50 us to reset the chip.',
      ],
      warnings: warnings('reset'),
      keywords: ['enable', 'reset', 'chip pu', 'power up', 'en'],
    }),
    io(5, 'GPIO0', 0, { side: 'left', order: 5 }, {
      mainFunctions: ['GPIO0', 'RTC_GPIO0', 'SAR I2C SCL0'],
      ioMux: ['GPIO0'],
      rtc: ['RTC_GPIO0', 'sar_i2c_scl_0'],
      notes: [
        'Strapping pin with default weak pull-up.',
        'Controls boot mode with GPIO46; GPIO0=0 and GPIO46=0 selects joint download boot mode.',
      ],
      warnings: warnings('strapping', 'boot'),
      keywords: ['boot', 'download', 'strap', 'strapping', 'rtc', 'sar i2c'],
    }),
    io(6, 'GPIO1', 1, { side: 'left', order: 6 }, {
      mainFunctions: ['GPIO1', 'RTC_GPIO1', 'TOUCH1', 'ADC1_CH0', 'SAR I2C SDA0'],
      ioMux: ['GPIO1'],
      rtc: ['RTC_GPIO1', 'sar_i2c_sda_0'],
      analog: ['TOUCH1', 'ADC1_CH0'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc', 'sar i2c'],
    }),
    io(7, 'GPIO2', 2, { side: 'left', order: 7 }, {
      mainFunctions: ['GPIO2', 'RTC_GPIO2', 'TOUCH2', 'ADC1_CH1', 'SAR I2C SCL1'],
      ioMux: ['GPIO2'],
      rtc: ['RTC_GPIO2', 'sar_i2c_scl_1'],
      analog: ['TOUCH2', 'ADC1_CH1'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc', 'sar i2c'],
    }),
    io(8, 'GPIO3', 3, { side: 'left', order: 8 }, {
      mainFunctions: ['GPIO3', 'RTC_GPIO3', 'TOUCH3', 'ADC1_CH2', 'SAR I2C SDA1'],
      ioMux: ['GPIO3'],
      rtc: ['RTC_GPIO3', 'sar_i2c_sda_1'],
      analog: ['TOUCH3', 'ADC1_CH2'],
      notes: [
        'Strapping pin for JTAG signal source selection; default is floating.',
        'Espressif notes GPIO3 has no internal pull resistors and the external circuit must not be high impedance during strapping.',
        lowGlitch,
      ],
      warnings: warnings('strapping', 'jtag', 'glitch'),
      keywords: ['adc1', 'touch', 'rtc', 'strap', 'strapping', 'jtag', 'sar i2c'],
    }),
    io(9, 'GPIO4', 4, { side: 'left', order: 9 }, {
      mainFunctions: ['GPIO4', 'RTC_GPIO4', 'TOUCH4', 'ADC1_CH3'],
      ioMux: ['GPIO4'],
      rtc: ['RTC_GPIO4'],
      analog: ['TOUCH4', 'ADC1_CH3'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc'],
    }),
    io(10, 'GPIO5', 5, { side: 'left', order: 10 }, {
      mainFunctions: ['GPIO5', 'RTC_GPIO5', 'TOUCH5', 'ADC1_CH4'],
      ioMux: ['GPIO5'],
      rtc: ['RTC_GPIO5'],
      analog: ['TOUCH5', 'ADC1_CH4'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc'],
    }),
    io(11, 'GPIO6', 6, { side: 'left', order: 11 }, {
      mainFunctions: ['GPIO6', 'RTC_GPIO6', 'TOUCH6', 'ADC1_CH5'],
      ioMux: ['GPIO6'],
      rtc: ['RTC_GPIO6'],
      analog: ['TOUCH6', 'ADC1_CH5'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc'],
    }),
    io(12, 'GPIO7', 7, { side: 'left', order: 12 }, {
      mainFunctions: ['GPIO7', 'RTC_GPIO7', 'TOUCH7', 'ADC1_CH6'],
      ioMux: ['GPIO7'],
      rtc: ['RTC_GPIO7'],
      analog: ['TOUCH7', 'ADC1_CH6'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc'],
    }),
    io(13, 'GPIO8', 8, { side: 'left', order: 13 }, {
      mainFunctions: ['GPIO8', 'RTC_GPIO8', 'TOUCH8', 'ADC1_CH7', 'SUBSPICS1'],
      ioMux: ['GPIO8', 'SUBSPICS1'],
      rtc: ['RTC_GPIO8'],
      analog: ['TOUCH8', 'ADC1_CH7'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc', 'spi', 'subspi'],
    }),
    io(14, 'GPIO9', 9, { side: 'left', order: 14 }, {
      mainFunctions: ['GPIO9', 'RTC_GPIO9', 'TOUCH9', 'ADC1_CH8', 'SUBSPIHD', 'FSPIHD'],
      ioMux: ['GPIO9', 'SUBSPIHD', 'FSPIHD'],
      rtc: ['RTC_GPIO9'],
      analog: ['TOUCH9', 'ADC1_CH8'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc', 'spi', 'subspi', 'fspi'],
    }),
    io(15, 'GPIO10', 10, { side: 'bottom', order: 1 }, {
      mainFunctions: ['GPIO10', 'RTC_GPIO10', 'TOUCH10', 'ADC1_CH9', 'FSPIIO4', 'SUBSPICS0', 'FSPICS0'],
      ioMux: ['GPIO10', 'FSPIIO4', 'SUBSPICS0', 'FSPICS0'],
      rtc: ['RTC_GPIO10'],
      analog: ['TOUCH10', 'ADC1_CH9'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc1', 'touch', 'rtc', 'spi', 'subspi', 'fspi'],
    }),
    io(16, 'GPIO11', 11, { side: 'bottom', order: 2 }, {
      mainFunctions: ['GPIO11', 'RTC_GPIO11', 'TOUCH11', 'ADC2_CH0', 'FSPIIO5', 'SUBSPID', 'FSPID'],
      ioMux: ['GPIO11', 'FSPIIO5', 'SUBSPID', 'FSPID'],
      rtc: ['RTC_GPIO11'],
      analog: ['TOUCH11', 'ADC2_CH0'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc2', 'touch', 'rtc', 'spi', 'subspi', 'fspi'],
    }),
    io(17, 'GPIO12', 12, { side: 'bottom', order: 3 }, {
      mainFunctions: ['GPIO12', 'RTC_GPIO12', 'TOUCH12', 'ADC2_CH1', 'FSPIIO6', 'SUBSPICLK', 'FSPICLK'],
      ioMux: ['GPIO12', 'FSPIIO6', 'SUBSPICLK', 'FSPICLK'],
      rtc: ['RTC_GPIO12'],
      analog: ['TOUCH12', 'ADC2_CH1'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc2', 'touch', 'rtc', 'spi', 'subspi', 'fspi', 'clock'],
    }),
    io(18, 'GPIO13', 13, { side: 'bottom', order: 4 }, {
      mainFunctions: ['GPIO13', 'RTC_GPIO13', 'TOUCH13', 'ADC2_CH2', 'FSPIIO7', 'SUBSPIQ', 'FSPIQ'],
      ioMux: ['GPIO13', 'FSPIIO7', 'SUBSPIQ', 'FSPIQ'],
      rtc: ['RTC_GPIO13'],
      analog: ['TOUCH13', 'ADC2_CH2'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc2', 'touch', 'rtc', 'spi', 'subspi', 'fspi'],
    }),
    io(19, 'GPIO14', 14, { side: 'bottom', order: 5 }, {
      mainFunctions: ['GPIO14', 'RTC_GPIO14', 'TOUCH14', 'ADC2_CH3', 'FSPIDQS', 'SUBSPIWP', 'FSPIWP'],
      ioMux: ['GPIO14', 'FSPIDQS', 'SUBSPIWP', 'FSPIWP'],
      rtc: ['RTC_GPIO14'],
      analog: ['TOUCH14', 'ADC2_CH3'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc2', 'touch', 'rtc', 'spi', 'subspi', 'fspi', 'dqs'],
    }),
    pin(20, 'VDD3P3_RTC', 'power', { side: 'bottom', order: 6 }, {
      mainFunctions: ['3.3 V RTC and partial digital power input'],
      notes: ['Supplies RTC IO and part of the digital power domains.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'rtc'],
    }),
    io(21, 'XTAL_32K_P', 15, { side: 'bottom', order: 7 }, {
      mainFunctions: ['GPIO15', 'RTC_GPIO15', '32 kHz crystal positive', 'ADC2_CH4', 'U0RTS'],
      ioMux: ['GPIO15', 'U0RTS'],
      rtc: ['RTC_GPIO15'],
      analog: ['XTAL_32K_P', 'ADC2_CH4'],
      notes: ['Package pin name is XTAL_32K_P; GPIO identity is GPIO15.', lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['gpio15', 'adc2', 'rtc', 'xtal', '32k', 'uart0', 'rts'],
    }),
    io(22, 'XTAL_32K_N', 16, { side: 'bottom', order: 8 }, {
      mainFunctions: ['GPIO16', 'RTC_GPIO16', '32 kHz crystal negative', 'ADC2_CH5', 'U0CTS'],
      ioMux: ['GPIO16', 'U0CTS'],
      rtc: ['RTC_GPIO16'],
      analog: ['XTAL_32K_N', 'ADC2_CH5'],
      notes: ['Package pin name is XTAL_32K_N; GPIO identity is GPIO16.', lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['gpio16', 'adc2', 'rtc', 'xtal', '32k', 'uart0', 'cts'],
    }),
    io(23, 'GPIO17', 17, { side: 'bottom', order: 9 }, {
      mainFunctions: ['GPIO17', 'RTC_GPIO17', 'ADC2_CH6', 'U1TXD'],
      ioMux: ['GPIO17', 'U1TXD'],
      rtc: ['RTC_GPIO17'],
      analog: ['ADC2_CH6'],
      notes: [lowGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc2', 'rtc', 'uart1', 'txd'],
    }),
    io(24, 'GPIO18', 18, { side: 'bottom', order: 10 }, {
      mainFunctions: ['GPIO18', 'RTC_GPIO18', 'ADC2_CH7', 'U1RXD', 'CLK_OUT3'],
      ioMux: ['GPIO18', 'U1RXD', 'CLK_OUT3'],
      rtc: ['RTC_GPIO18'],
      analog: ['ADC2_CH7'],
      notes: [lowGlitch, highGlitch],
      warnings: warnings('glitch'),
      keywords: ['adc2', 'rtc', 'uart1', 'rxd', 'clock'],
    }),
    io(25, 'GPIO19', 19, { side: 'bottom', order: 11 }, {
      mainFunctions: ['GPIO19', 'RTC_GPIO19', 'USB_D-', 'ADC2_CH8', 'U1RTS', 'CLK_OUT2'],
      ioMux: ['GPIO19', 'U1RTS', 'CLK_OUT2'],
      rtc: ['RTC_GPIO19'],
      analog: ['USB_D-', 'ADC2_CH8'],
      notes: [usbCaution, lowGlitch, usbHighGlitch],
      warnings: warnings('usb', 'glitch'),
      keywords: ['usb', 'usb d-', 'usb dm', 'serial jtag', 'otg', 'adc2', 'uart1', 'rts'],
    }),
    io(26, 'GPIO20', 20, { side: 'bottom', order: 12 }, {
      mainFunctions: ['GPIO20', 'RTC_GPIO20', 'USB_D+', 'ADC2_CH9', 'U1CTS', 'CLK_OUT1'],
      ioMux: ['GPIO20', 'U1CTS', 'CLK_OUT1'],
      rtc: ['RTC_GPIO20'],
      analog: ['USB_D+', 'ADC2_CH9'],
      notes: [usbCaution, 'Power-up pull-down glitch for about 60 us.', usbHighGlitch],
      warnings: warnings('usb', 'glitch'),
      keywords: ['usb', 'usb d+', 'usb dp', 'serial jtag', 'otg', 'adc2', 'uart1', 'cts'],
    }),
    io(27, 'GPIO21', 21, { side: 'bottom', order: 13 }, {
      mainFunctions: ['GPIO21', 'RTC_GPIO21'],
      ioMux: ['GPIO21'],
      rtc: ['RTC_GPIO21'],
      keywords: ['rtc'],
    }),
    io(28, 'SPICS1', 26, { side: 'bottom', order: 14 }, {
      mainFunctions: ['GPIO26', 'SPICS1', 'Flash/PSRAM CS1'],
      ioMux: ['SPICS1', 'GPIO26'],
      notes: [flashPsramAllocated, 'CS1 is for in-package PSRAM.'],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'spics1', 'flash', 'psram', 'memory', 'cs1', 'gpio26'],
    }),
    pin(29, 'VDD_SPI', 'power', { side: 'right', order: 14 }, {
      mainFunctions: ['Flash/PSRAM SPI IO power'],
      notes: [
        'Backup power line for in-package memory and flash/PSRAM SPI IO.',
        'VDD_SPI voltage is controlled by eFuse settings and GPIO45 strapping.',
      ],
      warnings: warnings('power', 'voltage', 'flash-psram'),
      keywords: ['power', 'supply', 'spi', 'flash', 'psram', 'memory', 'vdd spi'],
    }),
    io(30, 'SPIHD', 27, { side: 'right', order: 13 }, {
      mainFunctions: ['GPIO27', 'SPIHD', 'Flash HOLD#/DQ3'],
      ioMux: ['SPIHD', 'GPIO27'],
      notes: [flashPsramAllocated],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'flash', 'psram', 'memory', 'hold', 'dq3', 'gpio27'],
    }),
    io(31, 'SPIWP', 28, { side: 'right', order: 12 }, {
      mainFunctions: ['GPIO28', 'SPIWP', 'Flash WP#/DQ2'],
      ioMux: ['SPIWP', 'GPIO28'],
      notes: [flashPsramAllocated],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'flash', 'psram', 'memory', 'wp', 'dq2', 'gpio28'],
    }),
    io(32, 'SPICS0', 29, { side: 'right', order: 11 }, {
      mainFunctions: ['GPIO29', 'SPICS0', 'Flash CS0'],
      ioMux: ['SPICS0', 'GPIO29'],
      notes: [flashPsramAllocated, 'CS0 is for in-package flash.'],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'flash', 'psram', 'memory', 'cs0', 'gpio29'],
    }),
    io(33, 'SPICLK', 30, { side: 'right', order: 10 }, {
      mainFunctions: ['GPIO30', 'SPICLK', 'Flash/PSRAM clock'],
      ioMux: ['SPICLK', 'GPIO30'],
      notes: [flashPsramAllocated],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'flash', 'psram', 'memory', 'clock', 'clk', 'gpio30'],
    }),
    io(34, 'SPIQ', 31, { side: 'right', order: 9 }, {
      mainFunctions: ['GPIO31', 'SPIQ', 'Flash DO/DQ1'],
      ioMux: ['SPIQ', 'GPIO31'],
      notes: [flashPsramAllocated],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'flash', 'psram', 'memory', 'dq1', 'miso', 'gpio31'],
    }),
    io(35, 'SPID', 32, { side: 'right', order: 8 }, {
      mainFunctions: ['GPIO32', 'SPID', 'Flash DI/DQ0'],
      ioMux: ['SPID', 'GPIO32'],
      notes: [flashPsramAllocated],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'flash', 'psram', 'memory', 'dq0', 'mosi', 'gpio32'],
    }),
    io(36, 'SPICLK_N', 48, { side: 'right', order: 7 }, {
      mainFunctions: ['GPIO48', 'SPICLK_N_DIFF', 'SUBSPICLK_N_DIFF'],
      ioMux: ['SPICLK_N_DIFF', 'GPIO48', 'SUBSPICLK_N_DIFF'],
      notes: ['Differential SPI/SUBSPI negative clock.', 'On ESP32-S3R8V and ESP32-S3R16V, this pin can operate at 1.8 V.'],
      warnings: warnings('voltage'),
      keywords: ['spi', 'subspi', 'clock', 'clk', 'differential', 'gpio48'],
    }),
    io(37, 'SPICLK_P', 47, { side: 'right', order: 6 }, {
      mainFunctions: ['GPIO47', 'SPICLK_P_DIFF', 'SUBSPICLK_P_DIFF'],
      ioMux: ['SPICLK_P_DIFF', 'GPIO47', 'SUBSPICLK_P_DIFF'],
      notes: ['Differential SPI/SUBSPI positive clock.', 'On ESP32-S3R8V and ESP32-S3R16V, this pin can operate at 1.8 V.'],
      warnings: warnings('voltage'),
      keywords: ['spi', 'subspi', 'clock', 'clk', 'differential', 'gpio47'],
    }),
    io(38, 'GPIO33', 33, { side: 'right', order: 5 }, {
      mainFunctions: ['GPIO33', 'FSPIHD', 'SUBSPIHD', 'SPIIO4', 'Octal SPI DQ4'],
      ioMux: ['GPIO33', 'FSPIHD', 'SUBSPIHD', 'SPIIO4'],
      notes: [octalMemoryCaution],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'fspi', 'subspi', 'flash', 'psram', 'memory', 'dq4'],
    }),
    io(39, 'GPIO34', 34, { side: 'right', order: 4 }, {
      mainFunctions: ['GPIO34', 'FSPICS0', 'SUBSPICS0', 'SPIIO5', 'Octal SPI DQ5'],
      ioMux: ['GPIO34', 'FSPICS0', 'SUBSPICS0', 'SPIIO5'],
      notes: [octalMemoryCaution],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'fspi', 'subspi', 'flash', 'psram', 'memory', 'dq5'],
    }),
    io(40, 'GPIO35', 35, { side: 'right', order: 3 }, {
      mainFunctions: ['GPIO35', 'FSPID', 'SUBSPID', 'SPIIO6', 'Octal SPI DQ6'],
      ioMux: ['GPIO35', 'FSPID', 'SUBSPID', 'SPIIO6'],
      notes: [octalMemoryCaution],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'fspi', 'subspi', 'flash', 'psram', 'memory', 'dq6'],
    }),
    io(41, 'GPIO36', 36, { side: 'right', order: 2 }, {
      mainFunctions: ['GPIO36', 'FSPICLK', 'SUBSPICLK', 'SPIIO7', 'Octal SPI DQ7'],
      ioMux: ['GPIO36', 'FSPICLK', 'SUBSPICLK', 'SPIIO7'],
      notes: [octalMemoryCaution],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'fspi', 'subspi', 'flash', 'psram', 'memory', 'dq7', 'clock'],
    }),
    io(42, 'GPIO37', 37, { side: 'right', order: 1 }, {
      mainFunctions: ['GPIO37', 'FSPIQ', 'SUBSPIQ', 'SPIDQS', 'Octal SPI DQS/DM'],
      ioMux: ['GPIO37', 'FSPIQ', 'SUBSPIQ', 'SPIDQS'],
      notes: [octalMemoryCaution],
      warnings: warnings('flash-psram'),
      keywords: ['spi', 'fspi', 'subspi', 'flash', 'psram', 'memory', 'dqs', 'dm'],
    }),
    io(43, 'GPIO38', 38, { side: 'top', order: 14 }, {
      mainFunctions: ['GPIO38', 'FSPIWP', 'SUBSPIWP'],
      ioMux: ['GPIO38', 'FSPIWP', 'SUBSPIWP'],
      keywords: ['spi', 'fspi', 'subspi', 'wp'],
    }),
    io(44, 'MTCK', 39, { side: 'top', order: 13 }, {
      mainFunctions: ['GPIO39', 'MTCK', 'CLK_OUT3', 'SUBSPICS1'],
      ioMux: ['MTCK', 'GPIO39', 'CLK_OUT3', 'SUBSPICS1'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['jtag', 'debug', 'test clock', 'clock', 'subspi', 'gpio39'],
    }),
    io(45, 'MTDO', 40, { side: 'top', order: 12 }, {
      mainFunctions: ['GPIO40', 'MTDO', 'CLK_OUT2'],
      ioMux: ['MTDO', 'GPIO40', 'CLK_OUT2'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['jtag', 'debug', 'test data out', 'clock', 'gpio40'],
    }),
    pin(46, 'VDD3P3_CPU', 'power', { side: 'top', order: 11 }, {
      mainFunctions: ['3.3 V digital CPU power input'],
      notes: ['Digital power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'cpu', 'digital'],
    }),
    io(47, 'MTDI', 41, { side: 'top', order: 10 }, {
      mainFunctions: ['GPIO41', 'MTDI', 'CLK_OUT1'],
      ioMux: ['MTDI', 'GPIO41', 'CLK_OUT1'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['jtag', 'debug', 'test data in', 'clock', 'gpio41'],
    }),
    io(48, 'MTMS', 42, { side: 'top', order: 9 }, {
      mainFunctions: ['GPIO42', 'MTMS'],
      ioMux: ['MTMS', 'GPIO42'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['jtag', 'debug', 'test mode select', 'gpio42'],
    }),
    io(49, 'U0TXD', 43, { side: 'top', order: 8 }, {
      mainFunctions: ['GPIO43', 'U0TXD', 'CLK_OUT1'],
      ioMux: ['U0TXD', 'GPIO43', 'CLK_OUT1'],
      notes: [uart0Caution, 'ROM boot messages print to UART0 by default unless configured otherwise.'],
      warnings: warnings('uart0'),
      keywords: ['uart0', 'serial', 'debug', 'boot log', 'txd', 'gpio43'],
    }),
    io(50, 'U0RXD', 44, { side: 'top', order: 7 }, {
      mainFunctions: ['GPIO44', 'U0RXD', 'CLK_OUT2'],
      ioMux: ['U0RXD', 'GPIO44', 'CLK_OUT2'],
      notes: [uart0Caution],
      warnings: warnings('uart0'),
      keywords: ['uart0', 'serial', 'debug', 'flash', 'rxd', 'gpio44'],
    }),
    io(51, 'GPIO45', 45, { side: 'top', order: 6 }, {
      mainFunctions: ['GPIO45', 'VDD_SPI voltage strapping'],
      ioMux: ['GPIO45'],
      notes: [
        'Strapping pin with default weak pull-down.',
        'Participates in VDD_SPI voltage selection: default GPIO45=0 selects 3.3 V when eFuse does not force another value.',
      ],
      warnings: warnings('strapping', 'voltage'),
      keywords: ['strap', 'strapping', 'vdd spi', 'voltage', 'boot', 'gpio45'],
    }),
    io(52, 'GPIO46', 46, { side: 'top', order: 5 }, {
      mainFunctions: ['GPIO46', 'Boot mode strapping', 'ROM message control'],
      ioMux: ['GPIO46'],
      notes: [
        'Strapping pin with default weak pull-down.',
        'Controls boot mode with GPIO0; GPIO0=0 and GPIO46=0 selects joint download boot mode.',
        'Also participates in ROM message printing control.',
      ],
      warnings: warnings('strapping', 'boot'),
      keywords: ['strap', 'strapping', 'boot', 'download', 'rom messages', 'gpio46'],
    }),
    pin(53, 'XTAL_N', 'analog', { side: 'top', order: 4 }, {
      mainFunctions: ['Main crystal negative clock input/output'],
      analog: ['XTAL_N'],
      notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
    }),
    pin(54, 'XTAL_P', 'analog', { side: 'top', order: 3 }, {
      mainFunctions: ['Main crystal positive clock input/output'],
      analog: ['XTAL_P'],
      notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
    }),
    pin(55, 'VDDA', 'power', { side: 'top', order: 2 }, {
      mainFunctions: ['Analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'analog', 'vdda'],
    }),
    pin(56, 'VDDA', 'power', { side: 'top', order: 1 }, {
      mainFunctions: ['Analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'analog', 'vdda'],
    }),
    pin(57, 'GND', 'ground', { side: 'center', order: 1 }, {
      mainFunctions: ['Exposed ground pad'],
      notes: ['External ground connection.'],
      warnings: warnings('power'),
      keywords: ['ground', 'gnd', 'epad', 'thermal pad'],
    }),
  ],
};
