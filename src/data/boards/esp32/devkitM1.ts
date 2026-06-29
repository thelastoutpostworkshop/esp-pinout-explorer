import { boardPinName, makeBoardPin } from '@/data/boards/helpers';
import { mini1Source } from '@/data/boards/esp32/moduleSources';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

type SourcePinResolver = (gpio: number | undefined) => SocPin | undefined;

const inputOnlyCaution =
  'Input-only GPIO. This pin does not support digital output or internal pull-up/pull-down resistors.';
const flashCaution =
  'Used internally for communication between ESP32 and SPI flash memory. Avoid using this pin, as it may disrupt flash access.';

function warnings(...items: PinWarning[]): PinWarning[] {
  return items;
}

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}

const devkitM1Source: SocSource = {
  title: 'ESP32-DevKitM-1 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-devkitm-1/user_guide.html',
  sections: [
    'Overview',
    'Description of Components',
    'Block Diagram',
    'Power Source Select',
    'Pin Descriptions',
    'Pin Layout',
    'Hardware Revision Details',
    'Related Documents',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-DevKitM-1-isometric.png',
      alt: 'ESP32-DevKitM-1 development board',
      sourceSection: 'Overview',
    },
    {
      title: 'Component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-DevKitM-1-front.png',
      alt: 'ESP32-DevKitM-1 front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'System block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-DevKitM-1_v1_SystemBlock.png',
      alt: 'ESP32-DevKitM-1 system block diagram',
      sourceSection: 'Block Diagram',
    },
    {
      title: 'Pin layout',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/ESP32_DevKitM-1_pinlayout.png',
      alt: 'ESP32-DevKitM-1 pin layout',
      sourceSection: 'Pin Layout',
    },
  ],
};

const sameDevKitMHeaders = 'Same DevKitM-1 header profile.';

const devkitMModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-MINI-1',
    antenna: 'PCB antenna',
    flash: '4 MB SPI flash in chip package',
    psram: 'No PSRAM',
    footprint: '13.2 x 19.0 mm module',
    pinoutImpact: `${sameDevKitMHeaders} Uses the on-module PCB antenna.`,
    source: mini1Source,
  },
  {
    name: 'ESP32-MINI-1U',
    antenna: 'External antenna connector',
    flash: '4 MB SPI flash in chip package',
    psram: 'No PSRAM',
    footprint: '13.2 x 13.5 mm module',
    pinoutImpact: `${sameDevKitMHeaders} Antenna connector changes RF layout only.`,
    source: mini1Source,
  },
];

interface DevKitMBoardHeaderPinInput {
  header: 'J1' | 'J3';
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
  guideNumber?: number;
  omitSourceWarnings?: PinWarning[];
  omitSourceNotes?: string[];
  omitSourceKeywords?: string[];
}

