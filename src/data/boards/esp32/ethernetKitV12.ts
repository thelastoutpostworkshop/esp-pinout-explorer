import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import type { PinType, PinWarning, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

const functionSwitchNote =
  'When the Function Switch is ON, this pin is routed to the FT2232H JTAG interface; when OFF, it is available on the GPIO header.';
const notBrokenOutNote =
  'The official guide says this pin is not broken out to the ESP32-WROVER-E module and is unavailable on the stock board.';
const replaceModuleNote =
  'If you need this signal, replace the module with one that does not include PSRAM memory and exposes GPIO16/GPIO17.';

function warnings(...items: PinWarning[]): PinWarning[] {
  return items;
}

const baseKeywords = [
  'board a',
  'board b',
  'esp32-ethernet-kit',
  'esp32-ethernet-kit-v1.2',
  'ethernet',
  'ethernet-kit',
  'ft2232h',
  'ip101gri',
  'poe',
  'phy',
  'rmii',
];

const ethernetKitSource: SocSource = {
  title: 'ESP32-Ethernet-Kit v1.2 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-ethernet-kit/user_guide.html',
  sections: [
    'What You Need',
    'Overview',
    'Functionality Overview',
    'Functional Description',
    'Setup Options',
    'GPIO Allocation',
    'Start Application Development',
    'Summary of Changes from ESP32-Ethernet-Kit v1.1',
    'Other Versions of ESP32-Ethernet-Kit',
    'Related Documents',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-ethernet-kit-v1.2-overview.png',
      alt: 'ESP32-Ethernet-Kit v1.2 Overview',
      sourceSection: 'Overview',
    },
    {
      title: 'Board photo',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-ethernet-kit-v1.2.jpg',
      alt: 'ESP32-Ethernet-Kit v1.2',
      sourceSection: 'Overview',
    },
    {
      title: 'Functional block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-ethernet-kit-v1.1-block-diagram.png',
      alt: 'ESP32-Ethernet-Kit block diagram',
      sourceSection: 'Functionality Overview',
    },
    {
      title: 'Ethernet board A layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-ethernet-kit-a-v1.2-layout.jpg',
      alt: 'ESP32-Ethernet-Kit v1.2 - Ethernet board (A) layout',
      sourceSection: 'Functional Description',
    },
    {
      title: 'PoE board B layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-ethernet-kit-b-v1.0-layout.png',
      alt: 'ESP32-Ethernet-Kit - PoE board (B) layout',
      sourceSection: 'Functional Description',
    },
    {
      title: 'RMII clock from PHY',
      kind: 'schematic-excerpt',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-ethernet-kit-rmii-clk-from-phy.png',
      alt: 'RMII Clock from IP101GRI PHY',
      sourceSection: 'RMII Clock Selection',
    },
    {
      title: 'RMII clock from ESP APLL',
      kind: 'schematic-excerpt',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-ethernet-kit-rmii-clk-to-phy.png',
      alt: 'RMII Clock from ESP Internal APLL',
      sourceSection: 'RMII Clock Selection',
    },
  ],
};

interface EthernetKitHeaderPinInput {
  header: 'GPIO Header 1' | 'GPIO Header 2';
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions?: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

function buildEthernetKitPin(input: EthernetKitHeaderPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const sourcePin = resolveSourcePinByGpio(input.gpio);
  const displayNumber = `${input.header}-${input.number}`;
  const headerSlug = input.header.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return makeBoardPin({
    id: `esp32-ethernet-kit-v1-2-${headerSlug}-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'GPIO Header 1' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions ?? sourcePin?.mainFunctions ?? (input.gpio !== undefined ? [`GPIO${input.gpio}`] : []),
    sourcePin,
    note: `${displayNumber} board header pin, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords,
    keywords: input.keywords,
  });
}

export function createEsp32EthernetKitV12Profile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const pin = (input: EthernetKitHeaderPinInput) => buildEthernetKitPin(input, resolveSourcePinByGpio);

