import type { PinPosition, PinType, PinWarning, SocDefinition, SocPin } from '@/types/soc';

const source = {
  title: 'ESP32-C6 Series Datasheet',
  version: 'v1.5',
  url: 'https://documentation.espressif.com/esp32-c6_datasheet_en.pdf',
  sections: [
    'Figure 2-1 ESP32-C6 Pin Layout (QFN40, Top View)',
    'Figure 2-2 ESP32-C6 Pin Layout (QFN32, Top View)',
    'Table 2-1 QFN40 Pin Overview',
    'Table 2-2 QFN32 Pin Overview',
    'Table 2-4 QFN40 IO MUX Pin Functions',
    'Table 2-5 QFN32 IO MUX Pin Functions',
    'Table 2-7 LP IO MUX Functions',
    'Table 2-9 Analog Functions',
    'Section 2.3.4 Restrictions for GPIOs and LP GPIOs',
    'Table 2-10 QFN40 Peripheral Pin Assignment',
    'Table 2-11 QFN32 Peripheral Pin Assignment',
    'Table 2-16 Pin Mapping Between QFN40 Chip and Flash',
    'Table 3-1 Default Configuration of Strapping Pins',
    'Table 3-3 Chip Boot Mode Control',
    'Table 3-4 SDIO Input Sampling Edge/Output Driving Edge Control',
    'Table 3-5 UART0 ROM Message Printing Control',
    'Table 3-7 JTAG Signal Source Control',
  ],
};

const gpioMatrixSignals = [
  'SPI2',
  'UART1',
  'I2C',
  'I2S',
  'PCNT',
  'TWAI',
  'LED PWM',
  'MCPWM',
  'RMT',
  'PARLIO',
];

const usbCaution =
  'USB_D pins are connected to the USB Serial/JTAG controller by default and need reconfiguration before regular GPIO use.';
const jtagCaution = 'JTAG debug signal; freeing these pins may require using USB Serial/JTAG instead.';
const uart0Caution = 'UART0 is commonly used for boot messages, flashing, and serial debugging.';
const flashCaution =
  'Recommended for the off-package SPI0/1 flash interface. Do not use flash-connected pins for other purposes.';

function id(number: number) {
  return `esp32c6-pin-${number}`;
}

function pin(
  number: number,
  name: string,
  type: PinType,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position'>> = {},
): SocPin {
  return {
    id: id(number),
    number,
    name,
    type,
    position,
    mainFunctions: [],
    ...details,
  };
}

function io(
  number: number,
  name: string,
  gpio: number,
  position: PinPosition,
  details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position' | 'gpio'>> = {},
): SocPin {
  return pin(number, name, 'io', position, {
    gpio,
    matrixSignals: gpioMatrixSignals,
    ...details,
  });
}

function warnings(...values: PinWarning[]): PinWarning[] {
  return values;
}

