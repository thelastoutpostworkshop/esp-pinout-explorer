import { makeBoardPin } from '@/data/boards/helpers';
import type { PinType, PinWarning, SocDefinition, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

const source: SocSource = {
  title: 'ESP32-C5 Series Datasheet',
  version: 'v1.3',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://www.espressif.com/sites/default/files/documentation/esp32-c5_datasheet_en.pdf',
  sections: ['Features', 'Section 2 Pins', 'Section 3 Boot Configurations'],
};

const devKitSource: SocSource = {
  title: 'ESP32-C5-DevKitC-1 v1.2 User Guide',
  version: 'v1.2',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/esp32-c5-devkitc-1/user_guide.html',
  sections: ['Description of Components', 'Power Supply Options', 'Header Block J1', 'Header Block J3', 'Hardware Revision Details'],
  figures: [
    {
      title: 'Board overview',
      kind: 'board-photo',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/esp32-c5-devkitc-1-isometric_v1.1.png',
      alt: 'ESP32-C5-DevKitC-1 development board',
      sourceSection: 'Overview',
    },
    {
      title: 'Component layout',
      kind: 'component-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/ESP32-C5-DevKitC-1_callouts.png',
      alt: 'ESP32-C5-DevKitC-1 front component layout',
      sourceSection: 'Description of Components',
    },
    {
      title: 'System block diagram',
      kind: 'block-diagram',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/ESP32-C5-DevKitC-1-block-diagram.png',
      alt: 'ESP32-C5-DevKitC-1 system block diagram',
      sourceSection: 'Block Diagram',
    },
    {
      title: 'Pin layout',
      kind: 'pin-layout',
      url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/esp32-c5-devkitc-1-pin-layout_v1.2.png',
      alt: 'ESP32-C5-DevKitC-1 v1.2 pin layout',
      sourceSection: 'Pin Layout',
    },
  ],
};

const wroomSource: SocSource = {
  title: 'ESP32-C5-WROOM-1 & ESP32-C5-WROOM-1U Datasheet',
  version: 'latest',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://www.espressif.com/sites/default/files/documentation/esp32-c5-wroom-1_wroom-1u_datasheet_en.pdf',
  sections: ['Product Overview', 'Pin Definitions'],
};

const devKitVariants: SocModuleVariant[] = [
  {
    name: 'ESP32-C5-WROOM-1-N8R8',
    antenna: 'PCB antenna',
    flash: '8 MB SPI flash',
    psram: '8 MB octal PSRAM',
    pinoutImpact: 'GPIO15 is used for SPICS1 by the on-module PSRAM and is not available on the header.',
    source: wroomSource,
  },
  {
    name: 'ESP32-C5-WROOM-1U-N8R8',
    antenna: 'External antenna connector',
    flash: '8 MB SPI flash',
    psram: '8 MB octal PSRAM',
    pinoutImpact: 'Same header limitations as WROOM-1-N8R8; the antenna implementation differs.',
    source: wroomSource,
  },
];

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

function boardPin(input: HeaderPinInput): SocPin {
  const displayNumber = `${input.header}-${input.number}`;

  return makeBoardPin({
    id: `esp32c5-devkitc1-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'J1' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions,
    note: `${displayNumber} board header pin, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: ['board', 'devkit', 'devkitc', 'devkitc-1', 'esp32-c5-devkitc-1', 'module', 'wroom', 'header'],
    keywords: input.keywords,
  });
}

const strappingNote = 'ESP32-C5 strapping pin; its voltage at power-up or reset controls chip configuration.';

const devKitPins: SocPin[] = [
  boardPin({ header: 'J1', number: 1, label: '3V3', type: 'power', mainFunctions: ['3.3 V power supply'], notes: ['3.3 V board power rail.'], warnings: ['power', 'voltage'], keywords: ['3v3', '3.3v', 'power', 'supply'] }),
  boardPin({ header: 'J1', number: 2, label: 'RST', type: 'control', mainFunctions: ['EN', 'Reset'], notes: ['High enables the chip; low disables the chip. Connected to the board Reset button.'], warnings: ['reset'], keywords: ['rst', 'reset', 'en', 'enable'] }),
  boardPin({ header: 'J1', number: 3, label: '2', type: 'io', gpio: 2, mainFunctions: ['MTMS', 'LP_GPIO2', 'LP_UART_RTSN', 'LP_I2C_SDA', 'ADC1_CH1', 'FSPIQ'], notes: [strappingNote], warnings: ['strapping', 'jtag'], keywords: ['mtms', 'jtag', 'adc', 'lp uart', 'lp i2c', 'fspi'] }),
  boardPin({ header: 'J1', number: 4, label: '3', type: 'io', gpio: 3, mainFunctions: ['MTDI', 'LP_GPIO3', 'LP_UART_CTSN', 'LP_I2C_SCL', 'ADC1_CH2'], notes: [strappingNote], warnings: ['strapping', 'jtag'], keywords: ['mtdi', 'jtag', 'adc', 'lp uart', 'lp i2c'] }),
  boardPin({ header: 'J1', number: 5, label: '0', type: 'io', gpio: 0, mainFunctions: ['XTAL_32K_P', 'LP_GPIO0', 'LP_UART_DTRN'], keywords: ['xtal', '32k', 'lp uart'] }),
  boardPin({ header: 'J1', number: 6, label: '1', type: 'io', gpio: 1, mainFunctions: ['XTAL_32K_N', 'LP_GPIO1', 'LP_UART_DSRN', 'ADC1_CH0'], keywords: ['xtal', '32k', 'adc', 'lp uart'] }),
  boardPin({ header: 'J1', number: 7, label: '6', type: 'io', gpio: 6, mainFunctions: ['LP_GPIO6', 'ADC1_CH5', 'FSPICLK'], keywords: ['adc', 'fspi', 'spi', 'clock'] }),
  boardPin({ header: 'J1', number: 8, label: '7', type: 'io', gpio: 7, mainFunctions: ['SDIO_DATA1'], notes: [strappingNote], warnings: ['strapping'], keywords: ['sdio', 'strap', 'strapping'] }),
  boardPin({ header: 'J1', number: 9, label: '8', type: 'io', gpio: 8, mainFunctions: ['PAD_COMP0', 'SDIO_DATA0'], keywords: ['comparator', 'sdio'] }),
  boardPin({ header: 'J1', number: 10, label: '9', type: 'io', gpio: 9, mainFunctions: ['PAD_COMP1', 'SDIO_CLK'], keywords: ['comparator', 'sdio'] }),
  boardPin({ header: 'J1', number: 11, label: '10', type: 'io', gpio: 10, mainFunctions: ['FSPICS0', 'SDIO_CMD'], keywords: ['fspi', 'spi', 'sdio'] }),
  boardPin({ header: 'J1', number: 12, label: '26', type: 'io', gpio: 26, mainFunctions: [], notes: [strappingNote], warnings: ['strapping'], keywords: ['strap', 'strapping'] }),
  boardPin({ header: 'J1', number: 13, label: '25', type: 'io', gpio: 25, mainFunctions: [], notes: [strappingNote], warnings: ['strapping'], keywords: ['strap', 'strapping'] }),
  boardPin({ header: 'J1', number: 14, label: '5V', type: 'power', mainFunctions: ['5 V power supply'], notes: ['5 V board power rail.'], warnings: ['power', 'voltage'], keywords: ['5v', 'power', 'supply'] }),
  boardPin({ header: 'J1', number: 15, label: 'G', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin.'], keywords: ['ground', 'gnd'] }),
  boardPin({ header: 'J1', number: 16, label: 'NC', type: 'control', mainFunctions: ['No connection'], notes: ['Official header position is not connected.'], keywords: ['nc', 'no connection', 'not connected'] }),
  boardPin({ header: 'J3', number: 1, label: 'G', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin.'], keywords: ['ground', 'gnd'] }),
  boardPin({ header: 'J3', number: 2, label: 'TX', type: 'io', gpio: 11, mainFunctions: ['U0TXD'], notes: ['Connected to the on-board USB-to-UART bridge TX signal.'], warnings: ['uart0', 'onboard'], keywords: ['tx', 'uart', 'serial', 'usb to uart'] }),
  boardPin({ header: 'J3', number: 3, label: 'RX', type: 'io', gpio: 12, mainFunctions: ['U0RXD'], notes: ['Connected to the on-board USB-to-UART bridge RX signal.'], warnings: ['uart0', 'onboard'], keywords: ['rx', 'uart', 'serial', 'usb to uart'] }),
  boardPin({ header: 'J3', number: 4, label: '24', type: 'io', gpio: 24, mainFunctions: [] }),
  boardPin({ header: 'J3', number: 5, label: '23', type: 'io', gpio: 23, mainFunctions: [] }),
  boardPin({ header: 'J3', number: 6, label: 'NC/15', type: 'io', gpio: 15, mainFunctions: ['SPICS1'], notes: ['Not connected on this DevKitC-1 because the WROOM module uses GPIO15 for SPI PSRAM. GPIO15 is available only on module variants without SPI PSRAM.'], warnings: ['psram'], keywords: ['nc', 'psram', 'spics1', 'not connected'] }),
  boardPin({ header: 'J3', number: 7, label: '27', type: 'io', gpio: 27, mainFunctions: ['RGB LED'], notes: ['Drives the addressable RGB LED on the board.', strappingNote], warnings: ['onboard', 'strapping'], keywords: ['rgb', 'rgb led', 'led', 'onboard', 'strap', 'strapping'] }),
  boardPin({ header: 'J3', number: 8, label: '4', type: 'io', gpio: 4, mainFunctions: ['MTCK', 'LP_GPIO4', 'LP_UART_RXD', 'ADC1_CH3', 'FSPIHD'], keywords: ['mtck', 'jtag', 'adc', 'lp uart', 'fspi'] }),
  boardPin({ header: 'J3', number: 9, label: '5', type: 'io', gpio: 5, mainFunctions: ['MTDO', 'LP_GPIO5', 'LP_UART_TXD', 'ADC1_CH4', 'FSPIWP'], keywords: ['mtdo', 'jtag', 'adc', 'lp uart', 'fspi'] }),
  boardPin({ header: 'J3', number: 10, label: 'NC', type: 'control', mainFunctions: ['No connection'], notes: ['Official header position is not connected.'], keywords: ['nc', 'no connection', 'not connected'] }),
  boardPin({ header: 'J3', number: 11, label: '28', type: 'io', gpio: 28, mainFunctions: [], notes: [strappingNote], warnings: ['strapping'], keywords: ['strap', 'strapping'] }),
  boardPin({ header: 'J3', number: 12, label: 'G', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin.'], keywords: ['ground', 'gnd'] }),
  boardPin({ header: 'J3', number: 13, label: '14', type: 'io', gpio: 14, mainFunctions: ['USB_D+', 'SDIO_DATA2'], notes: ['Connected to the ESP32-C5 native USB Type-C port.'], warnings: ['usb', 'onboard'], keywords: ['usb', 'usb d+', 'native usb', 'sdio'] }),
  boardPin({ header: 'J3', number: 14, label: '13', type: 'io', gpio: 13, mainFunctions: ['USB_D-', 'SDIO_DATA3'], notes: ['Connected to the ESP32-C5 native USB Type-C port.'], warnings: ['usb', 'onboard'], keywords: ['usb', 'usb d-', 'native usb', 'sdio'] }),
  boardPin({ header: 'J3', number: 15, label: 'G', type: 'ground', mainFunctions: ['Ground'], notes: ['Ground reference pin.'], keywords: ['ground', 'gnd'] }),
  boardPin({ header: 'J3', number: 16, label: 'NC', type: 'control', mainFunctions: ['No connection'], notes: ['Official header position is not connected.'], keywords: ['nc', 'no connection', 'not connected'] }),
];

const devKitProfile: SocPackageVariant = {
  id: 'esp32c5-devkitc-1-v1-2',
  name: 'DevKitC-1 v1.2',
  packageName: 'ESP32-C5-DevKitC-1 v1.2 board headers',
  description: 'Entry-level ESP32-C5-WROOM-1(U) development board with Wi-Fi 6, Bluetooth LE, Zigbee, and Thread.',
  kind: 'board',
  source: devKitSource,
  boardSpecs: {
    power: ['USB Type-C to UART port, ESP32-C5 USB Type-C port, 5V/GND headers, or 3V3/GND headers; use only mutually compatible power paths.', 'J5 jumper supports module current measurement.'],
    programming: ['USB-to-UART bridge for flashing and serial logs; native ESP32-C5 USB Type-C supports USB protocols and JTAG debugging.'],
    onBoardHardware: ['Boot and Reset buttons, addressable RGB LED on GPIO27, USB-to-UART bridge, native USB Type-C port, and J5 current-measurement jumper.'],
  },
  moduleNames: ['ESP32-C5-WROOM-1', 'ESP32-C5-WROOM-1U'],
  moduleVariants: devKitVariants,
  identificationNotes: ['Choose this profile by the ESP32-C5-DevKitC-1 carrier board and its J1/J3 header layout. The WROOM module marking alone does not identify the carrier board.'],
  pins: devKitPins,
};

const sensairSource: SocSource = {
  title: 'ESP-SensairShuttle v1.0 User Guide',
  version: 'v1.0',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/esp-sensairshuttle/user_guide_v1.0.html',
  sections: ['Component Overview', 'Power Options', 'I2C/RGB/External Pin Interface', 'Shuttle Board Interface Circuit', 'Hardware Revision History'],
  figures: [
    { title: 'Mainboard front', kind: 'board-photo', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/esp-sensairshuttle-mainboard-front.png', alt: 'ESP-SensairShuttle mainboard front', sourceSection: 'Component Overview' },
    { title: 'Mainboard back', kind: 'component-layout', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/esp-sensairshuttle-mainboard-back.png', alt: 'ESP-SensairShuttle mainboard back', sourceSection: 'Component Overview' },
    { title: 'Function block diagram', kind: 'block-diagram', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/esp-sensairshuttle-sch-function-block_v1_0.png', alt: 'ESP-SensairShuttle function block diagram', sourceSection: 'Function Block Diagram' },
    { title: 'External-interface circuit', kind: 'schematic-excerpt', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32c5/_images/esp-sensairshuttle-mainboard-sch-external-interface-v1_0.png', alt: 'ESP-SensairShuttle external pin, I2C, and RGB interface circuit', sourceSection: 'I2C/RGB/External Pin Interface' },
  ],
};

function sensairPin(
  id: string,
  displayNumber: string,
  label: string,
  type: PinType,
  group: string,
  side: 'left' | 'right' | 'top' | 'bottom',
  order: number,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'displayNumber' | 'name' | 'type' | 'position' | 'boardGroup' | 'boardLabel'>> = {},
): SocPin {
  return makeBoardPin({
    id,
    number: order,
    displayNumber,
    label,
    type,
    gpio: details.gpio,
    boardGroup: group,
    position: { side, order },
    mainFunctions: details.mainFunctions ?? [],
    note: `${group} connector pin ${displayNumber}.`,
    notes: details.notes,
    warnings: details.warnings,
    baseKeywords: ['board', 'esp-sensairshuttle', 'sensair', 'connector', group.toLowerCase()],
    keywords: details.keywords,
  });
}

const sensairPins: SocPin[] = [
  sensairPin('esp-sensair-ext-1', 'EXT-1', 'GPIO5', 'io', 'External pins', 'top', 1, { gpio: 5, mainFunctions: ['PWR_CTRL'], notes: ['GPIO5 is not available by default. Install R14 to use it through the external pin interface; it also controls LCD power.'], warnings: ['onboard'], keywords: ['external io', 'r14', 'lcd power', 'power control'] }),
  sensairPin('esp-sensair-ext-2', 'EXT-2', 'GPIO4', 'io', 'External pins', 'top', 2, { gpio: 4, mainFunctions: ['EXT_IO1', 'PA_CTL'], notes: ['Exposed on the external pin interface and connected to the speaker-amplifier control signal.'], warnings: ['onboard'], keywords: ['external io', 'speaker', 'amplifier'] }),
  sensairPin('esp-sensair-ext-3', 'EXT-3', 'VDD', 'power', 'External pins', 'top', 3, { mainFunctions: ['3.3 V supply'], warnings: ['power', 'voltage'], keywords: ['3v3', 'power', 'supply'] }),
  sensairPin('esp-sensair-ext-4', 'EXT-4', 'GND', 'ground', 'External pins', 'top', 4, { mainFunctions: ['Ground'], keywords: ['ground', 'gnd'] }),
  sensairPin('esp-sensair-i2c-1', 'I2C-1', 'SCL', 'io', 'External I2C', 'left', 1, { gpio: 3, mainFunctions: ['BM_SCK/SCL', 'LCD_TP_SCL'], notes: ['Shared by the external I2C interface, Shuttle Board connector, and LCD touch interface.'], warnings: ['onboard'], keywords: ['i2c', 'scl', 'sensor', 'touch'] }),
  sensairPin('esp-sensair-i2c-2', 'I2C-2', 'SDA', 'io', 'External I2C', 'left', 2, { gpio: 2, mainFunctions: ['BM_SDI/SDA', 'LCD_TP_SDA'], notes: ['Shared by the external I2C interface, Shuttle Board connector, and LCD touch interface.'], warnings: ['onboard', 'strapping'], keywords: ['i2c', 'sda', 'sensor', 'touch', 'strap', 'strapping'] }),
  sensairPin('esp-sensair-i2c-3', 'I2C-3', 'VDD', 'power', 'External I2C', 'left', 3, { mainFunctions: ['3.3 V supply'], warnings: ['power', 'voltage'], keywords: ['3v3', 'power', 'supply'] }),
  sensairPin('esp-sensair-i2c-4', 'I2C-4', 'GND', 'ground', 'External I2C', 'left', 4, { mainFunctions: ['Ground'], keywords: ['ground', 'gnd'] }),
  sensairPin('esp-sensair-rgb-1', 'RGB-1', 'DIN', 'io', 'External RGB', 'right', 1, { gpio: 27, mainFunctions: ['WS2812_CTRL'], notes: ['Data output for the external RGB-strip interface. GPIO27 is also an ESP32-C5 strapping pin.'], warnings: ['strapping'], keywords: ['rgb', 'ws2812', 'led strip', 'strap', 'strapping'] }),
  sensairPin('esp-sensair-rgb-2', 'RGB-2', 'VDD', 'power', 'External RGB', 'right', 2, { mainFunctions: ['3.3 V supply'], warnings: ['power', 'voltage'], keywords: ['3v3', 'power', 'supply'] }),
  sensairPin('esp-sensair-rgb-3', 'RGB-3', 'GND', 'ground', 'External RGB', 'right', 3, { mainFunctions: ['Ground'], keywords: ['ground', 'gnd'] }),
  sensairPin('esp-sensair-shuttle-1', 'SHUTTLE-1', 'CS', 'io', 'Shuttle Board', 'bottom', 1, { gpio: 10, mainFunctions: ['BM_CS'], notes: ['Connected to the Shuttle Board sensor interface.'], warnings: ['onboard'], keywords: ['shuttle', 'sensor', 'chip select'] }),
  sensairPin('esp-sensair-shuttle-2', 'SHUTTLE-2', 'SDO', 'io', 'Shuttle Board', 'bottom', 2, { gpio: 9, mainFunctions: ['BM_SDO'], notes: ['Connected to the Shuttle Board sensor interface.'], warnings: ['onboard'], keywords: ['shuttle', 'sensor', 'spi'] }),
  sensairPin('esp-sensair-shuttle-3', 'SHUTTLE-3', 'G1', 'io', 'Shuttle Board', 'bottom', 3, { gpio: 28, mainFunctions: ['BM_G1', 'ESP_BOOT'], notes: ['Connected to the Shuttle Board sensor interface and the Boot button.'], warnings: ['onboard', 'strapping', 'boot'], keywords: ['shuttle', 'sensor', 'boot', 'strap', 'strapping'] }),
  sensairPin('esp-sensair-shuttle-4', 'SHUTTLE-4', 'G2', 'io', 'Shuttle Board', 'bottom', 4, { gpio: 0, mainFunctions: ['BM_G2'], notes: ['Connected to the Shuttle Board sensor interface.'], warnings: ['onboard'], keywords: ['shuttle', 'sensor'] }),
  sensairPin('esp-sensair-shuttle-5', 'SHUTTLE-5', 'SCL', 'io', 'Shuttle Board', 'bottom', 5, { gpio: 3, mainFunctions: ['BM_SCK/SCL'], notes: ['Shared I2C clock for Shuttle Board sensors.'], warnings: ['onboard'], keywords: ['shuttle', 'i2c', 'scl', 'sensor'] }),
  sensairPin('esp-sensair-shuttle-6', 'SHUTTLE-6', 'SDA', 'io', 'Shuttle Board', 'bottom', 6, { gpio: 2, mainFunctions: ['BM_SDI/SDA'], notes: ['Shared I2C data for Shuttle Board sensors.'], warnings: ['onboard', 'strapping'], keywords: ['shuttle', 'i2c', 'sda', 'sensor', 'strap', 'strapping'] }),
  sensairPin('esp-sensair-shuttle-7', 'SHUTTLE-7', 'VDD', 'power', 'Shuttle Board', 'bottom', 7, { mainFunctions: ['Sensor supply'], warnings: ['power', 'voltage'], keywords: ['power', 'sensor supply'] }),
  sensairPin('esp-sensair-shuttle-8', 'SHUTTLE-8', 'GND', 'ground', 'Shuttle Board', 'bottom', 8, { mainFunctions: ['Ground'], keywords: ['ground', 'gnd'] }),
];

const sensairProfile: SocPackageVariant = {
  id: 'esp-sensairshuttle-v1-0',
  name: 'SensairShuttle v1.0',
  packageName: 'ESP-SensairShuttle v1.0 connector interfaces',
  description: 'ESP32-C5 sensor and AI-interaction development board jointly launched by Espressif and Bosch Sensortec.',
  kind: 'board',
  boardLayout: 'connector-groups',
  source: sensairSource,
  boardSpecs: {
    power: ['USB-C power or an external 3.7 V lithium battery through the battery connector.'],
    programming: ['USB-C port supplies power, flashing, and debugging.'],
    onBoardHardware: ['ESP32-C5-WROOM-1-N16R8, LCD connector, Shuttle Board sensor connector, BMM350 magnetometer, battery charger, microphone and speaker connectors, Boot button, and external RGB-strip interface.'],
  },
  moduleNames: ['ESP32-C5-WROOM-1-N16R8'],
  moduleVariants: [{ name: 'ESP32-C5-WROOM-1-N16R8', antenna: 'PCB antenna', flash: '16 MB SPI flash', psram: '8 MB octal PSRAM', pinoutImpact: 'This SensairShuttle board profile represents connector signals and on-board sharing, not bare module pads.', source: wroomSource }],
  identificationNotes: ['Confirm the v1.0 silkscreen in the white circle at the top right of the mainboard front or back.', 'This profile represents documented connector interfaces; it is not a complete module-pad view.'],
  pins: sensairPins,
};

export const esp32c5: SocDefinition = {
  id: 'esp32c5',
  name: 'ESP32-C5',
  family: 'ESP32-C5',
  defaultProfileId: devKitProfile.id,
  packageName: 'ESP32-C5 QFN48, 6 x 6 mm',
  description: 'Dual-band Wi-Fi 6 ESP32 family with Bluetooth LE, Zigbee, and Thread support.',
  chipSpecs: {
    wireless: '2.4 and 5 GHz Wi-Fi 6, Bluetooth LE, Zigbee, Thread',
    cpu: 'HP RISC-V up to 240 MHz + LP RISC-V up to 48 MHz',
    sram: '384 KB HP SRAM + 16 KB LP SRAM',
    rom: '320 KB',
  },
  source,
  pins: devKitPins,
  boardProfiles: [devKitProfile, sensairProfile],
};
