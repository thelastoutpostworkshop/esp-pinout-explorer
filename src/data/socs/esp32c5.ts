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
  boardProfiles: [devKitProfile],
};
