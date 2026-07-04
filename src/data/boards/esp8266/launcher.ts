import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

type LauncherHeader = 'J4' | 'J2';

interface LauncherPinInput {
  header: LauncherHeader;
  number: number;
  label: string;
  name?: string;
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

const launcherSource: SocSource = {
  title: 'ESP8266 Hardware Design Guidelines',
  version: 'v2.8',
  publisher: 'Espressif',
  documentType: 'documentation',
  url: 'https://documentation.espressif.com/esp8266_hardware_design_guidelines_en.pdf',
  sections: [
    'ESP-LAUNCHER development board',
    'ESP-Test Board',
    'USB-UART',
    'Boot Mode Select',
    'Reset Key',
    'LED Indicators',
    'Infrared Remote Control',
    'HSPI',
    'SDIO/SPI',
    'Wake Up for deep sleep',
    'ADC',
    'I2C',
  ],
  figures: [
    {
      title: 'ESP-LAUNCHER development board',
      kind: 'pin-layout',
      url: 'https://documentation.espressif.com/esp8266_hardware_design_guidelines_en.pdf',
      alt: 'ESP-LAUNCHER development board in the ESP8266 Hardware Design Guidelines',
      sourceSection: 'ESP-LAUNCHER development board',
    },
  ],
};

const esp8266ExSource: SocSource = {
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

const launcherModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP8266EX',
    antenna: 'Board-level 2.4 GHz RF path',
    flash: 'External SPI flash on the launcher board',
    psram: 'No PSRAM',
    footprint: 'ESP-LAUNCHER reference design',
    pinoutImpact:
      'The launcher board exposes J4/J2 headers and on-board test circuitry; it is not a standalone module pad layout.',
    source: esp8266ExSource,
  },
];

function buildLauncherPin(input: LauncherPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const sourcePin = input.gpio !== undefined ? resolveSourcePinByGpio(input.gpio) : undefined;
  const displayNumber = `${input.header}-${input.number}`;

  return makeBoardPin({
    id: `esp8266-launcher-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    name: input.name ?? input.label,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'J4' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `${displayNumber} on the ESP-LAUNCHER J4/J2 header block, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: [
      'board',
      'esp8266',
      'esp-launcher',
      'launcher',
      'reference design',
      'test board',
      'j4',
      'j2',
      'micro usb',
      'usb-uart',
      'ft232rl',
      'boot',
      'reset',
      'led',
      'relay',
      'infrared',
      'flash',
    ],
    keywords: input.keywords,
  });
}

