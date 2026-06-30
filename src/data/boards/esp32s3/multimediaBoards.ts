import { makeBoardPin, uniqueValues, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { esp32s3Wroom1ModuleSource } from '@/data/boards/esp32s3/moduleSources';
import type { PinPosition, PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

interface AllocationPinInput {
  number: number;
  label: string;
  group: string;
  gpio?: number;
  type?: PinType;
  functions?: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

interface AllocationBoardPinInput extends AllocationPinInput {
  header: string;
  profileId: string;
  position: PinPosition;
}

const esp32s3DatasheetSource: SocSource = {
  title: 'ESP32-S3 Series Datasheet',
  version: 'v2.2',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-s3_datasheet_en.pdf',
  sections: ['Pin Definitions', 'Strapping Pins', 'Electrical Characteristics'],
};

const lcdEvBoardSource: SocSource = {
  title: 'ESP32-S3-LCD-EV-Board v1.5 User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp32-s3-lcd-ev-board/user_guide.html',
  sections: [
    'Board Overview',
    'Description of Components',
    'GPIO Allocation',
    'Power Distribution',
    'Hardware Setup Options',
    'Hardware Revision Details',
    'Related Documents',
  ],
  figures: [
    {
      title: '480 x 480 board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/ESP32-S3-LCD-EV-Board_480x480.png',
      alt: 'ESP32-S3-LCD-EV-Board with 480 x 480 LCD',
      sourceSection: 'Board Overview',
    },
    {
      title: 'Mainboard front layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp32-s3-lcd-ev-board-mb-v1.5-layout-front.png',
      alt: 'ESP32-S3-LCD-EV-Board-MB v1.5 front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'Block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp32-s3-lcd-ev-board-block-diagram.png',
      alt: 'ESP32-S3-LCD-EV-Board block diagram',
      sourceSection: 'Block Diagram',
    },
  ],
};

const vocatSource: SocSource = {
  title: 'ESP-VoCat v1.2 User Guide',
  version: 'v1.2',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-vocat/user_guide_v1.2.html',
  sections: ['Board Overview', 'Description of Components', 'Hardware Revision Details', 'Related Documents'],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp-vocat-black-front_v1.0.png',
      alt: 'ESP-VoCat board overview',
      sourceSection: 'Board Overview',
    },
    {
      title: 'Block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp-vocat-sch-function-block_v1.2.png',
      alt: 'ESP-VoCat block diagram',
      sourceSection: 'Board Overview',
    },
    {
      title: 'Core board schematic',
      kind: 'schematic-excerpt',
      url: 'https://dl.espressif.com/AE/esp-dev-kits/ESP-VoCat_SCH_V1_2.pdf',
      alt: 'ESP-VoCat v1.2 official schematic',
      sourceSection: 'Related Documents',
    },
  ],
};

const dualKeySource: SocSource = {
  title: 'ESP-DualKey User Guide',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/esp-dualkey/user_guide.html',
  sections: ['Board Overview', 'Description of Components', 'Related Documents'],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp-dualkey-front.jpg',
      alt: 'ESP-DualKey board overview',
      sourceSection: 'Board Overview',
    },
    {
      title: 'Block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s3/_images/esp-dualkey-block-diagram.png',
      alt: 'ESP-DualKey functional block diagram',
      sourceSection: 'Board Overview',
    },
    {
      title: 'Main board schematic',
      kind: 'schematic-excerpt',
      url: 'https://dl.espressif.com/AE/esp-dev-kits/SCH-ESP-Dualkey-MainBoard-V1_2.pdf',
      alt: 'ESP-DualKey v1.2 official schematic',
      sourceSection: 'Related Documents',
    },
  ],
};

const lcdEvModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-S3-WROOM-1-N16R16V',
    antenna: 'PCB antenna',
    flash: '16 MB SPI flash',
    psram: '16 MB Octal SPI PSRAM',
    footprint: '18 x 25 mm module',
    pinoutImpact: 'Fixed LCD-EV board profile; display, audio, USB, MicroSD, and expander circuits define the usable pins.',
    source: esp32s3Wroom1ModuleSource,
  },
];

const vocatModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-S3-WROOM-1-N16R16VA',
    antenna: 'PCB antenna',
    flash: '16 MB SPI flash',
    psram: '16 MB Octal SPI PSRAM',
    footprint: '18 x 25 mm module',
    pinoutImpact: 'Fixed ESP-VoCat board profile; voice, LCD, SD, touch, battery, and expansion circuits allocate the pins.',
    source: esp32s3Wroom1ModuleSource,
  },
];

const dualKeyModuleVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-S3FN8',
    antenna: 'PCB antenna on the main board',
    flash: '8 MB in-package flash',
    psram: 'No PSRAM',
    footprint: 'Bare ESP32-S3FN8 SoC on ESP-DualKey main board',
    pinoutImpact: 'Fixed ESP-DualKey board profile; keys, mode switch, USB, battery monitor, and RGB LEDs allocate the pins.',
    source: esp32s3DatasheetSource,
  },
];

export function createEsp32s3LcdEvBoardV15Profile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const modulePins = lcdEvModulePins.map((pin, index) =>
    allocationBoardPin(
      {
        ...pin,
        header: 'WROOM pin',
        profileId: 'esp32s3-lcd-ev-board-v1-5',
        position: positionForIndex(index, lcdEvModulePins.length, ['top', 'right', 'bottom', 'left']),
      },
      resolveSourcePinByGpio,
    ),
  );
  const expanderPins = lcdEvExpanderPins.map((pin, index) =>
    allocationBoardPin(
      {
        ...pin,
        header: 'I/O expander',
        profileId: 'esp32s3-lcd-ev-board-v1-5',
        position: { side: 'bottom', order: modulePins.filter((pin) => pin.position.side === 'bottom').length + index + 1 },
      },
      resolveSourcePinByGpio,
    ),
  );

  return {
    id: 'esp32s3-lcd-ev-board-v1-5',
    name: 'LCD-EV v1.5 (WROOM)',
    packageName: 'ESP32-S3-LCD-EV-Board v1.5 GPIO allocation',
    description:
      'ESP32-S3 HMI development board with LCD subboards, audio codec and ADC, microphones, MicroSD, USB, and an I/O expander.',
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'lcd-ev',
    source: lcdEvBoardSource,
    boardSpecs: {
      power: [
        'USB-to-USB or USB-to-UART can power the system; Espressif recommends at least a 5 V / 2 A supply.',
        'The board separates audio and digital power rails to reduce audio noise.',
      ],
      programming: [
        'Firmware can be uploaded through the USB-to-UART port or the native USB port.',
        'Download mode is entered with Boot plus Reset, or automatically through DTR/RTS from the USB-to-UART bridge.',
      ],
      onBoardHardware: [
        'LCD subboard connectors, RGB LED, ES7210 audio ADC, ES8311 audio codec, dual microphones, MicroSD slot, USB ports, buttons, and TCA9554 I/O expander.',
      ],
    },
    moduleNames: ['ESP32-S3-WROOM-1-N16R16V'],
    moduleVariants: lcdEvModuleVariants,
    identificationNotes: [
      'Choose this profile by the ESP32-S3-LCD-EV-Board-MB v1.5 carrier PCB silk marking and LCD-EV mainboard layout.',
    ],
    pins: [...modulePins, ...expanderPins],
  };
}

export function createEsp32s3VocatV12Profile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  return {
    id: 'esp-vocat-v1-2',
    name: 'ESP-VoCat v1.2 (WROOM)',
    packageName: 'ESP-VoCat v1.2 board allocation',
    description:
      'ESP32-S3 voice interaction board with circular LCD, microphone array, speaker amplifier, touch pads, MicroSD, battery management, and magnetic expansion.',
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'vocat',
    source: vocatSource,
    boardSpecs: {
      power: [
        'USB-C and the 3.7 V lithium battery path feed the board power system.',
        'The schematic includes power-control, battery-management, and codec power-control circuits.',
      ],
      programming: ['USB-C is used for power, programming download, and debugging. GPIO0 is tied to the boot function.'],
      onBoardHardware: [
        'Circular LCD, dual microphones, ES7210 audio ADC, ES8311 codec, NS4150B amplifier, BMI270 IMU, MicroSD slot, touch pads, green LED, battery gauge, and magnetic connector.',
      ],
    },
    moduleNames: ['ESP32-S3-WROOM-1-N16R16VA'],
    moduleVariants: vocatModuleVariants,
    identificationNotes: [
      'Choose this profile by the ESP-VoCat v1.2 carrier PCB, circular LCD assembly, microphone board, and magnetic connector.',
    ],
    pins: vocatPins.map((pin, index) =>
      allocationBoardPin(
        {
          ...pin,
          header: pin.group,
          profileId: 'esp-vocat-v1-2',
          position: positionForIndex(index, vocatPins.length, ['top', 'right', 'bottom', 'left']),
        },
        resolveSourcePinByGpio,
      ),
    ),
  };
}