  return {
    id: 'esp32-ethernet-kit-v1-2',
    name: 'ESP32-Ethernet-Kit v1.2',
    packageName: 'ESP32-Ethernet-Kit v1.2 board headers',
    description:
      'ESP32-WROVER-E Ethernet board A with GPIO Header 1 and GPIO Header 2, an IP101GRI PHY, an FT2232H USB bridge, and optional PoE board B support.',
    kind: 'board',
    boardLayout: 'dual-header',
    source: ethernetKitSource,
    boardSpecs: {
      power: [
        'USB port or 5 V Input can power the Ethernet board A.',
        'The PoE board B can also supply 5 V to board A; use only one active power path at a time.',
      ],
      programming: [
        'FT2232H USB bridge provides USB-to-serial and USB-to-JTAG access; automatic firmware download is supported.',
      ],
      onBoardHardware: [
        'ESP32-WROVER-E module, IP101GRI Ethernet PHY, RJ45 port, magnetics, and link/activity LEDs.',
        'FT2232H USB bridge, USB port, power switch, 5 V input, 5V power LED, and DC/DC converter.',
        'GPIO Header 1, GPIO Header 2, Function Switch, BOOT button, EN button, Tx/Rx LEDs, and optional PoE board B connectors.',
        'Internal RMII wiring uses GPIO0 for REF_CLK and GPIO5 for PHY Reset_N.',
      ],
    },
    moduleNames: ['ESP32-WROVER-E'],
    identificationNotes: [
      'Choose this profile by the Ethernet board A carrier PCB, the GPIO Header 1 and GPIO Header 2 labels, and the FT2232H / IP101GRI layout.',
      'The board A can operate without the PoE board B installed; the PoE board only adds an alternate power path.',
      'The official v1.2 guide replaces the earlier WROVER-B module with WROVER-E, but the exposed header profile remains centered on GPIO Header 1 and GPIO Header 2.',
    ],
    pins: [
      pin({ header: 'GPIO Header 1', number: 1, label: 'GPIO32', type: 'io', gpio: 32 }),
      pin({ header: 'GPIO Header 1', number: 2, label: 'GPIO33', type: 'io', gpio: 33 }),
      pin({ header: 'GPIO Header 1', number: 3, label: 'GPIO34', type: 'io', gpio: 34 }),
      pin({ header: 'GPIO Header 1', number: 4, label: 'GPIO35', type: 'io', gpio: 35 }),
      pin({ header: 'GPIO Header 1', number: 5, label: 'GPIO36', type: 'io', gpio: 36 }),
      pin({ header: 'GPIO Header 1', number: 6, label: 'GPIO39', type: 'io', gpio: 39 }),
      pin({
        header: 'GPIO Header 2',
        number: 1,
        label: 'GPIO17',
        type: 'io',
        gpio: 17,
        mainFunctions: ['GPIO17'],
        notes: [notBrokenOutNote, replaceModuleNote],
        warnings: warnings('psram'),
        keywords: ['module reserved', 'not available', 'wrover-e', 'psram'],
      }),
      pin({
        header: 'GPIO Header 2',
        number: 2,
        label: 'GPIO16',
        type: 'io',
        gpio: 16,
        mainFunctions: ['GPIO16'],
        notes: [notBrokenOutNote, replaceModuleNote],
        warnings: warnings('psram'),
        keywords: ['module reserved', 'not available', 'wrover-e', 'psram'],
      }),
      pin({ header: 'GPIO Header 2', number: 3, label: 'GPIO4', type: 'io', gpio: 4 }),
      pin({ header: 'GPIO Header 2', number: 4, label: 'GPIO2', type: 'io', gpio: 2 }),
      pin({
        header: 'GPIO Header 2',
        number: 5,
        label: 'GPIO13',
        type: 'io',
        gpio: 13,
        notes: [functionSwitchNote],
        warnings: warnings('onboard'),
        keywords: ['debug', 'ft2232h', 'function switch', 'jtag'],
      }),
      pin({
        header: 'GPIO Header 2',
        number: 6,
        label: 'GPIO12',
        type: 'io',
        gpio: 12,
        notes: [functionSwitchNote],
        warnings: warnings('onboard'),
        keywords: ['debug', 'ft2232h', 'function switch', 'jtag'],
      }),
      pin({
        header: 'GPIO Header 2',
        number: 7,
        label: 'GPIO15',
        type: 'io',
        gpio: 15,
        notes: [functionSwitchNote],
        warnings: warnings('onboard'),
        keywords: ['debug', 'ft2232h', 'function switch', 'jtag'],
      }),
      pin({
        header: 'GPIO Header 2',
        number: 8,
        label: 'GPIO14',
        type: 'io',
        gpio: 14,
        notes: [functionSwitchNote],
        warnings: warnings('onboard'),
        keywords: ['debug', 'ft2232h', 'function switch', 'jtag'],
      }),
      pin({
        header: 'GPIO Header 2',
        number: 9,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Board ground.'],
        keywords: ['ground', 'gnd'],
      }),
      pin({
        header: 'GPIO Header 2',
        number: 10,
        label: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        notes: ['3.3 V board power rail.'],
        warnings: warnings('power'),
        keywords: ['3.3v', '3v3', 'power', 'supply'],
      }),
    ],
  };
}
