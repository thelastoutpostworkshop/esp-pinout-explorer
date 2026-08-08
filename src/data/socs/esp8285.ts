import type { PinPosition, PinType, PinWarning, SocDefinition, SocPin, SocSource } from '@/types/soc';

const source: SocSource = {
  title: 'ESP8285 Datasheet', version: 'v2.7', publisher: 'Espressif', documentType: 'datasheet',
  url: 'https://documentation.espressif.com/0a-esp8285_datasheet_en.pdf',
  sections: ['Figure 2-1 Pin Layout (Top View)', 'Table 2-1 ESP8285EX Pin Definitions', 'Section 3.1.3 Flash', 'Table 4-1 Pin Definitions of SDIOs', 'Table 4-2 Pin Definitions of SPIs', 'Table 4-3 Pin Definitions of HSPI', 'Table 4-4 Pin Definitions of I2C', 'Table 4-5 Pin Definitions of I2S', 'Table 4-6 Pin Definitions of UART', 'Table 4-7 Pin Definitions of PWM', 'Table 4-8 Pin Definitions of IR Remote Control'],
};

const strapNote = 'GPIO2, GPIO0, and MTDO select boot mode and SDIO mode at reset.';
const flashNote = 'Connected to ESP8285 embedded flash; Espressif does not recommend using this pin for other purposes.';
const uartNote = 'UART0 is used for flash programming and emits boot messages.';
const positions = (number: number): PinPosition => number <= 8 ? { side: 'left', order: number } : number <= 16 ? { side: 'bottom', order: number - 8 } : number <= 24 ? { side: 'right', order: 25 - number } : { side: 'top', order: 33 - number };

function pin(number: number, name: string, type: PinType, mainFunctions: string[], details: Partial<Omit<SocPin, 'id' | 'number' | 'name' | 'type' | 'position' | 'mainFunctions'>> = {}): SocPin {
  return { id: `esp8285-pin-${number}`, number, name, type, position: positions(number), mainFunctions, ...details };
}
function io(number: number, name: string, gpio: number, mainFunctions: string[], warnings: PinWarning[] = [], notes: string[] = [], keywords: string[] = []): SocPin {
  return pin(number, name, 'io', mainFunctions, { gpio, ioMux: mainFunctions, matrixSignals: ['I2C', 'I2S', 'UART', 'PWM', 'IR Remote Control'], warnings, notes, keywords: [`gpio${gpio}`, `io${gpio}`, ...keywords] });
}

