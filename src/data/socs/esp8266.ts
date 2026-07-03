import { createEsp8266BoardProfiles, wroom02DuSource } from '@/data/boards/esp8266';
import type {
  PinPosition,
  PinType,
  PinWarning,
  SocDefinition,
  SocModuleVariant,
  SocPackageVariant,
  SocPin,
  SocSource,
} from '@/types/soc';

const source: SocSource = {
  title: 'ESP8266EX Datasheet',
  version: 'v7.1',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/0a-esp8266ex_datasheet_en.pdf',
  sections: [
    'Figure 2-1 Pin Layout (Top View)',
    'Table 2-1 ESP8266EX Pin Definitions',
    'Section 3.1.3 External Flash',
    'Section 4.1 General Purpose Input/Output Interface (GPIO)',
    'Table 4-1 Pin Definitions of SDIOs',
    'Table 4-2 Pin Definitions of SPIs',
    'Table 4-3 Pin Definitions of HSPI',
    'Table 4-4 Pin Definitions of I2C',
    'Table 4-5 Pin Definitions of I2S',
    'Table 4-6 Pin Definitions of UART',
    'Table 4-7 Pin Definitions of PWM',
    'Table 4-8 Pin Definitions of IR Remote Control',
    'Table 4-9 Pin Definition of ADC',
    'Section 5.1 Electrical Characteristics',
  ],
};

const gpioMatrixSignals = ['I2C', 'I2S', 'UART', 'PWM', 'IR Remote Control'];

const bootStrappingCaution =
  'GPIO2, GPIO0, and MTDO are strapping pins used to select boot mode and SDIO mode at reset.';
const externalFlashCaution =
  'ESP8266EX stores user programs in external SPI flash. Avoid reusing flash-connected SDIO/SPI pins in normal designs.';
const uart0Caution = 'UART0 is used for flash programming and boot/debug serial output.';

function id(number: number) {
  return `esp8266ex-pin-${number}`;
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
    keywords: [`gpio${gpio}`, `io${gpio}`, ...(details.keywords ?? [])],
  });
}

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

