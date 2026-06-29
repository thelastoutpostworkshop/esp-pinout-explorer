import { makeBoardPin } from '@/data/boards/helpers';
import { mini1Source } from '@/data/boards/esp32c6/moduleSources';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

type SourcePinResolver = (gpio: number) => SocPin | undefined;

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

const devkitM1Source: SocSource = {
  title: 'ESP32-C6-DevKitM-1 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/esp32-c6-devkitm-1/user_guide.html',
  sections: [
    'Description of Components',
    'Block Diagram',
    'Power Supply Options',
    'Current Measurement',
    'Header Block J1',
    'Header Block J3',
    'Pin Layout',
    'Hardware Revision Details',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/_images/esp32-c6-devkitm-1-isometric.png',
      alt: 'ESP32-C6-DevKitM-1 development board',
      sourceSection: 'Overview',
    },
    {
      title: 'Component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/_images/esp32-c6-devkitm-1-v1-annotated-photo.png',
      alt: 'ESP32-C6-DevKitM-1 front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'System block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/_images/esp32-c6-devkitm-1-v1-block-diagram.png',
      alt: 'ESP32-C6-DevKitM-1 system block diagram',
      sourceSection: 'Block Diagram',
    },
    {
      title: 'Pin layout',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c6/_images/esp32-c6-devkitm-1-pin-layout.png',
      alt: 'ESP32-C6-DevKitM-1 pin layout',
      sourceSection: 'Pin Layout',
    },
  ],
};

interface C6BoardHeaderPinInput {
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

function buildC6DevKitM1BoardPin(input: C6BoardHeaderPinInput, resolveSourcePinByGpio: SourcePinResolver): SocPin {
  const sourcePin = input.gpio !== undefined ? resolveSourcePinByGpio(input.gpio) : undefined;
  const displayNumber = `${input.header}-${input.number}`;

  return makeBoardPin({
    id: `esp32c6-devkitm1-${input.header.toLowerCase()}-${input.number}`,
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
      'esp32-c6-devkitm-1',
      'module',
      'mini',
      'mini-1',
      'mini-1u',
      'header',
    ],
    keywords: input.keywords,
  });
}

const esp32c6Mini1ModuleVariant: SocModuleVariant = {
  name: 'ESP32-C6-MINI-1',
  antenna: 'On-board PCB antenna',
  flash: '4 MB SPI flash in chip package',
  psram: 'No PSRAM',
  footprint: '13.2 x 16.6 x 2.4 mm',
  pinoutImpact: 'Same 53-pad module pinout as MINI-1U; antenna implementation differs.',
  source: mini1Source,
};

const esp32c6Mini1UModuleVariant: SocModuleVariant = {
  name: 'ESP32-C6-MINI-1U',
  antenna: 'External antenna connector',
  flash: '4 MB SPI flash in chip package',
  psram: 'No PSRAM',
  footprint: '13.2 x 12.5 x 2.4 mm',
  pinoutImpact: 'Same 53-pad module pinout as MINI-1; antenna connector changes RF layout only.',
  source: mini1Source,
};

const esp32c6DevKitM1ModuleVariants: SocModuleVariant[] = [
  {
    ...esp32c6Mini1ModuleVariant,
    pinoutImpact: 'Same DevKitM-1 header pinout; antenna implementation differs from MINI-1U.',
  },
  {
    ...esp32c6Mini1UModuleVariant,
    pinoutImpact: 'Same DevKitM-1 header pinout; antenna connector changes RF layout only.',
  },
];