export function createEsp32s3DualKeyProfile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  return {
    id: 'esp-dualkey',
    name: 'ESP-DualKey (S3FN8)',
    packageName: 'ESP-DualKey board allocation',
    description:
      'ESP32-S3FN8 mini keyboard board with two keys, mode switch, USB-C, battery monitor, RGB LEDs, and two HY2.0-4P ports.',
    kind: 'board',
    boardLayout: 'connector-groups',
    boardArtwork: 'dualkey',
    source: dualKeySource,
    boardSpecs: {
      power: [
        'USB-C powers the board and charges the 3.7 V battery through the charging circuit.',
        'The schematic includes VBUS, battery-voltage, charge-status, boost, and WS2812 power-control paths.',
      ],
      programming: ['USB-C is used for power, programming/download, debugging, and battery charging.'],
      onBoardHardware: ['Two keys, three-position mode switch, two WS2812 RGB LEDs, battery charger, VBUS monitor, and HY2.0-4P ports.'],
    },
    moduleNames: ['ESP32-S3FN8'],
    moduleVariants: dualKeyModuleVariants,
    identificationNotes: ['Choose this profile by the ESP-DualKey carrier PCB, dual-key shape, mode switch, and HY2.0-4P ports.'],
    pins: dualKeyPins.map((pin, index) =>
      allocationBoardPin(
        {
          ...pin,
          header: pin.group,
          profileId: 'esp-dualkey',
          position: positionForIndex(index, dualKeyPins.length, ['top', 'right', 'bottom', 'left']),
        },
        resolveSourcePinByGpio,
      ),
    ),
  };
}

