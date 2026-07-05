import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { esp32s3Wroom1ModuleSource } from '@/data/boards/esp32s3/moduleSources';
import { mini1Source } from '@/data/boards/esp32h2/moduleSources';
import { esp32h2 } from '@/data/socs/esp32h2';
import type { PinPosition, PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

interface ThreadBrBoardPinInput {
  header: 'J4' | 'J5';
  number: number;
  label: string;
  group: string;
  gpio?: number;
  sourceGpio?: number;
  type: PinType;
  position: PinPosition;
  mainFunctions?: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

const threadBrSource: SocSource = {
  title: 'ESP Thread Border Router SDK',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'documentation',
  url: 'https://docs.espressif.com/projects/esp-thread-br/en/latest/hardware_platforms.html',
  sections: [
    '1.1. Wi-Fi based Thread Border Router',
    '1.2. Ethernet based Thread Border Router',
    '1.3. Contents and Packaging',
    '1.4. Related Documents',
  ],
  figures: [
    {
      title: 'ESP Thread Border Router/Zigbee Gateway Board',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-thread-br/en/latest/_images/esp-thread-border-router-board.png',
      alt: 'ESP Thread Border Router/Zigbee Gateway board overview',
      sourceSection: '1.1. Wi-Fi based Thread Border Router',
    },
    {
      title: 'ESP Thread Border Router/Zigbee Gateway Sub-Ethernet',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-thread-br/en/latest/_images/esp-thread-border-router-sub-ethernet.png',
      alt: 'ESP Thread Border Router/Zigbee Gateway sub-Ethernet board overview',
      sourceSection: '1.2. Ethernet based Thread Border Router',
    },
  ],
};

const threadBrModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-S3-WROOM-1',
    antenna: 'PCB antenna',
    flash: '8 MB SPI flash',
    psram: '2 MB PSRAM',
    footprint: '18 x 25 mm module',
    pinoutImpact: 'Host module for the Thread Border Router board; the J4 header and onboard control circuits expose the S3 carrier pins.',
    source: esp32s3Wroom1ModuleSource,
  },
  {
    name: 'ESP32-H2-MINI-1',
    antenna: 'PCB antenna',
    flash: '4 MB SPI flash in chip package',
    psram: 'No PSRAM',
    footprint: '13.2 x 16.6 x 2.4 mm module',
    pinoutImpact: 'Radio co-processor module for the Thread Border Router board; the J5 header exposes the H2 carrier pins and the Y1 crystal constrains a few of them.',
    source: mini1Source,
  },
];

const threadBrBaseKeywords = [
  'board',
  'carrier pcb',
  'thread',
  'thread br',
  'thread border router',
  'zigbee',
  'zigbee gateway',
  'gateway',
  'esp thread br',
  'esp-thread-br',
  'esp32-s3',
  'esp32-h2',
  'host',
  'rcp',
  'j4',
  'j5',
];

const threadBrUartNote =
  'UART0 is the default communication interface for the board; the official build-and-run guide uses 460800 baud.';
const threadBrH2XtalNote = 'H2_GPIO13 and H2_GPIO14 are not available if using the Y1 32.768 kHz crystal.';
const threadBrS3MemoryNote =
  'S3_GPIO35 and S3_GPIO36 are not available for ESP32-S3-WROOM-1-N8R8 and ESP32-S3-WROOM-1-N16R8.';

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

function findH2PinByGpio(gpio: number | undefined) {
  return esp32h2.pins.find((pin) => pin.gpio === gpio);
}

function createThreadBrBoardPin(
  input: ThreadBrBoardPinInput,
  sourcePin: SocPin | undefined,
): SocPin {
  const displayNumber = `${input.header}-${input.number}`;

  return makeBoardPin({
    id: `esp32s3-thread-br-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    boardGroup: input.group,
    position: input.position,
    mainFunctions: input.mainFunctions ?? sourcePin?.mainFunctions ?? [],
    sourcePin,
    note: `${displayNumber} on the ESP Thread Border Router/Zigbee Gateway board, label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: threadBrBaseKeywords,
    keywords: input.keywords,
  });
}

