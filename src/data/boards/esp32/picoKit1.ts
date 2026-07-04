import { boardPinName, makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { picoD4Source } from '@/data/boards/esp32/moduleSources';
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

const picoKit1Source: SocSource = {
  title: 'ESP32-PICO-KIT-1 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/esp32-pico-kit-1/user_guide.html',
  sections: [
    'Overview',
    'Getting Started',
    'Description of Components',
    'Start Application Development',
    'Contents and Packaging',
    'Retail Orders',
    'Wholesale Orders',
    'Hardware Reference',
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
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-kit-1-overview.png',
      alt: 'ESP32-PICO-KIT-1 overview',
      sourceSection: 'Overview',
    },
    {
      title: 'Component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-kit-1-layout-front.png',
      alt: 'ESP32-PICO-KIT-1 board layout front',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-kit-1-block.png',
      alt: 'ESP32-PICO-KIT-1 block diagram',
      sourceSection: 'Block Diagram',
    },
    {
      title: 'Pin layout',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-pico-kit-1-pin-layout.png',
      alt: 'ESP32-PICO-KIT-1 pin layout',
      sourceSection: 'Pin Layout',
    },
  ],
};

const picoKit1ModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-PICO-V3',
    antenna: 'Board-level antenna matching network on the carrier PCB',
    flash: '8 MB embedded flash',
    psram: 'No PSRAM',
    footprint: '7.0 x 7.0 mm SiP',
    pinoutImpact: 'Same PICO-KIT-1 header profile. GPIO20 is exposed by ESP32-PICO-V3 and is not present on the bare ESP32 QFN48 profile.',
    source: picoD4Source,
  },
];