const lcdEvModulePins: AllocationPinInput[] = [
  powerPin(1, 'GND', 'GND'),
  powerPin(2, '3V3', 'Power supply'),
  controlPin(3, 'EN', 'RESET', ['reset']),
  gpioPin(4, 'IO4', 'LED', 4, 'LED', ['onboard']),
  gpioPin(5, 'IO5', 'I2S_MCLK', 5, 'I2S_MCLK', ['onboard']),
  gpioPin(6, 'IO6', 'I2S_CODEC_DSDIN', 6, 'I2S_CODEC_DSDIN', ['onboard']),
  gpioPin(7, 'IO7', 'I2S_LRCK', 7, 'I2S_LRCK', ['onboard']),
  gpioPin(8, 'IO15', 'I2S_ADC_SDOUT', 15, 'I2S_ADC_SDOUT', ['onboard']),
  gpioPin(9, 'IO16', 'I2S_SCLK', 16, 'I2S_SCLK', ['onboard']),
  gpioPin(10, 'IO17', 'LCD_DE', 17, 'LCD_DE', ['onboard']),
  gpioPin(11, 'IO18', 'LCD_DATA7', 18, 'LCD_DATA7', ['onboard']),
  gpioPin(12, 'IO8', 'LCD_DATA6', 8, 'LCD_DATA6', ['onboard']),
  gpioPin(13, 'IO19', 'USB_D-', 19, 'USB_D-', ['usb']),
  gpioPin(14, 'IO20', 'USB_D+', 20, 'USB_D+', ['usb']),
  gpioPin(15, 'IO3', 'LCD_VSYNC', 3, 'LCD_VSYNC', ['onboard']),
  gpioPin(16, 'IO46', 'LCD_HSYNC', 46, 'LCD_HSYNC', ['onboard']),
  gpioPin(17, 'IO9', 'LCD_PCLK', 9, 'LCD_PCLK', ['onboard']),
  gpioPin(18, 'IO10', 'LCD_DATA0', 10, 'LCD_DATA0', ['onboard']),
  gpioPin(19, 'IO11', 'LCD_DATA1', 11, 'LCD_DATA1', ['onboard']),
  gpioPin(20, 'IO12', 'LCD_DATA2', 12, 'LCD_DATA2', ['onboard']),
  gpioPin(21, 'IO13', 'LCD_DATA3', 13, 'LCD_DATA3', ['onboard']),
  gpioPin(22, 'IO14', 'LCD_DATA4', 14, 'LCD_DATA4', ['onboard']),
  gpioPin(23, 'IO21', 'LCD_DATA5', 21, 'LCD_DATA5', ['onboard']),
  gpioPin(24, 'IO47', 'I2C_SDA', 47, 'I2C_SDA', ['onboard', 'voltage']),
  gpioPin(25, 'IO48', 'I2C_SCL', 48, 'I2C_SCL', ['onboard', 'voltage']),
  gpioPin(26, 'IO45', 'LCD_DATA8', 45, 'LCD_DATA8', ['onboard']),
  gpioPin(27, 'IO0', 'BOOT', 0, 'BOOT', ['boot', 'strapping']),
  gpioPin(28, 'IO35', 'No connection', 35, 'NC', ['onboard'], ['The official GPIO allocation table marks this pin as no connection.']),
  gpioPin(29, 'IO36', 'No connection', 36, 'NC', ['onboard'], ['The official GPIO allocation table marks this pin as no connection.']),
  gpioPin(30, 'IO37', 'No connection', 37, 'NC', ['onboard'], ['The official GPIO allocation table marks this pin as no connection.']),
  gpioPin(31, 'IO38', 'LCD_DATA9', 38, 'LCD_DATA9', ['onboard']),
  gpioPin(32, 'IO39', 'LCD_DATA10', 39, 'LCD_DATA10', ['onboard']),
  gpioPin(33, 'IO40', 'LCD_DATA11', 40, 'LCD_DATA11', ['onboard']),
  gpioPin(34, 'IO41', 'LCD_DATA12', 41, 'LCD_DATA12', ['onboard']),
  gpioPin(35, 'IO42', 'LCD_DATA13', 42, 'LCD_DATA13', ['onboard']),
  gpioPin(36, 'RXD0', 'UART_RXD0', 44, 'UART_RXD0', ['uart0']),
  gpioPin(37, 'TXD0', 'UART_TXD0', 43, 'UART_TXD0', ['uart0']),
  gpioPin(38, 'IO2', 'LCD_DATA14', 2, 'LCD_DATA14', ['onboard']),
  gpioPin(39, 'IO1', 'LCD_DATA15', 1, 'LCD_DATA15', ['onboard']),
  powerPin(40, 'GND', 'GND'),
  powerPin(41, 'EPAD', 'GND'),
];

const lcdEvExpanderPins: AllocationPinInput[] = [
  powerPin(101, 'A0', 'GND'),
  powerPin(102, 'A1', 'GND'),
  powerPin(103, 'A2', 'GND'),
  expanderPin(104, 'P0', 'PA_CTRL'),
  expanderPin(105, 'P1', 'LCD_SPI_CS'),
  expanderPin(106, 'P2', 'LCD_SPI_SCK'),
  expanderPin(107, 'P3', 'LCD_SPI_MOSI'),
  powerPin(108, 'GND', 'GND'),
  expanderPin(109, 'P4', 'Free', ['The official I/O expander table marks this pin as free.']),
  expanderPin(110, 'P5', 'Free', ['The official I/O expander table marks this pin as free.']),
  expanderPin(111, 'P6', 'Free', ['The official I/O expander table marks this pin as free.']),
  expanderPin(112, 'P7', 'Free', ['The official I/O expander table marks this pin as free.']),
  expanderPin(113, 'INT', 'No connection', ['The official I/O expander table marks INT as no connection.']),
  expanderPin(114, 'SCL', 'I2C_SCL'),
  expanderPin(115, 'SDA', 'I2C_SDA'),
  powerPin(116, 'VCC', 'Supply voltage'),
];