export const esp8266ex: SocDefinition = {
  id: 'esp8266ex',
  name: 'ESP8266EX',
  family: 'ESP8266',
  defaultPackageId: 'esp8266ex-qfn32',
  defaultProfileId: 'esp8266-devkitc',
  chipSpecs: {
    cpu: 'Single-core Tensilica L106 32-bit processor up to 160 MHz',
    wireless: '2.4 GHz Wi-Fi 802.11 b/g/n.',
    sram: 'Around 50 KB heap plus data memory available to applications.',
    rom: 'Boot ROM plus external SPI flash for user programs.',
  },
  packageName: 'QFN32 (5 x 5 mm), top view',
  description: 'ESP8266EX Wi-Fi SoC bare package pinout. Espressif marks ESP8266EX as NRND.',
  source,
  pins: [
    pin(1, 'VDDA', 'power', { side: 'left', order: 1 }, {
      mainFunctions: ['Analog power 2.5 V to 3.6 V'],
      notes: ['Analog power supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'analog', 'supply', 'vdda'],
    }),
    pin(2, 'LNA', 'analog', { side: 'left', order: 2 }, {
      mainFunctions: ['LNA', 'RF antenna interface'],
      analog: ['RF antenna interface'],
      notes: ['Dedicated RF antenna interface, not a GPIO.', 'Espressif recommends retaining a pi-type matching network for antenna matching.'],
      keywords: ['rf', 'antenna', 'lna', 'wifi'],
    }),
    pin(3, 'VDD3P3', 'power', { side: 'left', order: 3 }, {
      mainFunctions: ['Amplifier power 2.5 V to 3.6 V'],
      notes: ['Amplifier power supply.'],
      warnings: warnings('power'),
      keywords: ['power', '3v3', 'supply', 'amplifier'],
    }),
    pin(4, 'VDD3P3', 'power', { side: 'left', order: 4 }, {
      mainFunctions: ['Amplifier power 2.5 V to 3.6 V'],
      notes: ['Amplifier power supply.'],
      warnings: warnings('power'),
      keywords: ['power', '3v3', 'supply', 'amplifier'],
    }),
    pin(5, 'VDD_RTC', 'power', { side: 'left', order: 5 }, {
      mainFunctions: ['NC', 'Internal 1.1 V RTC power'],
      notes: ['Datasheet marks this pin as NC (1.1 V). Follow the official reference design rather than using it as a power output.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['power', 'rtc', 'nc', 'no connect', '1.1v'],
    }),
    pin(6, 'TOUT', 'analog', { side: 'left', order: 6 }, {
      mainFunctions: ['TOUT', 'ADC'],
      analog: ['ADC'],
      notes: [
        'ADC pin for either VDD3P3 measurement or external TOUT input measurement; the two ADC uses cannot be used simultaneously.',
        'External TOUT input range is 0 V to 1.0 V.',
      ],
      warnings: warnings('voltage'),
      keywords: ['adc', 'analog', 'tout', 'vdd3p3', '0-1v'],
    }),
    pin(7, 'CHIP_EN', 'control', { side: 'left', order: 7 }, {
      mainFunctions: ['Chip enable'],
      notes: ['High enables normal operation; low turns the chip off with small current consumption.', 'Do not leave CHIP_EN floating.'],
      warnings: warnings('reset'),
      keywords: ['enable', 'chip en', 'reset', 'power up'],
    }),
    io(8, 'XPD_DCDC', 16, { side: 'left', order: 8 }, {
      mainFunctions: ['GPIO16', 'XPD_DCDC', 'Deep-sleep wakeup'],
      ioMux: ['GPIO16', 'XPD_DCDC'],
      notes: ['Connect XPD_DCDC to EXT_RSTB when GPIO16 is used for deep-sleep wakeup.', 'GPIO16 can only be configured with an internal pull-down.'],
      keywords: ['deep sleep', 'wakeup', 'xpd', 'dcdc', 'rtc', 'gpio16'],
    }),
    io(9, 'MTMS', 14, { side: 'top', order: 1 }, {
      mainFunctions: ['GPIO14', 'MTMS', 'HSPI_CLK', 'I2C_SCL', 'I2SI_WS', 'PWM2', 'IR TX'],
      ioMux: ['GPIO14', 'MTMS', 'HSPI_CLK', 'I2C_SCL', 'I2SI_WS', 'PWM2', 'IR TX'],
      notes: ['Package pin name is MTMS; common maker use is GPIO14 or HSPI clock.'],
      warnings: warnings('jtag'),
      keywords: ['hspi', 'clock', 'clk', 'i2c', 'i2s', 'pwm', 'ir', 'mtms', 'jtag'],
    }),
    io(10, 'MTDI', 12, { side: 'top', order: 2 }, {
      mainFunctions: ['GPIO12', 'MTDI', 'HSPI_MISO', 'I2SI_DATA', 'PWM0'],
      ioMux: ['GPIO12', 'MTDI', 'HSPI_MISO', 'I2SI_DATA', 'PWM0'],
      notes: ['Package pin name is MTDI; common maker use is GPIO12 or HSPI MISO.'],
      warnings: warnings('jtag'),
      keywords: ['hspi', 'miso', 'i2s', 'pwm', 'mtdi', 'jtag'],
    }),
    pin(11, 'VDDPST', 'power', { side: 'top', order: 3 }, {
      mainFunctions: ['Digital/IO power 1.8 V to 3.6 V'],
      notes: ['Digital and IO power supply.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['power', 'digital', 'io power', 'vddpst', 'supply'],
    }),
    io(12, 'MTCK', 13, { side: 'top', order: 4 }, {
      mainFunctions: ['GPIO13', 'MTCK', 'HSPI_MOSI', 'UART0_CTS', 'I2SI_BCK'],
      ioMux: ['GPIO13', 'MTCK', 'HSPI_MOSI', 'U0CTS', 'I2SI_BCK'],
      notes: ['Package pin name is MTCK; common maker use is GPIO13 or HSPI MOSI.'],
      warnings: warnings('jtag'),
      keywords: ['hspi', 'mosi', 'uart0', 'cts', 'i2s', 'mtck', 'jtag'],
    }),
    io(13, 'MTDO', 15, { side: 'top', order: 5 }, {
      mainFunctions: ['GPIO15', 'MTDO', 'HSPI_CS', 'UART0_RTS', 'I2SO_BCK', 'PWM1'],
      ioMux: ['GPIO15', 'MTDO', 'HSPI_CS', 'U0RTS', 'I2SO_BCK', 'PWM1'],
      notes: [bootStrappingCaution, 'Package pin name is MTDO; common maker use is GPIO15 or HSPI chip select.'],
      warnings: warnings('strapping', 'boot', 'jtag'),
      keywords: ['hspi', 'cs', 'chip select', 'uart0', 'rts', 'i2s', 'pwm', 'mtdo', 'strap', 'strapping', 'boot', 'sdio', 'jtag'],
    }),
    io(14, 'GPIO2', 2, { side: 'top', order: 6 }, {
      mainFunctions: ['GPIO2', 'UART flash TX', 'U1TXD', 'I2C_SDA', 'I2SO_WS'],
      ioMux: ['GPIO2', 'U1TXD', 'I2C_SDA', 'I2SO_WS'],
      notes: [bootStrappingCaution, 'Used as UART TX during flash programming.'],
      warnings: warnings('strapping', 'boot'),
      keywords: ['uart', 'flash programming', 'u1txd', 'i2c', 'i2s', 'strap', 'strapping', 'boot'],
    }),
    io(15, 'GPIO0', 0, { side: 'top', order: 7 }, {
      mainFunctions: ['GPIO0', 'SPI_CS2', 'Boot mode strapping'],
      ioMux: ['GPIO0', 'SPI_CS2'],
      notes: [bootStrappingCaution],
      warnings: warnings('strapping', 'boot'),
      keywords: ['spi', 'cs', 'chip select', 'strap', 'strapping', 'boot', 'download'],
    }),
    io(16, 'GPIO4', 4, { side: 'top', order: 8 }, {
      mainFunctions: ['GPIO4', 'PWM3'],
      ioMux: ['GPIO4', 'PWM3'],
      keywords: ['pwm'],
    }),
    pin(17, 'VDDPST', 'power', { side: 'right', order: 1 }, {
      mainFunctions: ['Digital/IO power 1.8 V to 3.6 V'],
      notes: ['Digital and IO power supply.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['power', 'digital', 'io power', 'vddpst', 'supply'],
    }),
    io(18, 'SDIO_DATA_2', 9, { side: 'right', order: 2 }, {
      mainFunctions: ['GPIO9', 'SDIO_DATA_2', 'SPIHD', 'HSPIHD'],
      ioMux: ['GPIO9', 'SDIO_DATA_2', 'SPIHD', 'HSPIHD'],
      notes: [externalFlashCaution, 'Connect to external flash SD_D2 through the datasheet series resistor.'],
      warnings: warnings('flash'),
      keywords: ['flash', 'sdio', 'spi', 'hspi', 'data2', 'd2', 'hold'],
    }),
    io(19, 'SDIO_DATA_3', 10, { side: 'right', order: 3 }, {
      mainFunctions: ['GPIO10', 'SDIO_DATA_3', 'SPIWP', 'HSPIWP'],
      ioMux: ['GPIO10', 'SDIO_DATA_3', 'SPIWP', 'HSPIWP'],
      notes: [externalFlashCaution, 'Connect to external flash SD_D3 through the datasheet series resistor.'],
      warnings: warnings('flash'),
      keywords: ['flash', 'sdio', 'spi', 'hspi', 'data3', 'd3', 'wp', 'write protect'],
    }),
    io(20, 'SDIO_CMD', 11, { side: 'right', order: 4 }, {
      mainFunctions: ['GPIO11', 'SDIO_CMD', 'SPI_CS0'],
      ioMux: ['GPIO11', 'SDIO_CMD', 'SPI_CS0'],
      notes: [externalFlashCaution, 'Connect to external flash SD_CMD through the datasheet series resistor.'],
      warnings: warnings('flash'),
      keywords: ['flash', 'sdio', 'spi', 'cmd', 'command', 'cs0', 'chip select'],
    }),
    io(21, 'SDIO_CLK', 6, { side: 'right', order: 5 }, {
      mainFunctions: ['GPIO6', 'SDIO_CLK', 'SPI_CLK'],
      ioMux: ['GPIO6', 'SDIO_CLK', 'SPI_CLK'],
      notes: [externalFlashCaution, 'Connect to external flash SD_CLK through the datasheet series resistor.'],
      warnings: warnings('flash'),
      keywords: ['flash', 'sdio', 'spi', 'clock', 'clk'],
    }),
    io(22, 'SDIO_DATA_0', 7, { side: 'right', order: 6 }, {
      mainFunctions: ['GPIO7', 'SDIO_DATA_0', 'SPI_MISO'],
      ioMux: ['GPIO7', 'SDIO_DATA_0', 'SPI_MISO'],
      notes: [externalFlashCaution, 'Connect to external flash SD_D0 through the datasheet series resistor.'],
      warnings: warnings('flash'),
      keywords: ['flash', 'sdio', 'spi', 'miso', 'data0', 'd0'],
    }),
    io(23, 'SDIO_DATA_1', 8, { side: 'right', order: 7 }, {
      mainFunctions: ['GPIO8', 'SDIO_DATA_1', 'SPI_MOSI', 'U1RXD'],
      ioMux: ['GPIO8', 'SDIO_DATA_1', 'SPI_MOSI', 'U1RXD'],
      notes: [externalFlashCaution, 'Connect to external flash SD_D1 through the datasheet series resistor.'],
      warnings: warnings('flash'),
      keywords: ['flash', 'sdio', 'spi', 'mosi', 'data1', 'd1', 'uart1', 'rxd'],
    }),
    io(24, 'GPIO5', 5, { side: 'right', order: 8 }, {
      mainFunctions: ['GPIO5', 'IR Rx'],
      ioMux: ['GPIO5', 'IR Rx'],
      keywords: ['ir', 'infrared', 'rx'],
    }),
    io(25, 'U0RXD', 3, { side: 'bottom', order: 8 }, {
      mainFunctions: ['GPIO3', 'U0RXD', 'I2SO_DATA'],
      ioMux: ['GPIO3', 'U0RXD', 'I2SO_DATA'],
      notes: [uart0Caution],
      warnings: warnings('uart0'),
      keywords: ['uart0', 'serial', 'flash programming', 'debug', 'rxd', 'i2s'],
    }),
    io(26, 'U0TXD', 1, { side: 'bottom', order: 7 }, {
      mainFunctions: ['GPIO1', 'U0TXD', 'SPI_CS1'],
      ioMux: ['GPIO1', 'U0TXD', 'SPI_CS1'],
      notes: [uart0Caution, 'U0TXD should not be pulled externally low during powering-up.'],
      warnings: warnings('uart0', 'boot'),
      keywords: ['uart0', 'serial', 'flash programming', 'debug', 'txd', 'spi', 'cs1', 'boot'],
    }),
    pin(27, 'XTAL_OUT', 'analog', { side: 'bottom', order: 6 }, {
      mainFunctions: ['XTAL_OUT', 'BT clock input'],
      analog: ['XTAL_OUT', 'BT clock input'],
      notes: ['External crystal oscillator output. Not a GPIO.', 'Datasheet notes this pin can provide Bluetooth clock input.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'bt clock'],
    }),
    pin(28, 'XTAL_IN', 'analog', { side: 'bottom', order: 5 }, {
      mainFunctions: ['XTAL_IN'],
      analog: ['XTAL_IN'],
      notes: ['External crystal oscillator input. Not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator'],
    }),
    pin(29, 'VDDD', 'power', { side: 'bottom', order: 4 }, {
      mainFunctions: ['Analog power 2.5 V to 3.6 V'],
      notes: ['Datasheet lists VDDD as analog power.'],
      warnings: warnings('power'),
      keywords: ['power', 'analog', 'supply', 'vddd'],
    }),
    pin(30, 'VDDA', 'power', { side: 'bottom', order: 3 }, {
      mainFunctions: ['Analog power 2.5 V to 3.6 V'],
      notes: ['Analog power supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'analog', 'supply', 'vdda'],
    }),
    pin(31, 'RES12K', 'control', { side: 'bottom', order: 2 }, {
      mainFunctions: ['RES12K'],
      notes: ['Connect in series with a 12 kOhm resistor to ground, per the datasheet pin definition.'],
      keywords: ['resistor', '12k', 'ground', 'bias', 'res12k'],
    }),
    pin(32, 'EXT_RSTB', 'control', { side: 'bottom', order: 1 }, {
      mainFunctions: ['EXT_RSTB', 'External reset'],
      notes: ['External reset input. Low level is active.', 'Connect to XPD_DCDC when GPIO16 is used for deep-sleep wakeup.'],
      warnings: warnings('reset'),
      keywords: ['reset', 'rst', 'ext rstb', 'deep sleep', 'wakeup'],
    }),
    pin(33, 'GND', 'ground', { side: 'center', order: 1 }, {
      mainFunctions: ['Exposed ground pad'],
      notes: ['Exposed ground pad.'],
      warnings: warnings('power'),
      keywords: ['ground', 'gnd', 'epad', 'thermal pad'],
    }),
  ],
};

const wroom02ModuleKeywords = [
  'module',
  'wroom',
  'wroom-02',
  'wroom-02d',
  'wroom-02u',
  'esp-wroom-02d',
  'esp-wroom-02u',
  'castellated pad',
  'esp8266 module',
];

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function findEsp8266PinByGpio(gpio: number | undefined) {
  if (gpio === undefined) {
    return undefined;
  }

  return esp8266ex.pins.find((pin) => pin.gpio === gpio);
}

function wroom02Id(profileId: string, number: number) {
  return `${profileId}-pin-${number}`;
}

function wroom02Pin(
  profileId: string,
  number: number,
  name: string,
  type: PinType,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position'>> = {},
): SocPin {
  return {
    id: wroom02Id(profileId, number),
    number,
    name,
    type,
    position,
    mainFunctions: [],
    ...details,
    keywords: uniqueValues([...(details.keywords ?? []), ...wroom02ModuleKeywords, `pin ${number}`]),
  };
}

function wroom02IoPin(
  profileId: string,
  number: number,
  name: string,
  gpio: number,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position' | 'gpio'>> = {},
): SocPin {
  const sourcePin = findEsp8266PinByGpio(gpio);

  return wroom02Pin(profileId, number, name, 'io', position, {
    gpio,
    mainFunctions: details.mainFunctions ?? sourcePin?.mainFunctions ?? [`GPIO${gpio}`],
    ioMux: details.ioMux ?? sourcePin?.ioMux,
    rtc: details.rtc ?? sourcePin?.rtc,
    analog: details.analog ?? sourcePin?.analog,
    matrixSignals: details.matrixSignals ?? sourcePin?.matrixSignals,
    notes: uniqueValues([...(details.notes ?? []), ...(sourcePin?.notes ?? [])]),
    warnings: uniqueValues([...(details.warnings ?? []), ...(sourcePin?.warnings ?? [])]),
    keywords: uniqueValues([`gpio${gpio}`, `io${gpio}`, ...(sourcePin?.keywords ?? []), ...(details.keywords ?? [])]),
  });
}

function wroom02GroundPin(profileId: string, number: number, position: PinPosition): SocPin {
  return wroom02Pin(profileId, number, 'GND', 'ground', position, {
    mainFunctions: number === 19 ? ['Exposed ground pad'] : ['Ground'],
    notes:
      number === 19
        ? ['Exposed soldering pad connected to ground. The module datasheet says soldering this pad is not required for satisfactory thermal performance.']
        : ['Module ground pad.'],
    warnings: warnings('power'),
    keywords: ['ground', 'gnd', number === 19 ? 'p_gnd' : '', number === 19 ? 'epad' : ''].filter(Boolean),
  });
}

function createWroom02Pins(profileId: string): SocPin[] {
  return [
    wroom02Pin(profileId, 1, '3V3', 'power', { side: 'left', order: 9 }, {
      mainFunctions: ['3.3 V module power supply'],
      notes: ['Module power supply input. Espressif specifies a 2.7 V to 3.6 V operating range and recommends a supply capable of at least 500 mA.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['power', 'supply', '3v3', '3.3v', 'vdd'],
    }),
    wroom02Pin(profileId, 2, 'EN', 'control', { side: 'left', order: 8 }, {
      mainFunctions: ['Chip enable'],
      notes: ['Chip enable input, active high.'],
      warnings: warnings('reset'),
      keywords: ['en', 'enable', 'chip enable', 'reset'],
    }),
    wroom02IoPin(profileId, 3, 'IO14', 14, { side: 'left', order: 7 }, {
      mainFunctions: ['GPIO14', 'HSPI_CLK', 'I2C_SCL', 'I2SI_WS', 'PWM2', 'IR TX'],
      keywords: ['hspi', 'clock', 'clk', 'i2c', 'i2s', 'pwm', 'ir'],
    }),
    wroom02IoPin(profileId, 4, 'IO12', 12, { side: 'left', order: 6 }, {
      mainFunctions: ['GPIO12', 'HSPI_MISO', 'I2SI_DATA', 'PWM0'],
      keywords: ['hspi', 'miso', 'i2s', 'pwm'],
    }),
    wroom02IoPin(profileId, 5, 'IO13', 13, { side: 'left', order: 5 }, {
      mainFunctions: ['GPIO13', 'HSPI_MOSI', 'UART0_CTS', 'I2SI_BCK'],
      keywords: ['hspi', 'mosi', 'uart0', 'cts', 'i2s'],
    }),
    wroom02IoPin(profileId, 6, 'IO15', 15, { side: 'left', order: 4 }, {
      mainFunctions: ['GPIO15', 'HSPICS', 'UART0_RTS', 'I2SO_BCK', 'PWM1'],
      notes: ['Module pin table specifies IO15 should be pulled down.'],
      warnings: warnings('strapping', 'boot'),
      keywords: ['hspi', 'hspics', 'cs', 'chip select', 'uart0', 'rts', 'i2s', 'pwm', 'pull down', 'strap', 'boot'],
    }),
    wroom02IoPin(profileId, 7, 'IO2', 2, { side: 'left', order: 3 }, {
      mainFunctions: ['GPIO2', 'UART1_TXD', 'I2C_SDA', 'I2SO_WS'],
      notes: ['Module pin table specifies IO2 should float, use its internal pull-up, or be pulled up for boot.'],
      warnings: warnings('strapping', 'boot'),
      keywords: ['uart1', 'u1txd', 'i2c', 'i2s', 'pull up', 'strap', 'boot'],
    }),
    wroom02IoPin(profileId, 8, 'IO0', 0, { side: 'left', order: 2 }, {
      mainFunctions: ['GPIO0', 'SPI_CS2', 'Boot mode strapping'],
      notes: ['UART download mode requires IO0 pulled down; flash boot requires IO0 floating or pulled up.'],
      warnings: warnings('strapping', 'boot'),
      keywords: ['spi', 'cs', 'chip select', 'strap', 'strapping', 'boot', 'download', 'flash boot'],
    }),
    wroom02GroundPin(profileId, 9, { side: 'left', order: 1 }),
    wroom02IoPin(profileId, 10, 'IO4', 4, { side: 'right', order: 1 }, {
      mainFunctions: ['GPIO4', 'PWM3'],
      keywords: ['pwm'],
    }),
    wroom02IoPin(profileId, 11, 'RXD', 3, { side: 'right', order: 2 }, {
      mainFunctions: ['GPIO3', 'U0RXD', 'UART0_RXD'],
      notes: ['UART0 receive pin and receive end during UART download.'],
      warnings: warnings('uart0'),
      keywords: ['uart0', 'serial', 'flash programming', 'download', 'debug', 'rxd'],
    }),
    wroom02IoPin(profileId, 12, 'TXD', 1, { side: 'right', order: 3 }, {
      mainFunctions: ['GPIO1', 'U0TXD', 'UART0_TXD'],
      notes: ['UART0 transmit pin and transmit end during UART download; the module pin table says it may float or be pulled up.'],
      warnings: warnings('uart0', 'boot'),
      keywords: ['uart0', 'serial', 'flash programming', 'download', 'debug', 'txd', 'pull up'],
    }),
    wroom02GroundPin(profileId, 13, { side: 'right', order: 4 }),
    wroom02IoPin(profileId, 14, 'IO5', 5, { side: 'right', order: 5 }, {
      mainFunctions: ['GPIO5', 'IR Rx'],
      keywords: ['ir', 'infrared', 'rx'],
    }),
    wroom02Pin(profileId, 15, 'RST', 'control', { side: 'right', order: 6 }, {
      mainFunctions: ['EXT_RSTB', 'Reset'],
      notes: ['Module reset input.'],
      warnings: warnings('reset'),
      keywords: ['rst', 'reset', 'ext rstb'],
    }),
    wroom02Pin(profileId, 16, 'TOUT', 'analog', { side: 'right', order: 7 }, {
      mainFunctions: ['TOUT', 'ADC'],
      analog: ['ADC'],
      notes: [
        'ADC pin for either VDD3P3 measurement or external TOUT input measurement; the two ADC uses cannot be used simultaneously.',
        'External TOUT input range is 0 V to 1.0 V.',
      ],
      warnings: warnings('voltage'),
      keywords: ['adc', 'analog', 'tout', 'vdd3p3', '0-1v'],
    }),
    wroom02IoPin(profileId, 17, 'IO16', 16, { side: 'right', order: 8 }, {
      mainFunctions: ['GPIO16', 'XPD_DCDC', 'Deep-sleep wakeup'],
      notes: ['GPIO16 can be used for deep-sleep wake-up when connected to RST.'],
      keywords: ['deep sleep', 'wakeup', 'xpd', 'dcdc', 'rtc'],
    }),
    wroom02GroundPin(profileId, 18, { side: 'right', order: 9 }),
    wroom02GroundPin(profileId, 19, { side: 'center', order: 1 }),
  ];
}

const espWroom02DPins = createWroom02Pins('esp-wroom-02d');
const espWroom02UPins = createWroom02Pins('esp-wroom-02u').map((pin) => ({
  ...pin,
  notes: uniqueValues([...(pin.notes ?? []), 'ESP-WROOM-02U uses the same 19-pad module pinout as ESP-WROOM-02D.']),
  keywords: uniqueValues([...(pin.keywords ?? []), 'external antenna', 'antenna connector', 'ipex', 'u.fl']),
}));

const espWroom02DModuleVariant: SocModuleVariant = {
  name: 'ESP-WROOM-02D',
  antenna: 'PCB antenna',
  flash: '2 MB / 4 MB / 16 MB SPI flash ordering options',
  psram: 'No PSRAM',
  footprint: '18.0 x 20.0 x 3.2 mm',
  pinoutImpact: 'Same 19-pad module pinout as ESP-WROOM-02U; antenna implementation and module length differ.',
  source: wroom02DuSource,
};

const espWroom02UModuleVariant: SocModuleVariant = {
  name: 'ESP-WROOM-02U',
  antenna: 'U.FL/IPEX external antenna connector',
  flash: '2 MB / 4 MB / 16 MB SPI flash ordering options',
  psram: 'No PSRAM',
  footprint: '18.0 x 14.3 x 3.2 mm',
  pinoutImpact: 'Same 19-pad module pinout as ESP-WROOM-02D; antenna connector changes RF layout only.',
  source: wroom02DuSource,
};

const espWroom02DProfile: SocPackageVariant = {
  id: 'esp-wroom-02d',
  name: 'WROOM-02D',
  packageName: 'ESP-WROOM-02D module, 19 pads, top view',
  kind: 'module',
  source: wroom02DuSource,
  moduleNames: ['ESP-WROOM-02D'],
  moduleVariants: [espWroom02DModuleVariant],
  identificationNotes: [
    'This profile is the 19-pad ESP-WROOM-02D module layout, not the bare ESP8266EX QFN package.',
    'ESP-WROOM-02D uses a PCB antenna; the related ESP-WROOM-02U uses an external antenna connector with the same pad pinout.',
  ],
  pins: espWroom02DPins,
};

const espWroom02UProfile: SocPackageVariant = {
  id: 'esp-wroom-02u',
  name: 'WROOM-02U',
  packageName: 'ESP-WROOM-02U module, 19 pads, top view',
  kind: 'module',
  source: wroom02DuSource,
  moduleNames: ['ESP-WROOM-02U'],
  moduleVariants: [espWroom02UModuleVariant],
  identificationNotes: [
    'This profile is the 19-pad ESP-WROOM-02U module layout, not the bare ESP8266EX QFN package.',
    'ESP-WROOM-02U uses an external antenna connector and a shorter module body; the pad pinout matches ESP-WROOM-02D.',
  ],
  pins: espWroom02UPins,
};

esp8266ex.packageVariants = [espWroom02DProfile, espWroom02UProfile];
esp8266ex.boardProfiles = createEsp8266BoardProfiles(findEsp8266PinByGpio);
