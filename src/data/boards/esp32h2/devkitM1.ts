import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { mini1Source } from '@/data/boards/esp32h2/moduleSources';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

const devkitM1Source: SocSource = {
  title: 'ESP32-H2-DevKitM-1 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/esp32-h2-devkitm-1/user_guide.html',
  sections: [
    'Description of Components',
    'Block Diagram',
    'Power Supply Options',
    'Current Measurement',
    'Header Block',
    'Pin Layout',
    'Hardware Revision Details',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/_images/esp32-h2-devkitm-1-45.png',
      alt: 'ESP32-H2-DevKitM-1 with ESP32-H2-MINI-1 module',
      sourceSection: 'Overview',
    },
    {
      title: 'Component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/_images/esp32-h2-devkitm-1_v1.2_callouts.png',
      alt: 'ESP32-H2-DevKitM-1 front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'System block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/_images/esp32-h2-devkitm-1_v1.0_systemblock.png',
      alt: 'ESP32-H2-DevKitM-1 system block diagram',
      sourceSection: 'Block Diagram',
    },
    {
      title: 'Pin layout',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32h2/_images/esp32-h2-devkitm-1-v1.2_pinlayout.png',
      alt: 'ESP32-H2-DevKitM-1 pin layout',
      sourceSection: 'Pin Layout',
    },
  ],
};

interface H2BoardHeaderPinInput {
  header: 'J1' | 'J3';
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

function buildH2DevKitM1BoardPin(input: H2BoardHeaderPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const sourcePin = input.gpio !== undefined ? resolveSourcePinByGpio(input.gpio) : undefined;
  const displayNumber = `${input.header}-${input.number}`;

  return makeBoardPin({
    id: `esp32h2-devkitm1-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'J1' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `${displayNumber} board header pin, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: [
      'board',
      'devkit',
      'devkitm',
      'devkitm-1',
      'esp32-h2-devkitm-1',
      'module',
      'mini',
      'mini-1',
      'mini-1u',
      'header',
    ],
    keywords: input.keywords,
  });
}

const esp32h2Mini1ModuleVariant: SocModuleVariant = {
  name: 'ESP32-H2-MINI-1',
  antenna: 'On-board PCB antenna',
  flash: '2 MB or 4 MB in-package flash',
  psram: 'No PSRAM',
  footprint: '13.2 x 16.6 x 2.4 mm',
  pinoutImpact: 'Same 53-pad module pinout as MINI-1U; antenna implementation differs.',
  source: mini1Source,
};

const esp32h2Mini1UModuleVariant: SocModuleVariant = {
  name: 'ESP32-H2-MINI-1U',
  antenna: 'External antenna connector',
  flash: '2 MB or 4 MB in-package flash',
  psram: 'No PSRAM',
  footprint: '13.2 x 12.5 x 2.4 mm',
  pinoutImpact: 'Same 53-pad module pinout as MINI-1; antenna connector changes RF layout only.',
  source: mini1Source,
};

export function createEsp32h2DevKitM1Profile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const h2DevKitM1BoardPin = (input: H2BoardHeaderPinInput) => buildH2DevKitM1BoardPin(input, resolveSourcePinByGpio);

