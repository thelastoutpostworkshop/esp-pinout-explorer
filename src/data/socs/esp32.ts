import { createEsp32DevKitCV4Profile, createEsp32DevKitM1Profile } from '@/data/boards/esp32';
import type { PinPosition, PinType, PinWarning, SocDefinition, SocPin, SocSource } from '@/types/soc';

const source: SocSource = {
  title: 'ESP32 Series Datasheet',
  version: 'v5.2',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32_datasheet_en.pdf',
  sections: [
    'Figure 2-1 ESP32 Pin Layout (QFN 6 x 6, Top View)',
    'Table 2-1 Pin Overview',
    'Section 2.3.1 Restrictions for GPIOs and RTC_GPIOs',
    'Table 2-2 Analog Pins',
    'Table 2-3 Power Pins',
    'Table 2-5 Pin-to-Pin Mapping Between Chip and In-Package Flash/PSRAM',
    'Table 2-6 Pin-to-Pin Mapping Between Chip and Off-Package Flash/PSRAM',
    'Table 3-1 Default Configuration of Strapping Pins',
    'Table 3-3 Chip Boot Mode Control',
    'Table 3-4 U0TXD Printing Control',
    'Table 3-5 Timing Control of SDIO Slave',
    'Table 4-6 Peripheral Pin Configurations',
  ],
};


const gpioMatrixSignals = [
  'I2C',
  'UART',
  'SPI',
  'I2S',
  'LED PWM',
  'RMT',
  'MCPWM',
  'PCNT',
  'TWAI',
  'SDIO',
  'Ethernet',
];

const inputOnlyCaution =
  'Input-only GPIO. This pin does not support digital output or internal pull-up/pull-down resistors.';
const flashCaution =
  'Used internally for communication between ESP32 and SPI flash memory. Avoid using this pin, as it may disrupt flash access.';
const jtagCaution = 'JTAG debug signal; using it as regular GPIO can interfere with JTAG workflows.';
const uart0Caution = 'UART0 is commonly used for boot messages, flashing, and serial debugging.';
const strappingCaution = 'Strapping pin sampled during reset. External circuits must not force the wrong boot-time level.';
const vddSdioCaution = 'MTDI/GPIO12 controls VDD_SDIO voltage at reset unless overridden by eFuse settings.';

function warnings(...items: PinWarning[]) {
  return items;
}

function id(number: number) {
  return `esp32-pin-${number}`;
}

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
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
    keywords: uniqueValues([name.toLowerCase(), ...(details.keywords ?? [])]),
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
    matrixSignals: details.matrixSignals ?? gpioMatrixSignals,
    ...details,
    keywords: uniqueValues([`gpio${gpio}`, `io${gpio}`, ...(details.keywords ?? [])]),
  });
}

