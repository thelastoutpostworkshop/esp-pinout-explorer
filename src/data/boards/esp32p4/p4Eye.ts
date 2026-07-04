import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { mini1Source as esp32c6Mini1Source } from '@/data/boards/esp32c6/moduleSources';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

type P4EyeHeaderSide = 'left' | 'right';

interface P4EyeHeaderPinInput {
  side: P4EyeHeaderSide;
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

const p4EyeSource: SocSource = {
  title: 'ESP32-P4-EYE User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/esp32-p4-eye/user_guide.html',
  sections: [
    'Getting Started',
    'Description of Components',
    'Application Examples',
    'Application Development',
    'Hardware Reference',
    'Functional Block Diagram',
    'Power Supply Options',
    'Female Header',
    'USB 2.0 Device Port Circuit',
    'LCD Circuit',
    'MicroSD Card Slot Interface Circuit',
    'Charging Circuit',
    'Microphone Circuit',
    'Camera Circuit',
    'Rotary Encoder Circuit',
    'ESP32-C6-MINI-1U Module Circuit',
    'Hardware Revision Details',
    'Related Documents',
  ],
  figures: [
    {
      title: 'Front view',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/pic_product_esp32_p4_eye_front.png',
      alt: 'ESP32-P4-EYE front view',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Back view',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/pic_product_esp32_p4_eye_back.png',
      alt: 'ESP32-P4-EYE back view',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Female header pin layout',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/p4_board_empty_pin.png',
      alt: 'ESP32-P4-EYE female header pin layout',
      sourceSection: 'Female Header',
    },
    {
      title: 'Functional block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32p4/_images/sch_function_block.png',
      alt: 'ESP32-P4-EYE functional block diagram',
      sourceSection: 'Functional Block Diagram',
    },
  ],
};

const esp32c6Mini1UModuleVariant: SocModuleVariant = {
  name: 'ESP32-C6-MINI-1U',
  antenna: 'External antenna connector',
  flash: '4 MB SPI flash in chip package',
  psram: 'No PSRAM',
  footprint: '13.2 x 12.5 x 2.4 mm',
  pinoutImpact: 'Wireless module for the board; the female header and on-board peripherals define the user-facing IO.',
  source: esp32c6Mini1Source,
};

function eyeWarnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

function buildP4EyeHeaderPin(input: P4EyeHeaderPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const sourcePin = input.gpio !== undefined ? resolveSourcePinByGpio(input.gpio) : undefined;
  const displayNumber = `Female Header ${input.number}`;

  return makeBoardPin({
    id: `esp32p4-eye-header-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    name: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: 'Female Header',
    boardGroup: 'Female Header',
    position: { side: input.side, order: input.side === 'left' ? input.number : input.number - 10 },
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `${displayNumber} on the ESP32-P4-EYE female header, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: [
      'board',
      'esp32-p4',
      'esp32-p4-eye',
      'p4-eye',
      'vision board',
      'female header',
      'camera',
      'lcd',
      'microsd',
      'battery',
      'rotary encoder',
      'fill light',
      'esp32-c6-mini-1u',
    ],
    keywords: input.keywords,
  });
}

const p4EyePins: P4EyeHeaderPinInput[] = [
  { side: 'left', number: 1, label: 'VCC_5V', type: 'power', mainFunctions: ['5 V power supply'], notes: ['5 V supply pin on the female header.'], warnings: eyeWarnings('power'), keywords: ['5v', 'power', 'supply'] },
  { side: 'left', number: 2, label: 'NC', type: 'control', mainFunctions: ['No connection'], notes: ['No connection on the official female header diagram.'], keywords: ['nc', 'no connection'] },
  { side: 'left', number: 3, label: 'GPIO10', type: 'io', gpio: 10, mainFunctions: ['GPIO10'], keywords: ['gpio10'] },
  { side: 'left', number: 4, label: 'GPIO8', type: 'io', gpio: 8, mainFunctions: ['GPIO8'], keywords: ['gpio8'] },
  { side: 'left', number: 5, label: 'GPIO6', type: 'io', gpio: 6, mainFunctions: ['GPIO6'], keywords: ['gpio6'] },
  { side: 'left', number: 6, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the female header.'], keywords: ['gnd', 'ground'] },
  { side: 'left', number: 7, label: 'GPIO54', type: 'io', gpio: 54, mainFunctions: ['GPIO54'], keywords: ['gpio54'] },
  { side: 'left', number: 8, label: 'GPIO53', type: 'io', gpio: 53, mainFunctions: ['GPIO53'], keywords: ['gpio53'] },
  { side: 'left', number: 9, label: 'GPIO51', type: 'io', gpio: 51, mainFunctions: ['GPIO51'], keywords: ['gpio51'] },
  { side: 'left', number: 10, label: 'GPIO38', type: 'io', gpio: 38, mainFunctions: ['GPIO38'], keywords: ['gpio38'] },
  { side: 'right', number: 11, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the female header.'], keywords: ['gnd', 'ground'] },
  { side: 'right', number: 12, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the female header.'], keywords: ['gnd', 'ground'] },
  { side: 'right', number: 13, label: 'GPIO34', type: 'io', gpio: 34, mainFunctions: ['GPIO34'], keywords: ['gpio34'] },
  { side: 'right', number: 14, label: 'GPIO7', type: 'io', gpio: 7, mainFunctions: ['GPIO7'], keywords: ['gpio7'] },
  {
    side: 'right',
    number: 15,
    label: 'I2C_SDA',
    type: 'io',
    mainFunctions: ['I2C_SDA'],
    notes: ['Shared with the camera I2C bus in the official female-header and camera-circuit documentation.'],
    warnings: eyeWarnings('onboard'),
    keywords: ['i2c', 'camera', 'sda'],
  },
  {
    side: 'right',
    number: 16,
    label: 'I2C_SCL',
    type: 'io',
    mainFunctions: ['I2C_SCL'],
    notes: ['Shared with the camera I2C bus in the official female-header and camera-circuit documentation.'],
    warnings: eyeWarnings('onboard'),
    keywords: ['i2c', 'camera', 'scl'],
  },
  { side: 'right', number: 17, label: 'GND', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin on the female header.'], keywords: ['gnd', 'ground'] },
  { side: 'right', number: 18, label: 'GPIO52', type: 'io', gpio: 52, mainFunctions: ['GPIO52'], keywords: ['gpio52'] },
  { side: 'right', number: 19, label: 'GPIO50', type: 'io', gpio: 50, mainFunctions: ['GPIO50'], keywords: ['gpio50'] },
  { side: 'right', number: 20, label: 'GPIO37', type: 'io', gpio: 37, mainFunctions: ['GPIO37'], keywords: ['gpio37'] },
];

export function createEsp32p4EyeBoardProfile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  return {
    id: 'esp32p4-eye',
    name: 'ESP32-P4-EYE',
    packageName: '2 x 10 female header',
    description:
      'ESP32-P4 legacy vision board with a 2 x 10 female header, 1.54-inch LCD, camera, MicroSD slot, USB device/debug ports, battery connector, and an ESP32-C6-MINI-1U wireless module.',
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'p4-eye',
    source: p4EyeSource,
    boardSpecs: {
      power: [
        'Power can be supplied through the USB 2.0 Device Port or USB Debug Port.',
        'The Battery Connector accepts a 1.25 mm pitch lithium battery plug and can charge while the board is powered over USB.',
      ],
      programming: [
        'Use the USB Debug Port for flashing firmware and USB-Serial-JTAG debugging.',
        'The ESP32-C6-MINI-1U test points support module programming and testing with jumper wires.',
        'Press Boot while resetting the board to enter firmware download mode.',
      ],
      onBoardHardware: [
        'ESP32-C6-MINI-1U test points, ESP32-C6-MINI-1U wireless module, 1.54-inch LCD, MIPI CSI camera, MicroSD card slot, digital microphone, rotary encoder, fill light, user-defined buttons, battery connector, USB 2.0 Device Port, USB Debug Port, power switch, Boot button, Reset button, charging indicator, and SPI flash.',
      ],
    },
    moduleNames: ['ESP32-C6-MINI-1U'],
    moduleVariants: [esp32c6Mini1UModuleVariant],
    identificationNotes: [
      'Choose this profile by the ESP32-P4-EYE carrier PCB, the ESP32-C6-MINI-1U wireless module, the 2 x 10 female header, and the camera/LCD enclosure markings shown in the official board photos.',
      'The official guide is the legacy EOL reference for the older ESP32-P4-EYE board and cross-references ESP32-P4X-EYE boards with chip revision v3.x.',
    ],
    pins: p4EyePins.map((input) => buildP4EyeHeaderPin(input, resolveSourcePinByGpio)),
  };
}
