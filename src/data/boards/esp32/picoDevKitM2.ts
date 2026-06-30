import { boardPinName, makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { picoMini02Source } from '@/data/boards/esp32/moduleSources';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

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

const picoDevKitM2Source: SocSource = {
  title: 'ESP32-PICO-DevKitM-2 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-devkitm-2/user_guide.html',
  sections: [
    'Overview',
    'Description of Components',
    'Block Diagram',
    'Power Supply Options',
    'Pin Descriptions',
    'Header J2',
    'Header J3',
    'Pin Layout',
    'Hardware Revision Details',
    'Related Documents',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-devkitm-2-overview.png',
      alt: 'ESP32-PICO-DevKitM-2 development board',
      sourceSection: 'Overview',
    },
    {
      title: 'Component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-devkitm-2-layout-front.png',
      alt: 'ESP32-PICO-DevKitM-2 front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'System block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-devkitm-2-block.png',
      alt: 'ESP32-PICO-DevKitM-2 system block diagram',
      sourceSection: 'Block Diagram',
    },
    {
      title: 'Pin layout',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-devkitm-2-pinout.png',
      alt: 'ESP32-PICO-DevKitM-2 pin layout',
      sourceSection: 'Pin Layout',
    },
  ],
};

const samePicoDevKitHeaders = 'Same PICO-DevKitM-2 header profile.';

const picoDevKitM2ModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-PICO-MINI-02',
    antenna: 'PCB antenna',
    flash: '8 MB SPI flash in package',
    psram: '2 MB PSRAM in package',
    footprint: '13.2 x 19.0 mm module',
    pinoutImpact: `${samePicoDevKitHeaders} Uses the on-module PCB antenna.`,
    source: picoMini02Source,
  },
  {
    name: 'ESP32-PICO-MINI-02U',
    antenna: 'External antenna connector',
    flash: '8 MB SPI flash in package',
    psram: '2 MB PSRAM in package',
    footprint: '13.2 x 13.5 mm module',
    pinoutImpact: `${samePicoDevKitHeaders} Antenna connector changes RF layout only.`,
    source: picoMini02Source,
  },
];

interface PicoDevKitM2HeaderPinInput {
  header: 'J2' | 'J3';
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
  omitSourceWarnings?: PinWarning[];
  omitSourceNotes?: string[];
  omitSourceKeywords?: string[];
}

function buildPicoDevKitM2Pin(input: PicoDevKitM2HeaderPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const sourcePin = resolveSourcePinByGpio(input.gpio);
  const displayNumber = `${input.header}-${input.number}`;
  const moduleExposesBareFlashGpio = input.gpio === 7 || input.gpio === 8;
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
    ...(moduleExposesBareFlashGpio ? ['flash', input.gpio === 7 ? 'd0' : 'd1'] : []),
  ]);

  return makeBoardPin({
    id: `esp32-pico-devkitm2-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    name: boardPinName(input.label, input.gpio, ['TXD0', 'RXD0']),
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'J2' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `${displayNumber} board header pin, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    omitSourceWarnings: omittedSourceWarnings,
    omitSourceNotes: omittedSourceNotes,
    omitSourceKeywords: omittedSourceKeywords,
    baseKeywords: [
      'board',
      'devkit',
      'pico',
      'pico-devkitm',
      'pico-devkitm-2',
      'esp32-pico-devkitm-2',
      'module',
      'pico-mini',
      'pico-mini-02',
      'pico-mini-02u',
      'header',
    ],
    keywords: input.keywords,
  });
}

