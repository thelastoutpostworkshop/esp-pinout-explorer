import { createEsp32h2BoardProfiles } from '@/data/boards/esp32h2';
import { mini1Source } from '@/data/boards/esp32h2';
import type { PinPosition, PinType, PinWarning, SocDefinition, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

const source: SocSource = {
  title: 'ESP32-H2 Series Datasheet',
  version: 'v1.2',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-h2_datasheet_en.pdf',
  sections: [
    'Figure 2-1 ESP32-H2 Pin Layout (Top View)',
    'Table 2-1 Pin Overview',
    'Table 2-3 IO MUX Pin Functions',
    'Table 2-5 Analog Functions',
    'Section 2.3.3 Restrictions for GPIOs',
    'Table 2-6 Analog Pins',
    'Table 2-7 Power Pins',
    'Table 3-1 Default Configuration of Strapping Pins',
    'Table 3-3 Chip Boot Mode Control',
    'Table 3-4 UART0 ROM Message Printing Control',
    'Table 3-6 JTAG Signal Source Control',
    'Appendix A ESP32-H2 Consolidated Pin Overview',
  ],
};

const gpioMatrixSignals = [
  'SPI2',
  'UART1',
  'I2C',
  'I2S',
  'PCNT',
  'TWAI',
  'LED PWM',
  'MCPWM',
  'RMT',
  'PARLIO',
];

const jtagCaution = 'JTAG debug signal; freeing these pins may require using USB Serial/JTAG instead.';
const uart0Caution = 'UART0 is commonly used for boot messages, flashing, and serial debugging.';
const usbCaution =
  'USB_D pins are connected to the USB Serial/JTAG controller by default and need reconfiguration before regular GPIO use.';

function id(number: number) {
  return `esp32h2-pin-${number}`;
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

export const esp32h2: SocDefinition = {
  id: 'esp32h2',
  name: 'ESP32-H2',
  family: 'ESP32',
  defaultPackageId: 'esp32h2-qfn32',
  defaultProfileId: 'esp32h2-devkitm-1',
  chipSpecs: {
    cpu: 'Single-core 32-bit RISC-V CPU up to 96 MHz',
    wireless: 'Bluetooth 5 LE and IEEE 802.15.4 for Thread, Zigbee, and Matter.',
    sram: '320 KB SRAM and 4 KB LP memory.',
    rom: '128 KB ROM.',
  },
  packageName: 'QFN32 (4 x 4 mm), top view',
  description: 'ESP32-H2 Bluetooth LE and IEEE 802.15.4 SoC pinout.',
  source,
  pins: [
    pin(1, 'VDD3P3', 'power', { side: 'left', order: 8 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(2, 'VDD3P3', 'power', { side: 'left', order: 7 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    io(3, 'GPIO0', 0, { side: 'left', order: 6 }, {
      mainFunctions: ['GPIO0', 'FSPIQ'],
      ioMux: ['GPIO0', 'FSPIQ'],
      keywords: ['gpio0', 'spi', 'fspi'],
    }),
    io(4, 'GPIO1', 1, { side: 'left', order: 5 }, {
      mainFunctions: ['GPIO1', 'FSPICS0', 'ADC1_CH0'],
      ioMux: ['GPIO1', 'FSPICS0'],
      analog: ['ADC1_CH0'],
      keywords: ['gpio1', 'adc1', 'spi', 'fspi'],
    }),
    io(5, 'MTMS', 2, { side: 'left', order: 4 }, {
      mainFunctions: ['GPIO2', 'MTMS', 'FSPIWP', 'ADC1_CH1'],
      ioMux: ['MTMS', 'GPIO2', 'FSPIWP'],
      analog: ['ADC1_CH1'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['gpio2', 'jtag', 'mtms', 'adc1', 'spi', 'fspi'],
    }),
    io(6, 'MTDO', 3, { side: 'left', order: 3 }, {
      mainFunctions: ['GPIO3', 'MTDO', 'FSPIHD', 'ADC1_CH2'],
      ioMux: ['MTDO', 'GPIO3', 'FSPIHD'],
      analog: ['ADC1_CH2'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['gpio3', 'jtag', 'mtdo', 'adc1', 'spi', 'fspi'],
    }),
    io(7, 'MTCK', 4, { side: 'left', order: 2 }, {
      mainFunctions: ['GPIO4', 'MTCK', 'FSPICLK', 'ADC1_CH3'],
      ioMux: ['MTCK', 'GPIO4', 'FSPICLK'],
      analog: ['ADC1_CH3'],
      notes: [jtagCaution, 'Reset pull-up behavior depends on EFUSE_DIS_PAD_JTAG.'],
      warnings: warnings('jtag'),
      keywords: ['gpio4', 'jtag', 'mtck', 'adc1', 'spi', 'fspi', 'clock'],
    }),
    io(8, 'MTDI', 5, { side: 'left', order: 1 }, {
      mainFunctions: ['GPIO5', 'MTDI', 'FSPID', 'ADC1_CH4'],
      ioMux: ['MTDI', 'GPIO5', 'FSPID'],
      analog: ['ADC1_CH4'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['gpio5', 'jtag', 'mtdi', 'adc1', 'spi', 'fspi'],
    }),
    pin(9, 'VDDPST1', 'power', { side: 'top', order: 1 }, {
      mainFunctions: ['IO power domain input'],
      notes: ['Supplies the VDDPST1 IO power domain, including digital IO and LP IO.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'vddpst1', 'io power', 'lp io'],
    }),
    io(10, 'GPIO8', 8, { side: 'top', order: 2 }, {
      mainFunctions: ['GPIO8', 'Boot mode strapping', 'ROM message control'],
      ioMux: ['GPIO8'],
      notes: [
        'Strapping pin with default floating state.',
        'Controls boot mode with GPIO9; GPIO8=1 and GPIO9=0 selects joint download boot mode.',
        'Also participates in UART0 ROM message printing control.',
      ],
      warnings: warnings('strapping', 'boot'),
      keywords: ['gpio8', 'strap', 'strapping', 'boot', 'download', 'rom messages', 'log'],
    }),
    io(11, 'GPIO9', 9, { side: 'top', order: 3 }, {
      mainFunctions: ['GPIO9', 'Boot mode strapping'],
      ioMux: ['GPIO9'],
      notes: [
        'Strapping pin with default weak pull-up.',
        'Controls boot mode with GPIO8; GPIO8=1 and GPIO9=0 selects joint download boot mode.',
      ],
      warnings: warnings('strapping', 'boot'),
      keywords: ['gpio9', 'strap', 'strapping', 'boot', 'download'],
    }),
    io(12, 'GPIO10', 10, { side: 'top', order: 4 }, {
      mainFunctions: ['GPIO10', 'ZCD0'],
      ioMux: ['GPIO10'],
      analog: ['ZCD0'],
      keywords: ['gpio10', 'zcd', 'voltage comparator'],
    }),
    io(13, 'GPIO11', 11, { side: 'top', order: 5 }, {
      mainFunctions: ['GPIO11', 'ZCD1'],
      ioMux: ['GPIO11'],
      analog: ['ZCD1'],
      keywords: ['gpio11', 'zcd', 'voltage comparator'],
    }),
    io(14, 'GPIO12', 12, { side: 'top', order: 6 }, {
      mainFunctions: ['GPIO12'],
      ioMux: ['GPIO12'],
      keywords: ['gpio12'],
    }),
    io(15, 'XTAL_32K_P', 13, { side: 'top', order: 7 }, {
      mainFunctions: ['GPIO13', 'XTAL_32K_P'],
      ioMux: ['GPIO13'],
      analog: ['XTAL_32K_P'],
      notes: ['Package pin name is XTAL_32K_P; GPIO identity is GPIO13.'],
      keywords: ['gpio13', 'xtal', '32k', 'crystal', 'low power clock'],
    }),
    io(16, 'XTAL_32K_N', 14, { side: 'top', order: 8 }, {
      mainFunctions: ['GPIO14', 'XTAL_32K_N'],
      ioMux: ['GPIO14'],
      analog: ['XTAL_32K_N'],
      notes: ['Package pin name is XTAL_32K_N; GPIO identity is GPIO14.'],
      keywords: ['gpio14', 'xtal', '32k', 'crystal', 'low power clock'],
    }),
    pin(17, 'CHIP_EN', 'control', { side: 'right', order: 1 }, {
      mainFunctions: ['Chip power-up and reset enable'],
      notes: ['High enables the chip; low disables or resets it.', 'Do not leave CHIP_EN floating.'],
      warnings: warnings('reset'),
      keywords: ['enable', 'reset', 'chip en', 'power up', 'en'],
    }),
    pin(18, 'VBAT', 'power', { side: 'right', order: 2 }, {
      mainFunctions: ['Battery power supply'],
      notes: ['Analog power domain or battery power supply input.'],
      warnings: warnings('power', 'voltage'),
      keywords: ['vbat', 'battery', 'power', 'supply'],
    }),
    pin(19, 'VDDA_PMU', 'power', { side: 'right', order: 3 }, {
      mainFunctions: ['Analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'analog', 'pmu'],
    }),
    pin(20, 'VDDPST2', 'power', { side: 'right', order: 4 }, {
      mainFunctions: ['IO power domain input'],
      notes: ['Supplies the VDDPST2 IO power domain.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'vddpst2', 'io power'],
    }),
    io(21, 'GPIO22', 22, { side: 'right', order: 5 }, {
      mainFunctions: ['GPIO22'],
      ioMux: ['GPIO22'],
      keywords: ['gpio22'],
    }),
    io(22, 'U0RXD', 23, { side: 'right', order: 6 }, {
      mainFunctions: ['GPIO23', 'U0RXD', 'FSPICS1'],
      ioMux: ['U0RXD', 'GPIO23', 'FSPICS1'],
      notes: [uart0Caution],
      warnings: warnings('uart0'),
      keywords: ['gpio23', 'uart0', 'serial', 'debug', 'boot log', 'rxd', 'spi', 'fspi'],
    }),
    io(23, 'U0TXD', 24, { side: 'right', order: 7 }, {
      mainFunctions: ['GPIO24', 'U0TXD', 'FSPICS2'],
      ioMux: ['U0TXD', 'GPIO24', 'FSPICS2'],
      notes: [uart0Caution, 'ROM boot messages print to UART0 by default unless configured otherwise.'],
      warnings: warnings('uart0'),
      keywords: ['gpio24', 'uart0', 'serial', 'debug', 'boot log', 'txd', 'spi', 'fspi'],
    }),
    io(24, 'GPIO25', 25, { side: 'right', order: 8 }, {
      mainFunctions: ['GPIO25', 'FSPICS3', 'JTAG signal source strapping'],
      ioMux: ['GPIO25', 'FSPICS3'],
      notes: [
        'Strapping pin for JTAG signal source selection; default is floating.',
        'Espressif notes GPIO25 has no internal pull resistors and the external circuit must not be high impedance during strapping.',
      ],
      warnings: warnings('strapping', 'jtag'),
      keywords: ['gpio25', 'strap', 'strapping', 'jtag', 'debug', 'spi', 'fspi'],
    }),
    io(25, 'GPIO26', 26, { side: 'bottom', order: 8 }, {
      mainFunctions: ['GPIO26', 'FSPICS4', 'USB_D-'],
      ioMux: ['GPIO26', 'FSPICS4'],
      analog: ['USB_D-'],
      notes: [usbCaution, 'Default drive strength for GPIO26 is 40 mA.'],
      warnings: warnings('usb'),
      keywords: ['gpio26', 'usb', 'usb d-', 'usb dm', 'serial jtag', 'spi', 'fspi'],
    }),
    io(26, 'GPIO27', 27, { side: 'bottom', order: 7 }, {
      mainFunctions: ['GPIO27', 'FSPICS5', 'USB_D+'],
      ioMux: ['GPIO27', 'FSPICS5'],
      analog: ['USB_D+'],
      notes: [usbCaution, 'Default drive strength for GPIO27 is 40 mA.'],
      warnings: warnings('usb'),
      keywords: ['gpio27', 'usb', 'usb d+', 'usb dp', 'serial jtag', 'spi', 'fspi'],
    }),
    pin(27, 'VDD3P3', 'power', { side: 'bottom', order: 6 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(28, 'XTAL_N', 'analog', { side: 'bottom', order: 5 }, {
      mainFunctions: ['Main crystal negative clock input/output'],
      analog: ['XTAL_N'],
      notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
    }),
    pin(29, 'XTAL_P', 'analog', { side: 'bottom', order: 4 }, {
      mainFunctions: ['Main crystal positive clock input/output'],
      analog: ['XTAL_P'],
      notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
    }),
    pin(30, 'VDD3P3', 'power', { side: 'bottom', order: 3 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(31, 'VDD3P3', 'power', { side: 'bottom', order: 2 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(32, 'ANT', 'analog', { side: 'bottom', order: 1 }, {
      mainFunctions: ['RF input/output'],
      analog: ['Antenna RF input/output'],
      notes: ['Dedicated RF analog pin, not a GPIO.'],
      keywords: ['antenna', 'rf', 'analog', 'ble', '802.15.4', 'zigbee', 'thread', 'matter'],
    }),
    pin(33, 'GND', 'ground', { side: 'center', order: 1 }, {
      mainFunctions: ['Exposed ground pad'],
      notes: ['External ground connection.'],
      warnings: warnings('power'),
      keywords: ['ground', 'gnd', 'epad', 'thermal pad'],
    }),
  ],
};

function findH2PinByGpio(gpio: number | undefined) {
  return esp32h2.pins.find((pin) => pin.gpio === gpio);
}

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function modulePin(
  profileId: string,
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
    keywords: uniqueValues([...(details.keywords ?? []), 'module', 'mini-1', 'esp32-h2-mini-1', `pin ${number}`]),
  };
}

function moduleIoPin(profileId: string, number: number, gpio: number, position: PinPosition, name = `IO${gpio}`): SocPin {
  const sourcePin = findH2PinByGpio(gpio);
  return modulePin(profileId, number, name, 'io', position, {
    gpio,
    mainFunctions: sourcePin?.mainFunctions ?? [`GPIO${gpio}`],
    ioMux: sourcePin?.ioMux,
    rtc: sourcePin?.rtc,
    analog: sourcePin?.analog,
    matrixSignals: sourcePin?.matrixSignals,
    notes: sourcePin?.notes,
    warnings: sourcePin?.warnings,
    keywords: uniqueValues([...(sourcePin?.keywords ?? []), name.toLowerCase(), `gpio${gpio}`, `io${gpio}`]),
  });
}

const mini1GndPads = new Set([1, 2, 11, 14, ...Array.from({ length: 18 }, (_, index) => index + 36)]);
const mini1NoConnectPads = new Set([4, 7, 17, 28, 29, 32, 33, 34, 35]);
const mini1GpioByPad: Record<number, number> = {
  5: 2, 6: 3, 9: 0, 10: 1, 12: 13, 13: 14, 16: 12, 18: 4, 19: 5, 20: 10,
  21: 11, 22: 8, 23: 9, 24: 22, 25: 25, 26: 26, 27: 27, 30: 23, 31: 24,
};

function createMini1Pins(profileId: string): SocPin[] {
  return Array.from({ length: 53 }, (_, index) => {
    const number = index + 1;
    const position = number <= 15
      ? { side: 'left' as const, order: number }
      : number <= 35
        ? { side: 'bottom' as const, order: number - 15 }
        : { side: 'right' as const, order: number - 35 };

    if (mini1GndPads.has(number)) {
      return modulePin(profileId, number, 'GND', 'ground', position, {
        mainFunctions: ['Ground'], notes: ['Module ground pad.'], warnings: warnings('power'), keywords: ['ground', 'gnd'],
      });
    }
    if (number === 3) {
      return modulePin(profileId, number, '3V3', 'power', position, {
        mainFunctions: ['3.3 V module power supply'], notes: ['Module power supply input. Espressif specifies a 3.0 V to 3.6 V operating range.'], warnings: warnings('power', 'voltage'), keywords: ['power', 'supply', '3v3'],
      });
    }
    if (number === 8) {
      return modulePin(profileId, number, 'EN', 'control', position, {
        mainFunctions: ['Chip enable and reset'], notes: ['High enables the chip; low powers it off or resets it. Do not leave EN floating.'], warnings: warnings('reset'), keywords: ['enable', 'reset', 'chip en'],
      });
    }
    if (number === 15) {
      return modulePin(profileId, number, 'VBAT', 'power', position, {
        mainFunctions: ['Internal 3.3 V supply or external battery power input'], notes: ['Connected to the internal 3.3 V supply by default; supports external battery power from 3.0 V to 3.6 V.'], warnings: warnings('power', 'voltage'), keywords: ['vbat', 'battery', 'power', '3v3'],
      });
    }
    if (mini1NoConnectPads.has(number)) {
      return modulePin(profileId, number, 'NC', 'control', position, {
        mainFunctions: ['No connect'], notes: ['Official module pad is not connected.'], keywords: ['nc', 'no connect'],
      });
    }
    const gpio = mini1GpioByPad[number];
    return moduleIoPin(profileId, number, gpio, position, number === 30 ? 'RXD0' : number === 31 ? 'TXD0' : undefined);
  });
}

const mini1Profile: SocPackageVariant = {
  id: 'esp32h2-mini-1', name: 'MINI-1', packageName: 'ESP32-H2-MINI-1/1U module, 53 pads, top view', kind: 'module',
  source: mini1Source, moduleNames: ['ESP32-H2-MINI-1', 'ESP32-H2-MINI-1U'],
  moduleVariants: [
    { name: 'ESP32-H2-MINI-1-H2S', antenna: 'On-board PCB antenna', flash: '2 MB Quad SPI in chip package', psram: 'No PSRAM', footprint: '13.2 x 16.6 x 2.4 mm', pinoutImpact: 'Same 53-pad module pinout as MINI-1U; antenna implementation differs.', source: mini1Source },
    { name: 'ESP32-H2-MINI-1-H4S', antenna: 'On-board PCB antenna', flash: '4 MB Quad SPI in chip package', psram: 'No PSRAM', footprint: '13.2 x 16.6 x 2.4 mm', pinoutImpact: 'Same 53-pad module pinout as MINI-1U; antenna implementation differs.', source: mini1Source },
    { name: 'ESP32-H2-MINI-1U-H2S', antenna: 'External antenna connector', flash: '2 MB Quad SPI in chip package', psram: 'No PSRAM', footprint: '13.2 x 12.5 x 2.4 mm', pinoutImpact: 'Same 53-pad module pinout as MINI-1; antenna connector changes RF layout only.', source: mini1Source },
    { name: 'ESP32-H2-MINI-1U-H4S', antenna: 'External antenna connector', flash: '4 MB Quad SPI in chip package', psram: 'No PSRAM', footprint: '13.2 x 12.5 x 2.4 mm', pinoutImpact: 'Same 53-pad module pinout as MINI-1; antenna connector changes RF layout only.', source: mini1Source },
  ],
  identificationNotes: ['This profile is the 53-pad ESP32-H2-MINI-1/1U module layout, not the bare ESP32-H2 package or a development-board header.', 'MINI-1 uses a PCB antenna; MINI-1U uses an external antenna connector with the same padout.'],
  pins: createMini1Pins('esp32h2-mini-1'),
};

esp32h2.packageVariants = [mini1Profile];
esp32h2.boardProfiles = createEsp32h2BoardProfiles(findH2PinByGpio);