const threadBrJ5Pins: ThreadBrBoardPinInput[] = [
  {
    header: 'J5',
    number: 1,
    label: 'H2_GPIO13',
    group: 'ESP32-H2',
    sourceGpio: 13,
    type: 'control',
    position: { side: 'left', order: 1 },
    mainFunctions: ['H2 GPIO13', 'XTAL_32K_P'],
    notes: [threadBrH2XtalNote],
    warnings: warnings('onboard'),
    keywords: ['h2 gpio13', 'xtal', 'y1', '32 khz', 'crystal'],
  },
  {
    header: 'J5',
    number: 2,
    label: 'H2_TXD0',
    group: 'ESP32-H2',
    sourceGpio: 24,
    type: 'control',
    position: { side: 'right', order: 1 },
    mainFunctions: ['H2 TXD0', 'U0TXD'],
    notes: [threadBrUartNote],
    warnings: warnings('uart0'),
    keywords: ['h2 txd0', 'uart0', 'serial', 'debug', 'flash'],
  },
  {
    header: 'J5',
    number: 3,
    label: 'H2_GPIO10',
    group: 'ESP32-H2',
    sourceGpio: 10,
    type: 'control',
    position: { side: 'left', order: 2 },
    mainFunctions: ['H2 GPIO10', 'ZCD0'],
    keywords: ['h2 gpio10', 'gpio10'],
  },
  {
    header: 'J5',
    number: 4,
    label: 'H2_RXD0',
    group: 'ESP32-H2',
    sourceGpio: 23,
    type: 'control',
    position: { side: 'right', order: 2 },
    mainFunctions: ['H2 RXD0', 'U0RXD'],
    notes: [threadBrUartNote],
    warnings: warnings('uart0'),
    keywords: ['h2 rxd0', 'uart0', 'serial', 'debug', 'flash'],
  },
  {
    header: 'J5',
    number: 5,
    label: 'H2_GPIO11',
    group: 'ESP32-H2',
    sourceGpio: 11,
    type: 'control',
    position: { side: 'left', order: 3 },
    mainFunctions: ['H2 GPIO11', 'ZCD1'],
    keywords: ['h2 gpio11', 'gpio11'],
  },
  {
    header: 'J5',
    number: 6,
    label: 'H2_GPIO14',
    group: 'ESP32-H2',
    sourceGpio: 14,
    type: 'control',
    position: { side: 'right', order: 3 },
    mainFunctions: ['H2 GPIO14', 'XTAL_32K_N'],
    notes: [threadBrH2XtalNote],
    warnings: warnings('onboard'),
    keywords: ['h2 gpio14', 'xtal', 'y1', '32 khz', 'crystal'],
  },
  {
    header: 'J5',
    number: 7,
    label: 'GND',
    group: 'ESP32-H2',
    type: 'ground',
    position: { side: 'left', order: 4 },
    mainFunctions: ['Ground'],
    notes: ['Ground reference on the J5 header.'],
    warnings: warnings('power'),
    keywords: ['ground', 'gnd'],
  },
  {
    header: 'J5',
    number: 8,
    label: 'H2_GPIO8',
    group: 'ESP32-H2',
    sourceGpio: 8,
    type: 'control',
    position: { side: 'right', order: 4 },
    mainFunctions: ['H2 GPIO8', 'Boot mode strapping'],
    notes: ['Boot strap pin on the H2 RCP; keep the level correct during reset.'],
    warnings: warnings('boot', 'strapping'),
    keywords: ['h2 gpio8', 'boot', 'strap', 'strapping', 'download'],
  },
];

