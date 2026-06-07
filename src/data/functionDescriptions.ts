const exactDescriptions: Record<string, string> = {
  ANT: 'Antenna RF input/output pin. This is a dedicated RF analog connection, not a general GPIO.',
  CHIP_PU: 'Chip power-up and reset-enable input. Pulling this low resets or disables the chip.',
  FSPICLK: 'Fast SPI clock signal. Often used for flash, PSRAM, or high-speed SPI connections.',
  FSPICS0: 'Fast SPI chip-select 0 signal. Commonly used as a chip-select line for SPI memory or peripherals.',
  FSPICS1: 'Fast SPI chip-select 1 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS2: 'Fast SPI chip-select 2 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS3: 'Fast SPI chip-select 3 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS4: 'Fast SPI chip-select 4 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPICS5: 'Fast SPI chip-select 5 signal. Commonly used as an extra chip-select line for SPI memory or peripherals.',
  FSPID: 'Fast SPI data output signal, also commonly labeled MOSI or DQ0 depending on bus mode.',
  FSPIHD: 'Fast SPI HOLD or DQ3 signal, commonly used by quad/octal SPI memory.',
  FSPIQ: 'Fast SPI data input signal, also commonly labeled MISO or DQ1 depending on bus mode.',
  FSPIWP: 'Fast SPI write-protect or DQ2 signal, commonly used by quad/octal SPI memory.',
  FSPIDQS: 'Fast SPI data strobe or data-mask signal, commonly used by octal SPI memory.',
  MTCK: 'JTAG test clock signal. Also used by some boot/debug configurations on supported chips.',
  MTDI: 'JTAG test data input signal. Also used by some boot/debug configurations on supported chips.',
  MTDO: 'JTAG test data output signal. Also used by some boot/debug configurations on supported chips.',
  MTMS: 'JTAG test mode select signal. Also used by some boot/debug configurations on supported chips.',
  SPICLK: 'SPI flash/PSRAM clock signal. Usually reserved when external flash or PSRAM uses this package pin.',
  SPICS0: 'SPI flash chip-select 0 signal. Usually reserved for external flash on many ESP32 packages.',
  SPICS1: 'SPI chip-select 1 signal. Often related to external PSRAM or an additional SPI memory device.',
  SPID: 'SPI flash data input/MOSI/DQ0 signal. Usually reserved when external flash uses this package pin.',
  SPIHD: 'SPI flash HOLD or DQ3 signal. Usually reserved when quad SPI flash or PSRAM uses this pin.',
  SPIQ: 'SPI flash data output/MISO/DQ1 signal. Usually reserved when external flash uses this package pin.',
  SPIWP: 'SPI flash write-protect or DQ2 signal. Usually reserved when quad SPI flash or PSRAM uses this pin.',
  XTAL_N: 'Main crystal negative clock input/output. Used with the external crystal oscillator circuit.',
  XTAL_P: 'Main crystal positive clock input/output. Used with the external crystal oscillator circuit.',
  XTAL_32K_N: '32 kHz crystal negative input/output. Used for an optional low-power clock crystal.',
  XTAL_32K_P: '32 kHz crystal positive input/output. Used for an optional low-power clock crystal.',
};

