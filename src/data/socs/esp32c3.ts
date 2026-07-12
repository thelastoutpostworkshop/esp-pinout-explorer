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
  title: 'ESP32-C3 Series Datasheet',
  version: 'v2.4',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c3_datasheet_en.pdf',
  sections: [
    'Figure 2-1 Pin Layout (Top View) for ESP32-C3, ESP32-C3FH4, ESP32-C3FN4, and ESP32-C3FH8X',
    'Figure 2-2 Pin Layout (Top View) for ESP32-C3FH4X and ESP32-C3FH4AZ',
    'Table 2-1 Pin Overview',
    'Table 2-4 IO MUX Pin Functions',
    'Table 2-6 Analog Functions',
    'Section 2.3.3 Restrictions for GPIOs',
    'Table 2-7 Peripheral Pin Assignment',
    'Table 2-9 Power Pins',
    'Table 2-12 Pin Mapping Between Chip and In-package Flash',
    'Table 3-1 Default Configuration of Strapping Pins',
    'Table 3-3 Chip Boot Mode Control',
    'Table 3-4 UART0 ROM Message Printing Control',
  ],
};

const mini1Source: SocSource = {
  title: 'ESP32-C3-MINI-1 & MINI-1U Datasheet',
  version: 'v2.2',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c3-mini-1_datasheet_en.pdf',
  sections: [
    'Table 1-1 ESP32-C3-MINI-1 (ANT) Series Comparison',
    'Table 1-2 ESP32-C3-MINI-1U (CONN) Series Comparison',
    'Figure 3-1 Pin Layout (Top View)',
    'Table 3-1 Pin Definitions',
    'Chapter 4 Boot Configurations',
    'Figure 8-1 ESP32-C3-MINI-1 Schematics',
    'Figure 8-2 ESP32-C3-MINI-1U Schematics',
    'Figure 10-1 ESP32-C3-MINI-1 Physical Dimensions',
    'Figure 10-2 ESP32-C3-MINI-1U Physical Dimensions',
  ],
};

const wroom02Source: SocSource = {
  title: 'ESP32-C3-WROOM-02 & WROOM-02U Datasheet',
  version: 'v1.7',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c3-wroom-02_datasheet_en.pdf',
  sections: [
    'Table 1-1 ESP32-C3-WROOM-02 (ANT) Series Comparison',
    'Table 1-2 ESP32-C3-WROOM-02U (CONN) Series Comparison',
    'Figure 3-1 Pin Layout (Top View)',
    'Table 3-1 Pin Definitions',
    'Chapter 4 Boot Configurations',
    'Figure 8-1 ESP32-C3-WROOM-02 Schematics',
    'Figure 8-2 ESP32-C3-WROOM-02U Schematics',
    'Figure 10-1 ESP32-C3-WROOM-02 Physical Dimensions',
    'Figure 10-2 ESP32-C3-WROOM-02U Physical Dimensions',
  ],
};

const gpioMatrixSignals = ['SPI2', 'UART1', 'I2C', 'I2S', 'TWAI', 'LED PWM', 'RMT', 'PCNT'];
const jtagCaution = 'JTAG debug signal; USB Serial/JTAG can be used when these default JTAG pins need to be freed.';
const uart0Caution = 'UART0 is commonly used for boot messages, flashing, and serial debugging.';
const usbCaution =
  'USB_D pins are connected to the USB Serial/JTAG controller by default and need reconfiguration before regular GPIO use.';
const flashCaution = 'Connected to in-package flash or recommended for flash; do not use this pin for other purposes.';

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

function c3Id(number: number) {
  return `esp32c3-pin-${number}`;
}

function pin(
  number: number,
  name: string,
  type: PinType,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position'>> = {},
): SocPin {
  return { id: c3Id(number), number, name, type, position, mainFunctions: [], ...details };
}

function io(
  number: number,
  name: string,
  gpio: number,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position' | 'gpio'>> = {},
): SocPin {
  return pin(number, name, 'io', position, { gpio, matrixSignals: gpioMatrixSignals, ...details });
}