interface PicoKit1HeaderPinInput {
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

function buildPicoKit1Pin(input: PicoKit1HeaderPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const sourcePin = resolveSourcePinByGpio(input.gpio);
  const displayNumber = `${input.header}-${input.number}`;
  const flashPinnedHeader = input.gpio === 7 || input.gpio === 8 || input.gpio === 9 || input.gpio === 10;
  const flashDataKeyword = input.gpio === 7 ? 'd0' : input.gpio === 8 ? 'd1' : input.gpio === 9 ? 'd2' : input.gpio === 10 ? 'd3' : undefined;
  const omittedSourceWarnings = uniqueValues([
    ...(input.omitSourceWarnings ?? []),
    ...(flashPinnedHeader ? ['flash' as PinWarning] : []),
  ]);
  const omittedSourceNotes = uniqueValues([
    ...(input.omitSourceNotes ?? []),
    ...(flashPinnedHeader ? [flashCaution] : []),
  ]);
  const omittedSourceKeywords = uniqueValues([
    ...(input.omitSourceKeywords ?? []),
    ...(flashDataKeyword ? ['flash', flashDataKeyword] : []),
  ]);

  return makeBoardPin({
    id: `esp32-pico-kit-1-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    name: boardPinName(input.label, input.gpio, ['TXD0', 'RXD0', 'SENSOR_VP', 'SENSOR_VN']),
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
      'esp32-pico-kit-1',
      'header',
      'male headers',
      'micro-usb',
      'module',
      'pico',
      'pico-kit',
      'pico-kit-1',
      'pico-v3',
      'usb-to-uart',
    ],
    keywords: input.keywords,
  });
}

export function createEsp32PicoKit1Profile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const boardPin = (input: PicoKit1HeaderPinInput) => buildPicoKit1Pin(input, resolveSourcePinByGpio);

  return {
    id: 'esp32-pico-kit-1',
    name: 'PICO-KIT-1',
    packageName: 'ESP32-PICO-KIT-1 board headers',
    description:
      'ESP32-PICO-V3 development board with a CP2102N USB-to-UART bridge, two 18-pin side headers, and male headers for easy breadboard access.',
    kind: 'board',
    source: picoKit1Source,
    boardSpecs: {
      power: [
        'Micro-USB port, 5V/GND header pins, or 3V3/GND header pins can power the board.',
        'Use only one power supply option at a time; the official guide warns that multiple sources can damage the board or supply.',
      ],
      programming: ['CP2102N USB-to-UART bridge on the Micro-USB port is used for flashing and serial debugging.'],
      onBoardHardware: ['Boot button, EN button, 5 V power LED, CP2102N USB-to-UART bridge, and Micro-USB connector.'],
    },
    moduleNames: ['ESP32-PICO-V3'],
    moduleVariants: picoKit1ModuleVariants,
    identificationNotes: [
      'The board core is ESP32-PICO-V3. Choose this profile by the ESP32-PICO-KIT-1 carrier PCB and J2/J3 header layout.',
      'ESP32-PICO-KIT-1 comes with male headers by default.',
    ],
    pins: [
      boardPin({
        header: 'J2',
        number: 1,
        label: 'IO20',
        type: 'io',
        gpio: 20,
        mainFunctions: ['GPIO20'],
        notes: ['Module-only GPIO exposed by ESP32-PICO-V3; it is not present on the bare ESP32 QFN48 profile.'],
        keywords: ['module gpio', 'pico gpio'],
      }),
      boardPin({
        header: 'J2',
        number: 2,
        label: 'IO21',
        type: 'io',
        gpio: 21,
        mainFunctions: ['GPIO21', 'VSPIHD', 'EMAC_TX_EN'],
        keywords: ['ethernet', 'emac'],
      }),
      boardPin({
        header: 'J2',
        number: 3,
        label: 'IO22',
        type: 'io',
        gpio: 22,
        mainFunctions: ['GPIO22', 'VSPIWP', 'U0RTS', 'EMAC_TXD1'],
        keywords: ['ethernet', 'emac', 'uart0'],
      }),
      boardPin({
        header: 'J2',
        number: 4,
        label: 'IO19',
        type: 'io',
        gpio: 19,
        mainFunctions: ['GPIO19', 'VSPIQ', 'U0CTS', 'EMAC_TXD0'],
        keywords: ['ethernet', 'emac', 'uart0'],
      }),
      boardPin({
        header: 'J2',
        number: 5,
        label: 'IO8',
        type: 'io',
        gpio: 8,
        mainFunctions: ['GPIO8', 'SD_DATA1', 'HS1_DATA1', 'U2CTS'],
        keywords: ['sd data1', 'uart2'],
      }),
      boardPin({
        header: 'J2',
        number: 6,
        label: 'IO7',
        type: 'io',
        gpio: 7,
        mainFunctions: ['GPIO7', 'SD_DATA0', 'HS1_DATA0', 'U2RTS'],
        keywords: ['sd data0', 'uart2'],
      }),
      boardPin({
        header: 'J2',
        number: 7,
        label: 'IO5',
        type: 'io',
        gpio: 5,
        mainFunctions: ['GPIO5', 'VSPICS0', 'HS1_DATA6', 'EMAC_RX_CLK'],
        keywords: ['ethernet', 'emac'],
      }),
      boardPin({
        header: 'J2',
        number: 8,
        label: 'IO10',
        type: 'io',
        gpio: 10,
        mainFunctions: ['GPIO10', 'SD_DATA3', 'SPIWP', 'HS1_DATA3', 'U1TXD'],
        keywords: ['spi', 'sd data3', 'uart1'],
      }),
      boardPin({
        header: 'J2',
        number: 9,
        label: 'IO9',
        type: 'io',
        gpio: 9,
        mainFunctions: ['GPIO9', 'SD_DATA2', 'SPIHD', 'HS1_DATA2', 'U1RXD'],
        keywords: ['spi', 'sd data2', 'uart1'],
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
        keywords: ['tx', 'txd0', 'uart0', 'serial', 'usb to uart', 'ethernet', 'emac'],
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
        label: 'SENSOR_VP',
        type: 'io',
        gpio: 36,
        mainFunctions: ['GPIO36', 'ADC1_CH0', 'RTC_GPIO0'],
        notes: [inputOnlyCaution],
        keywords: ['adc', 'adc1', 'rtc', 'sensor vp', 'fsvp', 'input only'],
      }),
      boardPin({
        header: 'J3',
        number: 3,
        label: 'SENSOR_VN',
        type: 'io',
        gpio: 39,
        mainFunctions: ['GPIO39', 'ADC1_CH3', 'RTC_GPIO3'],
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
        keywords: ['adc2', 'dac', 'ethernet', 'emac'],
      }),
      boardPin({
        header: 'J3',
        number: 5,
        label: 'IO26',
        type: 'io',
        gpio: 26,
        mainFunctions: ['GPIO26', 'DAC_2', 'ADC2_CH9', 'RTC_GPIO7', 'EMAC_RXD1'],
        keywords: ['adc2', 'dac', 'ethernet', 'emac'],
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
        keywords: ['adc2', 'touch', 'ethernet', 'emac'],
      }),
      boardPin({
        header: 'J3',
        number: 9,
        label: 'IO14',
        type: 'io',
        gpio: 14,
        mainFunctions: ['GPIO14', 'ADC2_CH6', 'TOUCH6', 'RTC_GPIO16', 'MTMS', 'HSPICLK', 'HS2_CLK', 'SD_CLK', 'EMAC_TXD2'],
        keywords: ['adc2', 'touch', 'jtag', 'mtms', 'sdio', 'hspi', 'ethernet', 'emac'],
      }),
      boardPin({
        header: 'J3',
        number: 10,
        label: 'IO12',
        type: 'io',
        gpio: 12,
        mainFunctions: ['GPIO12', 'ADC2_CH5', 'TOUCH5', 'RTC_GPIO15', 'MTDI', 'HSPIQ', 'HS2_DATA2', 'SD_DATA2', 'EMAC_TXD3'],
        notes: [
          'Official guide notes that the embedded SPI flash on ESP32-PICO-KIT-1 operates at 3.3 V, so MTDI should be pulled down during module power-on reset.',
        ],
        warnings: warnings('strapping', 'voltage', 'jtag'),
        keywords: ['mtdi', 'strap', 'strapping', 'vdd sdio', 'voltage', 'adc', 'touch', 'sdio', 'hspi', 'ethernet', 'emac'],
      }),
      boardPin({
        header: 'J3',
        number: 11,
        label: 'IO13',
        type: 'io',
        gpio: 13,
        mainFunctions: ['GPIO13', 'ADC2_CH4', 'TOUCH4', 'RTC_GPIO14', 'MTCK', 'HSPID', 'HS2_DATA3', 'SD_DATA3', 'EMAC_RX_ER'],
        keywords: ['adc2', 'touch', 'jtag', 'mtck', 'sdio', 'hspi', 'ethernet', 'emac'],
      }),
      boardPin({
        header: 'J3',
        number: 12,
        label: 'IO15',
        type: 'io',
        gpio: 15,
        mainFunctions: ['GPIO15', 'ADC2_CH3', 'TOUCH3', 'RTC_GPIO13', 'MTDO', 'HSPICS0', 'HS2_CMD', 'SD_CMD', 'EMAC_RXD3'],
        keywords: ['adc2', 'touch', 'jtag', 'mtdo', 'strap', 'strapping', 'sdio', 'uart0', 'ethernet', 'emac'],
      }),
      boardPin({
        header: 'J3',
        number: 13,
        label: 'IO2',
        type: 'io',
        gpio: 2,
        mainFunctions: ['GPIO2', 'ADC2_CH2', 'TOUCH2', 'RTC_GPIO12', 'HSPIWP', 'HS2_DATA0', 'SD_DATA0'],
        keywords: ['adc2', 'touch', 'strap', 'strapping', 'boot', 'sdio', 'hspi'],
      }),
      boardPin({
        header: 'J3',
        number: 14,
        label: 'IO4',
        type: 'io',
        gpio: 4,
        mainFunctions: ['GPIO4', 'ADC2_CH0', 'TOUCH0', 'RTC_GPIO10', 'HSPIHD', 'HS2_DATA1', 'SD_DATA1', 'EMAC_TX_ER'],
        keywords: ['adc2', 'touch', 'sdio', 'hspi', 'ethernet', 'emac'],
      }),
      boardPin({
        header: 'J3',
        number: 15,
        label: 'IO0',
        type: 'io',
        gpio: 0,
        mainFunctions: ['GPIO0', 'ADC2_CH1', 'TOUCH1', 'RTC_GPIO11', 'CLK_OUT1', 'EMAC_TX_CLK', 'Boot'],
        notes: ['Connected to the board Boot button. Holding Boot and then pressing EN initiates firmware download mode.'],
        warnings: warnings('onboard', 'boot', 'strapping'),
        keywords: ['boot', 'download', 'button', 'clk out', 'ethernet', 'emac'],
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
