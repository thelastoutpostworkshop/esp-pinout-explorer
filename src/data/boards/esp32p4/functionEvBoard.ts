import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { mini1Source as esp32c6Mini1Source } from '@/data/boards/esp32c6/moduleSources';
import type {
  PinType,
  PinWarning,
  SocBoardSpecs,
  SocModuleVariant,
  SocPackageVariant,
  SocPin,
  SocSource,
} from '@/types/soc';

type FunctionEvBoardRow = 'upper' | 'lower';

interface FunctionEvBoardPinInput {
  row: FunctionEvBoardRow;
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

const functionEvBoardSource: SocSource = {
  title: 'ESP32-P4X-Function-EV-Board User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4x-function-ev-board/user_guide.html',
  sections: [
    'Getting Started',
    'Description of Components',
    'Application Examples',
    'Hardware Reference',
    'Header Block',
    'Hardware Revision Details',
    'Related Documents',
    'Accessories',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4x-function-ev-board-isometric_v1.6.png',
      alt: 'ESP32-P4X-Function-EV-Board overview',
      sourceSection: 'Getting Started',
    },
    {
      title: 'Front component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4x-function-ev-board-annotated-photo-front_v1.6.png',
      alt: 'ESP32-P4X-Function-EV-Board front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Fully assembled board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4x-function-ev-board-assembled-board-overview.png',
      alt: 'Fully assembled ESP32-P4X-Function-EV-Board with LCD and camera accessories',
      sourceSection: 'Accessories',
    },
    {
      title: 'Block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4-function-ev-board-block-diagram_v1.5.2.png',
      alt: 'ESP32-P4X-Function-EV-Board block diagram',
      sourceSection: 'Getting Started',
    },
  ],
};

const functionEvBoardV152Source: SocSource = {
  title: 'ESP32-P4-Function-EV-Board v1.5.2 User Guide',
  version: 'v1.5.2',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4-function-ev-board/user_guide.html',
  sections: [
    'Getting Started',
    'Description of Components',
    'Application Examples',
    'Start Application Development',
    'Hardware Reference',
    'Power Supply Options',
    'Header Block',
    'Hardware Revision Details',
    'Related Documents',
    'Accessories',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4-function-ev-board-isometric_v1.5.2.png',
      alt: 'ESP32-P4-Function-EV-Board overview',
      sourceSection: 'Getting Started',
    },
    {
      title: 'Front component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4-function-ev-board-annotated-photo-front_v1.5.2.png',
      alt: 'ESP32-P4-Function-EV-Board front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Back component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4-function-ev-board-annotated-photo-back_v1.5.2.png',
      alt: 'ESP32-P4-Function-EV-Board back component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/esp32-p4-function-ev-board-block-diagram_v1.5.2.png',
      alt: 'ESP32-P4-Function-EV-Board block diagram',
      sourceSection: 'Hardware Reference',
    },
  ],
};

const esp32c6Mini1ModuleVariant: SocModuleVariant = {
  name: 'ESP32-C6-MINI-1',
  antenna: 'On-board PCB antenna',
  flash: '4 MB SPI flash in chip package',
  psram: 'No PSRAM',
  footprint: '13.2 x 16.6 x 2.4 mm',
  pinoutImpact: 'Wireless module for the board; the ESP32-P4 header block and on-board peripherals define the user-facing IO.',
  source: esp32c6Mini1Source,
};

const esp32p4ModuleVariants: SocModuleVariant[] = [esp32c6Mini1ModuleVariant];

function p4Warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

interface FunctionEvBoardProfileConfig {
  id: string;
  name: string;
  description: string;
  source: SocSource;
  baseKeywords: string[];
  identificationNotes: string[];
}

