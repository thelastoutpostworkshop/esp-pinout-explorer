import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { esp32s3Mini1ModuleSource } from '@/data/boards/esp32s3/moduleSources';
import type { PinPosition, PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

interface UsbBridgeBoardPinInput {
  number: number;
  label: string;
  group: string;
  type: PinType;
  gpio?: number;
  position: PinPosition;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

const usbBridgeSource: SocSource = {
  title: 'ESP32-S3-USB-Bridge User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-usb-bridge/user_guide.html',
  sections: [
    'Board Overview',
    'Feature List',
    'Block Diagram',
    'Description of Components',
    'GPIO Allocation',
    'Hardware Revision Details',
    'Related Documents',
  ],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp32-s3-usb-bridge.png',
      alt: 'ESP32-S3-USB-Bridge board overview',
      sourceSection: 'Board Overview',
    },
    {
      title: 'Front component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp32-s3-usb-bridge-front-instruction.png',
      alt: 'ESP32-S3-USB-Bridge front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Back component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp32-s3-usb-bridge-back-instruction.png',
      alt: 'ESP32-S3-USB-Bridge back component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp32-s3-usb-bridge-block-diagram.png',
      alt: 'ESP32-S3-USB-Bridge block diagram',
      sourceSection: 'Block Diagram',
    },
    {
      title: 'Power circuit',
      kind: 'schematic-excerpt',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp32-s3-usb-bridge-power.png',
      alt: 'ESP32-S3-USB-Bridge power circuit',
      sourceSection: 'Power Supply Options',
    },
  ],
};

const usbBridgeModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-S3-MINI-1-N4R2',
    antenna: 'PCB antenna',
    flash: '4 MB SPI flash',
    psram: '2 MB PSRAM',
    footprint: '15.4 x 20.5 mm module',
    pinoutImpact: 'Fixed USB-Bridge board profile; the GPIO allocation table defines bridge, target, and on-board signals.',
    source: esp32s3Mini1ModuleSource,
  },
];