export function createEsp32PicoDevKitM2Profile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const boardPin = (input: PicoDevKitM2HeaderPinInput) => buildPicoDevKitM2Pin(input, resolveSourcePinByGpio);

  return {
    id: 'esp32-pico-devkitm-2',
    name: 'PICO-DevKitM-2',
    packageName: 'ESP32-PICO-DevKitM-2 board headers',
    description:
      'ESP32-PICO-MINI-02 development board with USB-to-UART bridge and two 18-pin side headers for easy access to module I/O and power.',
    kind: 'board',
    source: picoDevKitM2Source,
    boardSpecs: {
      power: [
        'Micro-USB port, 5V/GND header pins, or 3V3/GND header pins can power the board.',
        'The official guide warns to use one and only one power supply option at a time.',
      ],
      programming: ['Micro-USB USB-to-UART bridge is used for flashing, power, and serial communication.'],
      onBoardHardware: ['Boot and EN buttons, 5 V power LED, USB-to-UART bridge, and Micro-B USB connector.'],
    },
    moduleNames: ['ESP32-PICO-MINI-02', 'ESP32-PICO-MINI-02U'],
    moduleVariants: picoDevKitM2ModuleVariants,
    identificationNotes: [
      'The metal shield may show a PICO-MINI module name. Choose this profile by the ESP32-PICO-DevKitM-2 carrier PCB and J2/J3 header layout.',
    ],
    pins: [
      boardPin({
        header: 'J2',
        number: 1,
        label: 'IO20',
        type: 'io',
        gpio: 20,
        mainFunctions: ['GPIO20'],
        notes: ['Module-only GPIO exposed by ESP32-PICO-MINI-02/02U; it is not present on the bare ESP32 QFN48 profile.'],
        keywords: ['module gpio', 'pico gpio'],
      }),
      boardPin({
        header: 'J2',
        number: 2,
        label: 'IO21',
        type: 'io',
        gpio: 21,
        mainFunctions: ['GPIO21', 'VSPIHD', 'EMAC_TX_EN'],
      }),
      boardPin({
        header: 'J2',
        number: 3,
        label: 'IO22',
        type: 'io',
        gpio: 22,
        mainFunctions: ['GPIO22', 'VSPIWP', 'U0RTS', 'EMAC_TXD1'],
      }),
      boardPin({
        header: 'J2',
        number: 4,
        label: 'IO19',
        type: 'io',
        gpio: 19,
        mainFunctions: ['GPIO19', 'VSPIQ', 'U0CTS', 'EMAC_TXD0'],
      }),
      boardPin({
        header: 'J2',
        number: 5,
        label: 'IO8',
        type: 'io',
        gpio: 8,
        mainFunctions: ['GPIO8', 'SD_DATA1', 'HS1_DATA1', 'U2CTS'],
        notes: ['ESP32-PICO-MINI-02/02U exposes GPIO8 on this board header.'],
        keywords: ['module gpio', 'sd data1', 'uart2'],
      }),
      boardPin({
        header: 'J2',
        number: 6,
        label: 'IO7',
        type: 'io',
        gpio: 7,
        mainFunctions: ['GPIO7', 'SD_DATA0', 'HS1_DATA0', 'U2RTS'],
        notes: ['ESP32-PICO-MINI-02/02U exposes GPIO7 on this board header.'],
        keywords: ['module gpio', 'sd data0', 'uart2'],
      }),
      boardPin({
        header: 'J2',
        number: 7,
        label: 'IO5',
        type: 'io',
        gpio: 5,
        mainFunctions: ['GPIO5', 'VSPICS0', 'HS1_DATA6', 'EMAC_RX_CLK'],
      }),
      boardPin({
        header: 'J2',
        number: 8,
        label: 'NC',
        type: 'control',
        mainFunctions: ['No connection'],
        notes: ['No connection on the official header table.'],
        keywords: ['nc', 'no connection'],
      }),
      boardPin({
        header: 'J2',
        number: 9,
        label: 'NC',
        type: 'control',
        mainFunctions: ['No connection'],
        notes: ['No connection on the official header table.'],
        keywords: ['nc', 'no connection'],
      }),
      boardPin({
        header: 'J2',
        number: 10,
        label: 'RXD0',
        type: 'io',
        gpio: 3,
        mainFunctions: ['GPIO3', 'U0RXD', 'CLK_OUT2'],
        notes: ['Connected to the USB-to-UART bridge chip on the board.'],
        warnings: warnings('onboard', 'uart0'),
        keywords: ['rx', 'rxd0', 'uart0', 'serial', 'usb to uart'],
      }),
      boardPin({
        header: 'J2',
        number: 11,
        label: 'TXD0',
        type: 'io',
        gpio: 1,
        mainFunctions: ['GPIO1', 'U0TXD', 'CLK_OUT3', 'EMAC_RXD2'],
        notes: ['Connected to the USB-to-UART bridge chip on the board.'],
        warnings: warnings('onboard', 'uart0'),
        keywords: ['tx', 'txd0', 'uart0', 'serial', 'usb to uart'],
      }),
      boardPin({
        header: 'J2',
        number: 12,
        label: 'IO35',
        type: 'io',
        gpio: 35,
        mainFunctions: ['GPIO35', 'ADC1_CH7', 'RTC_GPIO5'],
        notes: [inputOnlyCaution],
        keywords: ['adc', 'adc1', 'rtc', 'input only'],
      }),
      boardPin({
        header: 'J2',
        number: 13,
        label: 'IO34',
        type: 'io',
        gpio: 34,
        mainFunctions: ['GPIO34', 'ADC1_CH6', 'RTC_GPIO4'],
        notes: [inputOnlyCaution],
        keywords: ['adc', 'adc1', 'rtc', 'input only'],
      }),
      boardPin({
        header: 'J2',
        number: 14,
        label: 'IO38',
        type: 'io',
        gpio: 38,
        mainFunctions: ['GPIO38', 'ADC1_CH2', 'RTC_GPIO2'],
        notes: [inputOnlyCaution],
        keywords: ['adc', 'adc1', 'rtc', 'input only'],
      }),
      boardPin({
        header: 'J2',
        number: 15,
        label: 'IO37',
        type: 'io',
        gpio: 37,
        mainFunctions: ['GPIO37', 'ADC1_CH1', 'RTC_GPIO1'],
        notes: [inputOnlyCaution],
        keywords: ['adc', 'adc1', 'rtc', 'input only'],
      }),
      boardPin({
        header: 'J2',
        number: 16,
        label: 'EN',
        type: 'control',
        mainFunctions: ['CHIP_PU', 'Reset'],
        notes: ['Connected to the ESP32 enable/reset signal and the board EN button.'],
        warnings: warnings('reset'),
        keywords: ['en', 'enable', 'reset', 'chip pu'],
      }),
      boardPin({
        header: 'J2',
        number: 17,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Board ground.'],
        keywords: ['ground', 'gnd'],
      }),
      boardPin({
        header: 'J2',
        number: 18,
        label: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        notes: ['3.3 V board power rail.'],
        warnings: warnings('power'),
        keywords: ['3v3', '3.3v', 'vdd33', 'power', 'supply'],
      }),
      boardPin({
        header: 'J3',
        number: 1,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Board ground.'],
        keywords: ['ground', 'gnd'],
      }),
      boardPin({
        header: 'J3',
        number: 2,
        label: 'FSVP',
        type: 'io',
        gpio: 36,
        mainFunctions: ['GPIO36', 'ADC1_CH0', 'RTC_GPIO0', 'SENSOR_VP'],
        notes: [inputOnlyCaution],
        keywords: ['adc', 'adc1', 'rtc', 'sensor vp', 'fsvp', 'input only'],
      }),
      boardPin({
        header: 'J3',
        number: 3,
        label: 'FSVN',
        type: 'io',
        gpio: 39,
        mainFunctions: ['GPIO39', 'ADC1_CH3', 'RTC_GPIO3', 'SENSOR_VN'],
        notes: [inputOnlyCaution],
        keywords: ['adc', 'adc1', 'rtc', 'sensor vn', 'fsvn', 'input only'],
      }),
      boardPin({
        header: 'J3',
        number: 4,
        label: 'IO25',
        type: 'io',
        gpio: 25,
        mainFunctions: ['GPIO25', 'DAC_1', 'ADC2_CH8', 'RTC_GPIO6', 'EMAC_RXD0'],
      }),
      boardPin({
        header: 'J3',
        number: 5,
        label: 'IO26',
        type: 'io',
        gpio: 26,
        mainFunctions: ['GPIO26', 'DAC_2', 'ADC2_CH9', 'RTC_GPIO7', 'EMAC_RXD1'],
      }),
      boardPin({
        header: 'J3',
        number: 6,
        label: 'IO32',
        type: 'io',
        gpio: 32,
        mainFunctions: ['GPIO32', '32K_XP', 'ADC1_CH4', 'TOUCH9', 'RTC_GPIO9'],
        notes: ['32.768 kHz crystal oscillator input function on this pin.'],
        keywords: ['32k', 'crystal', 'adc', 'touch', 'rtc'],
      }),
      boardPin({
        header: 'J3',
        number: 7,
        label: 'IO33',
        type: 'io',
        gpio: 33,
        mainFunctions: ['GPIO33', '32K_XN', 'ADC1_CH5', 'TOUCH8', 'RTC_GPIO8'],
        notes: ['32.768 kHz crystal oscillator output function on this pin.'],
        keywords: ['32k', 'crystal', 'adc', 'touch', 'rtc'],
      }),
      boardPin({
        header: 'J3',
        number: 8,
        label: 'IO27',
        type: 'io',
        gpio: 27,
        mainFunctions: ['GPIO27', 'ADC2_CH7', 'TOUCH7', 'RTC_GPIO17', 'EMAC_RX_DV'],
      }),
      boardPin({
        header: 'J3',
        number: 9,
        label: 'IO14',
        type: 'io',
        gpio: 14,
        mainFunctions: ['GPIO14', 'ADC2_CH6', 'TOUCH6', 'RTC_GPIO16', 'MTMS', 'HSPICLK', 'HS2_CLK', 'SD_CLK'],
      }),
      boardPin({
        header: 'J3',
        number: 10,
        label: 'IO12',
        type: 'io',
        gpio: 12,
        mainFunctions: ['GPIO12', 'ADC2_CH5', 'TOUCH5', 'RTC_GPIO15', 'MTDI', 'HSPIQ', 'HS2_DATA2', 'SD_DATA2'],
        notes: [
          'Official guide notes that ESP32-PICO-DevKitM-2 embedded SPI flash operates at 3.3 V, so MTDI should be pulled down during module power-on reset.',
        ],
        warnings: warnings('strapping', 'voltage'),
        keywords: ['mtdi', 'strap', 'strapping', 'vdd sdio', 'voltage', 'adc', 'touch', 'sdio', 'hspi'],
      }),
      boardPin({
        header: 'J3',
        number: 11,
        label: 'IO13',
        type: 'io',
        gpio: 13,
        mainFunctions: ['GPIO13', 'ADC2_CH4', 'TOUCH4', 'RTC_GPIO14', 'MTCK', 'HSPID', 'HS2_DATA3', 'SD_DATA3'],
      }),
      boardPin({
        header: 'J3',
        number: 12,
        label: 'IO15',
        type: 'io',
        gpio: 15,
        mainFunctions: ['GPIO15', 'ADC2_CH3', 'TOUCH3', 'RTC_GPIO13', 'MTDO', 'HSPICS0', 'HS2_CMD', 'SD_CMD'],
      }),
      boardPin({
        header: 'J3',
        number: 13,
        label: 'IO2',
        type: 'io',
        gpio: 2,
        mainFunctions: ['GPIO2', 'ADC2_CH2', 'TOUCH2', 'RTC_GPIO12', 'HSPIWP', 'HS2_DATA0', 'SD_DATA0'],
      }),
      boardPin({
        header: 'J3',
        number: 14,
        label: 'IO4',
        type: 'io',
        gpio: 4,
        mainFunctions: ['GPIO4', 'ADC2_CH0', 'TOUCH0', 'RTC_GPIO10', 'HSPIHD', 'HS2_DATA1', 'SD_DATA1'],
      }),
      boardPin({
        header: 'J3',
        number: 15,
        label: 'IO0',
        type: 'io',
        gpio: 0,
        mainFunctions: ['GPIO0', 'ADC2_CH1', 'TOUCH1', 'RTC_GPIO11', 'CLK_OUT1', 'Boot'],
        notes: ['Connected to the board Boot button. Holding Boot and then pressing EN initiates firmware download mode.'],
        warnings: warnings('onboard', 'boot', 'strapping'),
        keywords: ['boot', 'download', 'button', 'clk out'],
      }),
      boardPin({
        header: 'J3',
        number: 16,
        label: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        notes: ['3.3 V board power rail.'],
        warnings: warnings('power'),
        keywords: ['3v3', '3.3v', 'vdd33', 'power', 'supply'],
      }),
      boardPin({
        header: 'J3',
        number: 17,
        label: 'GND',
        type: 'ground',
        mainFunctions: ['Ground'],
        notes: ['Board ground.'],
        keywords: ['ground', 'gnd'],
      }),
      boardPin({
        header: 'J3',
        number: 18,
        label: '5V',
        type: 'power',
        mainFunctions: ['5 V power supply'],
        notes: ['5 V board power rail. Use only one power supply option at a time.'],
        warnings: warnings('power'),
        keywords: ['5v', 'ext 5v', 'power', 'supply'],
      }),
    ],
  };
}