const phraseDescriptions: Array<[RegExp, string]> = [
  [/^3\.3 V .*power input$/i, 'Power-supply input pin for the named chip domain. Connect according to the datasheet power requirements.'],
  [/^analog power input$/i, 'Analog-domain power-supply input pin. This is not a GPIO.'],
  [/^exposed ground pad$/i, 'Exposed thermal/electrical ground pad. It should be connected to ground according to the package guidance.'],
  [/^flash\/psram/i, 'Function related to external flash or PSRAM memory. These pins may be reserved or constrained on boards using external memory.'],
  [/^boot mode strapping$/i, 'Boot strapping function sampled during reset to select a chip boot mode. Avoid external circuits that force the wrong level at boot.'],
  [/^jtag signal source strapping$/i, 'Strapping function that affects which JTAG signal source is selected during boot.'],
  [/^rom message control$/i, 'Boot ROM message-control function sampled during reset. It can affect startup serial logging behavior.'],
  [/^chip power-up and reset enable$/i, 'Chip enable/reset control. Pulling this signal low resets or disables the chip.'],
  [/^rf .*input\/output$/i, 'Dedicated RF analog input/output connection for the radio path, not a general GPIO.'],
  [/^main crystal .*clock input\/output$/i, 'Main crystal oscillator connection used by the chip clock circuit.'],
  [/^32 kHz crystal/i, 'Optional 32 kHz crystal oscillator connection for low-power timing.'],
];

export function getFunctionDescription(name: string): string | null {
  if (exactDescriptions[name]) {
    return exactDescriptions[name];
  }

  const normalized = name.trim();

  if (/^GPIO\d+$/.test(normalized)) {
    return `${normalized} is a general-purpose digital I/O signal. Check this pin's warnings before using it for a project.`;
  }

  if (/^RTC_GPIO\d+$/.test(normalized)) {
    return `${normalized} is a GPIO signal in the RTC/low-power domain, useful for some sleep and wake workflows.`;
  }

  if (/^LP_GPIO\d+$/.test(normalized)) {
    return `${normalized} is a low-power domain GPIO signal that can be used by LP peripherals on supported chips.`;
  }

  if (/^ADC\d_CH\d+$/.test(normalized)) {
    return `${normalized} is an analog-to-digital converter input channel. Use it to measure analog voltages within the chip's supported range.`;
  }

  if (/^TOUCH\d+$/.test(normalized)) {
    return `${normalized} is a capacitive touch-sensing channel.`;
  }

  if (/^U\d(TXD|RXD|RTS|CTS)$/.test(normalized)) {
    const [, signal] = normalized.match(/^U\d(TXD|RXD|RTS|CTS)$/) ?? [];
    const meanings: Record<string, string> = {
      TXD: 'transmit data',
      RXD: 'receive data',
      RTS: 'request-to-send flow control',
      CTS: 'clear-to-send flow control',
    };
    return `${normalized} is a UART ${meanings[signal]} signal.`;
  }

  if (/^LP_UART_/.test(normalized)) {
    return `${normalized} is a low-power UART signal.`;
  }

  if (/^LP_I2C_(SDA|SCL)$/.test(normalized)) {
    return `${normalized} is a low-power I2C ${normalized.endsWith('SDA') ? 'data' : 'clock'} signal.`;
  }

  if (/^SAR I2C (SDA|SCL)\d$/.test(normalized)) {
    return `${normalized} is an internal SAR ADC control-bus signal, not the usual application I2C peripheral.`;
  }

  if (/^CLK_OUT\d$/.test(normalized)) {
    return `${normalized} is a configurable clock output signal.`;
  }

  if (/^USB_D[+-]$/.test(normalized)) {
    return `${normalized} is a native USB differential data signal. Keep USB routing and pin restrictions in mind.`;
  }

  if (/^SDIO_(CMD|CLK|DATA\d)$/.test(normalized)) {
    return `${normalized} is an SDIO interface signal.`;
  }

  if (/^SPIIO\d$/.test(normalized)) {
    return `${normalized} is an extra SPI data line used by wider SPI memory modes such as octal SPI.`;
  }

  if (/^SUBSPI/.test(normalized)) {
    return `${normalized} is a secondary SPI signal available through the IO MUX on this pin.`;
  }

  if (/^FSPIIO\d$/.test(normalized)) {
    return `${normalized} is a Fast SPI data line used by wider SPI memory or peripheral modes.`;
  }

  for (const [pattern, description] of phraseDescriptions) {
    if (pattern.test(normalized)) {
      return description;
    }
  }

  return null;
}
