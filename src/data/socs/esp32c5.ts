import { makeBoardPin } from '@/data/boards/helpers';
import type { PinType, PinWarning, SocDefinition, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

const source: SocSource = {
  title: 'ESP32-C5 Series Datasheet',
  version: 'v1.3',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c5_datasheet_en.pdf',
  sections: ['Figure 2-1 ESP32-C5HR2 & ESP32-C5HR8 Pin Layout (Top View)', 'Figure 2-2 ESP32-C5HF4 Pin Layout (Top View)', 'Table 2-1 Pin Overview', 'Section 2.3.4 Restrictions for GPIOs and LP GPIOs', 'Table 2-13 Pin Mapping Between Chip and Off-Package Flash', 'Table 2-14 Pin Mapping Between Chip and Off-Package PSRAM', 'Table 3-1 Default Configuration of Strapping Pins', 'Table 3-3 Chip Boot Mode Control'],
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

const c5MatrixSignals = ['SPI2', 'UART1', 'I2C', 'I2S', 'TWAI', 'LED PWM', 'MCPWM', 'RMT', 'PCNT', 'PARLIO'];
const c5StrappingNote = 'ESP32-C5 strapping pin; its voltage at power-up or reset controls chip configuration.';
const c5FlashNote = 'Allocated to the off-package flash or PSRAM interface; Espressif does not recommend using it for other purposes.';

function c5Pin(
  number: number,
  name: string,
  type: PinType,
  position: SocPin['position'],
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position'>> = {},
): SocPin {
  return { id: `esp32c5-pin-${number}`, number, name, type, position, mainFunctions: [], ...details };
}

function c5Io(
  number: number,
  name: string,
  gpio: number,
  position: SocPin['position'],
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position' | 'gpio'>> = {},
): SocPin {
  return c5Pin(number, name, 'io', position, {
    gpio,
    mainFunctions: [`GPIO${gpio}`],
    matrixSignals: c5MatrixSignals,
    ...details,
  });
}

const qfn48HrPins: SocPin[] = [
  c5Pin(1, 'VDDA6', 'power', { side: 'left', order: 12 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda6'] }),
  c5Pin(2, 'GND', 'ground', { side: 'left', order: 11 }, { mainFunctions: ['Ground'], notes: ['External ground connection.'], keywords: ['ground', 'gnd'] }),
  c5Pin(3, 'VDDA7', 'power', { side: 'left', order: 10 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda7'] }),
  c5Pin(4, 'XTAL_N', 'analog', { side: 'left', order: 9 }, { mainFunctions: ['XTAL_N'], analog: ['XTAL_N'], notes: ['Dedicated main-crystal negative pin, not a GPIO.'], keywords: ['xtal', 'crystal', 'clock'] }),
  c5Pin(5, 'XTAL_P', 'analog', { side: 'left', order: 8 }, { mainFunctions: ['XTAL_P'], analog: ['XTAL_P'], notes: ['Dedicated main-crystal positive pin, not a GPIO.'], keywords: ['xtal', 'crystal', 'clock'] }),
  c5Pin(6, 'VDDA8', 'power', { side: 'left', order: 7 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda8'] }),
  c5Pin(7, 'CHIP_PU', 'control', { side: 'left', order: 6 }, { mainFunctions: ['CHIP_PU'], notes: ['High enables the chip; low disables or resets it. Do not leave this pin floating.'], warnings: ['reset'], keywords: ['enable', 'reset', 'chip pu'] }),
  c5Pin(8, 'VDDPST1', 'power', { side: 'left', order: 5 }, { mainFunctions: ['LP digital power input'], notes: ['Supplies the low-power digital domain.'], warnings: ['power', 'voltage'], keywords: ['power', 'lp', 'vddpst1'] }),
  c5Io(9, 'XTAL_32K_P', 0, { side: 'left', order: 4 }, { mainFunctions: ['GPIO0', 'XTAL_32K_P', 'LP_GPIO0', 'LP_UART_DTRN'], ioMux: ['GPIO0'], rtc: ['LP_GPIO0', 'LP_UART_DTRN'], analog: ['XTAL_32K_P'], keywords: ['gpio0', 'xtal', '32k', 'lp uart'] }),
  c5Io(10, 'XTAL_32K_N', 1, { side: 'left', order: 3 }, { mainFunctions: ['GPIO1', 'XTAL_32K_N', 'LP_GPIO1', 'LP_UART_DSRN'], ioMux: ['GPIO1'], rtc: ['LP_GPIO1', 'LP_UART_DSRN'], analog: ['XTAL_32K_N', 'ADC1_CH0'], keywords: ['gpio1', 'xtal', '32k', 'adc', 'lp uart'] }),
  c5Io(11, 'MTMS', 2, { side: 'left', order: 2 }, { mainFunctions: ['GPIO2', 'MTMS', 'LP_GPIO2', 'LP_UART_RTSN', 'LP_I2C_SDA', 'ADC1_CH1', 'FSPIQ'], ioMux: ['GPIO2', 'MTMS', 'FSPIQ'], rtc: ['LP_GPIO2', 'LP_UART_RTSN', 'LP_I2C_SDA'], analog: ['ADC1_CH1'], notes: [c5StrappingNote], warnings: ['strapping', 'jtag'], keywords: ['gpio2', 'jtag', 'strap', 'adc', 'fspi'] }),
  c5Io(12, 'MTDI', 3, { side: 'left', order: 1 }, { mainFunctions: ['GPIO3', 'MTDI', 'LP_GPIO3', 'LP_UART_CTSN', 'LP_I2C_SCL', 'ADC1_CH2'], ioMux: ['GPIO3', 'MTDI'], rtc: ['LP_GPIO3', 'LP_UART_CTSN', 'LP_I2C_SCL'], analog: ['ADC1_CH2'], notes: [c5StrappingNote], warnings: ['strapping', 'jtag'], keywords: ['gpio3', 'jtag', 'strap', 'adc'] }),
  c5Io(13, 'MTCK', 4, { side: 'top', order: 1 }, { mainFunctions: ['GPIO4', 'MTCK', 'LP_GPIO4', 'LP_UART_RXD', 'ADC1_CH3', 'FSPIHD'], ioMux: ['GPIO4', 'MTCK', 'FSPIHD'], rtc: ['LP_GPIO4', 'LP_UART_RXD'], analog: ['ADC1_CH3'], warnings: ['jtag'], keywords: ['gpio4', 'jtag', 'adc', 'fspi'] }),
  c5Io(14, 'MTDO', 5, { side: 'top', order: 2 }, { mainFunctions: ['GPIO5', 'MTDO', 'LP_GPIO5', 'LP_UART_TXD', 'ADC1_CH4', 'FSPIWP'], ioMux: ['GPIO5', 'MTDO', 'FSPIWP'], rtc: ['LP_GPIO5', 'LP_UART_TXD'], analog: ['ADC1_CH4'], warnings: ['jtag'], keywords: ['gpio5', 'jtag', 'adc', 'fspi'] }),
  c5Io(15, 'GPIO6', 6, { side: 'top', order: 3 }, { mainFunctions: ['GPIO6', 'LP_GPIO6', 'ADC1_CH5', 'FSPICLK'], ioMux: ['GPIO6', 'FSPICLK'], rtc: ['LP_GPIO6'], analog: ['ADC1_CH5'], keywords: ['gpio6', 'adc', 'fspi'] }),
  c5Io(16, 'GPIO7', 7, { side: 'top', order: 4 }, { mainFunctions: ['GPIO7', 'SDIO_DATA1'], ioMux: ['GPIO7', 'SDIO_DATA1'], notes: [c5StrappingNote], warnings: ['strapping'], keywords: ['gpio7', 'strap', 'sdio'] }),
  c5Io(17, 'GPIO8', 8, { side: 'top', order: 5 }, { mainFunctions: ['GPIO8', 'PAD_COMP0', 'SDIO_DATA0'], ioMux: ['GPIO8', 'SDIO_DATA0'], analog: ['PAD_COMP0'], keywords: ['gpio8', 'comparator', 'sdio'] }),
  c5Io(18, 'GPIO9', 9, { side: 'top', order: 6 }, { mainFunctions: ['GPIO9', 'PAD_COMP1', 'SDIO_CLK'], ioMux: ['GPIO9', 'SDIO_CLK'], analog: ['PAD_COMP1'], keywords: ['gpio9', 'comparator', 'sdio'] }),
  c5Io(19, 'GPIO10', 10, { side: 'top', order: 7 }, { mainFunctions: ['GPIO10', 'FSPICS0', 'SDIO_CMD'], ioMux: ['GPIO10', 'FSPICS0', 'SDIO_CMD'], keywords: ['gpio10', 'fspi', 'sdio'] }),
  c5Io(20, 'U0TXD', 11, { side: 'top', order: 8 }, { mainFunctions: ['GPIO11', 'U0TXD'], ioMux: ['GPIO11', 'U0TXD'], notes: ['UART0 is commonly used for boot messages, flashing, and serial debugging.'], warnings: ['uart0'], keywords: ['gpio11', 'uart0', 'tx', 'serial'] }),
  c5Io(21, 'U0RXD', 12, { side: 'top', order: 9 }, { mainFunctions: ['GPIO12', 'U0RXD'], ioMux: ['GPIO12', 'U0RXD'], notes: ['UART0 is commonly used for boot messages, flashing, and serial debugging.'], warnings: ['uart0'], keywords: ['gpio12', 'uart0', 'rx', 'serial'] }),
  c5Io(22, 'GPIO13', 13, { side: 'top', order: 10 }, { mainFunctions: ['GPIO13', 'USB_D-'], ioMux: ['GPIO13', 'USB_D-'], notes: ['Connected to USB Serial/JTAG by default; reconfigure before normal GPIO use.'], warnings: ['usb'], keywords: ['gpio13', 'usb', 'serial jtag'] }),
  c5Io(23, 'GPIO14', 14, { side: 'top', order: 11 }, { mainFunctions: ['GPIO14', 'USB_D+'], ioMux: ['GPIO14', 'USB_D+'], notes: ['Connected to USB Serial/JTAG by default; reconfigure before normal GPIO use.'], warnings: ['usb'], keywords: ['gpio14', 'usb', 'serial jtag'] }),
  c5Pin(24, 'VDDPST2', 'power', { side: 'top', order: 12 }, { mainFunctions: ['HP digital power input'], notes: ['Supplies the high-performance digital and part of the analog pin domains.'], warnings: ['power', 'voltage'], keywords: ['power', 'hp', 'vddpst2'] }),
  c5Io(25, 'SPICS1', 15, { side: 'right', order: 1 }, { mainFunctions: ['GPIO15', 'SPICS1'], ioMux: ['GPIO15', 'SPICS1'], notes: [c5FlashNote], warnings: ['flash', 'psram'], keywords: ['gpio15', 'flash', 'psram', 'spi'] }),
  c5Io(26, 'SPICS0', 16, { side: 'right', order: 2 }, { mainFunctions: ['GPIO16', 'SPICS0'], ioMux: ['GPIO16', 'SPICS0'], notes: [c5FlashNote], warnings: ['flash'], keywords: ['gpio16', 'flash', 'spi'] }),
  c5Io(27, 'SPIQ', 17, { side: 'right', order: 3 }, { mainFunctions: ['GPIO17', 'SPIQ'], ioMux: ['GPIO17', 'SPIQ'], notes: [c5FlashNote], warnings: ['flash'], keywords: ['gpio17', 'flash', 'spi'] }),
  c5Io(28, 'SPIWP', 18, { side: 'right', order: 4 }, { mainFunctions: ['GPIO18', 'SPIWP'], ioMux: ['GPIO18', 'SPIWP'], notes: [c5FlashNote], warnings: ['flash'], keywords: ['gpio18', 'flash', 'spi'] }),
  c5Io(29, 'VDD_SPI', 19, { side: 'right', order: 5 }, { mainFunctions: ['GPIO19', 'VDD_SPI'], ioMux: ['GPIO19'], analog: ['VDD_SPI'], notes: ['Flash/PSRAM power-supply pin by default; it can only be used as GPIO when flash uses an external supply.'], warnings: ['flash', 'power', 'voltage'], keywords: ['gpio19', 'flash', 'psram', 'power', 'vdd spi'] }),
  c5Io(30, 'SPIHD', 20, { side: 'right', order: 6 }, { mainFunctions: ['GPIO20', 'SPIHD'], ioMux: ['GPIO20', 'SPIHD'], notes: [c5FlashNote], warnings: ['flash'], keywords: ['gpio20', 'flash', 'spi'] }),
  c5Io(31, 'SPICLK', 21, { side: 'right', order: 7 }, { mainFunctions: ['GPIO21', 'SPICLK'], ioMux: ['GPIO21', 'SPICLK'], notes: [c5FlashNote], warnings: ['flash'], keywords: ['gpio21', 'flash', 'spi'] }),
  c5Io(32, 'SPID', 22, { side: 'right', order: 8 }, { mainFunctions: ['GPIO22', 'SPID'], ioMux: ['GPIO22', 'SPID'], notes: [c5FlashNote], warnings: ['flash'], keywords: ['gpio22', 'flash', 'spi'] }),
  c5Io(33, 'GPIO23', 23, { side: 'right', order: 9 }, { keywords: ['gpio23'] }),
  c5Io(34, 'GPIO24', 24, { side: 'right', order: 10 }, { keywords: ['gpio24'] }),
  c5Io(35, 'GPIO25', 25, { side: 'right', order: 11 }, { notes: [c5StrappingNote], warnings: ['strapping'], keywords: ['gpio25', 'strap', 'boot'] }),
  c5Io(36, 'GPIO26', 26, { side: 'right', order: 12 }, { notes: [c5StrappingNote], warnings: ['strapping', 'boot'], keywords: ['gpio26', 'strap', 'boot'] }),
  c5Io(37, 'GPIO27', 27, { side: 'bottom', order: 12 }, { notes: [c5StrappingNote], warnings: ['strapping', 'boot'], keywords: ['gpio27', 'strap', 'boot'] }),
  c5Io(38, 'GPIO28', 28, { side: 'bottom', order: 11 }, { notes: [c5StrappingNote], warnings: ['strapping', 'boot'], keywords: ['gpio28', 'strap', 'boot'] }),
  c5Pin(39, 'VDDPST3', 'power', { side: 'bottom', order: 10 }, { mainFunctions: ['HP digital power input'], notes: ['Supplies a high-performance digital pin power domain.'], warnings: ['power', 'voltage'], keywords: ['power', 'hp', 'vddpst3'] }),
  c5Pin(40, 'VDDA1', 'power', { side: 'bottom', order: 9 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda1'] }),
  c5Pin(41, 'VDDA2', 'power', { side: 'bottom', order: 8 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda2'] }),
  c5Pin(42, 'ANT_2G', 'analog', { side: 'bottom', order: 7 }, { mainFunctions: ['ANT'], analog: ['2.4 GHz RF antenna input/output'], notes: ['Dedicated 2.4 GHz RF connection, not a GPIO.'], keywords: ['antenna', 'rf', '2.4 ghz'] }),
  c5Pin(43, 'GND', 'ground', { side: 'bottom', order: 6 }, { mainFunctions: ['Ground'], notes: ['External ground connection.'], keywords: ['ground', 'gnd'] }),
  c5Pin(44, 'VDDA3', 'power', { side: 'bottom', order: 5 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda3'] }),
  c5Pin(45, 'VDDA4', 'power', { side: 'bottom', order: 4 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda4'] }),
  c5Pin(46, 'VDDA5', 'power', { side: 'bottom', order: 3 }, { mainFunctions: ['3.3 V analog power input'], notes: ['Analog power-domain supply.'], warnings: ['power', 'voltage'], keywords: ['power', '3v3', 'analog', 'vdda5'] }),
  c5Pin(47, 'GND', 'ground', { side: 'bottom', order: 2 }, { mainFunctions: ['Ground'], notes: ['External ground connection.'], keywords: ['ground', 'gnd'] }),
  c5Pin(48, 'ANT_5G', 'analog', { side: 'bottom', order: 1 }, { mainFunctions: ['ANT'], analog: ['5 GHz RF antenna input/output'], notes: ['Dedicated 5 GHz RF connection, not a GPIO.'], keywords: ['antenna', 'rf', '5 ghz'] }),
  c5Pin(49, 'GND', 'ground', { side: 'center', order: 1 }, { mainFunctions: ['Exposed ground pad'], notes: ['Exposed thermal ground pad; connect to ground.'], warnings: ['power'], keywords: ['ground', 'gnd', 'epad', 'thermal'] }),
];

const qfn48Hf4Pins: SocPin[] = qfn48HrPins.map((pin) => {
  if (pin.number < 26 || pin.number > 32) return { ...pin, id: `esp32c5hf4-pin-${pin.number}` };
  return {
    ...pin,
    id: `esp32c5hf4-pin-${pin.number}`,
    name: 'NC',
    type: 'control',
    gpio: undefined,
    mainFunctions: ['No connect'],
    ioMux: undefined,
    rtc: undefined,
    analog: undefined,
    matrixSignals: undefined,
    notes: ['Not connected on ESP32-C5HF4, which has in-package flash.'],
    warnings: undefined,
    keywords: ['nc', 'no connect', 'in-package flash'],
  };
});

const qfn48Hf4Profile: SocPackageVariant = {
  id: 'qfn48-hf4',
  name: 'QFN48 (HF4)',
  packageName: 'ESP32-C5HF4 QFN48, 6 x 6 mm',
  description: 'ESP32-C5HF4 raw chip package with 4 MB in-package flash; pins 26 to 32 are not connected.',
  source,
  pins: qfn48Hf4Pins,
};

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
  const sourcePin = input.gpio === undefined ? undefined : qfn48HrPins.find((pin) => pin.gpio === input.gpio);

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
    sourcePin,
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
  identificationNotes: ['Choose this profile by the ESP32-C5-DevKitC-1 carrier PCB and its J1/J3 header layout. The WROOM module marking alone does not identify the carrier PCB.'],
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
  identificationNotes: ['Confirm the v1.0 silkscreen in the white circle at the top right of the mainboard front or back.', 'Choose this profile by the ESP-SensairShuttle carrier PCB and its documented connector interfaces; it is not a complete module-pad view.'],
  pins: sensairPins,
};

export const esp32c5: SocDefinition = {
  id: 'esp32c5',
  name: 'ESP32-C5',
  family: 'ESP32-C5',
  defaultProfileId: devKitProfile.id,
  defaultPackageId: 'qfn48-hr2-hr8',
  packageName: 'ESP32-C5HR2/HR8 QFN48, 6 x 6 mm',
  description: 'Dual-band Wi-Fi 6 ESP32 family with Bluetooth LE, Zigbee, and Thread support.',
  chipSpecs: {
    wireless: '2.4 and 5 GHz Wi-Fi 6, Bluetooth LE, Zigbee, Thread',
    cpu: 'HP RISC-V up to 240 MHz + LP RISC-V up to 48 MHz',
    sram: '384 KB HP SRAM + 16 KB LP SRAM',
    rom: '320 KB',
  },
  source,
  pins: qfn48HrPins,
  packageVariants: [qfn48Hf4Profile],
  boardProfiles: [devKitProfile, sensairProfile],
};