export const esp32: SocDefinition = {
  id: 'esp32',
  name: 'ESP32',
  family: 'Classic ESP32',
  defaultPackageId: 'esp32-qfn48-6x6',
  defaultProfileId: 'esp32-devkitc-v4',
  chipSpecs: {
    cpu: 'Dual-core 32-bit Xtensa LX6 CPU up to 240 MHz; ESP32-SOLO-1 module variants use a single-core LX6 CPU.',
  },
  packageName: 'ESP32 QFN48, 6 x 6 mm',
  description: 'Classic ESP32 Wi-Fi + Bluetooth SoC package.',
  source,
  pins: [
    pin(1, 'VDDA', 'power', { side: 'left', order: 1 }, {
      mainFunctions: ['Analog power supply'],
      notes: ['Analog power supply, 2.3 V to 3.6 V.'],
      warnings: warnings('power'),
      keywords: ['power', 'analog', 'supply'],
    }),
    pin(2, 'LNA_IN', 'analog', { side: 'left', order: 2 }, {
      mainFunctions: ['RF input/output'],
      analog: ['LNA_IN'],
      notes: ['Low Noise Amplifier input and Power Amplifier output signal. Not a general GPIO.'],
      keywords: ['rf', 'antenna', 'lna', 'pa'],
    }),
    pin(3, 'VDD3P3', 'power', { side: 'left', order: 3 }, {
      mainFunctions: ['Analog power supply'],
      notes: ['Analog power supply, 2.3 V to 3.6 V.'],
      warnings: warnings('power'),
      keywords: ['power', '3v3', 'analog', 'supply'],
    }),
    pin(4, 'VDD3P3', 'power', { side: 'left', order: 4 }, {
      mainFunctions: ['Analog power supply'],
      notes: ['Analog power supply, 2.3 V to 3.6 V.'],
      warnings: warnings('power'),
      keywords: ['power', '3v3', 'analog', 'supply'],
    }),
    io(5, 'SENSOR_VP', 36, { side: 'left', order: 5 }, {
      mainFunctions: ['GPIO36', 'ADC1_CH0', 'RTC_GPIO0', 'S_VP'],
      ioMux: ['GPIO36'],
      rtc: ['RTC_GPIO0'],
      analog: ['ADC1_CH0', 'S_VP'],
      notes: [inputOnlyCaution],
      keywords: ['adc1', 'sensor vp', 's vp', 'input only'],
    }),
    io(6, 'SENSOR_CAPP', 37, { side: 'left', order: 6 }, {
      mainFunctions: ['GPIO37', 'ADC1_CH1', 'RTC_GPIO1', 'SENSOR_CAPP'],
      ioMux: ['GPIO37'],
      rtc: ['RTC_GPIO1'],
      analog: ['ADC1_CH1', 'SENSOR_CAPP'],
      notes: [inputOnlyCaution],
      keywords: ['adc1', 'sensor capp', 'input only'],
    }),
    io(7, 'SENSOR_CAPN', 38, { side: 'left', order: 7 }, {
      mainFunctions: ['GPIO38', 'ADC1_CH2', 'RTC_GPIO2', 'SENSOR_CAPN'],
      ioMux: ['GPIO38'],
      rtc: ['RTC_GPIO2'],
      analog: ['ADC1_CH2', 'SENSOR_CAPN'],
      notes: [inputOnlyCaution],
      keywords: ['adc1', 'sensor capn', 'input only'],
    }),
    io(8, 'SENSOR_VN', 39, { side: 'left', order: 8 }, {
      mainFunctions: ['GPIO39', 'ADC1_CH3', 'RTC_GPIO3', 'S_VN'],
      ioMux: ['GPIO39'],
      rtc: ['RTC_GPIO3'],
      analog: ['ADC1_CH3', 'S_VN'],
      notes: [inputOnlyCaution],
      keywords: ['adc1', 'sensor vn', 's vn', 'input only'],
    }),
    pin(9, 'CHIP_PU', 'control', { side: 'left', order: 9 }, {
      mainFunctions: ['CHIP_PU', 'Reset'],
      notes: ['High enables the chip; low powers it off or resets it.', 'Do not leave CHIP_PU floating.'],
      warnings: warnings('reset'),
      keywords: ['enable', 'reset', 'chip pu', 'en'],
    }),
    io(10, 'VDET_1', 34, { side: 'left', order: 10 }, {
      mainFunctions: ['GPIO34', 'ADC1_CH6', 'RTC_GPIO4', 'VDET_1'],
      ioMux: ['GPIO34'],
      rtc: ['RTC_GPIO4'],
      analog: ['ADC1_CH6', 'VDET_1'],
      notes: [inputOnlyCaution],
      keywords: ['adc1', 'vdet', 'input only'],
    }),
    io(11, 'VDET_2', 35, { side: 'left', order: 11 }, {
      mainFunctions: ['GPIO35', 'ADC1_CH7', 'RTC_GPIO5', 'VDET_2'],
      ioMux: ['GPIO35'],
      rtc: ['RTC_GPIO5'],
      analog: ['ADC1_CH7', 'VDET_2'],
      notes: [inputOnlyCaution],
      keywords: ['adc1', 'vdet', 'input only'],
    }),
    io(12, '32K_XP', 32, { side: 'left', order: 12 }, {
      mainFunctions: ['GPIO32', 'ADC1_CH4', 'RTC_GPIO9', 'TOUCH9', '32K_XP'],
      ioMux: ['GPIO32'],
      rtc: ['RTC_GPIO9'],
      analog: ['ADC1_CH4', 'TOUCH9', '32K_XP'],
      keywords: ['adc1', 'touch', '32k', 'crystal'],
    }),
    io(13, '32K_XN', 33, { side: 'bottom', order: 1 }, {
      mainFunctions: ['GPIO33', 'ADC1_CH5', 'RTC_GPIO8', 'TOUCH8', '32K_XN'],
      ioMux: ['GPIO33'],
      rtc: ['RTC_GPIO8'],
      analog: ['ADC1_CH5', 'TOUCH8', '32K_XN'],
      keywords: ['adc1', 'touch', '32k', 'crystal'],
    }),
    io(14, 'GPIO25', 25, { side: 'bottom', order: 2 }, {
      mainFunctions: ['GPIO25', 'ADC2_CH8', 'RTC_GPIO6', 'DAC_1', 'EMAC_RXD0'],
      ioMux: ['GPIO25', 'EMAC_RXD0'],
      rtc: ['RTC_GPIO6'],
      analog: ['ADC2_CH8', 'DAC_1'],
      keywords: ['adc2', 'dac', 'ethernet', 'emac'],
    }),
    io(15, 'GPIO26', 26, { side: 'bottom', order: 3 }, {
      mainFunctions: ['GPIO26', 'ADC2_CH9', 'RTC_GPIO7', 'DAC_2', 'EMAC_RXD1'],
      ioMux: ['GPIO26', 'EMAC_RXD1'],
      rtc: ['RTC_GPIO7'],
      analog: ['ADC2_CH9', 'DAC_2'],
      keywords: ['adc2', 'dac', 'ethernet', 'emac'],
    }),
    io(16, 'GPIO27', 27, { side: 'bottom', order: 4 }, {
      mainFunctions: ['GPIO27', 'ADC2_CH7', 'RTC_GPIO17', 'TOUCH7', 'EMAC_RX_DV'],
      ioMux: ['GPIO27', 'EMAC_RX_DV'],
      rtc: ['RTC_GPIO17'],
      analog: ['ADC2_CH7', 'TOUCH7'],
      keywords: ['adc2', 'touch', 'ethernet', 'emac'],
    }),
    io(17, 'MTMS', 14, { side: 'bottom', order: 5 }, {
      mainFunctions: ['GPIO14', 'ADC2_CH6', 'RTC_GPIO16', 'TOUCH6', 'MTMS'],
      ioMux: ['GPIO14', 'MTMS', 'HSPICLK', 'HS2_CLK', 'SD_CLK'],
      rtc: ['RTC_GPIO16'],
      analog: ['ADC2_CH6', 'TOUCH6'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['adc2', 'touch', 'jtag', 'mtms', 'sdio', 'hspi'],
    }),
    io(18, 'MTDI', 12, { side: 'bottom', order: 6 }, {
      mainFunctions: ['GPIO12', 'ADC2_CH5', 'RTC_GPIO15', 'TOUCH5', 'MTDI'],
      ioMux: ['GPIO12', 'MTDI', 'HSPIQ', 'HS2_DATA2', 'SD_DATA2'],
      rtc: ['RTC_GPIO15'],
      analog: ['ADC2_CH5', 'TOUCH5'],
      notes: [strappingCaution, vddSdioCaution, jtagCaution],
      warnings: warnings('strapping', 'voltage', 'jtag'),
      keywords: ['adc2', 'touch', 'jtag', 'mtdi', 'strap', 'strapping', 'vdd sdio', 'sdio', 'hspi'],
    }),
    pin(19, 'VDD3P3_RTC', 'power', { side: 'bottom', order: 7 }, {
      mainFunctions: ['RTC IO power supply'],
      notes: ['Input power supply for RTC IO, 2.3 V to 3.6 V.'],
      warnings: warnings('power'),
      keywords: ['power', 'rtc', 'supply'],
    }),
    io(20, 'MTCK', 13, { side: 'bottom', order: 8 }, {
      mainFunctions: ['GPIO13', 'ADC2_CH4', 'RTC_GPIO14', 'TOUCH4', 'MTCK'],
      ioMux: ['GPIO13', 'MTCK', 'HSPID', 'HS2_DATA3', 'SD_DATA3'],
      rtc: ['RTC_GPIO14'],
      analog: ['ADC2_CH4', 'TOUCH4'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['adc2', 'touch', 'jtag', 'mtck', 'sdio', 'hspi'],
    }),
    io(21, 'MTDO', 15, { side: 'bottom', order: 9 }, {
      mainFunctions: ['GPIO15', 'ADC2_CH3', 'RTC_GPIO13', 'TOUCH3', 'MTDO'],
      ioMux: ['GPIO15', 'MTDO', 'HSPICS0', 'HS2_CMD', 'SD_CMD'],
      rtc: ['RTC_GPIO13'],
      analog: ['ADC2_CH3', 'TOUCH3'],
      notes: [strappingCaution, 'Controls U0TXD printing and SDIO slave timing at reset.', jtagCaution],
      warnings: warnings('strapping', 'jtag'),
      keywords: ['adc2', 'touch', 'jtag', 'mtdo', 'strap', 'strapping', 'sdio', 'uart0'],
    }),
    io(22, 'GPIO2', 2, { side: 'bottom', order: 10 }, {
      mainFunctions: ['GPIO2', 'ADC2_CH2', 'RTC_GPIO12', 'TOUCH2'],
      ioMux: ['GPIO2', 'HSPIWP', 'HS2_DATA0', 'SD_DATA0'],
      rtc: ['RTC_GPIO12'],
      analog: ['ADC2_CH2', 'TOUCH2'],
      notes: [strappingCaution, 'Controls boot mode with GPIO0.'],
      warnings: warnings('strapping', 'boot'),
      keywords: ['adc2', 'touch', 'strap', 'strapping', 'boot', 'sdio', 'hspi'],
    }),
    io(23, 'GPIO0', 0, { side: 'bottom', order: 11 }, {
      mainFunctions: ['GPIO0', 'ADC2_CH1', 'RTC_GPIO11', 'TOUCH1', 'Boot'],
      ioMux: ['GPIO0', 'CLK_OUT1', 'EMAC_TX_CLK'],
      rtc: ['RTC_GPIO11'],
      analog: ['ADC2_CH1', 'TOUCH1'],
      notes: [strappingCaution, 'GPIO0=0 and GPIO2=0 selects Joint Download Boot mode.'],
      warnings: warnings('strapping', 'boot'),
      keywords: ['adc2', 'touch', 'strap', 'strapping', 'boot', 'download'],
    }),
    io(24, 'GPIO4', 4, { side: 'bottom', order: 12 }, {
      mainFunctions: ['GPIO4', 'ADC2_CH0', 'RTC_GPIO10', 'TOUCH0'],
      ioMux: ['GPIO4', 'HSPIHD', 'HS2_DATA1', 'SD_DATA1', 'EMAC_TX_ER'],
      rtc: ['RTC_GPIO10'],
      analog: ['ADC2_CH0', 'TOUCH0'],
      keywords: ['adc2', 'touch', 'sdio', 'hspi', 'ethernet'],
    }),
    io(25, 'GPIO16', 16, { side: 'right', order: 1 }, {
      mainFunctions: ['GPIO16', 'HS1_DATA4', 'U2RXD', 'EMAC_CLK_OUT'],
      ioMux: ['GPIO16', 'HS1_DATA4', 'U2RXD', 'EMAC_CLK_OUT'],
      keywords: ['uart2', 'sdio', 'ethernet'],
    }),
    pin(26, 'VDD_SDIO', 'power', { side: 'right', order: 2 }, {
      mainFunctions: ['VDD_SDIO power supply'],
      notes: ['Output power supply: 1.8 V or the same voltage as VDD3P3_RTC.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['power', 'sdio', 'vdd sdio', 'flash'],
    }),
    io(27, 'GPIO17', 17, { side: 'right', order: 3 }, {
      mainFunctions: ['GPIO17', 'HS1_DATA5', 'U2TXD', 'EMAC_CLK_OUT_180'],
      ioMux: ['GPIO17', 'HS1_DATA5', 'U2TXD', 'EMAC_CLK_OUT_180'],
      keywords: ['uart2', 'sdio', 'ethernet'],
    }),
    io(28, 'SD_DATA_2', 9, { side: 'right', order: 4 }, {
      mainFunctions: ['GPIO9', 'SD_DATA2', 'SPIHD'],
      ioMux: ['GPIO9', 'HS1_DATA2', 'U1RXD', 'SD_DATA2', 'SPIHD'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['flash', 'spi', 'sdio', 'u1rxd', 'd2'],
    }),
    io(29, 'SD_DATA_3', 10, { side: 'right', order: 5 }, {
      mainFunctions: ['GPIO10', 'SD_DATA3', 'SPIWP'],
      ioMux: ['GPIO10', 'HS1_DATA3', 'U1TXD', 'SD_DATA3', 'SPIWP'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['flash', 'spi', 'sdio', 'u1txd', 'd3'],
    }),
    io(30, 'SD_CMD', 11, { side: 'right', order: 6 }, {
      mainFunctions: ['GPIO11', 'SD_CMD', 'SPICS0'],
      ioMux: ['GPIO11', 'HS1_CMD', 'U1RTS', 'SD_CMD', 'SPICS0'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['flash', 'spi', 'sdio', 'cmd'],
    }),
    io(31, 'SD_CLK', 6, { side: 'right', order: 7 }, {
      mainFunctions: ['GPIO6', 'SD_CLK', 'SPICLK'],
      ioMux: ['GPIO6', 'HS1_CLK', 'U1CTS', 'SD_CLK', 'SPICLK'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['flash', 'spi', 'sdio', 'clock', 'clk'],
    }),
    io(32, 'SD_DATA_0', 7, { side: 'right', order: 8 }, {
      mainFunctions: ['GPIO7', 'SD_DATA0', 'SPIQ'],
      ioMux: ['GPIO7', 'HS1_DATA0', 'U2RTS', 'SD_DATA0', 'SPIQ'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['flash', 'spi', 'sdio', 'd0'],
    }),
    io(33, 'SD_DATA_1', 8, { side: 'right', order: 9 }, {
      mainFunctions: ['GPIO8', 'SD_DATA1', 'SPID'],
      ioMux: ['GPIO8', 'HS1_DATA1', 'U2CTS', 'SD_DATA1', 'SPID'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['flash', 'spi', 'sdio', 'd1'],
    }),
    io(34, 'GPIO5', 5, { side: 'right', order: 10 }, {
      mainFunctions: ['GPIO5', 'VSPICS0', 'EMAC_RX_CLK'],
      ioMux: ['GPIO5', 'HS1_DATA6', 'VSPICS0', 'EMAC_RX_CLK'],
      notes: [strappingCaution, 'Controls SDIO slave timing at reset.'],
      warnings: warnings('strapping'),
      keywords: ['strap', 'strapping', 'spi', 'vspi', 'ethernet', 'sdio'],
    }),
    io(35, 'GPIO18', 18, { side: 'right', order: 11 }, {
      mainFunctions: ['GPIO18', 'VSPICLK'],
      ioMux: ['GPIO18', 'HS1_DATA7', 'VSPICLK'],
      keywords: ['spi', 'vspi', 'clock'],
    }),
    io(36, 'GPIO23', 23, { side: 'right', order: 12 }, {
      mainFunctions: ['GPIO23', 'VSPID'],
      ioMux: ['GPIO23', 'HS1_STROBE', 'VSPID'],
      keywords: ['spi', 'vspi', 'mosi'],
    }),
    pin(37, 'VDD3P3_CPU', 'power', { side: 'top', order: 12 }, {
      mainFunctions: ['CPU IO power supply'],
      notes: ['Input power supply for CPU IO, 1.8 V to 3.6 V.'],
      warnings: warnings('power'),
      keywords: ['power', 'cpu', 'supply'],
    }),
    io(38, 'GPIO19', 19, { side: 'top', order: 11 }, {
      mainFunctions: ['GPIO19', 'U0CTS', 'VSPIQ', 'EMAC_TXD0'],
      ioMux: ['GPIO19', 'U0CTS', 'VSPIQ', 'EMAC_TXD0'],
      keywords: ['uart0', 'spi', 'vspi', 'ethernet'],
    }),
    io(39, 'GPIO22', 22, { side: 'top', order: 10 }, {
      mainFunctions: ['GPIO22', 'U0RTS', 'VSPIWP', 'EMAC_TXD1'],
      ioMux: ['GPIO22', 'U0RTS', 'VSPIWP', 'EMAC_TXD1'],
      keywords: ['uart0', 'spi', 'vspi', 'ethernet'],
    }),
    io(40, 'U0RXD', 3, { side: 'top', order: 9 }, {
      mainFunctions: ['GPIO3', 'U0RXD', 'CLK_OUT2'],
      ioMux: ['GPIO3', 'U0RXD', 'CLK_OUT2'],
      notes: [uart0Caution],
      warnings: warnings('uart0'),
      keywords: ['uart0', 'serial', 'debug', 'flash', 'rxd'],
    }),
    io(41, 'U0TXD', 1, { side: 'top', order: 8 }, {
      mainFunctions: ['GPIO1', 'U0TXD', 'CLK_OUT3'],
      ioMux: ['GPIO1', 'U0TXD', 'CLK_OUT3', 'EMAC_RXD2'],
      notes: [uart0Caution, 'ROM boot messages print to UART0 by default unless configured otherwise.'],
      warnings: warnings('uart0'),
      keywords: ['uart0', 'serial', 'debug', 'boot log', 'txd'],
    }),
    io(42, 'GPIO21', 21, { side: 'top', order: 7 }, {
      mainFunctions: ['GPIO21', 'VSPIHD', 'EMAC_TX_EN'],
      ioMux: ['GPIO21', 'VSPIHD', 'EMAC_TX_EN'],
      keywords: ['spi', 'vspi', 'ethernet'],
    }),
    pin(43, 'VDDA', 'power', { side: 'top', order: 6 }, {
      mainFunctions: ['Analog power supply'],
      notes: ['Analog power supply, 2.3 V to 3.6 V.'],
      warnings: warnings('power'),
      keywords: ['power', 'analog', 'supply'],
    }),
    pin(44, 'XTAL_N', 'analog', { side: 'top', order: 5 }, {
      mainFunctions: ['External crystal output'],
      analog: ['XTAL_N'],
      notes: ['External crystal output, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator'],
    }),
    pin(45, 'XTAL_P', 'analog', { side: 'top', order: 4 }, {
      mainFunctions: ['External crystal input'],
      analog: ['XTAL_P'],
      notes: ['External crystal input, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator'],
    }),
    pin(46, 'VDDA', 'power', { side: 'top', order: 3 }, {
      mainFunctions: ['Analog power supply'],
      notes: ['Analog power supply, 2.3 V to 3.6 V.'],
      warnings: warnings('power'),
      keywords: ['power', 'analog', 'supply'],
    }),
    pin(47, 'CAP2', 'analog', { side: 'top', order: 2 }, {
      mainFunctions: ['External capacitor connection'],
      analog: ['CAP2'],
      notes: ['Connects to a 3.3 nF capacitor and 20 kOhm resistor in parallel to CAP1.'],
      keywords: ['capacitor', 'cap'],
    }),
    pin(48, 'CAP1', 'analog', { side: 'top', order: 1 }, {
      mainFunctions: ['External capacitor connection'],
      analog: ['CAP1'],
      notes: ['Connects to a 10 nF series capacitor to ground.'],
      keywords: ['capacitor', 'cap'],
    }),
    pin(49, 'GND', 'ground', { side: 'center', order: 1 }, {
      mainFunctions: ['Ground'],
      notes: ['Exposed ground pad.'],
      warnings: warnings('power'),
      keywords: ['ground', 'gnd', 'epad'],
    }),
  ],
};

function findQfnPinByGpio(gpio: number | undefined) {
  if (gpio === undefined) {
    return undefined;
  }

  return esp32.pins.find((candidate) => candidate.gpio === gpio);
}

const esp32DevKitCV4Profile = createEsp32DevKitCV4Profile(findQfnPinByGpio);

const esp32DevKitM1Profile = createEsp32DevKitM1Profile(findQfnPinByGpio);

esp32.boardProfiles = [esp32DevKitCV4Profile, esp32DevKitM1Profile];
