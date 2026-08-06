import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

interface HeaderPinInput {
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

interface BoardProfileInput {
  id: string;
  name: string;
  packageName: string;
  description: string;
  source: SocSource;
  moduleNames: string[];
  moduleVariants: SocModuleVariant[];
  identificationNotes: string[];
  onBoardHardware: string[];
  pins: HeaderPinInput[];
}

const c3StrappingNote = 'ESP32-C3 strapping pin; its voltage at power-up or reset controls chip configuration.';

const devKitC02Source: SocSource = {
  title: 'ESP32-C3-DevKitC-02 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitc-02/user_guide.html',
  sections: ['Description of Components', 'Power Supply Options', 'Header Block J1', 'Header Block J3', 'Pin Layout'],
  figures: [
    { title: 'Board overview', kind: 'board-photo', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitc-02-v1-isometric.png', alt: 'ESP32-C3-DevKitC-02 development board', sourceSection: 'Overview' },
    { title: 'Component layout', kind: 'component-layout', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitc-02-v1-annotated-photo.png', alt: 'ESP32-C3-DevKitC-02 component layout', sourceSection: 'Description of Components' },
    { title: 'System block diagram', kind: 'block-diagram', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitc-02-v1-block-diags.png', alt: 'ESP32-C3-DevKitC-02 system block diagram', sourceSection: 'Hardware Reference' },
    { title: 'Pin layout', kind: 'pin-layout', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitc-02-v1-pinout.png', alt: 'ESP32-C3-DevKitC-02 pin layout', sourceSection: 'Pin Layout' },
  ],
};

const devKitM1Source: SocSource = {
  title: 'ESP32-C3-DevKitM-1 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/esp32-c3-devkitm-1/user_guide.html',
  sections: ['Description of Components', 'Power Supply Options', 'Header Block J1', 'Header Block J3', 'Pin Layout'],
  figures: [
    { title: 'Board overview', kind: 'board-photo', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitm-1-v1-isometric.png', alt: 'ESP32-C3-DevKitM-1 development board', sourceSection: 'Overview' },
    { title: 'Component layout', kind: 'component-layout', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitm-1-v1-annotated-photo.png', alt: 'ESP32-C3-DevKitM-1 component layout', sourceSection: 'Description of Components' },
    { title: 'System block diagram', kind: 'block-diagram', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitm-1-v1-block-diagram.png', alt: 'ESP32-C3-DevKitM-1 system block diagram', sourceSection: 'Hardware Reference' },
    { title: 'Pin layout', kind: 'pin-layout', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c3/_images/esp32-c3-devkitm-1-v1-pinout.png', alt: 'ESP32-C3-DevKitM-1 pin layout', sourceSection: 'Pin Layout' },
  ],
};

const wroom02Source: SocSource = {
  title: 'ESP32-C3-WROOM-02 & WROOM-02U Datasheet',
  version: 'v1.7',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c3-wroom-02_datasheet_en.pdf',
  sections: ['Table 1-1 ESP32-C3-WROOM-02 (ANT) Series Comparison', 'Table 1-2 ESP32-C3-WROOM-02U (CONN) Series Comparison', 'Figure 3-1 Pin Layout (Top View)', 'Table 3-1 Pin Definitions'],
};

const mini1Source: SocSource = {
  title: 'ESP32-C3-MINI-1 & MINI-1U Datasheet',
  version: 'v2.2',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c3-mini-1_datasheet_en.pdf',
  sections: ['Table 1-1 ESP32-C3-MINI-1 (ANT) Series Comparison', 'Table 1-2 ESP32-C3-MINI-1U (CONN) Series Comparison', 'Figure 3-1 Pin Layout (Top View)', 'Table 3-1 Pin Definitions'],
};

function createBoardPin(input: HeaderPinInput, resolveSourcePinByGpio: BoardSourcePinResolver, profileId: string): SocPin {
  const displayNumber = `${input.header}-${input.number}`;
  return makeBoardPin({
    id: `${profileId}-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'J1' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions,
    sourcePin: input.gpio === undefined ? undefined : resolveSourcePinByGpio(input.gpio),
    note: `${displayNumber} board header pin, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: ['board', 'devkit', 'esp32-c3', 'esp32c3', 'header'],
    keywords: input.keywords,
  });
}

function createBoardProfile(input: BoardProfileInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  return {
    id: input.id,
    name: input.name,
    packageName: input.packageName,
    description: input.description,
    kind: 'board',
    source: input.source,
    boardSpecs: {
      power: ['Micro-USB port, 5V/GND headers, or 3V3/GND headers are documented power options; use only mutually compatible power paths.'],
      programming: ['On-board USB-to-UART bridge for flashing and serial logs.'],
      onBoardHardware: input.onBoardHardware,
    },
    moduleNames: input.moduleNames,
    moduleVariants: input.moduleVariants,
    identificationNotes: input.identificationNotes,
    pins: input.pins.map((pin) => createBoardPin(pin, resolveSourcePinByGpio, input.id)),
  };
}

const ground = (header: 'J1' | 'J3', number: number, label = 'G'): HeaderPinInput => ({ header, number, label, type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin.'], keywords: ['ground', 'gnd'] });
const power = (header: 'J1' | 'J3', number: number, label: '3V3' | '5V'): HeaderPinInput => ({ header, number, label, type: 'power', mainFunctions: [`${label === '3V3' ? '3.3' : '5'} V power supply`], notes: [`${label === '3V3' ? '3.3' : '5'} V board power rail.`], warnings: ['power', 'voltage'], keywords: [label.toLowerCase(), 'power', 'supply'] });

const devKitC02Variants: SocModuleVariant[] = [
  { name: 'ESP32-C3-WROOM-02', antenna: 'PCB antenna', flash: '4 MB SPI flash', psram: 'No PSRAM', footprint: '18.0 x 20.0 mm module', pinoutImpact: 'Same DevKitC-02 header profile; antenna implementation differs from WROOM-02U.', source: wroom02Source },
  { name: 'ESP32-C3-WROOM-02U', antenna: 'External antenna connector', flash: '4 MB SPI flash', psram: 'No PSRAM', footprint: '18.0 x 14.3 mm module', pinoutImpact: 'Same DevKitC-02 header profile; antenna connector changes RF layout only.', source: wroom02Source },
];

const devKitM1Variants: SocModuleVariant[] = [
  { name: 'ESP32-C3-MINI-1', antenna: 'PCB antenna', flash: '4 MB SPI flash', psram: 'No PSRAM', footprint: '13.2 x 16.6 mm module', pinoutImpact: 'Same DevKitM-1 header profile; antenna implementation differs from MINI-1U.', source: mini1Source },
  { name: 'ESP32-C3-MINI-1U', antenna: 'External antenna connector', flash: '4 MB SPI flash', psram: 'No PSRAM', footprint: '13.2 x 12.5 mm module', pinoutImpact: 'Same DevKitM-1 header profile; antenna connector changes RF layout only.', source: mini1Source },
];

const devKitC02Pins: HeaderPinInput[] = [
  ground('J1', 1), power('J1', 2, '3V3'), power('J1', 3, '3V3'),
  { header: 'J1', number: 4, label: 'RST', type: 'control', mainFunctions: ['CHIP_PU'], notes: ['Connected to the board Reset button.'], warnings: ['reset'], keywords: ['reset', 'en', 'enable'] },
  ground('J1', 5),
  { header: 'J1', number: 6, label: '4', type: 'io', gpio: 4, mainFunctions: ['ADC1_CH4', 'FSPIHD', 'MTMS'] },
  { header: 'J1', number: 7, label: '5', type: 'io', gpio: 5, mainFunctions: ['ADC2_CH0', 'FSPIWP', 'MTDI'] },
  { header: 'J1', number: 8, label: '6', type: 'io', gpio: 6, mainFunctions: ['FSPICLK', 'MTCK'] },
  { header: 'J1', number: 9, label: '7', type: 'io', gpio: 7, mainFunctions: ['FSPID', 'MTDO'] },
  ground('J1', 10),
  { header: 'J1', number: 11, label: '8', type: 'io', gpio: 8, mainFunctions: ['RGB LED'], notes: ['Drives the addressable RGB LED on the board.', c3StrappingNote], warnings: ['onboard', 'strapping'], keywords: ['rgb', 'rgb led', 'led', 'strap', 'strapping'] },
  { header: 'J1', number: 12, label: '9', type: 'io', gpio: 9, mainFunctions: [], notes: [c3StrappingNote], warnings: ['strapping'], keywords: ['strap', 'strapping', 'boot'] },
  power('J1', 13, '5V'), power('J1', 14, '5V'), ground('J1', 15),
  ground('J3', 1),
  { header: 'J3', number: 2, label: '0', type: 'io', gpio: 0, mainFunctions: ['ADC1_CH0', 'XTAL_32K_P'] },
  { header: 'J3', number: 3, label: '1', type: 'io', gpio: 1, mainFunctions: ['ADC1_CH1', 'XTAL_32K_N'] },
  { header: 'J3', number: 4, label: '2', type: 'io', gpio: 2, mainFunctions: ['ADC1_CH2', 'FSPIQ'], notes: [c3StrappingNote], warnings: ['strapping'], keywords: ['strap', 'strapping', 'boot'] },
  { header: 'J3', number: 5, label: '3', type: 'io', gpio: 3, mainFunctions: ['ADC1_CH3'] },
  ground('J3', 6),
  { header: 'J3', number: 7, label: '10', type: 'io', gpio: 10, mainFunctions: ['FSPICS0'] },
  ground('J3', 8),
  { header: 'J3', number: 9, label: 'RX', type: 'io', gpio: 20, mainFunctions: ['U0RXD'], notes: ['Connected to the on-board USB-to-UART bridge RX signal.'], warnings: ['uart0', 'onboard'], keywords: ['rx', 'uart', 'serial', 'usb to uart'] },
  { header: 'J3', number: 10, label: 'TX', type: 'io', gpio: 21, mainFunctions: ['U0TXD'], notes: ['Connected to the on-board USB-to-UART bridge TX signal.'], warnings: ['uart0', 'onboard'], keywords: ['tx', 'uart', 'serial', 'usb to uart'] },
  ground('J3', 11),
  { header: 'J3', number: 12, label: '18', type: 'io', gpio: 18, mainFunctions: ['USB_D-'] },
  { header: 'J3', number: 13, label: '19', type: 'io', gpio: 19, mainFunctions: ['USB_D+'] },
  ground('J3', 14), ground('J3', 15),
];

const devKitM1Pins: HeaderPinInput[] = [
  ground('J1', 1, 'GND'), power('J1', 2, '3V3'), power('J1', 3, '3V3'),
  { header: 'J1', number: 4, label: 'IO2', type: 'io', gpio: 2, mainFunctions: ['ADC1_CH2', 'FSPIQ'], notes: [c3StrappingNote], warnings: ['strapping'], keywords: ['strap', 'strapping', 'boot'] },
  { header: 'J1', number: 5, label: 'IO3', type: 'io', gpio: 3, mainFunctions: ['ADC1_CH3'] },
  ground('J1', 6, 'GND'),
  { header: 'J1', number: 7, label: 'RST', type: 'control', mainFunctions: ['CHIP_PU'], notes: ['Connected to the board Reset button.'], warnings: ['reset'], keywords: ['reset', 'en', 'enable'] },
  ground('J1', 8, 'GND'),
  { header: 'J1', number: 9, label: 'IO0', type: 'io', gpio: 0, mainFunctions: ['ADC1_CH0', 'XTAL_32K_P'] },
  { header: 'J1', number: 10, label: 'IO1', type: 'io', gpio: 1, mainFunctions: ['ADC1_CH1', 'XTAL_32K_N'] },
  { header: 'J1', number: 11, label: 'IO10', type: 'io', gpio: 10, mainFunctions: ['FSPICS0'] },
  ground('J1', 12, 'GND'), power('J1', 13, '5V'), power('J1', 14, '5V'), ground('J1', 15, 'GND'),
  ground('J3', 1, 'GND'),
  { header: 'J3', number: 2, label: 'TX', type: 'io', gpio: 21, mainFunctions: ['U0TXD'], notes: ['Connected to the on-board USB-to-UART bridge TX signal.'], warnings: ['uart0', 'onboard'], keywords: ['tx', 'uart', 'serial', 'usb to uart'] },
  { header: 'J3', number: 3, label: 'RX', type: 'io', gpio: 20, mainFunctions: ['U0RXD'], notes: ['Connected to the on-board USB-to-UART bridge RX signal.'], warnings: ['uart0', 'onboard'], keywords: ['rx', 'uart', 'serial', 'usb to uart'] },
  ground('J3', 4, 'GND'),
  { header: 'J3', number: 5, label: 'IO9', type: 'io', gpio: 9, mainFunctions: [], notes: [c3StrappingNote], warnings: ['strapping'], keywords: ['strap', 'strapping', 'boot'] },
  { header: 'J3', number: 6, label: 'IO8', type: 'io', gpio: 8, mainFunctions: ['RGB LED'], notes: ['Drives the addressable RGB LED on the board.', c3StrappingNote], warnings: ['onboard', 'strapping'], keywords: ['rgb', 'rgb led', 'led', 'strap', 'strapping'] },
  ground('J3', 7, 'GND'),
  { header: 'J3', number: 8, label: 'IO7', type: 'io', gpio: 7, mainFunctions: ['FSPID', 'MTDO'] },
  { header: 'J3', number: 9, label: 'IO6', type: 'io', gpio: 6, mainFunctions: ['FSPICLK', 'MTCK'] },
  { header: 'J3', number: 10, label: 'IO5', type: 'io', gpio: 5, mainFunctions: ['ADC2_CH0', 'FSPIWP', 'MTDI'] },
  { header: 'J3', number: 11, label: 'IO4', type: 'io', gpio: 4, mainFunctions: ['ADC1_CH4', 'FSPIHD', 'MTMS'] },
  ground('J3', 12, 'GND'),
  { header: 'J3', number: 13, label: 'IO18', type: 'io', gpio: 18, mainFunctions: ['USB_D-'] },
  { header: 'J3', number: 14, label: 'IO19', type: 'io', gpio: 19, mainFunctions: ['USB_D+'] },
  ground('J3', 15, 'GND'),
];

export function createEsp32c3BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant[] {
  return [
    createBoardProfile({
      id: 'esp32c3-devkitc-02', name: 'DevKitC-02 (WROOM-02)', packageName: 'ESP32-C3-DevKitC-02 board headers',
      description: 'Entry-level ESP32-C3-WROOM-02 development board for Wi-Fi and Bluetooth LE applications.', source: devKitC02Source,
      moduleNames: ['ESP32-C3-WROOM-02', 'ESP32-C3-WROOM-02U'], moduleVariants: devKitC02Variants,
      identificationNotes: ['Choose this profile by the ESP32-C3-DevKitC-02 carrier PCB and J1/J3 header layout; the metal shield may show the WROOM-02 or WROOM-02U module marking.'],
      onBoardHardware: ['Boot and Reset buttons, addressable RGB LED on GPIO8, Micro-USB port, and USB-to-UART bridge.'], pins: devKitC02Pins,
    }, resolveSourcePinByGpio),
    createBoardProfile({
      id: 'esp32c3-devkitm-1', name: 'DevKitM-1 (MINI-1)', packageName: 'ESP32-C3-DevKitM-1 board headers',
      description: 'Entry-level ESP32-C3-MINI-1 development board for Wi-Fi and Bluetooth LE applications.', source: devKitM1Source,
      moduleNames: ['ESP32-C3-MINI-1', 'ESP32-C3-MINI-1U'], moduleVariants: devKitM1Variants,
      identificationNotes: ['Choose this profile by the ESP32-C3-DevKitM-1 carrier PCB and J1/J3 header layout; the metal shield may show the MINI-1 or MINI-1U module marking.'],
      onBoardHardware: ['Boot and Reset buttons, addressable RGB LED on GPIO8, Micro-USB port, and USB-to-UART bridge.'], pins: devKitM1Pins,
    }, resolveSourcePinByGpio),
  ];
}