const threadBrJ4Pins: ThreadBrBoardPinInput[] = [
  {
    header: 'J4',
    number: 1,
    label: 'VCC_5V',
    group: 'ESP32-S3',
    type: 'power',
    position: { side: 'left', order: 5 },
    mainFunctions: ['5 V power supply'],
    notes: ['5 V board rail on the J4 header.'],
    warnings: warnings('power'),
    keywords: ['5v', 'power', 'supply', 'vcc'],
  },
  {
    header: 'J4',
    number: 2,
    label: 'GND',
    group: 'ESP32-S3',
    type: 'ground',
    position: { side: 'right', order: 5 },
    mainFunctions: ['Ground'],
    notes: ['Ground reference on the J4 header.'],
    warnings: warnings('power'),
    keywords: ['ground', 'gnd'],
  },
  {
    header: 'J4',
    number: 3,
    label: 'S3_GPIO15',
    group: 'ESP32-S3',
    gpio: 15,
    type: 'io',
    position: { side: 'left', order: 6 },
    keywords: ['s3 gpio15', 'gpio15', 'xtal', 'rtc'],
  },
  {
    header: 'J4',
    number: 4,
    label: 'S3_GPIO16',
    group: 'ESP32-S3',
    gpio: 16,
    type: 'io',
    position: { side: 'right', order: 6 },
    keywords: ['s3 gpio16', 'gpio16', 'xtal', 'rtc'],
  },
  {
    header: 'J4',
    number: 5,
    label: 'S3_GPIO3',
    group: 'ESP32-S3',
    gpio: 3,
    type: 'io',
    position: { side: 'left', order: 7 },
    keywords: ['s3 gpio3', 'gpio3'],
  },
  {
    header: 'J4',
    number: 6,
    label: 'S3_GPIO46',
    group: 'ESP32-S3',
    gpio: 46,
    type: 'io',
    position: { side: 'right', order: 7 },
    keywords: ['s3 gpio46', 'gpio46', 'boot', 'strapping'],
  },
  {
    header: 'J4',
    number: 7,
    label: 'S3_GPIO9',
    group: 'ESP32-S3',
    gpio: 9,
    type: 'io',
    position: { side: 'left', order: 8 },
    keywords: ['s3 gpio9', 'gpio9'],
  },
  {
    header: 'J4',
    number: 8,
    label: 'S3_GPIO14',
    group: 'ESP32-S3',
    gpio: 14,
    type: 'io',
    position: { side: 'right', order: 8 },
    keywords: ['s3 gpio14', 'gpio14', 'xtal', '32k'],
  },
  {
    header: 'J4',
    number: 9,
    label: 'S3_GPIO21',
    group: 'ESP32-S3',
    gpio: 21,
    type: 'io',
    position: { side: 'left', order: 9 },
    keywords: ['s3 gpio21', 'gpio21'],
  },
  {
    header: 'J4',
    number: 10,
    label: 'S3_GPIO47',
    group: 'ESP32-S3',
    gpio: 47,
    type: 'io',
    position: { side: 'right', order: 9 },
    keywords: ['s3 gpio47', 'gpio47'],
  },
  {
    header: 'J4',
    number: 11,
    label: 'S3_GPIO48',
    group: 'ESP32-S3',
    gpio: 48,
    type: 'io',
    position: { side: 'left', order: 10 },
    keywords: ['s3 gpio48', 'gpio48'],
  },
  {
    header: 'J4',
    number: 12,
    label: 'S3_GPIO45',
    group: 'ESP32-S3',
    gpio: 45,
    type: 'io',
    position: { side: 'right', order: 10 },
    keywords: ['s3 gpio45', 'gpio45', 'strap', 'strapping', 'vdd spi'],
  },
  {
    header: 'J4',
    number: 13,
    label: 'S3_GPIO35',
    group: 'ESP32-S3',
    gpio: 35,
    type: 'io',
    position: { side: 'left', order: 11 },
    notes: [threadBrS3MemoryNote],
    keywords: ['s3 gpio35', 'gpio35', 'psram', 'memory'],
  },
  {
    header: 'J4',
    number: 14,
    label: 'S3_GPIO36',
    group: 'ESP32-S3',
    gpio: 36,
    type: 'io',
    position: { side: 'right', order: 11 },
    notes: [threadBrS3MemoryNote],
    keywords: ['s3 gpio36', 'gpio36', 'psram', 'memory'],
  },
  {
    header: 'J4',
    number: 15,
    label: 'S3_GPIO37',
    group: 'ESP32-S3',
    gpio: 37,
    type: 'io',
    position: { side: 'left', order: 12 },
    keywords: ['s3 gpio37', 'gpio37', 'psram', 'memory'],
  },
  {
    header: 'J4',
    number: 16,
    label: 'S3_GPIO38',
    group: 'ESP32-S3',
    gpio: 38,
    type: 'io',
    position: { side: 'right', order: 12 },
    keywords: ['s3 gpio38', 'gpio38'],
  },
  {
    header: 'J4',
    number: 17,
    label: 'S3_GPIO39',
    group: 'ESP32-S3',
    gpio: 39,
    type: 'io',
    position: { side: 'left', order: 13 },
    keywords: ['s3 gpio39', 'gpio39', 'jtag'],
  },
  {
    header: 'J4',
    number: 18,
    label: 'S3_GPIO40',
    group: 'ESP32-S3',
    gpio: 40,
    type: 'io',
    position: { side: 'right', order: 13 },
    keywords: ['s3 gpio40', 'gpio40', 'jtag'],
  },
  {
    header: 'J4',
    number: 19,
    label: 'S3_GPIO41',
    group: 'ESP32-S3',
    gpio: 41,
    type: 'io',
    position: { side: 'left', order: 14 },
    keywords: ['s3 gpio41', 'gpio41', 'jtag'],
  },
  {
    header: 'J4',
    number: 20,
    label: 'S3_GPIO42',
    group: 'ESP32-S3',
    gpio: 42,
    type: 'io',
    position: { side: 'right', order: 14 },
    keywords: ['s3 gpio42', 'gpio42', 'jtag'],
  },
  {
    header: 'J4',
    number: 21,
    label: 'S3_RXD0',
    group: 'ESP32-S3',
    gpio: 44,
    type: 'io',
    position: { side: 'left', order: 15 },
    notes: [threadBrUartNote],
    warnings: warnings('uart0'),
    keywords: ['s3 rxd0', 'uart0', 'serial', 'debug', 'flash'],
  },
  {
    header: 'J4',
    number: 22,
    label: 'S3_TXD0',
    group: 'ESP32-S3',
    gpio: 43,
    type: 'io',
    position: { side: 'right', order: 15 },
    notes: [threadBrUartNote],
    warnings: warnings('uart0'),
    keywords: ['s3 txd0', 'uart0', 'serial', 'debug', 'flash'],
  },
  {
    header: 'J4',
    number: 23,
    label: 'S3_GPIO2',
    group: 'ESP32-S3',
    gpio: 2,
    type: 'io',
    position: { side: 'left', order: 16 },
    keywords: ['s3 gpio2', 'gpio2'],
  },
  {
    header: 'J4',
    number: 24,
    label: 'S3_GPIO1',
    group: 'ESP32-S3',
    gpio: 1,
    type: 'io',
    position: { side: 'right', order: 16 },
    keywords: ['s3 gpio1', 'gpio1'],
  },
  {
    header: 'J4',
    number: 25,
    label: 'GND',
    group: 'ESP32-S3',
    type: 'ground',
    position: { side: 'left', order: 17 },
    mainFunctions: ['Ground'],
    notes: ['Ground reference on the J4 header.'],
    warnings: warnings('power'),
    keywords: ['ground', 'gnd'],
  },
  {
    header: 'J4',
    number: 26,
    label: 'VCC_3V3',
    group: 'ESP32-S3',
    type: 'power',
    position: { side: 'right', order: 17 },
    mainFunctions: ['3.3 V power supply'],
    notes: ['3.3 V board rail on the J4 header.'],
    warnings: warnings('power'),
    keywords: ['3v3', 'power', 'supply', 'vcc'],
  },
];