const qfn32Pins: SocPin[] = [
  pin(1, 'LNA_IN', 'analog', { side: 'left', order: 8 }, {
    mainFunctions: ['RF LNA input/output'],
    analog: ['RF LNA input/output'],
    notes: ['Dedicated RF analog connection, not a GPIO.'],
    keywords: ['rf', 'lna', 'antenna', 'analog'],
  }),
  pin(2, 'VDD3P3', 'power', { side: 'left', order: 7 }, {
    mainFunctions: ['3.3 V analog power input'],
    notes: ['Analog power-domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', '3v3', 'analog'],
  }),
  pin(3, 'VDD3P3', 'power', { side: 'left', order: 6 }, {
    mainFunctions: ['3.3 V analog power input'],
    notes: ['Analog power-domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', '3v3', 'analog'],
  }),
  io(4, 'XTAL_32K_P', 0, { side: 'left', order: 5 }, {
    mainFunctions: ['GPIO0', 'XTAL_32K_P', 'ADC1_CH0'],
    ioMux: ['GPIO0'],
    analog: ['XTAL_32K_P', 'ADC1_CH0'],
    notes: ['Package pin name is XTAL_32K_P; GPIO identity is GPIO0.'],
    keywords: ['gpio0', 'adc1', 'xtal', '32k'],
  }),
  io(5, 'XTAL_32K_N', 1, { side: 'left', order: 4 }, {
    mainFunctions: ['GPIO1', 'XTAL_32K_N', 'ADC1_CH1'],
    ioMux: ['GPIO1'],
    analog: ['XTAL_32K_N', 'ADC1_CH1'],
    notes: ['Package pin name is XTAL_32K_N; GPIO identity is GPIO1.'],
    keywords: ['gpio1', 'adc1', 'xtal', '32k'],
  }),
  io(6, 'GPIO2', 2, { side: 'left', order: 3 }, {
    mainFunctions: ['GPIO2', 'ADC1_CH2', 'FSPIQ'],
    ioMux: ['GPIO2', 'FSPIQ'],
    analog: ['ADC1_CH2'],
    notes: ['Strapping pin. Espressif recommends pulling GPIO2 high because of power-up glitches.'],
    warnings: warnings('strapping', 'glitch'),
    keywords: ['gpio2', 'adc1', 'strap', 'strapping', 'boot', 'spi', 'fspi', 'glitch'],
  }),
  pin(7, 'CHIP_EN', 'control', { side: 'left', order: 2 }, {
    mainFunctions: ['Chip power-up and reset enable'],
    notes: ['High enables the chip; low disables or resets it.', 'Do not leave CHIP_EN floating.'],
    warnings: warnings('reset'),
    keywords: ['chip en', 'enable', 'reset', 'power up'],
  }),
  io(8, 'GPIO3', 3, { side: 'left', order: 1 }, {
    mainFunctions: ['GPIO3', 'ADC1_CH3'],
    ioMux: ['GPIO3'],
    analog: ['ADC1_CH3'],
    keywords: ['gpio3', 'adc1'],
  }),
  io(9, 'MTMS', 4, { side: 'top', order: 1 }, {
    mainFunctions: ['GPIO4', 'MTMS', 'ADC1_CH4', 'FSPIHD'],
    ioMux: ['MTMS', 'GPIO4', 'FSPIHD'],
    analog: ['ADC1_CH4'],
    notes: [jtagCaution],
    warnings: warnings('jtag'),
    keywords: ['gpio4', 'jtag', 'mtms', 'adc1', 'spi', 'fspi'],
  }),
  io(10, 'MTDI', 5, { side: 'top', order: 2 }, {
    mainFunctions: ['GPIO5', 'MTDI', 'ADC2_CH0', 'FSPIWP'],
    ioMux: ['MTDI', 'GPIO5', 'FSPIWP'],
    analog: ['ADC2_CH0'],
    notes: [jtagCaution, 'ADC2 may not be operable on some ESP32-C3 chip revisions.'],
    warnings: warnings('jtag'),
    keywords: ['gpio5', 'jtag', 'mtdi', 'adc2', 'spi', 'fspi'],
  }),
  pin(11, 'VDD3P3_RTC', 'power', { side: 'top', order: 3 }, {
    mainFunctions: ['RTC IO power supply'],
    notes: ['Supplies the RTC and part of the digital power domains.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'rtc', '3v3'],
  }),
  io(12, 'MTCK', 6, { side: 'top', order: 4 }, {
    mainFunctions: ['GPIO6', 'MTCK', 'FSPICLK'],
    ioMux: ['MTCK', 'GPIO6', 'FSPICLK'],
    notes: [jtagCaution, 'Espressif documents a low-level power-up glitch on this pin.'],
    warnings: warnings('jtag', 'glitch'),
    keywords: ['gpio6', 'jtag', 'mtck', 'spi', 'fspi', 'clock', 'glitch'],
  }),
  io(13, 'MTDO', 7, { side: 'top', order: 5 }, {
    mainFunctions: ['GPIO7', 'MTDO', 'FSPID'],
    ioMux: ['MTDO', 'GPIO7', 'FSPID'],
    notes: [jtagCaution, 'Espressif documents a low-level power-up glitch on this pin.'],
    warnings: warnings('jtag', 'glitch'),
    keywords: ['gpio7', 'jtag', 'mtdo', 'spi', 'fspi', 'glitch'],
  }),
  io(14, 'GPIO8', 8, { side: 'top', order: 6 }, {
    mainFunctions: ['GPIO8', 'Boot mode strapping', 'ROM message control'],
    ioMux: ['GPIO8'],
    notes: [
      'Strapping pin with default floating state.',
      'GPIO8=1 with GPIO9=0 selects joint download boot mode.',
      'Also participates in UART0 ROM message printing control.',
    ],
    warnings: warnings('strapping', 'boot'),
    keywords: ['gpio8', 'strap', 'strapping', 'boot', 'download', 'rom messages'],
  }),
  io(15, 'GPIO9', 9, { side: 'top', order: 7 }, {
    mainFunctions: ['GPIO9', 'Boot mode strapping'],
    ioMux: ['GPIO9'],
    notes: ['Strapping pin with default weak pull-up.', 'GPIO8=1 with GPIO9=0 selects joint download boot mode.'],
    warnings: warnings('strapping', 'boot'),
    keywords: ['gpio9', 'strap', 'strapping', 'boot', 'download'],
  }),
  io(16, 'GPIO10', 10, { side: 'top', order: 8 }, {
    mainFunctions: ['GPIO10', 'FSPICS0'],
    ioMux: ['GPIO10', 'FSPICS0'],
    notes: ['Espressif documents a low-level power-up glitch on this pin.'],
    warnings: warnings('glitch'),
    keywords: ['gpio10', 'spi', 'fspi', 'chip select', 'glitch'],
  }),
  pin(17, 'VDD3P3_CPU', 'power', { side: 'right', order: 1 }, {
    mainFunctions: ['CPU IO power supply'],
    notes: ['Supplies the digital power domain.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'cpu', '3v3'],
  }),
  pin(18, 'VDD_SPI', 'power', { side: 'right', order: 2 }, {
    gpio: 11,
    mainFunctions: ['GPIO11', 'VDD_SPI flash power'],
    ioMux: ['GPIO11'],
    notes: ['Flash power supply pin by default. It can be reconfigured as GPIO11 only when external flash has an external power supply.'],
    warnings: warnings('power', 'flash', 'voltage'),
    keywords: ['gpio11', 'vdd spi', 'flash', 'memory', 'power', 'voltage'],
  }),
  io(19, 'SPIHD', 12, { side: 'right', order: 3 }, {
    mainFunctions: ['GPIO12', 'SPIHD', 'Flash HOLD#/SIO3'],
    ioMux: ['SPIHD', 'GPIO12'],
    notes: [flashCaution],
    warnings: warnings('flash'),
    keywords: ['gpio12', 'flash', 'spi', 'hold', 'sio3'],
  }),
  io(20, 'SPIWP', 13, { side: 'right', order: 4 }, {
    mainFunctions: ['GPIO13', 'SPIWP', 'Flash WP#/SIO2'],
    ioMux: ['SPIWP', 'GPIO13'],
    notes: [flashCaution],
    warnings: warnings('flash'),
    keywords: ['gpio13', 'flash', 'spi', 'wp', 'sio2'],
  }),
  io(21, 'SPICS0', 14, { side: 'right', order: 5 }, {
    mainFunctions: ['GPIO14', 'SPICS0', 'Flash CS#'],
    ioMux: ['SPICS0', 'GPIO14'],
    notes: [flashCaution],
    warnings: warnings('flash'),
    keywords: ['gpio14', 'flash', 'spi', 'chip select', 'cs'],
  }),
  io(22, 'SPICLK', 15, { side: 'right', order: 6 }, {
    mainFunctions: ['GPIO15', 'SPICLK', 'Flash clock'],
    ioMux: ['SPICLK', 'GPIO15'],
    notes: [flashCaution],
    warnings: warnings('flash'),
    keywords: ['gpio15', 'flash', 'spi', 'clock'],
  }),
  io(23, 'SPID', 16, { side: 'right', order: 7 }, {
    mainFunctions: ['GPIO16', 'SPID', 'Flash MOSI/SIO0'],
    ioMux: ['SPID', 'GPIO16'],
    notes: [flashCaution],
    warnings: warnings('flash'),
    keywords: ['gpio16', 'flash', 'spi', 'mosi', 'sio0'],
  }),
  io(24, 'SPIQ', 17, { side: 'right', order: 8 }, {
    mainFunctions: ['GPIO17', 'SPIQ', 'Flash MISO/SIO1'],
    ioMux: ['SPIQ', 'GPIO17'],
    notes: [flashCaution],
    warnings: warnings('flash'),
    keywords: ['gpio17', 'flash', 'spi', 'miso', 'sio1'],
  }),
  io(25, 'GPIO18', 18, { side: 'bottom', order: 8 }, {
    mainFunctions: ['GPIO18', 'USB_D-'],
    ioMux: ['GPIO18'],
    analog: ['USB_D-'],
    notes: [usbCaution, 'Espressif documents a high-level power-up glitch on this pin.'],
    warnings: warnings('usb', 'glitch'),
    keywords: ['gpio18', 'usb', 'usb d-', 'serial jtag', 'glitch'],
  }),
  io(26, 'GPIO19', 19, { side: 'bottom', order: 7 }, {
    mainFunctions: ['GPIO19', 'USB_D+'],
    ioMux: ['GPIO19'],
    analog: ['USB_D+'],
    notes: [usbCaution],
    warnings: warnings('usb'),
    keywords: ['gpio19', 'usb', 'usb d+', 'serial jtag'],
  }),
  io(27, 'U0RXD', 20, { side: 'bottom', order: 6 }, {
    mainFunctions: ['GPIO20', 'U0RXD'],
    ioMux: ['U0RXD', 'GPIO20'],
    notes: [uart0Caution, 'Espressif documents a low-level power-up glitch on this pin.'],
    warnings: warnings('uart0', 'glitch'),
    keywords: ['gpio20', 'uart0', 'serial', 'rxd', 'boot log', 'glitch'],
  }),
  io(28, 'U0TXD', 21, { side: 'bottom', order: 5 }, {
    mainFunctions: ['GPIO21', 'U0TXD'],
    ioMux: ['U0TXD', 'GPIO21'],
    notes: [uart0Caution, 'ROM boot messages print to UART0 by default.'],
    warnings: warnings('uart0'),
    keywords: ['gpio21', 'uart0', 'serial', 'txd', 'boot log'],
  }),
  pin(29, 'XTAL_N', 'analog', { side: 'bottom', order: 4 }, {
    mainFunctions: ['Main crystal negative clock input/output'],
    analog: ['XTAL_N'],
    notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
    keywords: ['xtal', 'crystal', 'clock', 'analog'],
  }),
  pin(30, 'XTAL_P', 'analog', { side: 'bottom', order: 3 }, {
    mainFunctions: ['Main crystal positive clock input/output'],
    analog: ['XTAL_P'],
    notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
    keywords: ['xtal', 'crystal', 'clock', 'analog'],
  }),
  pin(31, 'VDDA', 'power', { side: 'bottom', order: 2 }, {
    mainFunctions: ['Analog power input'],
    notes: ['Analog power-domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'analog'],
  }),
  pin(32, 'VDDA', 'power', { side: 'bottom', order: 1 }, {
    mainFunctions: ['Analog power input'],
    notes: ['Analog power-domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'analog'],
  }),
  pin(33, 'GND', 'ground', { side: 'center', order: 1 }, {
    mainFunctions: ['Exposed ground pad'],
    notes: ['External ground connection.'],
    warnings: warnings('power'),
    keywords: ['ground', 'gnd', 'epad', 'thermal pad'],
  }),
];

const qfn32SixteenGpioPins = qfn32Pins.map((candidate) => {
  if (candidate.number < 19 || candidate.number > 24) return { ...candidate, id: candidate.id.replace('esp32c3-', 'esp32c3-16gpio-') };

  return {
    ...candidate,
    id: candidate.id.replace('esp32c3-', 'esp32c3-16gpio-'),
    name: 'NC',
    type: 'control' as const,
    gpio: undefined,
    mainFunctions: ['No connect'],
    ioMux: undefined,
    analog: undefined,
    matrixSignals: undefined,
    notes: ['This package variant does not bond this physical pad.'],
    warnings: undefined,
    keywords: ['nc', 'no connect', 'not connected'],
  };
});

export const esp32c3: SocDefinition = {
  id: 'esp32c3',
  name: 'ESP32-C3',
  family: 'ESP32',
  defaultPackageId: 'esp32c3-qfn32-22-gpio',
  defaultProfileId: 'esp32c3-qfn32-22-gpio',
  chipSpecs: {
    cpu: 'Single-core 32-bit RISC-V CPU up to 160 MHz',
    wireless: '2.4 GHz Wi-Fi and Bluetooth LE 5.',
    sram: '400 KB SRAM.',
    rom: '384 KB ROM.',
  },
  packageName: 'QFN32 (5 x 5 mm), 22 GPIO, top view',
  description: 'ESP32-C3 Wi-Fi and Bluetooth LE SoC pinout.',
  source,
  pins: qfn32Pins,
};

function findC3PinByGpio(gpio: number | undefined) {
  return gpio === undefined ? undefined : esp32c3.pins.find((candidate) => candidate.gpio === gpio);
}

function modulePin(
  profileId: string,
  keywords: string[],
  number: number,
  name: string,
  type: PinType,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position'>> = {},
): SocPin {
  return {
    id: `${profileId}-pin-${number}`,
    number,
    name,
    type,
    position,
    mainFunctions: [],
    ...details,
    keywords: uniqueValues([...(details.keywords ?? []), ...keywords, `pin ${number}`]),
  };
}

function moduleIoPin(
  profileId: string,
  keywords: string[],
  number: number,
  name: string,
  gpio: number,
  position: PinPosition,
): SocPin {
  const sourcePin = findC3PinByGpio(gpio);

  return modulePin(profileId, keywords, number, name, 'io', position, {
    gpio,
    mainFunctions: sourcePin?.mainFunctions ?? [`GPIO${gpio}`],
    ioMux: sourcePin?.ioMux,
    analog: sourcePin?.analog,
    matrixSignals: sourcePin?.matrixSignals,
    notes: sourcePin?.notes,
    warnings: sourcePin?.warnings,
    keywords: uniqueValues([...(sourcePin?.keywords ?? []), `gpio${gpio}`, `io${gpio}`]),
  });
}

function moduleGroundPin(profileId: string, keywords: string[], number: number, position: PinPosition): SocPin {
  return modulePin(profileId, keywords, number, 'GND', 'ground', position, {
    mainFunctions: ['Ground'],
    notes: ['Module ground pad.'],
    warnings: warnings('power'),
    keywords: ['ground', 'gnd'],
  });
}

function moduleNoConnectPin(profileId: string, keywords: string[], number: number, position: PinPosition): SocPin {
  return modulePin(profileId, keywords, number, 'NC', 'control', position, {
    mainFunctions: ['No connect'],
    notes: ['Official module pad is not connected.'],
    keywords: ['nc', 'no connect', 'not connected'],
  });
}

const miniKeywords = ['module', 'mini', 'mini-1', 'esp32-c3-mini-1', 'esp32c3 mini', 'castellated pad'];

function createMini1Pins(profileId: string): SocPin[] {
  const left = (number: number) => ({ side: 'left' as const, order: number });
  const bottom = (number: number) => ({ side: 'bottom' as const, order: number - 11 });
  const right = (number: number) => ({ side: 'right' as const, order: number - 25 });
  const top = (number: number) => ({ side: 'top' as const, order: number - 35 });

  return [
    moduleGroundPin(profileId, miniKeywords, 1, left(1)),
    moduleGroundPin(profileId, miniKeywords, 2, left(2)),
    modulePin(profileId, miniKeywords, 3, '3V3', 'power', left(3), {
      mainFunctions: ['3.3 V module power supply'],
      notes: ['Module power supply input. Espressif specifies a 3.0 V to 3.6 V operating range.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['power', 'supply', '3v3', '3.3v'],
    }),
    moduleNoConnectPin(profileId, miniKeywords, 4, left(4)),
    moduleIoPin(profileId, miniKeywords, 5, 'IO2', 2, left(5)),
    moduleIoPin(profileId, miniKeywords, 6, 'IO3', 3, left(6)),
    moduleNoConnectPin(profileId, miniKeywords, 7, left(7)),
    modulePin(profileId, miniKeywords, 8, 'EN', 'control', left(8), {
      mainFunctions: ['Chip enable and reset'],
      notes: ['High enables the chip; low powers it off or resets it.', 'Do not leave EN floating.'],
      warnings: warnings('reset'),
      keywords: ['enable', 'reset', 'chip en'],
    }),
    moduleNoConnectPin(profileId, miniKeywords, 9, left(9)),
    moduleNoConnectPin(profileId, miniKeywords, 10, left(10)),
    moduleGroundPin(profileId, miniKeywords, 11, left(11)),
    moduleIoPin(profileId, miniKeywords, 12, 'IO0', 0, bottom(12)),
    moduleIoPin(profileId, miniKeywords, 13, 'IO1', 1, bottom(13)),
    moduleGroundPin(profileId, miniKeywords, 14, bottom(14)),
    moduleNoConnectPin(profileId, miniKeywords, 15, bottom(15)),
    moduleIoPin(profileId, miniKeywords, 16, 'IO10', 10, bottom(16)),
    moduleNoConnectPin(profileId, miniKeywords, 17, bottom(17)),
    moduleIoPin(profileId, miniKeywords, 18, 'IO4', 4, bottom(18)),
    moduleIoPin(profileId, miniKeywords, 19, 'IO5', 5, bottom(19)),
    moduleIoPin(profileId, miniKeywords, 20, 'IO6', 6, bottom(20)),
    moduleIoPin(profileId, miniKeywords, 21, 'IO7', 7, bottom(21)),
    moduleIoPin(profileId, miniKeywords, 22, 'IO8', 8, bottom(22)),
    moduleIoPin(profileId, miniKeywords, 23, 'IO9', 9, bottom(23)),
    moduleNoConnectPin(profileId, miniKeywords, 24, bottom(24)),
    moduleNoConnectPin(profileId, miniKeywords, 25, bottom(25)),
    moduleIoPin(profileId, miniKeywords, 26, 'IO18', 18, right(26)),
    moduleIoPin(profileId, miniKeywords, 27, 'IO19', 19, right(27)),
    moduleNoConnectPin(profileId, miniKeywords, 28, right(28)),
    moduleNoConnectPin(profileId, miniKeywords, 29, right(29)),
    moduleIoPin(profileId, miniKeywords, 30, 'RXD0', 20, right(30)),
    moduleIoPin(profileId, miniKeywords, 31, 'TXD0', 21, right(31)),
    moduleNoConnectPin(profileId, miniKeywords, 32, right(32)),
    moduleNoConnectPin(profileId, miniKeywords, 33, right(33)),
    moduleNoConnectPin(profileId, miniKeywords, 34, right(34)),
    moduleNoConnectPin(profileId, miniKeywords, 35, right(35)),
    ...Array.from({ length: 13 }, (_, index) => moduleGroundPin(profileId, miniKeywords, index + 36, top(index + 36))),
    moduleGroundPin(profileId, miniKeywords, 49, { side: 'center', order: 1 }),
    moduleGroundPin(profileId, miniKeywords, 50, { side: 'right', order: 11 }),
    moduleGroundPin(profileId, miniKeywords, 51, { side: 'right', order: 12 }),
    moduleGroundPin(profileId, miniKeywords, 52, { side: 'left', order: 12 }),
    moduleGroundPin(profileId, miniKeywords, 53, { side: 'left', order: 13 }),
  ];
}

const wroomKeywords = ['module', 'wroom', 'wroom-02', 'esp32-c3-wroom-02', 'esp32c3 wroom', 'castellated pad'];

function createWroom02Pins(profileId: string): SocPin[] {
  const left = (number: number) => ({ side: 'left' as const, order: 10 - number });
  const right = (number: number) => ({ side: 'right' as const, order: number - 9 });

  return [
    modulePin(profileId, wroomKeywords, 1, '3V3', 'power', left(1), {
      mainFunctions: ['3.3 V module power supply'],
      notes: ['Module power supply input. Espressif specifies a 3.0 V to 3.6 V operating range.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['power', 'supply', '3v3', '3.3v'],
    }),
    modulePin(profileId, wroomKeywords, 2, 'EN', 'control', left(2), {
      mainFunctions: ['Chip enable and reset'],
      notes: ['High enables the chip; low powers it off or resets it.', 'Do not leave EN floating.'],
      warnings: warnings('reset'),
      keywords: ['enable', 'reset', 'chip en'],
    }),
    moduleIoPin(profileId, wroomKeywords, 3, 'IO4', 4, left(3)),
    moduleIoPin(profileId, wroomKeywords, 4, 'IO5', 5, left(4)),
    moduleIoPin(profileId, wroomKeywords, 5, 'IO6', 6, left(5)),
    moduleIoPin(profileId, wroomKeywords, 6, 'IO7', 7, left(6)),
    moduleIoPin(profileId, wroomKeywords, 7, 'IO8', 8, left(7)),
    moduleIoPin(profileId, wroomKeywords, 8, 'IO9', 9, left(8)),
    moduleGroundPin(profileId, wroomKeywords, 9, left(9)),
    moduleIoPin(profileId, wroomKeywords, 10, 'IO10', 10, right(10)),
    moduleIoPin(profileId, wroomKeywords, 11, 'RXD', 20, right(11)),
    moduleIoPin(profileId, wroomKeywords, 12, 'TXD', 21, right(12)),
    moduleIoPin(profileId, wroomKeywords, 13, 'IO18', 18, right(13)),
    moduleIoPin(profileId, wroomKeywords, 14, 'IO19', 19, right(14)),
    moduleIoPin(profileId, wroomKeywords, 15, 'IO3', 3, right(15)),
    moduleIoPin(profileId, wroomKeywords, 16, 'IO2', 2, right(16)),
    moduleIoPin(profileId, wroomKeywords, 17, 'IO1', 1, right(17)),
    moduleIoPin(profileId, wroomKeywords, 18, 'IO0', 0, right(18)),
    moduleGroundPin(profileId, wroomKeywords, 19, { side: 'bottom', order: 1 }),
  ];
}

const qfn32SixteenGpioProfile: SocPackageVariant = {
  id: 'esp32c3-qfn32-16-gpio',
  name: 'QFN32, 16 GPIO',
  packageName: 'ESP32-C3 QFN32 (5 x 5 mm), 16 GPIO, top view',
  kind: 'package',
  source,
  identificationNotes: [
    'ESP32-C3FH4X and ESP32-C3FH4AZ do not bond physical pads 19 through 24; this is not the 22-GPIO package pinout.',
  ],
  pins: qfn32SixteenGpioPins,
};

const mini1Variant: SocModuleVariant = {
  name: 'ESP32-C3-MINI-1',
  antenna: 'On-board PCB antenna',
  flash: '4 MB or 8 MB Quad SPI flash in the chip package, depending on module variant',
  psram: 'No PSRAM',
  footprint: '13.2 x 16.6 x 2.4 mm',
  pinoutImpact: 'Same 53-pad module pinout as MINI-1U; antenna implementation and module length differ.',
  source: mini1Source,
};

const mini1UVariant: SocModuleVariant = {
  name: 'ESP32-C3-MINI-1U',
  antenna: 'External antenna connector',
  flash: '4 MB Quad SPI flash in the chip package',
  psram: 'No PSRAM',
  footprint: '13.2 x 12.5 x 2.4 mm',
  pinoutImpact: 'Same 53-pad module pinout as MINI-1; antenna connector changes the RF layout only.',
  source: mini1Source,
};

const wroom02Variant: SocModuleVariant = {
  name: 'ESP32-C3-WROOM-02',
  antenna: 'On-board PCB antenna',
  flash: '4 MB or 8 MB external Quad SPI flash, depending on module variant',
  psram: 'No PSRAM',
  footprint: '18.0 x 20.0 x 3.2 mm',
  pinoutImpact: 'Same 19-pad module pinout as WROOM-02U; antenna implementation and module length differ.',
  source: wroom02Source,
};

const wroom02UVariant: SocModuleVariant = {
  name: 'ESP32-C3-WROOM-02U',
  antenna: 'External antenna connector',
  flash: '4 MB or 8 MB external Quad SPI flash, depending on module variant',
  psram: 'No PSRAM',
  footprint: '18.0 x 14.3 x 3.2 mm',
  pinoutImpact: 'Same 19-pad module pinout as WROOM-02; antenna connector changes the RF layout only.',
  source: wroom02Source,
};

const mini1Profile: SocPackageVariant = {
  id: 'esp32c3-mini-1',
  name: 'MINI-1',
  packageName: 'ESP32-C3-MINI-1 module, 53 pads, top view',
  kind: 'module',
  source: mini1Source,
  moduleNames: ['ESP32-C3-MINI-1'],
  moduleVariants: [mini1Variant],
  identificationNotes: [
    'This profile is the 53-pad ESP32-C3-MINI-1 module layout, not the bare ESP32-C3 QFN package.',
    'ESP32-C3-MINI-1 uses an on-board PCB antenna; the related MINI-1U uses an external antenna connector with the same pad pinout.',
  ],
  pins: createMini1Pins('esp32c3-mini-1'),
};

const mini1UProfile: SocPackageVariant = {
  id: 'esp32c3-mini-1u',
  name: 'MINI-1U',
  packageName: 'ESP32-C3-MINI-1U module, 53 pads, top view',
  kind: 'module',
  source: mini1Source,
  moduleNames: ['ESP32-C3-MINI-1U'],
  moduleVariants: [mini1UVariant],
  identificationNotes: [
    'This profile is the 53-pad ESP32-C3-MINI-1U module layout, not the bare ESP32-C3 QFN package.',
    'ESP32-C3-MINI-1U uses an external antenna connector and has no PCB-antenna keepout zone; its pad pinout matches ESP32-C3-MINI-1.',
  ],
  pins: createMini1Pins('esp32c3-mini-1u').map((candidate) => ({
    ...candidate,
    keywords: uniqueValues([...(candidate.keywords ?? []), 'mini-1u', 'esp32-c3-mini-1u', 'external antenna', 'antenna connector']),
  })),
};

const wroom02Profile: SocPackageVariant = {
  id: 'esp32c3-wroom-02',
  name: 'WROOM-02',
  packageName: 'ESP32-C3-WROOM-02 module, 19 pads, top view',
  kind: 'module',
  source: wroom02Source,
  moduleNames: ['ESP32-C3-WROOM-02'],
  moduleVariants: [wroom02Variant],
  identificationNotes: [
    'This profile is the 19-pad ESP32-C3-WROOM-02 module layout, not the bare ESP32-C3 QFN package.',
    'ESP32-C3-WROOM-02 uses an on-board PCB antenna; the related WROOM-02U uses an external antenna connector with the same pad pinout.',
  ],
  pins: createWroom02Pins('esp32c3-wroom-02'),
};

const wroom02UProfile: SocPackageVariant = {
  id: 'esp32c3-wroom-02u',
  name: 'WROOM-02U',
  packageName: 'ESP32-C3-WROOM-02U module, 19 pads, top view',
  kind: 'module',
  source: wroom02Source,
  moduleNames: ['ESP32-C3-WROOM-02U'],
  moduleVariants: [wroom02UVariant],
  identificationNotes: [
    'This profile is the 19-pad ESP32-C3-WROOM-02U module layout, not the bare ESP32-C3 QFN package.',
    'ESP32-C3-WROOM-02U uses an external antenna connector and has no PCB-antenna keepout zone; its pad pinout matches ESP32-C3-WROOM-02.',
  ],
  pins: createWroom02Pins('esp32c3-wroom-02u').map((candidate) => ({
    ...candidate,
    keywords: uniqueValues([...(candidate.keywords ?? []), 'wroom-02u', 'esp32-c3-wroom-02u', 'external antenna', 'antenna connector']),
  })),
};

esp32c3.packageVariants = [qfn32SixteenGpioProfile, mini1Profile, mini1UProfile, wroom02Profile, wroom02UProfile];