const vocatPins: AllocationPinInput[] = [
  gpioPin(1, 'ESP_BOOT', 'Boot button', 0, 'ESP_BOOT', ['boot', 'strapping']),
  gpioPin(2, 'USB_DN', 'USB-C', 19, 'USB_D-', ['usb']),
  gpioPin(3, 'USB_DP', 'USB-C', 20, 'USB_D+', ['usb']),
  gpioPin(4, 'POWER_CTRL', 'Power', 9, 'POWER_CTRL', ['onboard', 'power']),
  gpioPin(5, 'CODEC_PWR_CTRL', 'Audio power', 48, 'CODEC_PWR_CTRL', ['onboard', 'voltage']),
  gpioPin(6, 'I2C_SCL', 'Shared I2C', 1, 'I2C_SCL', ['onboard'], ['Shared clock for IMU, touch, battery, audio, and expansion I2C paths.']),
  gpioPin(7, 'I2C_SDA', 'Shared I2C', 2, 'I2C_SDA', ['onboard'], ['Shared data for IMU, touch, battery, audio, and expansion I2C paths.']),
  gpioPin(8, 'LCD_SDA0', 'LCD QSPI', 46, 'LCD_SDA0', ['onboard']),
  gpioPin(9, 'LCD_SDA1', 'LCD QSPI', 13, 'LCD_SDA1', ['onboard']),
  gpioPin(10, 'LCD_SDA2', 'LCD QSPI', 11, 'LCD_SDA2', ['onboard']),
  gpioPin(11, 'LCD_SDA3', 'LCD QSPI', 12, 'LCD_SDA3', ['onboard']),
  gpioPin(12, 'LCD_SCL', 'LCD QSPI', 18, 'LCD_SCL', ['onboard']),
  gpioPin(13, 'LCD_DC', 'LCD control', 45, 'LCD_DC', ['onboard']),
  gpioPin(14, 'LCD_BLK', 'LCD control', 44, 'LCD_BLK', ['onboard', 'uart0']),
  gpioPin(15, 'LCD_CS', 'LCD control', 14, 'LCD_CS', ['onboard']),
  gpioPin(16, 'LCD_RST_CTRL', 'LCD control', 47, 'LCD_RST_CTRL', ['onboard', 'voltage']),
  gpioPin(17, 'LCD_TE', 'LCD control', 8, 'LCD_TE', ['onboard']),
  gpioPin(18, 'TP_INT', 'Touch', 10, 'TP_INT', ['onboard']),
  gpioPin(19, 'TOUCH_PAD1', 'Touch', 6, 'TOUCH_PAD1', ['onboard']),
  gpioPin(20, 'TOUCH_PAD2', 'Touch', 7, 'TOUCH_PAD2', ['onboard']),
  gpioPin(21, 'I2S_MCLK', 'Audio I2S', 42, 'I2S_MCLK', ['onboard']),
  gpioPin(22, 'I2S_DI', 'Audio I2S', 3, 'I2S_DI', ['onboard']),
  gpioPin(23, 'I2S_WS', 'Audio I2S', 39, 'I2S_WS', ['onboard']),
  gpioPin(24, 'I2S_BCK', 'Audio I2S', 40, 'I2S_BCK', ['onboard']),
  gpioPin(25, 'I2S_DO', 'Audio I2S', 41, 'I2S_DO', ['onboard']),
  gpioPin(26, 'PA_CTRL', 'Speaker amplifier', 15, 'PA_CTRL', ['onboard']),
  gpioPin(27, 'SD_DA0', 'MicroSD', 17, 'SD_DA0', ['onboard']),
  gpioPin(28, 'SD_CLK', 'MicroSD', 16, 'SD_CLK', ['onboard']),
  gpioPin(29, 'SD_CMD', 'MicroSD', 38, 'SD_CMD', ['onboard']),
  gpioPin(30, 'IMU_INT1', 'IMU', 21, 'IMU_INT1', ['onboard']),
  gpioPin(31, 'U1RXD', 'Magnetic connector', 4, 'U1RXD', ['onboard']),
  gpioPin(32, 'U1TXD', 'Magnetic connector', 5, 'U1TXD', ['onboard']),
];