export function createEsp32c6DevKitM1Profile(resolveSourcePinByGpio: SourcePinResolver): SocPackageVariant {
  const c6DevKitM1BoardPin = (input: C6BoardHeaderPinInput) => buildC6DevKitM1BoardPin(input, resolveSourcePinByGpio);

  return {
  id: 'esp32c6-devkitm-1',
  name: 'DevKitM-1 (MINI)',
  packageName: 'ESP32-C6-DevKitM-1 board headers',
  kind: 'board',
  source: devkitM1Source,
  boardSpecs: {
    power: [
      'USB-C ports, 5V/GND headers, or 3V3/GND headers; keep external power paths mutually exclusive.',
      'J5 jumper supports module current measurement.',
    ],
    programming: ['USB-to-UART bridge for flashing and serial logs; native ESP32-C6 USB port supports USB/JTAG workflows.'],
    onBoardHardware: ['Boot and Reset buttons, addressable RGB LED on GPIO8, USB-to-UART bridge, native USB port, J5 jumper.'],
  },
  moduleNames: ['ESP32-C6-MINI-1', 'ESP32-C6-MINI-1U'],
  moduleVariants: esp32c6DevKitM1ModuleVariants,
  identificationNotes: [
    'The metal shield may show a MINI module name. Choose this profile by the ESP32-C6-DevKitM-1 carrier PCB and J1/J3 header layout.',
  ],
  pins: [
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 1,
      label: '3V3',
      type: 'power',
      mainFunctions: ['3.3 V power supply'],
      notes: ['3.3 V power rail for the DevKitM-1 board.'],
      warnings: warnings('power'),
      keywords: ['3v3', '3.3v', 'power', 'supply'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 2,
      label: 'RST',
      type: 'control',
      mainFunctions: ['EN', 'Reset'],
      notes: ['Connected to the module enable/reset signal and the board Reset button.'],
      warnings: warnings('reset'),
      keywords: ['rst', 'reset', 'en', 'enable', 'power down'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 3,
      label: '2',
      type: 'io',
      gpio: 2,
      mainFunctions: ['GPIO2', 'LP_GPIO2', 'LP_UART_RTSN', 'ADC1_CH2', 'FSPIQ'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 4,
      label: '3',
      type: 'io',
      gpio: 3,
      mainFunctions: ['GPIO3', 'LP_GPIO3', 'LP_UART_CTSN', 'ADC1_CH3'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 5,
      label: '4',
      type: 'io',
      gpio: 4,
      mainFunctions: ['MTMS', 'GPIO4', 'LP_GPIO4', 'LP_UART_RXD', 'ADC1_CH4', 'FSPIHD'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 6,
      label: '5',
      type: 'io',
      gpio: 5,
      mainFunctions: ['MTDI', 'GPIO5', 'LP_GPIO5', 'LP_UART_TXD', 'ADC1_CH5', 'FSPIWP'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 7,
      label: '0/N',
      type: 'io',
      gpio: 0,
      mainFunctions: ['GPIO0', 'XTAL_32K_P', 'LP_GPIO0', 'LP_UART_DTRN', 'ADC1_CH0'],
      keywords: ['32k', 'xtal', 'n label'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 8,
      label: '1/N',
      type: 'io',
      gpio: 1,
      mainFunctions: ['GPIO1', 'XTAL_32K_N', 'LP_GPIO1', 'LP_UART_DSRN', 'ADC1_CH1'],
      keywords: ['32k', 'xtal', 'n label'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 9,
      label: '8',
      type: 'io',
      gpio: 8,
      mainFunctions: ['GPIO8', 'RGB LED'],
      notes: ['Connected to the addressable RGB LED on ESP32-C6-DevKitM-1.'],
      warnings: warnings('onboard'),
      keywords: ['rgb', 'rgb led', 'led', 'onboard'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 10,
      label: '6',
      type: 'io',
      gpio: 6,
      mainFunctions: ['MTCK', 'GPIO6', 'LP_GPIO6', 'LP_I2C_SDA', 'ADC1_CH6', 'FSPICLK'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 11,
      label: '7',
      type: 'io',
      gpio: 7,
      mainFunctions: ['MTDO', 'GPIO7', 'LP_GPIO7', 'LP_I2C_SCL', 'FSPID'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 12,
      label: '14',
      type: 'io',
      gpio: 14,
      mainFunctions: ['GPIO14'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 13,
      label: 'G',
      type: 'ground',
      mainFunctions: ['Ground'],
      notes: ['Ground reference pin.'],
      keywords: ['ground', 'gnd'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 14,
      label: '5V',
      type: 'power',
      mainFunctions: ['5 V power supply'],
      notes: ['5 V board power rail.'],
      warnings: warnings('power'),
      keywords: ['5v', 'power', 'supply'],
    }),
    c6DevKitM1BoardPin({
      header: 'J1',
      number: 15,
      label: 'G',
      type: 'ground',
      mainFunctions: ['Ground'],
      notes: ['Ground reference pin.'],
      keywords: ['ground', 'gnd'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 1,
      label: 'G',
      type: 'ground',
      mainFunctions: ['Ground'],
      notes: ['Ground reference pin.'],
      keywords: ['ground', 'gnd'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 2,
      label: 'TX',
      type: 'io',
      gpio: 16,
      mainFunctions: ['U0TXD', 'GPIO16', 'FSPICS0'],
      notes: ['Connected to the board USB-to-UART bridge TX signal.'],
      keywords: ['tx', 'uart', 'serial', 'usb to uart'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 3,
      label: 'RX',
      type: 'io',
      gpio: 17,
      mainFunctions: ['U0RXD', 'GPIO17', 'FSPICS1'],
      notes: ['Connected to the board USB-to-UART bridge RX signal.'],
      keywords: ['rx', 'uart', 'serial', 'usb to uart'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 4,
      label: '23',
      type: 'io',
      gpio: 23,
      mainFunctions: ['GPIO23', 'SDIO_DATA3'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 5,
      label: '22',
      type: 'io',
      gpio: 22,
      mainFunctions: ['GPIO22', 'SDIO_DATA2'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 6,
      label: '21',
      type: 'io',
      gpio: 21,
      mainFunctions: ['GPIO21', 'SDIO_DATA1', 'FSPICS5'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 7,
      label: '20',
      type: 'io',
      gpio: 20,
      mainFunctions: ['GPIO20', 'SDIO_DATA0', 'FSPICS4'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 8,
      label: '19',
      type: 'io',
      gpio: 19,
      mainFunctions: ['GPIO19', 'SDIO_CLK', 'FSPICS3'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 9,
      label: '18',
      type: 'io',
      gpio: 18,
      mainFunctions: ['GPIO18', 'SDIO_CMD', 'FSPICS2'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 10,
      label: '15',
      type: 'io',
      gpio: 15,
      mainFunctions: ['GPIO15', 'JTAG signal source strapping'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 11,
      label: '9',
      type: 'io',
      gpio: 9,
      mainFunctions: ['GPIO9', 'Boot mode strapping'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 12,
      label: 'G',
      type: 'ground',
      mainFunctions: ['Ground'],
      notes: ['Ground reference pin.'],
      keywords: ['ground', 'gnd'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 13,
      label: '13',
      type: 'io',
      gpio: 13,
      mainFunctions: ['GPIO13', 'USB_D+'],
      notes: ['Native USB D+ signal on the ESP32-C6 module.'],
      keywords: ['usb', 'usb d+', 'usb dp'],
    }),
    c6DevKitM1BoardPin({
      header: 'J3',
      number: 14,
      label: '12',
      type: 'io',
      gpio: 12,
      mainFunctions: ['GPIO12', 'USB_D-'],
      notes: ['Native USB D- signal on the ESP32-C6 module.'],
      keywords: ['usb', 'usb d-', 'usb dm'],
    }),
    c6DevKitM1BoardPin({
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