function buildDevKitMBoardPin(input: DevKitMBoardHeaderPinInput, resolveSourcePinByGpio: SourcePinResolver): SocPin {
  const sourcePin = resolveSourcePinByGpio(input.gpio);
  const displayNumber = `${input.header}-${input.number}`;
  const moduleExposesBareFlashGpio = input.gpio === 9 || input.gpio === 10;
  const omittedSourceWarnings = uniqueValues([
    ...(input.omitSourceWarnings ?? []),
    ...(moduleExposesBareFlashGpio ? ['flash' as PinWarning] : []),
  ]);
  const omittedSourceNotes = uniqueValues([
    ...(input.omitSourceNotes ?? []),
    ...(moduleExposesBareFlashGpio ? [flashCaution] : []),
  ]);
  const omittedSourceKeywords = uniqueValues([
    ...(input.omitSourceKeywords ?? []),
    ...(moduleExposesBareFlashGpio ? ['flash', input.gpio === 9 ? 'd2' : 'd3'] : []),
  ]);
  const guideNote = input.guideNumber ? ` Official user-guide pin No. ${input.guideNumber}.` : '';

  return makeBoardPin({
    id: `esp32-devkitm1-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    name: boardPinName(input.label, input.gpio, ['TX', 'RX', 'TXD0', 'RXD0']),
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'J1' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `${displayNumber} board header pin, silkscreen label ${input.label}.${guideNote}`,
    notes: input.notes,
    warnings: input.warnings,
    omitSourceWarnings: omittedSourceWarnings,
    omitSourceNotes: omittedSourceNotes,
    omitSourceKeywords: omittedSourceKeywords,
    baseKeywords: [
      'board',
      'devkit',
      'devkitm',
      'devkitm-1',
      'esp32-devkitm-1',
      'module',
      'mini',
      'mini-1',
      'mini-1u',
      'header',
    ],
    keywords: [input.guideNumber ? `pin ${input.guideNumber}` : '', ...(input.keywords ?? [])],
  });
}

export function createEsp32DevKitM1Profile(resolveSourcePinByGpio: SourcePinResolver): SocPackageVariant {
  const devkitMBoardPin = (input: DevKitMBoardHeaderPinInput) => buildDevKitMBoardPin(input, resolveSourcePinByGpio);

  return {
  id: 'esp32-devkitm-1',
  name: 'DevKitM-1 (MINI)',
  packageName: 'ESP32-DevKitM-1 board headers',
  kind: 'board',
  source: devkitM1Source,
  boardSpecs: {
    power: [
      'Micro-USB port, 5V/GND header pins, or 3V3/GND header pins can power the board.',
      'Keep external power inputs mutually exclusive; the official guide documents USB, 5V, and 3V3 power options.',
    ],
    programming: ['Micro-USB USB-to-UART bridge is used for flashing, power, and serial communication.'],
    onBoardHardware: ['Boot and Reset buttons, 3.3 V power LED, USB-to-UART bridge, and Micro-USB connector.'],
  },
  moduleNames: ['ESP32-MINI-1', 'ESP32-MINI-1U'],
  moduleVariants: devkitMModuleVariants,
  identificationNotes: [
    'The metal shield may show a MINI module name. Choose this profile by the ESP32-DevKitM-1 carrier PCB and J1/J3 header layout.',
    'On the ESP32-DevKitM-1 carrier PCB, Espressif notes that boards produced before December 2, 2021 may contain a single-core ESP32 chip, which affects firmware configuration but not the header pinout.',
  ],
  pins: [
    devkitMBoardPin({
      header: 'J1',
      number: 1,
      guideNumber: 1,
      label: 'GND',
      type: 'ground',
      mainFunctions: ['Ground'],
      notes: ['Board ground.'],
      keywords: ['ground', 'gnd'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 2,
      guideNumber: 2,
      label: '3V3',
      type: 'power',
      mainFunctions: ['3.3 V power supply'],
      notes: ['3.3 V board power rail.'],
      warnings: warnings('power'),
      keywords: ['3v3', '3.3v', 'power', 'supply'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 3,
      guideNumber: 3,
      label: 'IO36',
      type: 'io',
      gpio: 36,
      mainFunctions: ['GPIO36', 'ADC1_CH0', 'S_VP'],
      notes: [inputOnlyCaution],
      keywords: ['adc', 'adc1', 'sensor vp', 'vp', 'input only'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 4,
      guideNumber: 4,
      label: 'IO37',
      type: 'io',
      gpio: 37,
      mainFunctions: ['GPIO37', 'ADC1_CH1', 'SENSOR_CAPP'],
      notes: [inputOnlyCaution],
      keywords: ['adc', 'adc1', 'sensor capp', 'input only'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 5,
      guideNumber: 5,
      label: 'IO38',
      type: 'io',
      gpio: 38,
      mainFunctions: ['GPIO38', 'ADC1_CH2', 'SENSOR_CAPN'],
      notes: [inputOnlyCaution],
      keywords: ['adc', 'adc1', 'sensor capn', 'input only'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 6,
      guideNumber: 6,
      label: 'IO39',
      type: 'io',
      gpio: 39,
      mainFunctions: ['GPIO39', 'ADC1_CH3', 'S_VN'],
      notes: [inputOnlyCaution],
      keywords: ['adc', 'adc1', 'sensor vn', 'vn', 'input only'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 7,
      guideNumber: 7,
      label: 'RST',
      type: 'control',
      mainFunctions: ['CHIP_PU', 'Reset'],
      notes: ['Connected to the ESP32 enable/reset signal and the board Reset button.'],
      warnings: warnings('reset'),
      keywords: ['rst', 'reset', 'en', 'enable', 'chip pu'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 8,
      guideNumber: 8,
      label: 'IO34',
      type: 'io',
      gpio: 34,
      mainFunctions: ['GPIO34', 'ADC1_CH6', 'VDET_1'],
      notes: [inputOnlyCaution],
      keywords: ['adc', 'adc1', 'vdet', 'input only'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 9,
      guideNumber: 9,
      label: 'IO35',
      type: 'io',
      gpio: 35,
      mainFunctions: ['GPIO35', 'ADC1_CH7', 'VDET_2'],
      notes: [inputOnlyCaution],
      keywords: ['adc', 'adc1', 'vdet', 'input only'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 10,
      guideNumber: 10,
      label: 'IO32',
      type: 'io',
      gpio: 32,
      mainFunctions: ['GPIO32', 'ADC1_CH4', 'TOUCH9', 'XTAL_32K_P'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 11,
      guideNumber: 11,
      label: 'IO33',
      type: 'io',
      gpio: 33,
      mainFunctions: ['GPIO33', 'ADC1_CH5', 'TOUCH8', 'XTAL_32K_N'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 12,
      guideNumber: 12,
      label: 'IO25',
      type: 'io',
      gpio: 25,
      mainFunctions: ['GPIO25', 'ADC2_CH8', 'DAC_1'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 13,
      guideNumber: 13,
      label: 'IO26',
      type: 'io',
      gpio: 26,
      mainFunctions: ['GPIO26', 'ADC2_CH9', 'DAC_2'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 14,
      guideNumber: 14,
      label: 'IO27',
      type: 'io',
      gpio: 27,
      mainFunctions: ['GPIO27', 'ADC2_CH7', 'TOUCH7'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 15,
      guideNumber: 15,
      label: 'IO14',
      type: 'io',
      gpio: 14,
      mainFunctions: ['GPIO14', 'ADC2_CH6', 'TOUCH6', 'MTMS'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 16,
      guideNumber: 16,
      label: '5V',
      type: 'power',
      mainFunctions: ['5 V power supply'],
      notes: ['5 V board power rail. Use only one power supply option at a time.'],
      warnings: warnings('power'),
      keywords: ['5v', 'power', 'supply'],
    }),
    devkitMBoardPin({
      header: 'J1',
      number: 17,
      guideNumber: 17,
      label: 'GND',
      type: 'ground',
      mainFunctions: ['Ground'],
      notes: ['Board ground.'],
      keywords: ['ground', 'gnd'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 1,
      guideNumber: 34,
      label: 'GND',
      type: 'ground',
      mainFunctions: ['Ground'],
      notes: ['Board ground.'],
      keywords: ['ground', 'gnd'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 2,
      guideNumber: 33,
      label: 'TX',
      type: 'io',
      gpio: 1,
      mainFunctions: ['GPIO1', 'U0TXD'],
      notes: ['Connected to the board USB-to-UART bridge TX signal.'],
      warnings: warnings('onboard'),
      keywords: ['tx', 'txd0', 'uart', 'serial', 'usb to uart'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 3,
      guideNumber: 32,
      label: 'RX',
      type: 'io',
      gpio: 3,
      mainFunctions: ['GPIO3', 'U0RXD'],
      notes: ['Connected to the board USB-to-UART bridge RX signal.'],
      warnings: warnings('onboard'),
      keywords: ['rx', 'rxd0', 'uart', 'serial', 'usb to uart'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 4,
      guideNumber: 31,
      label: 'IO21',
      type: 'io',
      gpio: 21,
      mainFunctions: ['GPIO21'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 5,
      guideNumber: 30,
      label: 'IO22',
      type: 'io',
      gpio: 22,
      mainFunctions: ['GPIO22'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 6,
      guideNumber: 29,
      label: 'IO19',
      type: 'io',
      gpio: 19,
      mainFunctions: ['GPIO19'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 7,
      guideNumber: 28,
      label: 'IO23',
      type: 'io',
      gpio: 23,
      mainFunctions: ['GPIO23'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 8,
      guideNumber: 27,
      label: 'IO18',
      type: 'io',
      gpio: 18,
      mainFunctions: ['GPIO18'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 9,
      guideNumber: 26,
      label: 'IO5',
      type: 'io',
      gpio: 5,
      mainFunctions: ['GPIO5'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 10,
      guideNumber: 25,
      label: 'IO10',
      type: 'io',
      gpio: 10,
      mainFunctions: ['GPIO10'],
      notes: ['ESP32-MINI-1 exposes GPIO10 on the board header; the module flash uses other internal GPIOs.'],
      keywords: ['mini exposed', 'module gpio'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 11,
      guideNumber: 24,
      label: 'IO9',
      type: 'io',
      gpio: 9,
      mainFunctions: ['GPIO9'],
      notes: ['ESP32-MINI-1 exposes GPIO9 on the board header; the module flash uses other internal GPIOs.'],
      keywords: ['mini exposed', 'module gpio'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 12,
      guideNumber: 23,
      label: 'IO4',
      type: 'io',
      gpio: 4,
      mainFunctions: ['GPIO4', 'ADC2_CH0', 'TOUCH0'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 13,
      guideNumber: 22,
      label: 'IO0',
      type: 'io',
      gpio: 0,
      mainFunctions: ['GPIO0', 'ADC2_CH1', 'TOUCH1', 'CLK_OUT1', 'Boot'],
      notes: ['Connected to the board Boot button. Holding Boot and pressing Reset enters firmware download mode.'],
      warnings: warnings('onboard', 'boot', 'strapping'),
      keywords: ['boot', 'download', 'button', 'clk out'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 14,
      guideNumber: 21,
      label: 'IO2',
      type: 'io',
      gpio: 2,
      mainFunctions: ['GPIO2', 'ADC2_CH2', 'TOUCH2'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 15,
      guideNumber: 20,
      label: 'IO15',
      type: 'io',
      gpio: 15,
      mainFunctions: ['GPIO15', 'ADC2_CH3', 'TOUCH3', 'MTDO'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 16,
      guideNumber: 19,
      label: 'IO13',
      type: 'io',
      gpio: 13,
      mainFunctions: ['GPIO13', 'ADC2_CH4', 'TOUCH4', 'MTCK'],
    }),
    devkitMBoardPin({
      header: 'J3',
      number: 17,
      guideNumber: 18,
      label: 'IO12',
      type: 'io',
      gpio: 12,
      mainFunctions: ['GPIO12', 'ADC2_CH5', 'TOUCH5', 'MTDI'],
    }),
  ],
  };
}