export function createEsp32s3UsbBridgeProfile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  return {
    id: 'esp32s3-usb-bridge',
    name: 'USB-Bridge (MINI)',
    packageName: 'ESP32-S3-USB-Bridge',
    description:
      'ESP32-S3 bridge board for connecting a computer to a target chip over USB-to-UART, JTAG, MSC, or wireless bridge workflows.',
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'usb-bridge',
    source: usbBridgeSource,
    boardSpecs: {
      power: [
        'USB-to-USB port powers the board.',
        'On-board regulator converts USB voltage to 3.3 V for the ESP32-S3-MINI-1 module.',
      ],
      programming: [
        'Default firmware acts as a USB-to-UART bridge, JTAG adapter, MSC storage device, and wireless bridge.',
        'Avoid holding the module Boot button during power-up unless you intend to enter module download mode.',
      ],
      onBoardHardware: [
        'ESP32-S3-MINI-1-N4R2 module, USB-to-USB port, expansion connector, target Boot/Reset buttons, module Boot button, TX/RX indicators, and WS2812 LED.',
      ],
    },
    moduleNames: ['ESP32-S3-MINI-1-N4R2'],
    moduleVariants: usbBridgeModuleVariants,
    identificationNotes: [
      'Choose this profile by the ESP32-S3-USB-Bridge carrier PCB, compact USB bridge board shape, and official GPIO Allocation table.',
    ],
    pins: [
      usbBridgeBoardPin(
        {
          number: 1,
          label: 'GND',
          group: 'Power',
          type: 'ground',
          position: { side: 'top', order: 1 },
          mainFunctions: ['Ground'],
          notes: ['Ground reference for the bridge board and attached target wiring.'],
          warnings: warnings('power'),
          keywords: ['ground', 'gnd', 'power'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 2,
          label: '3V3',
          group: 'Power',
          type: 'power',
          position: { side: 'top', order: 2 },
          mainFunctions: ['3.3 V power supply'],
          notes: ['3.3 V rail generated from the USB supply by the on-board regulator.'],
          warnings: warnings('power'),
          keywords: ['3v3', '3.3v', 'power', 'supply'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 3,
          label: 'MODULE_BOOT',
          group: 'Module controls',
          type: 'io',
          gpio: 0,
          position: { side: 'left', order: 1 },
          mainFunctions: ['GPIO0', 'MODULE_BOOT'],
          notes: [
            'Module Boot button signal. Holding the module Boot button while powering the board enters module download mode.',
          ],
          warnings: warnings('onboard', 'boot', 'strapping'),
          keywords: ['module boot', 'boot button', 'download', 'firmware upload'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 4,
          label: 'TDO',
          group: 'Target JTAG',
          type: 'io',
          gpio: 2,
          position: { side: 'right', order: 1 },
          mainFunctions: ['GPIO2', 'TDO'],
          notes: ['JTAG TDO signal for test data output to the externally connected target chip.'],
          warnings: warnings('onboard', 'jtag'),
          keywords: ['jtag', 'tdo', 'test data out', 'target debug'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 5,
          label: 'TDI',
          group: 'Target JTAG',
          type: 'io',
          gpio: 3,
          position: { side: 'right', order: 2 },
          mainFunctions: ['GPIO3', 'TDI'],
          notes: ['JTAG TDI signal for test data input from the externally connected target chip.'],
          warnings: warnings('onboard', 'jtag'),
          keywords: ['jtag', 'tdi', 'test data in', 'target debug'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 6,
          label: 'TCK',
          group: 'Target JTAG',
          type: 'io',
          gpio: 4,
          position: { side: 'right', order: 3 },
          mainFunctions: ['GPIO4', 'TCK'],
          notes: ['JTAG TCK signal for synchronized test data transfer to the externally connected target chip.'],
          warnings: warnings('onboard', 'jtag'),
          keywords: ['jtag', 'tck', 'test clock', 'target debug'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 7,
          label: 'TMS',
          group: 'Target JTAG',
          type: 'io',
          gpio: 5,
          position: { side: 'right', order: 4 },
          mainFunctions: ['GPIO5', 'TMS'],
          notes: ['JTAG TMS signal for test mode configuration on the externally connected target chip.'],
          warnings: warnings('onboard', 'jtag'),
          keywords: ['jtag', 'tms', 'test mode select', 'target debug'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 8,
          label: 'RESET',
          group: 'Target controls',
          type: 'io',
          gpio: 8,
          position: { side: 'left', order: 2 },
          mainFunctions: ['GPIO8', 'RESET_TO_TARGET'],
          notes: ['Reset signal connected to the target chip; pressing Reset sets the target chip to low level.'],
          warnings: warnings('onboard', 'reset'),
          keywords: ['reset', 'rst', 'target reset', 'en'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 9,
          label: 'BOOT',
          group: 'Target controls',
          type: 'io',
          gpio: 9,
          position: { side: 'left', order: 3 },
          mainFunctions: ['GPIO9', 'BOOT_TO_TARGET'],
          notes: ['Boot signal connected to the target chip; pressing Boot sets the target chip to low level.'],
          warnings: warnings('onboard', 'boot'),
          keywords: ['boot', 'target boot', 'download', 'firmware upload'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 10,
          label: 'USB_D-',
          group: 'Native USB',
          type: 'io',
          gpio: 19,
          position: { side: 'bottom', order: 1 },
          mainFunctions: ['GPIO19', 'USB_D-'],
          notes: ['Native USB D- signal used by the bridge board USB workflow.'],
          warnings: warnings('onboard', 'usb'),
          keywords: ['usb', 'usb d-', 'usb dm', 'serial jtag'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 11,
          label: 'USB_D+',
          group: 'Native USB',
          type: 'io',
          gpio: 20,
          position: { side: 'bottom', order: 2 },
          mainFunctions: ['GPIO20', 'USB_D+'],
          notes: ['Native USB D+ signal used by the bridge board USB workflow.'],
          warnings: warnings('onboard', 'usb'),
          keywords: ['usb', 'usb d+', 'usb dp', 'serial jtag'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 12,
          label: 'RX',
          group: 'Target UART',
          type: 'io',
          gpio: 40,
          position: { side: 'bottom', order: 3 },
          mainFunctions: ['GPIO40', 'BRIDGE_RX'],
          notes: ['UART RX bridge signal connected to the UART TX pin of the target chip.'],
          warnings: warnings('onboard'),
          keywords: ['uart', 'serial', 'rx', 'target tx', 'usb-to-uart'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 13,
          label: 'TX',
          group: 'Target UART',
          type: 'io',
          gpio: 41,
          position: { side: 'bottom', order: 4 },
          mainFunctions: ['GPIO41', 'BRIDGE_TX'],
          notes: ['UART TX bridge signal connected to the UART RX pin of the target chip.'],
          warnings: warnings('onboard'),
          keywords: ['uart', 'serial', 'tx', 'target rx', 'usb-to-uart'],
        },
        resolveSourcePinByGpio,
      ),
      usbBridgeBoardPin(
        {
          number: 14,
          label: 'WS2812',
          group: 'On-board LED',
          type: 'io',
          gpio: 42,
          position: { side: 'bottom', order: 5 },
          mainFunctions: ['GPIO42', 'WS2812'],
          notes: ['On-board WS2812 LED control pin that indicates the current state of the development board.'],
          warnings: warnings('onboard'),
          keywords: ['rgb', 'led', 'ws2812', 'neopixel', 'indicator'],
        },
        resolveSourcePinByGpio,
      ),
    ],
  };
}

function usbBridgeBoardPin(input: UsbBridgeBoardPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const sourcePin = resolveSourcePinByGpio(input.gpio);
  const displayNumber = `GPIO allocation-${input.number}`;

  return makeBoardPin({
    id: `esp32s3-usb-bridge-gpio-allocation-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: 'GPIO allocation',
    boardGroup: input.group,
    position: input.position,
    mainFunctions: input.mainFunctions,
    sourcePin,
    note: `Pin ${input.number} in the official ESP32-S3-USB-Bridge GPIO Allocation table, label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: [
      'board',
      'usb bridge',
      'usb-bridge',
      'esp32-s3-usb-bridge',
      'bridge',
      'module',
      'mini',
      'mini-1',
      'mini-1-n4r2',
      'gpio allocation',
      'expansion connector',
    ],
    keywords: input.keywords,
  });
}

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}