const qfn32Pins: SocPin[] = [
  pin(1, 'ANT', 'analog', { side: 'left', order: 8 }, {
    mainFunctions: ['RF input/output'],
    analog: ['Antenna RF input/output'],
    notes: ['Dedicated RF analog pin, not a GPIO.'],
    keywords: ['antenna', 'rf', 'analog', 'wifi', 'ble', '802.15.4', 'zigbee', 'thread'],
  }),
  pin(2, 'VDDA3P3', 'power', { side: 'left', order: 7 }, {
    mainFunctions: ['3.3 V analog power input'],
    notes: ['Analog power domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', '3v3', 'analog'],
  }),
  pin(3, 'VDDA3P3', 'power', { side: 'left', order: 6 }, {
    mainFunctions: ['3.3 V analog power input'],
    notes: ['Analog power domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', '3v3', 'analog'],
  }),
  pin(4, 'CHIP_PU', 'analog', { side: 'left', order: 5 }, {
    mainFunctions: ['Chip power-up and reset enable'],
    notes: ['High enables the chip; low disables or resets it.', 'Do not leave CHIP_PU floating.'],
    warnings: warnings('reset'),
    keywords: ['enable', 'reset', 'chip pu', 'power up', 'en'],
  }),
  pin(5, 'VDDPST1', 'power', { side: 'left', order: 4 }, {
    mainFunctions: ['LP digital and analog pin power input'],
    notes: ['Supplies the LP digital domain and part of the analog pin power domains.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'lp', 'low power', 'vddpst1'],
  }),
  io(6, 'XTAL_32K_P', 0, { side: 'left', order: 3 }, {
    mainFunctions: ['GPIO0', 'LP_GPIO0', 'LP_UART_DTRN', 'XTAL_32K_P', 'ADC1_CH0'],
    ioMux: ['GPIO0'],
    rtc: ['LP_GPIO0', 'LP_UART_DTRN'],
    analog: ['XTAL_32K_P', 'ADC1_CH0'],
    notes: ['Package pin name is XTAL_32K_P; GPIO identity is GPIO0.'],
    keywords: ['gpio0', 'adc1', 'lp gpio', 'lp uart', 'dtr', 'xtal', '32k'],
  }),
  io(7, 'XTAL_32K_N', 1, { side: 'left', order: 2 }, {
    mainFunctions: ['GPIO1', 'LP_GPIO1', 'LP_UART_DSRN', 'XTAL_32K_N', 'ADC1_CH1'],
    ioMux: ['GPIO1'],
    rtc: ['LP_GPIO1', 'LP_UART_DSRN'],
    analog: ['XTAL_32K_N', 'ADC1_CH1'],
    notes: ['Package pin name is XTAL_32K_N; GPIO identity is GPIO1.'],
    keywords: ['gpio1', 'adc1', 'lp gpio', 'lp uart', 'dsr', 'xtal', '32k'],
  }),
  io(8, 'GPIO2', 2, { side: 'left', order: 1 }, {
    mainFunctions: ['GPIO2', 'LP_GPIO2', 'LP_UART_RTSN', 'ADC1_CH2', 'FSPIQ'],
    ioMux: ['GPIO2', 'FSPIQ'],
    rtc: ['LP_GPIO2', 'LP_UART_RTSN'],
    analog: ['ADC1_CH2'],
    keywords: ['adc1', 'lp gpio', 'lp uart', 'rts', 'spi', 'fspi'],
  }),
  io(9, 'GPIO3', 3, { side: 'top', order: 1 }, {
    mainFunctions: ['GPIO3', 'LP_GPIO3', 'LP_UART_CTSN', 'ADC1_CH3'],
    ioMux: ['GPIO3'],
    rtc: ['LP_GPIO3', 'LP_UART_CTSN'],
    analog: ['ADC1_CH3'],
    keywords: ['adc1', 'lp gpio', 'lp uart', 'cts'],
  }),
  io(10, 'MTMS', 4, { side: 'top', order: 2 }, {
    mainFunctions: ['GPIO4', 'MTMS', 'LP_GPIO4', 'LP_UART_RXD', 'ADC1_CH4', 'FSPIHD'],
    ioMux: ['MTMS', 'GPIO4', 'FSPIHD'],
    rtc: ['LP_GPIO4', 'LP_UART_RXD'],
    analog: ['ADC1_CH4'],
    notes: [
      jtagCaution,
      'Strapping pin for SDIO input sampling and output driving edge control; default is floating.',
    ],
    warnings: warnings('jtag', 'strapping'),
    keywords: ['gpio4', 'jtag', 'mtms', 'strap', 'strapping', 'sdio', 'adc1', 'lp uart', 'spi', 'fspi'],
  }),
  io(11, 'MTDI', 5, { side: 'top', order: 3 }, {
    mainFunctions: ['GPIO5', 'MTDI', 'LP_GPIO5', 'LP_UART_TXD', 'ADC1_CH5', 'FSPIWP'],
    ioMux: ['MTDI', 'GPIO5', 'FSPIWP'],
    rtc: ['LP_GPIO5', 'LP_UART_TXD'],
    analog: ['ADC1_CH5'],
    notes: [
      jtagCaution,
      'Strapping pin for SDIO input sampling and output driving edge control; default is floating.',
    ],
    warnings: warnings('jtag', 'strapping'),
    keywords: ['gpio5', 'jtag', 'mtdi', 'strap', 'strapping', 'sdio', 'adc1', 'lp uart', 'spi', 'fspi'],
  }),
  io(12, 'MTCK', 6, { side: 'top', order: 4 }, {
    mainFunctions: ['GPIO6', 'MTCK', 'LP_GPIO6', 'LP_I2C_SDA', 'ADC1_CH6', 'FSPICLK'],
    ioMux: ['MTCK', 'GPIO6', 'FSPICLK'],
    rtc: ['LP_GPIO6', 'LP_I2C_SDA'],
    analog: ['ADC1_CH6'],
    notes: [jtagCaution, 'Reset pull-up behavior depends on EFUSE_DIS_PAD_JTAG.'],
    warnings: warnings('jtag'),
    keywords: ['gpio6', 'jtag', 'mtck', 'adc1', 'lp i2c', 'sda', 'spi', 'fspi', 'clock'],
  }),
  io(13, 'MTDO', 7, { side: 'top', order: 5 }, {
    mainFunctions: ['GPIO7', 'MTDO', 'LP_GPIO7', 'LP_I2C_SCL', 'FSPID'],
    ioMux: ['MTDO', 'GPIO7', 'FSPID'],
    rtc: ['LP_GPIO7', 'LP_I2C_SCL'],
    notes: [jtagCaution],
    warnings: warnings('jtag'),
    keywords: ['gpio7', 'jtag', 'mtdo', 'lp i2c', 'scl', 'spi', 'fspi'],
  }),
  io(14, 'GPIO8', 8, { side: 'top', order: 6 }, {
    mainFunctions: ['GPIO8', 'Boot mode strapping', 'ROM message control'],
    ioMux: ['GPIO8'],
    notes: [
      'Strapping pin with default floating state.',
      'Controls boot mode with GPIO9; GPIO8=1 and GPIO9=0 selects joint download boot mode.',
      'Also participates in UART0 ROM message printing control.',
    ],
    warnings: warnings('strapping', 'boot'),
    keywords: ['strap', 'strapping', 'boot', 'download', 'rom messages', 'gpio8'],
  }),
  io(15, 'GPIO9', 9, { side: 'top', order: 7 }, {
    mainFunctions: ['GPIO9', 'Boot mode strapping'],
    ioMux: ['GPIO9'],
    notes: [
      'Strapping pin with default weak pull-up.',
      'Controls boot mode with GPIO8; GPIO8=1 and GPIO9=0 selects joint download boot mode.',
    ],
    warnings: warnings('strapping', 'boot'),
    keywords: ['strap', 'strapping', 'boot', 'download', 'gpio9'],
  }),
  io(16, 'GPIO12', 12, { side: 'top', order: 8 }, {
    mainFunctions: ['GPIO12', 'USB_D-'],
    ioMux: ['GPIO12'],
    analog: ['USB_D-'],
    notes: [usbCaution, 'GPIO12 and GPIO13 have 40 mA default drive strength.'],
    warnings: warnings('usb'),
    keywords: ['usb', 'usb d-', 'usb dm', 'serial jtag', 'download', 'gpio12'],
  }),
  io(17, 'GPIO13', 13, { side: 'right', order: 1 }, {
    mainFunctions: ['GPIO13', 'USB_D+'],
    ioMux: ['GPIO13'],
    analog: ['USB_D+'],
    notes: [usbCaution, 'GPIO12 and GPIO13 have 40 mA default drive strength.'],
    warnings: warnings('usb'),
    keywords: ['usb', 'usb d+', 'usb dp', 'serial jtag', 'download', 'gpio13'],
  }),
  io(18, 'GPIO14', 14, { side: 'right', order: 2 }, {
    mainFunctions: ['GPIO14'],
    ioMux: ['GPIO14'],
    keywords: ['gpio14'],
  }),
  io(19, 'GPIO15', 15, { side: 'right', order: 3 }, {
    mainFunctions: ['GPIO15', 'JTAG signal source strapping'],
    ioMux: ['GPIO15'],
    notes: [
      'Strapping pin for JTAG signal source selection; default is floating.',
      'Espressif notes GPIO15 has no internal pull resistors and the external circuit must not be high impedance during strapping.',
    ],
    warnings: warnings('strapping', 'jtag'),
    keywords: ['gpio15', 'strap', 'strapping', 'jtag', 'debug'],
  }),
  pin(20, 'VDDPST2', 'power', { side: 'right', order: 4 }, {
    mainFunctions: ['HP digital power input'],
    notes: ['Supplies the HP digital power domain and HP IO.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'hp', 'vddpst2'],
  }),
  io(21, 'U0TXD', 16, { side: 'right', order: 5 }, {
    mainFunctions: ['GPIO16', 'U0TXD', 'FSPICS0'],
    ioMux: ['U0TXD', 'GPIO16', 'FSPICS0'],
    notes: [uart0Caution, 'ROM boot messages print to UART0 by default unless configured otherwise.'],
    warnings: warnings('uart0'),
    keywords: ['gpio16', 'uart0', 'serial', 'debug', 'boot log', 'txd', 'spi', 'fspi'],
  }),
  io(22, 'U0RXD', 17, { side: 'right', order: 6 }, {
    mainFunctions: ['GPIO17', 'U0RXD', 'FSPICS1'],
    ioMux: ['U0RXD', 'GPIO17', 'FSPICS1'],
    notes: [uart0Caution],
    warnings: warnings('uart0'),
    keywords: ['gpio17', 'uart0', 'serial', 'debug', 'flash', 'rxd', 'spi', 'fspi'],
  }),
  io(23, 'SDIO_CMD', 18, { side: 'right', order: 7 }, {
    mainFunctions: ['GPIO18', 'SDIO_CMD', 'FSPICS2'],
    ioMux: ['SDIO_CMD', 'GPIO18', 'FSPICS2'],
    notes: ['Fixed SDIO Slave command signal through IO MUX. Joint download boot mode supports SDIO download.'],
    keywords: ['gpio18', 'sdio', 'cmd', 'download', 'spi', 'fspi'],
  }),
  io(24, 'SDIO_CLK', 19, { side: 'right', order: 8 }, {
    mainFunctions: ['GPIO19', 'SDIO_CLK', 'FSPICS3'],
    ioMux: ['SDIO_CLK', 'GPIO19', 'FSPICS3'],
    notes: ['Fixed SDIO Slave clock signal through IO MUX.'],
    keywords: ['gpio19', 'sdio', 'clock', 'clk', 'spi', 'fspi'],
  }),
  io(25, 'SDIO_DATA0', 20, { side: 'bottom', order: 8 }, {
    mainFunctions: ['GPIO20', 'SDIO_DATA0', 'FSPICS4'],
    ioMux: ['SDIO_DATA0', 'GPIO20', 'FSPICS4'],
    notes: ['Fixed SDIO Slave data 0 signal through IO MUX.'],
    keywords: ['gpio20', 'sdio', 'data0', 'spi', 'fspi'],
  }),
  io(26, 'SDIO_DATA1', 21, { side: 'bottom', order: 7 }, {
    mainFunctions: ['GPIO21', 'SDIO_DATA1', 'FSPICS5'],
    ioMux: ['SDIO_DATA1', 'GPIO21', 'FSPICS5'],
    notes: ['Fixed SDIO Slave data 1 signal through IO MUX.'],
    keywords: ['gpio21', 'sdio', 'data1', 'spi', 'fspi'],
  }),
  io(27, 'SDIO_DATA2', 22, { side: 'bottom', order: 6 }, {
    mainFunctions: ['GPIO22', 'SDIO_DATA2'],
    ioMux: ['SDIO_DATA2', 'GPIO22'],
    notes: ['Fixed SDIO Slave data 2 signal through IO MUX.'],
    keywords: ['gpio22', 'sdio', 'data2'],
  }),
  io(28, 'SDIO_DATA3', 23, { side: 'bottom', order: 5 }, {
    mainFunctions: ['GPIO23', 'SDIO_DATA3'],
    ioMux: ['SDIO_DATA3', 'GPIO23'],
    notes: ['Fixed SDIO Slave data 3 signal through IO MUX.'],
    keywords: ['gpio23', 'sdio', 'data3'],
  }),
  pin(29, 'VDDA1', 'power', { side: 'bottom', order: 4 }, {
    mainFunctions: ['Analog power input'],
    notes: ['Analog power domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'analog', 'vdda1'],
  }),
  pin(30, 'XTAL_N', 'analog', { side: 'bottom', order: 3 }, {
    mainFunctions: ['Main crystal negative clock input/output'],
    analog: ['XTAL_N'],
    notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
    keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
  }),
  pin(31, 'XTAL_P', 'analog', { side: 'bottom', order: 2 }, {
    mainFunctions: ['Main crystal positive clock input/output'],
    analog: ['XTAL_P'],
    notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
    keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
  }),
  pin(32, 'VDDA2', 'power', { side: 'bottom', order: 1 }, {
    mainFunctions: ['Analog power input'],
    notes: ['Analog power domain supply.'],
    warnings: warnings('power'),
    keywords: ['power', 'supply', 'analog', 'vdda2'],
  }),
  pin(33, 'GND', 'ground', { side: 'center', order: 1 }, {
    mainFunctions: ['Exposed ground pad'],
    notes: ['External ground connection.'],
    warnings: warnings('power'),
    keywords: ['ground', 'gnd', 'epad', 'thermal pad'],
  }),
];

export const esp32c6: SocDefinition = {
  id: 'esp32c6',
  name: 'ESP32-C6',
  family: 'ESP32',
  defaultPackageId: 'qfn40',
  packageName: 'QFN40 (5 x 5 mm), top view',
  description: 'ESP32-C6 Wi-Fi 6, Bluetooth LE, and 802.15.4 SoC pinout.',
  source,
  packageVariants: [
    {
      id: 'qfn32',
      name: 'QFN32',
      packageName: 'QFN32 (5 x 5 mm), top view',
      pins: qfn32Pins,
    },
  ],
  pins: [
    pin(1, 'ANT', 'analog', { side: 'left', order: 10 }, {
      mainFunctions: ['RF input/output'],
      analog: ['Antenna RF input/output'],
      notes: ['Dedicated RF analog pin, not a GPIO.'],
      keywords: ['antenna', 'rf', 'analog', 'wifi', 'ble', '802.15.4', 'zigbee', 'thread'],
    }),
    pin(2, 'VDDA3P3', 'power', { side: 'left', order: 9 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(3, 'VDDA3P3', 'power', { side: 'left', order: 8 }, {
      mainFunctions: ['3.3 V analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', '3v3', 'analog'],
    }),
    pin(4, 'CHIP_PU', 'analog', { side: 'left', order: 7 }, {
      mainFunctions: ['Chip power-up and reset enable'],
      notes: ['High enables the chip; low disables or resets it.', 'Do not leave CHIP_PU floating.'],
      warnings: warnings('reset'),
      keywords: ['enable', 'reset', 'chip pu', 'power up', 'en'],
    }),
    pin(5, 'VDDPST1', 'power', { side: 'left', order: 6 }, {
      mainFunctions: ['LP digital and analog pin power input'],
      notes: ['Supplies the LP digital domain and part of the analog pin power domains.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'lp', 'low power', 'vddpst1'],
    }),
    io(6, 'XTAL_32K_P', 0, { side: 'left', order: 5 }, {
      mainFunctions: ['GPIO0', 'LP_GPIO0', 'LP_UART_DTRN', 'XTAL_32K_P', 'ADC1_CH0'],
      ioMux: ['GPIO0'],
      rtc: ['LP_GPIO0', 'LP_UART_DTRN'],
      analog: ['XTAL_32K_P', 'ADC1_CH0'],
      notes: ['Package pin name is XTAL_32K_P; GPIO identity is GPIO0.'],
      keywords: ['gpio0', 'adc1', 'lp gpio', 'lp uart', 'dtr', 'xtal', '32k'],
    }),
    io(7, 'XTAL_32K_N', 1, { side: 'left', order: 4 }, {
      mainFunctions: ['GPIO1', 'LP_GPIO1', 'LP_UART_DSRN', 'XTAL_32K_N', 'ADC1_CH1'],
      ioMux: ['GPIO1'],
      rtc: ['LP_GPIO1', 'LP_UART_DSRN'],
      analog: ['XTAL_32K_N', 'ADC1_CH1'],
      notes: ['Package pin name is XTAL_32K_N; GPIO identity is GPIO1.'],
      keywords: ['gpio1', 'adc1', 'lp gpio', 'lp uart', 'dsr', 'xtal', '32k'],
    }),
    io(8, 'GPIO2', 2, { side: 'left', order: 3 }, {
      mainFunctions: ['GPIO2', 'LP_GPIO2', 'LP_UART_RTSN', 'ADC1_CH2', 'FSPIQ'],
      ioMux: ['GPIO2', 'FSPIQ'],
      rtc: ['LP_GPIO2', 'LP_UART_RTSN'],
      analog: ['ADC1_CH2'],
      keywords: ['adc1', 'lp gpio', 'lp uart', 'rts', 'spi', 'fspi'],
    }),
    io(9, 'GPIO3', 3, { side: 'left', order: 2 }, {
      mainFunctions: ['GPIO3', 'LP_GPIO3', 'LP_UART_CTSN', 'ADC1_CH3'],
      ioMux: ['GPIO3'],
      rtc: ['LP_GPIO3', 'LP_UART_CTSN'],
      analog: ['ADC1_CH3'],
      keywords: ['adc1', 'lp gpio', 'lp uart', 'cts'],
    }),
    io(10, 'MTMS', 4, { side: 'left', order: 1 }, {
      mainFunctions: ['GPIO4', 'MTMS', 'LP_GPIO4', 'LP_UART_RXD', 'ADC1_CH4', 'FSPIHD'],
      ioMux: ['MTMS', 'GPIO4', 'FSPIHD'],
      rtc: ['LP_GPIO4', 'LP_UART_RXD'],
      analog: ['ADC1_CH4'],
      notes: [
        jtagCaution,
        'Strapping pin for SDIO input sampling and output driving edge control; default is floating.',
      ],
      warnings: warnings('jtag', 'strapping'),
      keywords: ['gpio4', 'jtag', 'mtms', 'strap', 'strapping', 'sdio', 'adc1', 'lp uart', 'spi', 'fspi'],
    }),
    io(11, 'MTDI', 5, { side: 'top', order: 1 }, {
      mainFunctions: ['GPIO5', 'MTDI', 'LP_GPIO5', 'LP_UART_TXD', 'ADC1_CH5', 'FSPIWP'],
      ioMux: ['MTDI', 'GPIO5', 'FSPIWP'],
      rtc: ['LP_GPIO5', 'LP_UART_TXD'],
      analog: ['ADC1_CH5'],
      notes: [
        jtagCaution,
        'Strapping pin for SDIO input sampling and output driving edge control; default is floating.',
      ],
      warnings: warnings('jtag', 'strapping'),
      keywords: ['gpio5', 'jtag', 'mtdi', 'strap', 'strapping', 'sdio', 'adc1', 'lp uart', 'spi', 'fspi'],
    }),
    io(12, 'MTCK', 6, { side: 'top', order: 2 }, {
      mainFunctions: ['GPIO6', 'MTCK', 'LP_GPIO6', 'LP_I2C_SDA', 'ADC1_CH6', 'FSPICLK'],
      ioMux: ['MTCK', 'GPIO6', 'FSPICLK'],
      rtc: ['LP_GPIO6', 'LP_I2C_SDA'],
      analog: ['ADC1_CH6'],
      notes: [jtagCaution, 'Reset pull-up behavior depends on EFUSE_DIS_PAD_JTAG.'],
      warnings: warnings('jtag'),
      keywords: ['gpio6', 'jtag', 'mtck', 'adc1', 'lp i2c', 'sda', 'spi', 'fspi', 'clock'],
    }),
    io(13, 'MTDO', 7, { side: 'top', order: 3 }, {
      mainFunctions: ['GPIO7', 'MTDO', 'LP_GPIO7', 'LP_I2C_SCL', 'FSPID'],
      ioMux: ['MTDO', 'GPIO7', 'FSPID'],
      rtc: ['LP_GPIO7', 'LP_I2C_SCL'],
      notes: [jtagCaution],
      warnings: warnings('jtag'),
      keywords: ['gpio7', 'jtag', 'mtdo', 'lp i2c', 'scl', 'spi', 'fspi'],
    }),
    io(14, 'GPIO8', 8, { side: 'top', order: 4 }, {
      mainFunctions: ['GPIO8', 'Boot mode strapping', 'ROM message control'],
      ioMux: ['GPIO8'],
      notes: [
        'Strapping pin with default floating state.',
        'Controls boot mode with GPIO9; GPIO8=1 and GPIO9=0 selects joint download boot mode.',
        'Also participates in UART0 ROM message printing control.',
      ],
      warnings: warnings('strapping', 'boot'),
      keywords: ['strap', 'strapping', 'boot', 'download', 'rom messages', 'gpio8'],
    }),
    io(15, 'GPIO9', 9, { side: 'top', order: 5 }, {
      mainFunctions: ['GPIO9', 'Boot mode strapping'],
      ioMux: ['GPIO9'],
      notes: [
        'Strapping pin with default weak pull-up.',
        'Controls boot mode with GPIO8; GPIO8=1 and GPIO9=0 selects joint download boot mode.',
      ],
      warnings: warnings('strapping', 'boot'),
      keywords: ['strap', 'strapping', 'boot', 'download', 'gpio9'],
    }),
    io(16, 'GPIO10', 10, { side: 'top', order: 6 }, {
      mainFunctions: ['GPIO10'],
      ioMux: ['GPIO10'],
      keywords: ['gpio10'],
    }),
    io(17, 'GPIO11', 11, { side: 'top', order: 7 }, {
      mainFunctions: ['GPIO11'],
      ioMux: ['GPIO11'],
      keywords: ['gpio11'],
    }),
    io(18, 'GPIO12', 12, { side: 'top', order: 8 }, {
      mainFunctions: ['GPIO12', 'USB_D-'],
      ioMux: ['GPIO12'],
      analog: ['USB_D-'],
      notes: [usbCaution, 'GPIO12 and GPIO13 have 40 mA default drive strength.'],
      warnings: warnings('usb'),
      keywords: ['usb', 'usb d-', 'usb dm', 'serial jtag', 'download', 'gpio12'],
    }),
    io(19, 'GPIO13', 13, { side: 'top', order: 9 }, {
      mainFunctions: ['GPIO13', 'USB_D+'],
      ioMux: ['GPIO13'],
      analog: ['USB_D+'],
      notes: [usbCaution, 'GPIO12 and GPIO13 have 40 mA default drive strength.'],
      warnings: warnings('usb'),
      keywords: ['usb', 'usb d+', 'usb dp', 'serial jtag', 'download', 'gpio13'],
    }),
    io(20, 'SPICS0', 24, { side: 'top', order: 10 }, {
      mainFunctions: ['GPIO24', 'SPICS0', 'Flash CS#'],
      ioMux: ['SPICS0', 'GPIO24'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['spi', 'flash', 'memory', 'spics0', 'cs', 'gpio24'],
    }),
    io(21, 'SPIQ', 25, { side: 'right', order: 1 }, {
      mainFunctions: ['GPIO25', 'SPIQ', 'Flash MISO/SIO1'],
      ioMux: ['SPIQ', 'GPIO25'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['spi', 'flash', 'memory', 'miso', 'sio1', 'gpio25'],
    }),
    io(22, 'SPIWP', 26, { side: 'right', order: 2 }, {
      mainFunctions: ['GPIO26', 'SPIWP', 'Flash WP#/SIO2'],
      ioMux: ['SPIWP', 'GPIO26'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['spi', 'flash', 'memory', 'wp', 'sio2', 'gpio26'],
    }),
    pin(23, 'VDD_SPI', 'power', { side: 'right', order: 3 }, {
      gpio: 27,
      mainFunctions: ['GPIO27', 'VDD_SPI flash power'],
      ioMux: ['GPIO27'],
      analog: ['VDD_SPI'],
      notes: [
        'Power supply pin for off-package flash by default.',
        'Can be reconfigured as GPIO27 only if flash is powered by an external power supply.',
      ],
      warnings: warnings('power', 'flash', 'voltage'),
      keywords: ['gpio27', 'power', 'supply', 'vdd spi', 'flash', 'memory', 'voltage'],
    }),
    io(24, 'SPIHD', 28, { side: 'right', order: 4 }, {
      mainFunctions: ['GPIO28', 'SPIHD', 'Flash HOLD#/SIO3'],
      ioMux: ['SPIHD', 'GPIO28'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['spi', 'flash', 'memory', 'hold', 'sio3', 'gpio28'],
    }),
    io(25, 'SPICLK', 29, { side: 'right', order: 5 }, {
      mainFunctions: ['GPIO29', 'SPICLK', 'Flash clock'],
      ioMux: ['SPICLK', 'GPIO29'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['spi', 'flash', 'memory', 'clock', 'clk', 'gpio29'],
    }),
    io(26, 'SPID', 30, { side: 'right', order: 6 }, {
      mainFunctions: ['GPIO30', 'SPID', 'Flash MOSI/SIO0'],
      ioMux: ['SPID', 'GPIO30'],
      notes: [flashCaution],
      warnings: warnings('flash'),
      keywords: ['spi', 'flash', 'memory', 'mosi', 'sio0', 'gpio30'],
    }),
    io(27, 'GPIO15', 15, { side: 'right', order: 7 }, {
      mainFunctions: ['GPIO15', 'JTAG signal source strapping'],
      ioMux: ['GPIO15'],
      notes: [
        'Strapping pin for JTAG signal source selection; default is floating.',
        'Espressif notes GPIO15 has no internal pull resistors and the external circuit must not be high impedance during strapping.',
      ],
      warnings: warnings('strapping', 'jtag'),
      keywords: ['gpio15', 'strap', 'strapping', 'jtag', 'debug'],
    }),
    pin(28, 'VDDPST2', 'power', { side: 'right', order: 8 }, {
      mainFunctions: ['HP digital power input'],
      notes: ['Supplies the HP digital power domain and HP IO.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'hp', 'vddpst2'],
    }),
    io(29, 'U0TXD', 16, { side: 'right', order: 9 }, {
      mainFunctions: ['GPIO16', 'U0TXD', 'FSPICS0'],
      ioMux: ['U0TXD', 'GPIO16', 'FSPICS0'],
      notes: [uart0Caution, 'ROM boot messages print to UART0 by default unless configured otherwise.'],
      warnings: warnings('uart0'),
      keywords: ['gpio16', 'uart0', 'serial', 'debug', 'boot log', 'txd', 'spi', 'fspi'],
    }),
    io(30, 'U0RXD', 17, { side: 'right', order: 10 }, {
      mainFunctions: ['GPIO17', 'U0RXD', 'FSPICS1'],
      ioMux: ['U0RXD', 'GPIO17', 'FSPICS1'],
      notes: [uart0Caution],
      warnings: warnings('uart0'),
      keywords: ['gpio17', 'uart0', 'serial', 'debug', 'flash', 'rxd', 'spi', 'fspi'],
    }),
    io(31, 'SDIO_CMD', 18, { side: 'bottom', order: 10 }, {
      mainFunctions: ['GPIO18', 'SDIO_CMD', 'FSPICS2'],
      ioMux: ['SDIO_CMD', 'GPIO18', 'FSPICS2'],
      notes: ['Fixed SDIO Slave command signal through IO MUX. Joint download boot mode supports SDIO download.'],
      keywords: ['gpio18', 'sdio', 'cmd', 'download', 'spi', 'fspi'],
    }),
    io(32, 'SDIO_CLK', 19, { side: 'bottom', order: 9 }, {
      mainFunctions: ['GPIO19', 'SDIO_CLK', 'FSPICS3'],
      ioMux: ['SDIO_CLK', 'GPIO19', 'FSPICS3'],
      notes: ['Fixed SDIO Slave clock signal through IO MUX.'],
      keywords: ['gpio19', 'sdio', 'clock', 'clk', 'spi', 'fspi'],
    }),
    io(33, 'SDIO_DATA0', 20, { side: 'bottom', order: 8 }, {
      mainFunctions: ['GPIO20', 'SDIO_DATA0', 'FSPICS4'],
      ioMux: ['SDIO_DATA0', 'GPIO20', 'FSPICS4'],
      notes: ['Fixed SDIO Slave data 0 signal through IO MUX.'],
      keywords: ['gpio20', 'sdio', 'data0', 'spi', 'fspi'],
    }),
    io(34, 'SDIO_DATA1', 21, { side: 'bottom', order: 7 }, {
      mainFunctions: ['GPIO21', 'SDIO_DATA1', 'FSPICS5'],
      ioMux: ['SDIO_DATA1', 'GPIO21', 'FSPICS5'],
      notes: ['Fixed SDIO Slave data 1 signal through IO MUX.'],
      keywords: ['gpio21', 'sdio', 'data1', 'spi', 'fspi'],
    }),
    io(35, 'SDIO_DATA2', 22, { side: 'bottom', order: 6 }, {
      mainFunctions: ['GPIO22', 'SDIO_DATA2'],
      ioMux: ['SDIO_DATA2', 'GPIO22'],
      notes: ['Fixed SDIO Slave data 2 signal through IO MUX.'],
      keywords: ['gpio22', 'sdio', 'data2'],
    }),
    io(36, 'SDIO_DATA3', 23, { side: 'bottom', order: 5 }, {
      mainFunctions: ['GPIO23', 'SDIO_DATA3'],
      ioMux: ['SDIO_DATA3', 'GPIO23'],
      notes: ['Fixed SDIO Slave data 3 signal through IO MUX.'],
      keywords: ['gpio23', 'sdio', 'data3'],
    }),
    pin(37, 'VDDA1', 'power', { side: 'bottom', order: 4 }, {
      mainFunctions: ['Analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'analog', 'vdda1'],
    }),
    pin(38, 'XTAL_N', 'analog', { side: 'bottom', order: 3 }, {
      mainFunctions: ['Main crystal negative clock input/output'],
      analog: ['XTAL_N'],
      notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
    }),
    pin(39, 'XTAL_P', 'analog', { side: 'bottom', order: 2 }, {
      mainFunctions: ['Main crystal positive clock input/output'],
      analog: ['XTAL_P'],
      notes: ['Dedicated external crystal/oscillator pin, not a GPIO.'],
      keywords: ['xtal', 'crystal', 'clock', 'oscillator', 'analog'],
    }),
    pin(40, 'VDDA2', 'power', { side: 'bottom', order: 1 }, {
      mainFunctions: ['Analog power input'],
      notes: ['Analog power domain supply.'],
      warnings: warnings('power'),
      keywords: ['power', 'supply', 'analog', 'vdda2'],
    }),
    pin(41, 'GND', 'ground', { side: 'center', order: 1 }, {
      mainFunctions: ['Exposed ground pad'],
      notes: ['External ground connection.'],
      warnings: warnings('power'),
      keywords: ['ground', 'gnd', 'epad', 'thermal pad'],
    }),
  ],
};