const dualKeyPins: AllocationPinInput[] = [
  gpioPin(1, 'KEY_1', 'Keys', 0, 'KEY_1', ['onboard', 'boot', 'strapping']),
  gpioPin(2, 'KEY_2', 'Keys', 17, 'KEY_2', ['onboard']),
  gpioPin(3, 'SWITCH_1', 'Mode switch', 8, 'SWITCH_1', ['onboard']),
  gpioPin(4, 'SWITCH_2', 'Mode switch', 7, 'SWITCH_2', ['onboard']),
  gpioPin(5, 'ADC_BAT', 'Power monitor', 10, 'ADC_BAT', ['onboard', 'voltage']),
  gpioPin(6, 'ADC_VBUS', 'Power monitor', 2, 'ADC_VBUS', ['onboard', 'voltage']),
  gpioPin(7, 'ADC_CHRG', 'Power monitor', 9, 'ADC_CHRG', ['onboard', 'voltage']),
  gpioPin(8, 'WS2812_IN', 'RGB LEDs', 21, 'WS2812_IN', ['onboard']),
  gpioPin(9, 'PWR_2812', 'RGB LEDs', 40, 'PWR_2812', ['onboard', 'power']),
  gpioPin(10, 'USB_DN', 'USB-C', 19, 'USB_D-', ['usb']),
  gpioPin(11, 'USB_DP', 'USB-C', 20, 'USB_D+', ['usb']),
  gpioPin(12, 'U0RXD', 'USB serial', 44, 'U0RXD', ['uart0']),
  gpioPin(13, 'U0TXD', 'USB serial', 43, 'U0TXD', ['uart0']),
  gpioPin(14, 'GPIO5', 'HY2.0 ports', 5, 'UART1_RX', ['onboard']),
  gpioPin(15, 'GPIO6', 'HY2.0 ports', 6, 'GPIO6', ['onboard']),
  gpioPin(16, 'GPIO47', 'HY2.0 ports', 47, 'GPIO47', ['onboard', 'voltage']),
  gpioPin(17, 'GPIO48', 'HY2.0 ports', 48, 'GPIO48', ['onboard', 'voltage']),
];

function allocationBoardPin(input: AllocationBoardPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const type = input.type ?? (input.gpio === undefined ? 'control' : 'io');
  const sourcePin = resolveSourcePinByGpio(input.gpio);
  const functionLabels = uniqueValues([
    input.gpio !== undefined ? `GPIO${input.gpio}` : '',
    input.functions?.[0] ?? input.label,
    ...(input.functions?.slice(1) ?? []),
  ].filter(Boolean));

  return makeBoardPin({
    id: `${input.profileId}-${input.header.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${input.number}`,
    number: input.number,
    displayNumber: `${input.header}-${input.number}`,
    label: input.label,
    boardHeader: input.header,
    boardGroup: input.group,
    type,
    gpio: input.gpio,
    sourcePin,
    position: input.position,
    mainFunctions: functionLabels,
    notes: input.notes,
    warnings: input.warnings,
    keywords: input.keywords,
    baseKeywords: ['board', 'allocation', 'esp32-s3'],
    note: `${input.label} in the official ${input.header} allocation for ${input.group}.`,
  });
}

function gpioPin(
  number: number,
  label: string,
  group: string,
  gpio: number,
  signal: string,
  warnings: PinWarning[] = ['onboard'],
  notes: string[] = [],
): AllocationPinInput {
  return {
    number,
    label,
    group,
    gpio,
    functions: [signal],
    notes,
    warnings,
    keywords: [signal, group],
  };
}

function powerPin(number: number, label: string, functionLabel: string): AllocationPinInput {
  return {
    number,
    label,
    group: 'Power',
    type: functionLabel === 'GND' ? 'ground' : 'power',
    functions: [functionLabel],
    notes: [functionLabel === 'GND' ? 'Ground reference on the board.' : `${functionLabel} on the board.`],
    warnings: ['power'],
    keywords: ['power', functionLabel, label],
  };
}

function controlPin(number: number, label: string, functionLabel: string, warnings: PinWarning[]): AllocationPinInput {
  return {
    number,
    label,
    group: 'Control',
    type: 'control',
    functions: [functionLabel],
    warnings,
    keywords: [functionLabel, label],
  };
}

function expanderPin(number: number, label: string, functionLabel: string, notes: string[] = []): AllocationPinInput {
  return {
    number,
    label,
    group: 'I/O expander',
    type: 'control',
    functions: [functionLabel],
    notes,
    warnings: ['onboard'],
    keywords: ['expander', 'tca9554', functionLabel, label],
  };
}

function positionForIndex(index: number, total: number, sides: PinPosition['side'][]): PinPosition {
  const sideSize = Math.ceil(total / sides.length);
  const sideIndex = Math.min(sides.length - 1, Math.floor(index / sideSize));

  return {
    side: sides[sideIndex],
    order: index - sideIndex * sideSize + 1,
  };
}