function buildThreadBrPins(
  inputs: ThreadBrBoardPinInput[],
  resolveSourcePinByGpio: BoardSourcePinResolver,
): SocPin[] {
  return inputs.map((input) => {
    const sourceGpio = input.sourceGpio ?? input.gpio;
    const sourcePin = input.group === 'ESP32-H2' ? findH2PinByGpio(sourceGpio) : resolveSourcePinByGpio(sourceGpio);

    return createThreadBrBoardPin(input, sourcePin);
  });
}

export function createEsp32s3ThreadBorderRouterProfile(
  resolveSourcePinByGpio: BoardSourcePinResolver,
): SocPackageVariant {
  return {
    id: 'esp32s3-thread-br-zigbee-gw-v1-2',
    name: 'ESP Thread Border Router / Zigbee Gateway v1.2',
    packageName: 'ESP Thread Border Router/Zigbee Gateway v1.2 connector groups',
    description:
      'ESP32-S3 border-router carrier board revision 1.2 with an ESP32-H2 radio co-processor module, dual USB connectors, an optional sub-board header, and exposed J4/J5 connector groups.',
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'thread-br',
    source: threadBrSource,
    boardSpecs: {
      power: [
        'USB1 or USB2 can power the board through the onboard 5 V to 3.3 V regulator.',
        'J4 exposes 5 V and 3.3 V rails for external wiring; use one power path at a time.',
      ],
      programming: [
        'The official build-and-run guide uses UART0 at 460800 baud for the border-router workflow.',
        'The board combines an ESP32-S3 host with an ESP32-H2 RCP; J4 and J5 expose the board-level UART0 signals for each side.',
      ],
      onBoardHardware: [
        'ESP32-S3-WROOM-1 host module, ESP32-H2-MINI-1 radio co-processor module, USB1 and USB2 connectors, power regulator, boot and reset buttons, optional LEDs, optional sub-board header, and a 32.768 kHz crystal on the H2 side.',
      ],
    },
    moduleNames: ['ESP32-S3-WROOM-1', 'ESP32-H2-MINI-1'],
    moduleVariants: threadBrModuleVariants,
    identificationNotes: [
      'Choose this profile by the ESP Thread Border Router/Zigbee Gateway carrier PCB, the paired ESP32-S3-WROOM-1 and ESP32-H2-MINI-1 modules, the USB1/USB2 connectors, and the J4/J5 header tables on the official board schematic.',
      'The optional ESP Thread BR-Zigbee GW_SUB daughter board uses the same base board and extends Ethernet via the fixed sub-board header.',
    ],
    pins: buildThreadBrPins(threadBrJ5Pins, resolveSourcePinByGpio).concat(buildThreadBrPins(threadBrJ4Pins, resolveSourcePinByGpio)),
  };
}
