import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { wroom02DuSource } from '@/data/boards/esp8266/moduleSources';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

type DevKitCHeader = 'Top header' | 'Bottom header';

interface DevKitCHeaderPinInput {
  header: DevKitCHeader;
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

const devkitCSource: SocSource = {
  title: 'ESP8266-DevKitC Getting Started Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp8266-rtos-sdk/en/latest/get-started/get-started-devkitc.html',
  sections: [
    'Overview',
    'Functional Description',
    'Power Supply Options',
    'Board Dimensions',
    'Related Documents',
  ],
  figures: [
    {
      title: 'Functional overview and header labels',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp8266-rtos-sdk/en/latest/_images/esp8266-devkitc-functional-overview.jpg',
      alt: 'ESP8266-DevKitC functional overview with ESP-WROOM-02D/U module and I/O connector labels',
      sourceSection: 'Functional Description',
    },
    {
      title: 'Board dimensions',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp8266-rtos-sdk/en/latest/_images/esp8266-devkitc-dimensions-back.jpg',
      alt: 'ESP8266-DevKitC board dimensions back view',
      sourceSection: 'Board Dimensions',
    },
  ],
};

const esp8266DevKitCModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP-WROOM-02D',
    antenna: 'PCB antenna',
    flash: '2 MB / 4 MB / 16 MB SPI flash ordering options',
    psram: 'No PSRAM',
    footprint: '18.0 x 20.0 x 3.2 mm module',
    pinoutImpact: 'Same DevKitC header profile as ESP-WROOM-02U; antenna implementation and module length differ.',
    source: wroom02DuSource,
  },
  {
    name: 'ESP-WROOM-02U',
    antenna: 'U.FL/IPEX external antenna connector',
    flash: '2 MB / 4 MB / 16 MB SPI flash ordering options',
    psram: 'No PSRAM',
    footprint: '18.0 x 14.3 x 3.2 mm module',
    pinoutImpact: 'Same DevKitC header profile as ESP-WROOM-02D; antenna connector changes RF layout only.',
    source: wroom02DuSource,
  },
];

function buildEsp8266DevKitCBoardPin(
  input: DevKitCHeaderPinInput,
  resolveSourcePinByGpio: BoardSourcePinResolver,
): SocPin {
  const sourcePin = input.gpio !== undefined ? resolveSourcePinByGpio(input.gpio) : undefined;
  const displayNumber = `${input.header}-${input.number}`;

  return makeBoardPin({
    id: `esp8266-devkitc-${input.header.toLowerCase().replace(/\s+/g, '-')}-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    boardGroup: input.header,
    position: { side: input.header === 'Top header' ? 'top' : 'bottom', order: input.number },
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `${displayNumber} on the ESP8266-DevKitC I/O connector, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: [
      'board',
      'devkit',
      'devkitc',
      'esp8266-devkitc',
      'esp8266',
      'module',
      'wroom',
      'wroom-02d',
      'wroom-02u',
      'io connector',
      'header',
    ],
    keywords: input.keywords,
  });
}