export const esp8285: SocDefinition = {
  id: 'esp8285', name: 'ESP8285', family: 'ESP8266', defaultPackageId: 'esp8285-qfn32', packageName: 'QFN32 (5 x 5 mm), top view',
  description: 'ESP8285 Wi-Fi SoC bare-package pinout with embedded SPI flash. Espressif marks it NRND and recommends ESP8684 for new designs.', source,
  chipSpecs: { cpu: 'Single-core Tensilica L106 32-bit processor up to 160 MHz', wireless: '2.4 GHz Wi-Fi 802.11 b/g/n.', sram: 'Less than 75 KB heap plus data memory available in Station mode.', rom: 'Built-in 1 MB or 2 MB SPI flash, depending on ESP8285N08 or ESP8285H16.' },
  pins: [
    pin(1, 'VDDA', 'power', ['Analog power 2.5 V to 3.6 V'], { warnings: ['power', 'voltage'], notes: ['Analog power supply.'], keywords: ['power', 'analog', 'vdda'] }),
    pin(2, 'LNA', 'analog', ['LNA', 'RF antenna interface'], { analog: ['RF antenna interface'], notes: ['Dedicated RF antenna interface, not a GPIO. Retain the datasheet-recommended pi-type matching network.'], keywords: ['rf', 'antenna', 'lna'] }),
    pin(3, 'VDD3P3', 'power', ['Amplifier power 2.5 V to 3.6 V'], { warnings: ['power', 'voltage'], notes: ['Amplifier power supply.'], keywords: ['power', '3v3'] }),
    pin(4, 'VDD3P3', 'power', ['Amplifier power 2.5 V to 3.6 V'], { warnings: ['power', 'voltage'], notes: ['Amplifier power supply.'], keywords: ['power', '3v3'] }),
    pin(5, 'VDD_RTC', 'power', ['NC', 'Internal 1.1 V RTC power'], { warnings: ['power', 'voltage'], notes: ['Datasheet marks this pin NC (1.1 V). Follow the official reference design; do not use it as a power output.'], keywords: ['power', 'rtc', 'nc', '1.1v'] }),
    pin(6, 'TOUT', 'analog', ['TOUT', 'ADC'], { analog: ['ADC'], warnings: ['voltage'], notes: ['ADC pin for either VDD3P3 measurement or external TOUT input; the two functions cannot be used simultaneously.', 'External TOUT input range is 0 V to 1.0 V.'], keywords: ['adc', 'analog', 'tout'] }),
    pin(7, 'CHIP_EN', 'control', ['Chip enable'], { warnings: ['reset'], notes: ['High enables normal operation; low turns the chip off. Do not leave this pin floating.'], keywords: ['enable', 'reset'] }),
    io(8, 'XPD_DCDC', 16, ['GPIO16', 'XPD_DCDC', 'Deep-sleep wakeup'], [], ['Connect to EXT_RSTB for deep-sleep wakeup. GPIO16 has only an internal pull-down.'], ['deep sleep', 'wakeup']),
    io(9, 'MTMS', 14, ['GPIO14', 'MTMS', 'HSPI_CLK', 'I2C_SCL', 'I2SI_WS', 'PWM2', 'IR TX'], ['jtag'], [], ['hspi', 'i2c', 'i2s', 'pwm', 'ir', 'jtag']),
    io(10, 'MTDI', 12, ['GPIO12', 'MTDI', 'HSPI_MISO', 'I2SI_DATA', 'PWM0'], ['jtag'], [], ['hspi', 'i2s', 'pwm', 'jtag']),
    pin(11, 'VDDPST', 'power', ['Digital/IO power 2.7 V to 3.6 V'], { warnings: ['power', 'voltage'], notes: ['Digital and IO power supply.'], keywords: ['power', 'digital', 'io power'] }),
    io(12, 'MTCK', 13, ['GPIO13', 'MTCK', 'HSPI_MOSI', 'UART0_CTS', 'I2SI_BCK'], ['jtag'], [], ['hspi', 'uart0', 'i2s', 'jtag']),
    io(13, 'MTDO', 15, ['GPIO15', 'MTDO', 'HSPI_CS', 'UART0_RTS', 'I2SO_BCK', 'PWM1'], ['strapping', 'boot', 'jtag'], [strapNote], ['hspi', 'uart0', 'i2s', 'pwm', 'strap', 'boot', 'jtag']),
    io(14, 'GPIO2', 2, ['GPIO2', 'UART flash TX', 'U1TXD', 'I2C_SDA', 'I2SO_WS'], ['strapping', 'boot'], [strapNote, 'Used as UART TX during flash programming.'], ['uart', 'i2c', 'i2s', 'strap', 'boot']),
    io(15, 'GPIO0', 0, ['GPIO0', 'SPI_CS2', 'Boot mode strapping'], ['strapping', 'boot'], [strapNote], ['spi', 'strap', 'boot', 'download']),
    io(16, 'GPIO4', 4, ['GPIO4', 'PWM3'], [], [], ['pwm']),
    pin(17, 'VDDPST', 'power', ['Digital/IO power 2.7 V to 3.6 V'], { warnings: ['power', 'voltage'], notes: ['Digital and IO power supply.'], keywords: ['power', 'digital', 'io power'] }),
    io(18, 'SDIO_DATA_2', 9, ['GPIO9', 'SDIO_DATA_2', 'SPIHD', 'HSPIHD'], [], ['SDIO data 2; the datasheet assigns it to the SDIO/SPI interface.'], ['sdio', 'spi', 'hspi', 'data2']),
    io(19, 'SDIO_DATA_3', 10, ['GPIO10', 'SDIO_DATA_3', 'SPIWP', 'HSPIWP'], [], ['SDIO data 3; the datasheet assigns it to the SDIO/SPI interface.'], ['sdio', 'spi', 'hspi', 'data3']),
    io(20, 'SDIO_CMD', 11, ['GPIO11', 'SDIO_CMD', 'SPI_CS0'], ['flash'], [flashNote], ['flash', 'sdio', 'spi', 'cmd']),
    io(21, 'SDIO_CLK', 6, ['GPIO6', 'SDIO_CLK', 'SPI_CLK'], ['flash'], [flashNote], ['flash', 'sdio', 'spi', 'clock']),
    io(22, 'SDIO_DATA_0', 7, ['GPIO7', 'SDIO_DATA_0', 'SPI_MISO'], ['flash'], [flashNote], ['flash', 'sdio', 'spi', 'data0']),
    io(23, 'SDIO_DATA_1', 8, ['GPIO8', 'SDIO_DATA_1', 'SPI_MOSI', 'U1RXD'], ['flash'], [flashNote], ['flash', 'sdio', 'spi', 'data1', 'uart1']),
    io(24, 'GPIO5', 5, ['GPIO5', 'IR Rx'], [], [], ['ir', 'infrared']),
    io(25, 'U0RXD', 3, ['GPIO3', 'U0RXD', 'I2SO_DATA'], ['uart0'], [uartNote], ['uart0', 'serial', 'i2s']),
    io(26, 'U0TXD', 1, ['GPIO1', 'U0TXD', 'SPI_CS1'], ['uart0', 'boot'], [uartNote, 'Do not pull U0TXD externally low during power-up.'], ['uart0', 'serial', 'spi', 'boot']),
    pin(27, 'XTAL_OUT', 'analog', ['XTAL_OUT', 'BT clock input'], { analog: ['XTAL_OUT', 'BT clock input'], notes: ['External crystal oscillator output. Not a GPIO.'], keywords: ['xtal', 'crystal', 'clock'] }),
    pin(28, 'XTAL_IN', 'analog', ['XTAL_IN'], { analog: ['XTAL_IN'], notes: ['External crystal oscillator input. Not a GPIO.'], keywords: ['xtal', 'crystal', 'clock'] }),
    pin(29, 'VDDD', 'power', ['Analog power 2.5 V to 3.6 V'], { warnings: ['power', 'voltage'], notes: ['Datasheet lists VDDD as analog power.'], keywords: ['power', 'analog', 'vddd'] }),
    pin(30, 'VDDA', 'power', ['Analog power 2.5 V to 3.6 V'], { warnings: ['power', 'voltage'], notes: ['Analog power supply.'], keywords: ['power', 'analog', 'vdda'] }),
    pin(31, 'RES12K', 'control', ['RES12K'], { notes: ['Connect in series with a 12 kOhm resistor to ground, per the datasheet.'], keywords: ['resistor', '12k', 'ground'] }),
    pin(32, 'EXT_RSTB', 'control', ['EXT_RSTB', 'External reset'], { warnings: ['reset'], notes: ['External reset input; low level is active. Connect to XPD_DCDC for deep-sleep wakeup.'], keywords: ['reset', 'deep sleep', 'wakeup'] }),
    { id: 'esp8285-pin-33', number: 33, name: 'GND', type: 'ground', position: { side: 'center', order: 1 }, mainFunctions: ['Exposed ground pad'], warnings: ['power'], notes: ['Exposed ground pad.'], keywords: ['ground', 'gnd', 'epad'] },
  ],
};