const functionEvBoardProfileConfig: FunctionEvBoardProfileConfig = {
  id: 'esp32p4x-function-ev-board',
  name: 'ESP32-P4X-Function-EV-Board',
  description:
    'ESP32-P4 multimedia development board with a J1 header block, LCD and camera accessories, Ethernet, USB, audio, and an ESP32-C6-MINI-1 wireless module.',
  source: functionEvBoardSource,
  baseKeywords: [
    'board',
    'esp32-p4',
    'esp32-p4x',
    'p4x-function-ev-board',
    'function-ev-board',
    'function ev board',
    'carrier pcb',
    'j1',
    'header',
    'esp32-c6-mini-1',
    'multimedia',
  ],
  identificationNotes: [
    'Choose this profile by the ESP32-P4X-Function-EV-Board carrier PCB, the ESP32-C6-MINI-1 wireless module, the J1 header block, and the LCD/camera accessory layout shown in the official front and assembled-board photos.',
    'Do not confuse it with the older ESP32-P4-Function-EV-Board v1.5.2; the current board is the P4X revision documented in the latest user guide.',
  ],
};

const functionEvBoardV152ProfileConfig: FunctionEvBoardProfileConfig = {
  id: 'esp32p4-function-ev-board-v1-5-2',
  name: 'ESP32-P4-Function-EV-Board v1.5.2',
  description:
    'ESP32-P4 legacy multimedia development board with a J1 header block, LCD and camera accessories, Ethernet, USB, audio, and an ESP32-C6-MINI-1 wireless module.',
  source: functionEvBoardV152Source,
  baseKeywords: [
    'board',
    'esp32-p4',
    'esp32-p4-function-ev-board',
    'function-ev-board',
    'function ev board',
    'carrier pcb',
    'j1',
    'header',
    'legacy',
    'eol',
    'v1.5.2',
    'esp32-c6-mini-1',
    'multimedia',
  ],
  identificationNotes: [
    'Choose this profile by the ESP32-P4-Function-EV-Board v1.5.2 carrier PCB, the ESP32-C6-MINI-1 wireless module, the J1 header block, and the LCD/camera accessory layout shown in the official board photos.',
    'This is the legacy EOL reference; the newer ESP32-P4X-Function-EV-Board is documented separately for chip revision v3.x and later.',
  ],
};

function buildFunctionEvBoardPin(
  input: FunctionEvBoardPinInput,
  resolveSourcePinByGpio: BoardSourcePinResolver,
  profile: FunctionEvBoardProfileConfig,
): SocPin {
  const sourcePin = input.gpio !== undefined ? resolveSourcePinByGpio(input.gpio) : undefined;
  const displayNumber = `J1-${input.number}`;
  const boardGroup = input.row === 'upper' ? 'J1 upper row' : 'J1 lower row';

  return makeBoardPin({
    id: `${profile.id}-j1-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    name: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: 'J1',
    boardGroup,
    position: { side: input.row === 'upper' ? 'top' : 'bottom', order: input.row === 'upper' ? input.number : input.number - 20 },
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `${displayNumber} on the ${profile.name} J1 header block, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: profile.baseKeywords,
    keywords: input.keywords,
  });
}