  return {
    id: 'esp32h2-devkitm-1',
    name: 'DevKitM-1 (MINI)',
    packageName: 'ESP32-H2-DevKitM-1 board headers',
    description:
      'Entry-level ESP32-H2-MINI-1 development board for Bluetooth LE, Thread, Zigbee, Matter, and low-power 802.15.4 applications.',
    kind: 'board',
    source: devkitM1Source,
    boardSpecs: {
      power: [
        'USB Type-C to UART port, 5V/GND headers, or 3V3/GND headers; use only one power path at a time.',
        'J5 jumper supports module current measurement and should be removed for 3V3 header current measurement.',
      ],
      programming: [
        'USB-to-UART bridge for flashing and serial logs.',
        'Native ESP32-H2 USB Type-C port supports USB 2.0 full-speed USB Serial/JTAG workflows.',
      ],
      onBoardHardware: [
        'Boot and Reset buttons, addressable RGB LED on GPIO8, 32.768 kHz crystal on current hardware, USB-to-UART bridge, native USB port, and J5 current-measurement jumper.',
      ],
    },
    moduleNames: ['ESP32-H2-MINI-1', 'ESP32-H2-MINI-1U'],
    moduleVariants: [
      {
        ...esp32h2Mini1ModuleVariant,
        pinoutImpact: 'Same DevKitM-1 header pinout; antenna implementation differs from MINI-1U.',
      },
      {
        ...esp32h2Mini1UModuleVariant,
        pinoutImpact: 'Same DevKitM-1 header pinout; antenna connector changes RF layout only.',
      },
    ],
    identificationNotes: [
      'The board is based on ESP32-H2-MINI-1 or ESP32-H2-MINI-1U. Choose this profile by the ESP32-H2-DevKitM-1 carrier PCB and J1/J3 header layout.',
      'For the ESP32-H2-DevKitM-1 carrier PCB with PW number on or after PW-2024-02-0362, the 32.768 kHz crystal is populated by default.',
    ],
    pins: [
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 1,
        label: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        notes: ['3.3 V board power rail.'],
        warnings: warnings('power'),
        keywords: ['3v3', '3.3v', 'power', 'supply'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 2,
        label: 'RST',
        type: 'control',
        mainFunctions: ['EN', 'Reset'],
        notes: ['Connected to the module enable/reset signal and the board Reset button.'],
        warnings: warnings('reset'),
        keywords: ['rst', 'reset', 'en', 'enable'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 3,
        label: '0',
        type: 'io',
        gpio: 0,
        mainFunctions: ['GPIO0', 'FSPIQ'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 4,
        label: '1',
        type: 'io',
        gpio: 1,
        mainFunctions: ['GPIO1', 'FSPICS0', 'ADC1_CH0'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 5,
        label: '2',
        type: 'io',
        gpio: 2,
        mainFunctions: ['GPIO2', 'FSPIWP', 'ADC1_CH1', 'MTMS'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 6,
        label: '3',
        type: 'io',
        gpio: 3,
        mainFunctions: ['GPIO3', 'FSPIHD', 'ADC1_CH2', 'MTDO'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 7,
        label: '13/N',
        type: 'io',
        gpio: 13,
        mainFunctions: ['GPIO13', 'XTAL_32K_P'],
        notes: [
          'The user guide notes that when this pin is connected to XTAL_32K_P inside the module, it cannot be used for another purpose.',
          'Boards with PW number on or after PW-2024-02-0362 populate the 32.768 kHz crystal by default.',
        ],
        warnings: warnings('onboard'),
        keywords: ['13/n', '32k', 'xtal', 'crystal', 'low power clock'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 8,
        label: '14/N',
        type: 'io',
        gpio: 14,
        mainFunctions: ['GPIO14', 'XTAL_32K_N'],
        notes: [
          'The user guide notes that when this pin is connected to XTAL_32K_N inside the module, it cannot be used for another purpose.',
          'Boards with PW number on or after PW-2024-02-0362 populate the 32.768 kHz crystal by default.',
        ],
        warnings: warnings('onboard'),
        keywords: ['14/n', '32k', 'xtal', 'crystal', 'low power clock'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 9,
        label: '4',
        type: 'io',
        gpio: 4,
        mainFunctions: ['GPIO4', 'FSPICLK', 'ADC1_CH3', 'MTCK'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 10,
        label: '5',
        type: 'io',
        gpio: 5,
        mainFunctions: ['GPIO5', 'FSPID', 'ADC1_CH4', 'MTDI'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 11,
        label: 'NC',
        type: 'control',
        mainFunctions: ['No connection'],
        notes: ['Official header table marks this pin as NC.'],
        keywords: ['nc', 'no connection', 'no connect'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 12,
        label: 'VBAT',
        type: 'power',
        mainFunctions: ['VBAT'],
        notes: ['3.3 V power supply or battery supply pin according to the official header table.'],
        warnings: warnings('power', 'voltage'),
        keywords: ['vbat', 'battery', 'power', '3v3'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 13,
        label: 'G',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin.'],
        keywords: ['ground', 'gnd'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 14,
        label: '5V',
        type: 'power',
        mainFunctions: ['5 V power supply'],
        notes: ['5 V board power rail.'],
        warnings: warnings('power'),
        keywords: ['5v', 'power', 'supply'],
      }),
      h2DevKitM1BoardPin({
        header: 'J1',
        number: 15,
        label: 'G',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin.'],
        keywords: ['ground', 'gnd'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 1,
        label: 'G',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin.'],
        keywords: ['ground', 'gnd'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 2,
        label: 'TX',
        type: 'io',
        gpio: 24,
        mainFunctions: ['GPIO24', 'FSPICS2', 'U0TXD'],
        notes: ['Connected to the board USB-to-UART bridge transmit path.'],
        warnings: warnings('uart0'),
        keywords: ['tx', 'uart', 'uart0', 'serial', 'usb to uart'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 3,
        label: 'RX',
        type: 'io',
        gpio: 23,
        mainFunctions: ['GPIO23', 'FSPICS1', 'U0RXD'],
        notes: ['Connected to the board USB-to-UART bridge receive path.'],
        warnings: warnings('uart0'),
        keywords: ['rx', 'uart', 'uart0', 'serial', 'usb to uart'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 4,
        label: '10',
        type: 'io',
        gpio: 10,
        mainFunctions: ['GPIO10', 'ZCD0'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 5,
        label: '11',
        type: 'io',
        gpio: 11,
        mainFunctions: ['GPIO11', 'ZCD1'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 6,
        label: '25',
        type: 'io',
        gpio: 25,
        mainFunctions: ['GPIO25', 'FSPICS3', 'JTAG signal source strapping'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 7,
        label: '12',
        type: 'io',
        gpio: 12,
        mainFunctions: ['GPIO12'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 8,
        label: '8',
        type: 'io',
        gpio: 8,
        mainFunctions: ['GPIO8', 'ROM message control', 'RGB LED'],
        notes: ['Connected to the addressable RGB LED on ESP32-H2-DevKitM-1. The official header table also labels this pin LOG.'],
        warnings: warnings('onboard', 'strapping', 'boot'),
        keywords: ['rgb', 'rgb led', 'led', 'log', 'rom messages', 'strap', 'boot'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 9,
        label: '22',
        type: 'io',
        gpio: 22,
        mainFunctions: ['GPIO22'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 10,
        label: 'G',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin.'],
        keywords: ['ground', 'gnd'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 11,
        label: '9',
        type: 'io',
        gpio: 9,
        mainFunctions: ['GPIO9', 'Boot mode strapping'],
        notes: ['Official header table labels this pin BOOT. It controls boot mode with GPIO8.'],
        warnings: warnings('strapping', 'boot'),
        keywords: ['boot', 'strap', 'strapping', 'download'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 12,
        label: 'G',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin.'],
        keywords: ['ground', 'gnd'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 13,
        label: '27',
        type: 'io',
        gpio: 27,
        mainFunctions: ['GPIO27', 'FSPICS5', 'USB_D+'],
        notes: ['Native USB D+ signal on the ESP32-H2 module and ESP32-H2 USB Type-C port.'],
        warnings: warnings('usb'),
        keywords: ['usb', 'usb d+', 'usb dp', 'serial jtag'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 14,
        label: '26',
        type: 'io',
        gpio: 26,
        mainFunctions: ['GPIO26', 'FSPICS4', 'USB_D-'],
        notes: ['Native USB D- signal on the ESP32-H2 module and ESP32-H2 USB Type-C port.'],
        warnings: warnings('usb'),
        keywords: ['usb', 'usb d-', 'usb dm', 'serial jtag'],
      }),
      h2DevKitM1BoardPin({
        header: 'J3',
        number: 15,
        label: 'G',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Ground reference pin.'],
        keywords: ['ground', 'gnd'],
      }),
    ],
  };
}