export function createEsp8266LauncherProfile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const pin = (input: LauncherPinInput) => buildLauncherPin(input, resolveSourcePinByGpio);

  return {
    id: 'esp-launcher',
    name: 'ESP-Launcher',
    packageName: 'ESP-LAUNCHER board headers',
    description:
      'Legacy ESP8266 reference board with dual 12-pin headers, a USB-UART bridge, boot-mode selection, reset keys, status LEDs, an infrared remote-control circuit, and on-board SPI flash.',
    kind: 'board',
    boardLayout: 'dual-header',
    chipPackageId: 'esp8266ex-qfn32',
    source: launcherSource,
    boardSpecs: {
      power: [
        'Power comes from the Micro USB / USB-UART section, and the J2 3V3 pin exposes the board 3.3 V rail for external use.',
        'Follow the hardware design guide before mixing USB power with an external 3.3 V supply.',
      ],
      programming: [
        'The FT232RL USB-UART bridge supports flashing and serial logging through Micro USB.',
        'Use the J66 boot-mode toggle for UART download versus flash boot, and the J14/J67 jumper path when you need UART flow control.',
      ],
      onBoardHardware: [
        'FT232RL USB-UART bridge, boot-mode select toggle, reset keys, relay/WiFi/link LEDs, infrared remote-control circuit, wake-up jumper, external SPI flash, and UART flow-control jumpers.',
      ],
    },
    moduleNames: ['ESP8266EX'],
    moduleVariants: launcherModuleVariants,
    identificationNotes: [
      'Choose this profile by the ESP-LAUNCHER carrier PCB, Micro USB / USB-UART section, Boot Mode select toggle, reset keys, and the two 12-pin J4/J2 header blocks.',
      'The board also carries the relay/WiFi/link LEDs, infrared remote-control circuit, and external SPI flash shown in the official hardware design guide and schematic reference design.',
    ],
    pins: [
      pin({
        header: 'J4',
        number: 1,
        label: 'TOUT',
        type: 'analog',
        mainFunctions: ['TOUT', 'ADC'],
        notes: [
          'Analog ADC input on the launcher board.',
          'External TOUT input must stay within the ESP8266 voltage range; do not treat it as a general 3.3 V GPIO.',
        ],
        warnings: warnings('voltage'),
        keywords: ['adc', 'analog', 'tout', '0-1v'],
      }),
      pin({
        header: 'J4',
        number: 2,
        label: 'GPIO14',
        type: 'io',
        gpio: 14,
        mainFunctions: ['GPIO14', 'MTMS', 'HSPI_CLK', 'I2C_SCL', 'I2SI_WS', 'PWM2', 'IR TX'],
        notes: ['Used by the on-board infrared remote-control circuit.'],
        warnings: warnings('onboard'),
        keywords: ['ir', 'infrared', 'remote control', 'hspi', 'i2c', 'pwm'],
      }),
      pin({
        header: 'J4',
        number: 3,
        label: 'GPIO12',
        type: 'io',
        gpio: 12,
        mainFunctions: ['GPIO12', 'MTDI', 'HSPI_MISO', 'I2SI_DATA', 'PWM0'],
        notes: ['Connected to the on-board link LED.'],
        warnings: warnings('onboard'),
        keywords: ['link led', 'hspi', 'miso', 'i2s', 'pwm'],
      }),
      pin({
        header: 'J4',
        number: 4,
        label: 'GPIO13',
        type: 'io',
        gpio: 13,
        mainFunctions: ['GPIO13', 'MTCK', 'HSPI_MOSI', 'UART0_CTS', 'I2SI_BCK'],
        notes: ['Connected to the UART0 CTS flow-control jumper path on the board.'],
        warnings: warnings('uart0', 'onboard'),
        keywords: ['uart0', 'cts', 'flow control', 'hspi', 'mosi'],
      }),
      pin({
        header: 'J4',
        number: 5,
        label: 'GPIO15',
        type: 'io',
        gpio: 15,
        mainFunctions: ['GPIO15', 'MTDO', 'HSPICS', 'UART0_RTS', 'I2SO_BCK', 'PWM1'],
        notes: [
          'Connected to the on-board relay LED and the UART0 RTS flow-control jumper path.',
          'ESP8266 boot mode uses this pin as a strap input, so keep the documented level when powering up.',
        ],
        warnings: warnings('strapping', 'boot', 'uart0', 'onboard'),
        keywords: ['relay', 'uart0', 'rts', 'flow control', 'strap', 'boot', 'hspi'],
      }),
      pin({
        header: 'J4',
        number: 6,
        label: 'SD_D2',
        type: 'io',
        gpio: 9,
        mainFunctions: ['GPIO9', 'SDIO_DATA_2', 'SPIHD', 'HSPIHD'],
        notes: ['Connected to the on-board SPI flash U4. Treat this pin as reserved on the launcher board.'],
        warnings: warnings('flash', 'onboard'),
        keywords: ['flash', 'sdio', 'spi', 'reserved'],
      }),
      pin({
        header: 'J4',
        number: 7,
        label: 'SD_D3',
        type: 'io',
        gpio: 10,
        mainFunctions: ['GPIO10', 'SDIO_DATA_3', 'SPIWP', 'HSPIWP'],
        notes: ['Connected to the on-board SPI flash U4. Treat this pin as reserved on the launcher board.'],
        warnings: warnings('flash', 'onboard'),
        keywords: ['flash', 'sdio', 'spi', 'reserved'],
      }),
      pin({
        header: 'J4',
        number: 8,
        label: 'SD_CMD',
        type: 'io',
        gpio: 11,
        mainFunctions: ['GPIO11', 'SDIO_CMD', 'SPI_CS0'],
        notes: ['Connected to the on-board SPI flash U4. Treat this pin as reserved on the launcher board.'],
        warnings: warnings('flash', 'onboard'),
        keywords: ['flash', 'sdio', 'spi', 'cmd', 'reserved'],
      }),
      pin({
        header: 'J4',
        number: 9,
        label: 'SD_CLK',
        type: 'io',
        gpio: 6,
        mainFunctions: ['GPIO6', 'SDIO_CLK', 'SPI_CLK'],
        notes: ['Connected to the on-board SPI flash U4. Treat this pin as reserved on the launcher board.'],
        warnings: warnings('flash', 'onboard'),
        keywords: ['flash', 'sdio', 'spi', 'clock', 'reserved'],
      }),
      pin({
        header: 'J4',
        number: 10,
        label: 'SD_D0',
        type: 'io',
        gpio: 7,
        mainFunctions: ['GPIO7', 'SDIO_DATA_0', 'SPI_MISO'],
        notes: ['Connected to the on-board SPI flash U4. Treat this pin as reserved on the launcher board.'],
        warnings: warnings('flash', 'onboard'),
        keywords: ['flash', 'sdio', 'spi', 'miso', 'reserved'],
      }),
      pin({
        header: 'J4',
        number: 11,
        label: 'SD_D1',
        type: 'io',
        gpio: 8,
        mainFunctions: ['GPIO8', 'SDIO_DATA_1', 'SPI_MOSI', 'U1RXD'],
        notes: ['Connected to the on-board SPI flash U4. Treat this pin as reserved on the launcher board.'],
        warnings: warnings('flash', 'onboard'),
        keywords: ['flash', 'sdio', 'spi', 'mosi', 'uart1', 'reserved'],
      }),
      pin({
        header: 'J4',
        number: 12,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the left header.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'J2',
        number: 1,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the right header.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'J2',
        number: 2,
        label: 'CH_PD',
        name: 'CH_EN',
        type: 'control',
        mainFunctions: ['CH_EN', 'CHIP_EN', 'Chip enable'],
        notes: ['Connected to the board enable/reset toggle path. The schematic uses CH_PD for this header pin.'],
        warnings: warnings('reset', 'onboard'),
        keywords: ['ch_pd', 'ch_en', 'chip enable', 'enable', 'reset'],
      }),
      pin({
        header: 'J2',
        number: 3,
        label: 'VDD33',
        name: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        notes: ['3.3 V board rail from the on-board regulator or an external 3.3 V supply path.'],
        warnings: warnings('power'),
        keywords: ['3v3', 'vdd33', 'power', 'supply'],
      }),
      pin({
        header: 'J2',
        number: 4,
        label: 'RST',
        name: 'RST',
        type: 'control',
        mainFunctions: ['RST', 'EXT_RSTB', 'Reset'],
        notes: ['Connected to the board reset key.'],
        warnings: warnings('reset', 'onboard'),
        keywords: ['rst', 'reset'],
      }),
      pin({
        header: 'J2',
        number: 5,
        label: 'GPIO16',
        type: 'io',
        gpio: 16,
        mainFunctions: ['GPIO16', 'XPD_DCDC', 'Deep-sleep wakeup'],
        notes: ['This pin can be jumpered to RST for deep-sleep wake-up on the board.'],
        warnings: warnings('onboard'),
        keywords: ['deep sleep', 'wakeup', 'xpd', 'rtc'],
      }),
      pin({
        header: 'J2',
        number: 6,
        label: 'GPIO5',
        type: 'io',
        gpio: 5,
        mainFunctions: ['GPIO5', 'IR Rx'],
        notes: ['Used by the board infrared remote-control circuit.'],
        warnings: warnings('onboard'),
        keywords: ['infrared', 'ir', 'remote control', 'rx'],
      }),
      pin({
        header: 'J2',
        number: 7,
        label: 'GPIO4',
        type: 'io',
        gpio: 4,
        mainFunctions: ['GPIO4', 'PWM3'],
        keywords: ['pwm'],
      }),
      pin({
        header: 'J2',
        number: 8,
        label: 'U0TXD',
        type: 'io',
        gpio: 1,
        mainFunctions: ['GPIO1', 'U0TXD', 'UART0_TXD'],
        notes: ['Connected to the FT232RL USB-UART bridge transmit path.'],
        warnings: warnings('uart0', 'onboard'),
        keywords: ['uart0', 'serial', 'usb-uart', 'txd'],
      }),
      pin({
        header: 'J2',
        number: 9,
        label: 'U0RXD',
        type: 'io',
        gpio: 3,
        mainFunctions: ['GPIO3', 'U0RXD', 'UART0_RXD'],
        notes: ['Connected to the FT232RL USB-UART bridge receive path.'],
        warnings: warnings('uart0', 'onboard'),
        keywords: ['uart0', 'serial', 'usb-uart', 'rxd'],
      }),
      pin({
        header: 'J2',
        number: 10,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin on the right header.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'J2',
        number: 11,
        label: 'GPIO0',
        type: 'io',
        gpio: 0,
        mainFunctions: ['GPIO0', 'SPI_CS2', 'Boot mode strapping'],
        notes: ['Connected to the boot-mode toggle and the WiFi LED.'],
        warnings: warnings('strapping', 'boot', 'onboard'),
        keywords: ['boot', 'download', 'wifi', 'led', 'strap'],
      }),
      pin({
        header: 'J2',
        number: 12,
        label: 'GPIO2',
        type: 'io',
        gpio: 2,
        mainFunctions: ['GPIO2', 'UART1_TXD', 'I2C_SDA', 'I2SO_WS'],
        notes: ['Boot strap pin on the board header.'],
        warnings: warnings('strapping', 'boot'),
        keywords: ['boot', 'strap', 'uart1', 'i2c'],
      }),
    ],
  };
}