const functionEvBoardPins: FunctionEvBoardPinInput[] = [
  { row: 'upper', number: 1, label: '3V3', type: 'power', mainFunctions: ['3.3 V power supply'], notes: ['3.3 V board rail on the J1 header.'], warnings: p4Warnings('power'), keywords: ['3v3', 'power', 'supply'] },
  { row: 'upper', number: 2, label: '5V', type: 'power', mainFunctions: ['5 V power supply'], notes: ['5 V board supply pin on the J1 header.'], warnings: p4Warnings('power'), keywords: ['5v', 'power', 'supply'] },
  { row: 'upper', number: 3, label: '7', type: 'io', gpio: 7, mainFunctions: ['GPIO7'], keywords: ['gpio7'] },
  { row: 'upper', number: 4, label: '5V', type: 'power', mainFunctions: ['5 V power supply'], notes: ['5 V board supply pin on the J1 header.'], warnings: p4Warnings('power'), keywords: ['5v', 'power', 'supply'] },
  { row: 'upper', number: 5, label: '8', type: 'io', gpio: 8, mainFunctions: ['GPIO8'], keywords: ['gpio8'] },
  { row: 'upper', number: 6, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  { row: 'upper', number: 7, label: '23', type: 'io', gpio: 23, mainFunctions: ['GPIO23'], keywords: ['gpio23'] },
  { row: 'upper', number: 8, label: '37', type: 'io', gpio: 37, mainFunctions: ['U0TXD'], notes: ['Header access to UART0 TX for serial communication and debugging.'], keywords: ['uart0', 'serial', 'debug', 'txd'] },
  { row: 'upper', number: 9, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  { row: 'upper', number: 10, label: '38', type: 'io', gpio: 38, mainFunctions: ['U0RXD'], notes: ['Header access to UART0 RX for serial communication and debugging.'], keywords: ['uart0', 'serial', 'debug', 'rxd'] },
  { row: 'upper', number: 11, label: '21', type: 'io', gpio: 21, mainFunctions: ['GPIO21'], keywords: ['gpio21'] },
  { row: 'upper', number: 12, label: '22', type: 'io', gpio: 22, mainFunctions: ['GPIO22'], keywords: ['gpio22'] },
  { row: 'upper', number: 13, label: '20', type: 'io', gpio: 20, mainFunctions: ['GPIO20'], keywords: ['gpio20'] },
  { row: 'upper', number: 14, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  { row: 'upper', number: 15, label: '6', type: 'io', gpio: 6, mainFunctions: ['GPIO6'], keywords: ['gpio6'] },
  { row: 'upper', number: 16, label: '5', type: 'io', gpio: 5, mainFunctions: ['GPIO5'], keywords: ['gpio5'] },
  { row: 'upper', number: 17, label: '3V3', type: 'power', mainFunctions: ['3.3 V power supply'], notes: ['3.3 V board rail on the J1 header.'], warnings: p4Warnings('power'), keywords: ['3v3', 'power', 'supply'] },
  { row: 'upper', number: 18, label: '4', type: 'io', gpio: 4, mainFunctions: ['GPIO4'], keywords: ['gpio4'] },
  { row: 'upper', number: 19, label: '3', type: 'io', gpio: 3, mainFunctions: ['GPIO3'], keywords: ['gpio3'] },
  { row: 'upper', number: 20, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  { row: 'lower', number: 21, label: '2', type: 'io', gpio: 2, mainFunctions: ['GPIO2'], keywords: ['gpio2'] },
  {
    row: 'lower',
    number: 22,
    label: 'NC(1)',
    type: 'io',
    gpio: 1,
    mainFunctions: ['GPIO1'],
    notes: ['GPIO1 can be enabled by disabling the XTAL_32K function; the board guide documents moving R59 to R197.'],
    warnings: p4Warnings('onboard'),
    keywords: ['gpio1', 'nc', 'xtal_32k', '32k', 'clock'],
  },
  {
    row: 'lower',
    number: 23,
    label: 'NC(0)',
    type: 'io',
    gpio: 0,
    mainFunctions: ['GPIO0'],
    notes: [
      'GPIO0 can be enabled by disabling the XTAL_32K function; the board guide documents moving R61 to R199.',
      'Keep the boot strap level correct at reset.',
    ],
    warnings: p4Warnings('strapping', 'boot', 'onboard'),
    keywords: ['gpio0', 'boot', 'strap', 'strapping', 'nc', 'xtal_32k', '32k'],
  },
  { row: 'lower', number: 24, label: '36', type: 'io', gpio: 36, mainFunctions: ['GPIO36'], keywords: ['gpio36'] },
  { row: 'lower', number: 25, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  { row: 'lower', number: 26, label: '32', type: 'io', gpio: 32, mainFunctions: ['GPIO32'], keywords: ['gpio32'] },
  { row: 'lower', number: 27, label: 'NC', type: 'control', mainFunctions: ['No connection'], notes: ['No connection on the official header table.'], keywords: ['nc', 'no connection'] },
  { row: 'lower', number: 28, label: 'NC', type: 'control', mainFunctions: ['No connection'], notes: ['No connection on the official header table.'], keywords: ['nc', 'no connection'] },
  { row: 'lower', number: 29, label: '33', type: 'io', gpio: 33, mainFunctions: ['GPIO33'], keywords: ['gpio33'] },
  { row: 'lower', number: 30, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  {
    row: 'lower',
    number: 31,
    label: '26',
    type: 'io',
    gpio: 26,
    mainFunctions: ['GPIO26'],
    notes: ['GPIO26 is wired to the LCD adapter board PWM pin in the fully assembled setup.'],
    warnings: p4Warnings('onboard'),
    keywords: ['gpio26', 'lcd', 'display', 'pwm'],
  },
  { row: 'lower', number: 32, label: '54', type: 'io', gpio: 54, mainFunctions: ['GPIO54'], keywords: ['gpio54'] },
  { row: 'lower', number: 33, label: '48', type: 'io', gpio: 48, mainFunctions: ['GPIO48'], keywords: ['gpio48'] },
  { row: 'lower', number: 34, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  { row: 'lower', number: 35, label: '53', type: 'io', gpio: 53, mainFunctions: ['GPIO53'], keywords: ['gpio53'] },
  { row: 'lower', number: 36, label: '46', type: 'io', gpio: 46, mainFunctions: ['GPIO46'], keywords: ['gpio46'] },
  { row: 'lower', number: 37, label: '47', type: 'io', gpio: 47, mainFunctions: ['GPIO47'], keywords: ['gpio47'] },
  {
    row: 'lower',
    number: 38,
    label: '27',
    type: 'io',
    gpio: 27,
    mainFunctions: ['GPIO27'],
    notes: ['GPIO27 is wired to the LCD adapter board RST_LCD pin in the fully assembled setup.'],
    warnings: p4Warnings('onboard'),
    keywords: ['gpio27', 'lcd', 'display', 'rst_lcd'],
  },
  { row: 'lower', number: 39, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the J1 header.'], keywords: ['gnd', 'ground'] },
  {
    row: 'lower',
    number: 40,
    label: 'NC(45)',
    type: 'io',
    gpio: 45,
    mainFunctions: ['GPIO45'],
    notes: ['GPIO45 can be enabled by disabling the SD_PWRn function; the board guide documents moving R231 to R100.'],
    warnings: p4Warnings('onboard', 'power'),
    keywords: ['gpio45', 'sd_pwrn', 'sd', 'power', 'nc'],
  },
];

const functionEvBoardSpecs: SocBoardSpecs = {
  power: [
    'Power can be supplied through any USB 2.0 Type-C Port, USB Full-speed Port, or USB Serial/JTAG Port, depending on the attached cable and accessory setup.',
    'The board uses a 5 V to 3.3 V LDO plus a buck converter; the J1 header exposes 3V3 and 5V rails for accessory wiring.',
  ],
  programming: [
    'Use the USB Serial/JTAG Port to flash firmware to the ESP32-P4 chip and perform JTAG debugging.',
    'Use the ESP32-C6 Module Programming Connector with ESP-Prog or another UART tool when you need to flash the wireless module separately.',
    'Press Boot while resetting the board to enter firmware download mode.',
  ],
  onBoardHardware: [
    'ESP32-C6-MINI-1 wireless module, ESP32-C6 module programming connector, microphone, ES8311 audio codec, speaker output port, NS4150B audio PA chip, Ethernet PHY IC, RJ45 Ethernet port, USB Full-speed Port, USB Serial/JTAG Port, USB 2.0 Type-C Port, USB 2.0 Type-A Port, power switch, BOOT button, Reset button, 5 V power-on LED, MIPI CSI connector, MIPI DSI connector, SPI flash, MicroSD card slot, and the LCD and camera accessory boards.',
  ],
};

function createFunctionEvBoardProfile(
  profile: FunctionEvBoardProfileConfig,
  resolveSourcePinByGpio: BoardSourcePinResolver,
): SocPackageVariant {
  return {
    id: profile.id,
    name: profile.name,
    packageName: 'J1 header block',
    description: profile.description,
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'p4-function-ev',
    source: profile.source,
    boardSpecs: functionEvBoardSpecs,
    moduleNames: ['ESP32-C6-MINI-1'],
    moduleVariants: esp32p4ModuleVariants,
    identificationNotes: profile.identificationNotes,
    pins: functionEvBoardPins.map((input) => buildFunctionEvBoardPin(input, resolveSourcePinByGpio, profile)),
  };
}

export function createEsp32p4FunctionEvBoardProfile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  return createFunctionEvBoardProfile(functionEvBoardProfileConfig, resolveSourcePinByGpio);
}

export function createEsp32p4FunctionEvBoardV152Profile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  return createFunctionEvBoardProfile(functionEvBoardV152ProfileConfig, resolveSourcePinByGpio);
}