export function createEsp8266DevKitCProfile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const pin = (input: DevKitCHeaderPinInput) => buildEsp8266DevKitCBoardPin(input, resolveSourcePinByGpio);

  return {
    id: 'esp8266-devkitc',
    name: 'DevKitC (WROOM-02D/U)',
    packageName: 'ESP8266-DevKitC I/O connector headers',
    description:
      'Small ESP8266 development board with ESP-WROOM-02D or ESP-WROOM-02U module, USB-UART bridge, Boot and EN buttons, and side I/O headers.',
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'esp8266-devkitc',
    chipPackageId: 'esp8266ex-qfn32',
    source: devkitCSource,
    boardSpecs: {
      power: [
        'Power can come from Micro USB, 5V/GND header pins, or 3V3/GND header pins; the official guide says these options are mutually exclusive.',
        'The on-board 5V to 3.3V LDO is rated up to 800 mA for the module and user peripherals.',
      ],
      programming: [
        'The USB-UART bridge supports flashing and serial communication through the Micro USB port.',
        'Hold Boot and press EN to enter firmware download mode; the dial switch selects Auto Download or Flow Control.',
      ],
      onBoardHardware: [
        'ESP-WROOM-02D/U module, 5V to 3.3V LDO, dial switch, USB-UART bridge, Boot button, Micro USB port, EN button, and I/O connector headers.',
      ],
    },
    moduleNames: ['ESP-WROOM-02D', 'ESP-WROOM-02U'],
    moduleVariants: esp8266DevKitCModuleVariants,
    identificationNotes: [
      'The shield may show ESP-WROOM-02D or ESP-WROOM-02U. Choose this profile by the ESP8266-DevKitC carrier PCB, Micro USB port, Boot/EN buttons, dial switch, and two 15-pin I/O connector rows.',
    ],
    pins: [
      pin({
        header: 'Top header',
        number: 1,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Top header',
        number: 2,
        label: '16',
        type: 'io',
        gpio: 16,
        mainFunctions: ['GPIO16', 'XPD_DCDC', 'Deep-sleep wakeup'],
        notes: ['GPIO16 can be connected to reset for timed deep-sleep wake-up designs.'],
        keywords: ['io16', 'deep sleep', 'wakeup', 'xpd'],
      }),
      pin({
        header: 'Top header',
        number: 3,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Top header',
        number: 4,
        label: 'TX',
        type: 'io',
        gpio: 1,
        mainFunctions: ['GPIO1', 'U0TXD', 'UART0_TXD'],
        notes: ['Connected to the USB-UART bridge transmit path for flashing and serial logs.'],
        warnings: warnings('uart0', 'onboard'),
        keywords: ['tx', 'txd', 'uart', 'uart0', 'serial', 'usb-uart', 'usb to uart'],
      }),
      pin({
        header: 'Top header',
        number: 5,
        label: 'RX',
        type: 'io',
        gpio: 3,
        mainFunctions: ['GPIO3', 'U0RXD', 'UART0_RXD'],
        notes: ['Connected to the USB-UART bridge receive path for flashing and serial logs.'],
        warnings: warnings('uart0', 'onboard'),
        keywords: ['rx', 'rxd', 'uart', 'uart0', 'serial', 'usb-uart', 'usb to uart'],
      }),
      pin({
        header: 'Top header',
        number: 6,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Top header',
        number: 7,
        label: '4',
        type: 'io',
        gpio: 4,
        mainFunctions: ['GPIO4', 'PWM3'],
        keywords: ['io4', 'pwm'],
      }),
      pin({
        header: 'Top header',
        number: 8,
        label: 'RST',
        type: 'control',
        mainFunctions: ['RST', 'EXT_RSTB', 'Reset'],
        notes: ['Connected to the module reset signal and the board EN/reset button path.'],
        warnings: warnings('reset'),
        keywords: ['rst', 'reset', 'en button', 'enable'],
      }),
      pin({
        header: 'Top header',
        number: 9,
        label: '5',
        type: 'io',
        gpio: 5,
        mainFunctions: ['GPIO5', 'IR Rx'],
        keywords: ['io5', 'ir', 'infrared'],
      }),
      pin({
        header: 'Top header',
        number: 10,
        label: 'ADC',
        type: 'analog',
        mainFunctions: ['TOUT', 'ADC'],
        notes: [
          'ESP8266 analog input. It can measure either external TOUT voltage or the chip supply-voltage calibration path, not both at once.',
          'External TOUT input range is 0 V to 1.0 V.',
        ],
        warnings: warnings('voltage'),
        keywords: ['adc', 'analog', 'tout', '0-1v', 'vdd3p3'],
      }),
      pin({
        header: 'Top header',
        number: 11,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Top header',
        number: 12,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Top header',
        number: 13,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Top header',
        number: 14,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Top header',
        number: 15,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the top I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Bottom header',
        number: 1,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the bottom I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Bottom header',
        number: 2,
        label: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        notes: ['3.3 V board rail from the on-board LDO or an external 3V3 supply path.'],
        warnings: warnings('power'),
        keywords: ['3v3', '3.3v', 'power', 'supply'],
      }),
      pin({
        header: 'Bottom header',
        number: 3,
        label: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        notes: ['3.3 V board rail from the on-board LDO or an external 3V3 supply path.'],
        warnings: warnings('power'),
        keywords: ['3v3', '3.3v', 'power', 'supply'],
      }),
      pin({
        header: 'Bottom header',
        number: 4,
        label: 'EN',
        type: 'control',
        mainFunctions: ['EN', 'Chip enable'],
        notes: ['Chip enable/reset input. Pressing the EN button resets the system.'],
        warnings: warnings('reset'),
        keywords: ['en', 'enable', 'reset', 'en button', 'chip enable'],
      }),
      pin({
        header: 'Bottom header',
        number: 5,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the bottom I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Bottom header',
        number: 6,
        label: '14',
        type: 'io',
        gpio: 14,
        mainFunctions: ['GPIO14', 'MTMS', 'HSPI_CLK', 'I2C_SCL', 'I2SI_WS', 'PWM2', 'IR TX'],
        keywords: ['io14', 'hspi', 'clock', 'clk', 'i2c', 'i2s', 'pwm', 'ir'],
      }),
      pin({
        header: 'Bottom header',
        number: 7,
        label: '12',
        type: 'io',
        gpio: 12,
        mainFunctions: ['GPIO12', 'MTDI', 'HSPI_MISO', 'I2SI_DATA', 'PWM0'],
        keywords: ['io12', 'hspi', 'miso', 'i2s', 'pwm'],
      }),
      pin({
        header: 'Bottom header',
        number: 8,
        label: '13',
        type: 'io',
        gpio: 13,
        mainFunctions: ['GPIO13', 'MTCK', 'HSPI_MOSI', 'UART0_CTS', 'I2SI_BCK'],
        notes: ['The board dial switch can place the USB-UART bridge in Flow Control mode, involving UART0 CTS.'],
        warnings: warnings('onboard'),
        keywords: ['io13', 'hspi', 'mosi', 'uart0', 'cts', 'flow control', 'dial switch'],
      }),
      pin({
        header: 'Bottom header',
        number: 9,
        label: '15',
        type: 'io',
        gpio: 15,
        mainFunctions: ['GPIO15', 'MTDO', 'HSPICS', 'UART0_RTS', 'I2SO_BCK', 'PWM1'],
        notes: [
          'ESP-WROOM-02D/U requires IO15 to be pulled down for boot.',
          'The board dial switch can place the USB-UART bridge in Flow Control mode, involving UART0 RTS.',
        ],
        warnings: warnings('strapping', 'boot', 'onboard'),
        keywords: ['io15', 'hspi', 'hspics', 'cs', 'uart0', 'rts', 'flow control', 'dial switch', 'strap', 'boot'],
      }),
      pin({
        header: 'Bottom header',
        number: 10,
        label: '2',
        type: 'io',
        gpio: 2,
        mainFunctions: ['GPIO2', 'UART1_TXD', 'I2C_SDA', 'I2SO_WS'],
        notes: ['ESP-WROOM-02D/U requires IO2 to float, use its internal pull-up, or be pulled up for boot.'],
        warnings: warnings('strapping', 'boot'),
        keywords: ['io2', 'uart1', 'u1txd', 'i2c', 'i2s', 'strap', 'boot'],
      }),
      pin({
        header: 'Bottom header',
        number: 11,
        label: '0',
        type: 'io',
        gpio: 0,
        mainFunctions: ['GPIO0', 'SPI_CS2', 'Boot mode strapping'],
        notes: [
          'Connected to the Boot button. Holding Boot and pressing EN initiates firmware download mode.',
          'ESP-WROOM-02D/U uses IO0 low for UART download and floating or pulled up for flash boot.',
        ],
        warnings: warnings('strapping', 'boot', 'onboard'),
        keywords: ['io0', 'boot', 'boot button', 'download', 'flash mode', 'strap', 'strapping'],
      }),
      pin({
        header: 'Bottom header',
        number: 12,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the bottom I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Bottom header',
        number: 13,
        label: '5V',
        type: 'power',
        mainFunctions: ['5 V power supply'],
        notes: ['5 V board rail. The official guide says Micro USB, 5V/GND header power, and 3V3/GND header power are mutually exclusive.'],
        warnings: warnings('power'),
        keywords: ['5v', 'power', 'supply', 'micro usb'],
      }),
      pin({
        header: 'Bottom header',
        number: 14,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the bottom I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'Bottom header',
        number: 15,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the bottom I/O connector row.'],
        keywords: ['ground', 'gnd'],
      }),
    ],
  };
}
