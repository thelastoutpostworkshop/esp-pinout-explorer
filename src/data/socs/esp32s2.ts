import { makeBoardPin } from '@/data/boards/helpers';
import type { PinPosition, PinType, PinWarning, SocDefinition, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

const source: SocSource = {
  title: 'ESP32-S2 Series Datasheet', version: 'v1.9', publisher: 'Espressif', documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-s2_datasheet_en.pdf',
  sections: ['Figure 2-1 ESP32-S2 Pin Layout (Top View)', 'Table 2-1 Pin Overview', 'Table 2-3 IO MUX Functions', 'Table 2-6 RTC Functions', 'Table 2-8 Analog Functions', 'Section 2.3.5 Restrictions for GPIOs and RTC_GPIOs', 'Table 2-14 Pin Mapping Between Chip and Flash or PSRAM', 'Table 3-1 Default Configuration of Strapping Pins'],
};
const boardSource: SocSource = {
  title: 'ESP32-S2-DevKitC-1 User Guide', version: 'latest', publisher: 'Espressif', documentType: 'user-guide',
  url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s2/esp32-s2-devkitc-1/user_guide.html',
  sections: ['Description of Components', 'Ordering Information', 'Header Block J1', 'Header Block J3', 'Pin Layout'],
  figures: [{ title: 'ESP32-S2-DevKitC-1 pin layout', kind: 'pin-layout', url: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s2/_images/esp32-s2-devkitc-1-pinout.png', alt: 'ESP32-S2-DevKitC-1 pin layout', sourceSection: 'Pin Layout' }],
};
const moduleSource: SocSource = { title: 'ESP32-S2-SOLO-2 & ESP32-S2-SOLO-2U Datasheet', version: 'v1.4', publisher: 'Espressif', documentType: 'datasheet', url: 'https://documentation.espressif.com/esp32-s2-solo-2_esp32-s2-solo-2u_datasheet_en.pdf', sections: ['Ordering Information', 'Pin Definitions'] };
const names = ['VDDA','LNA_IN','VDD3P3','VDD3P3','GPIO0','GPIO1','GPIO2','GPIO3','GPIO4','GPIO5','GPIO6','GPIO7','GPIO8','GPIO9','GPIO10','GPIO11','GPIO12','GPIO13','GPIO14','VDD3P3_RTC','XTAL_32K_P','XTAL_32K_N','DAC_1','DAC_2','GPIO19','GPIO20','VDD3P3_RTC_IO','GPIO21','SPICS1','VDD_SPI','SPIHD','SPIWP','SPICS0','SPICLK','SPIQ','SPID','GPIO33','GPIO34','GPIO35','GPIO36','GPIO37','GPIO38','MTCK','MTDO','VDD3P3_CPU','MTDI','MTMS','U0TXD','U0RXD','GPIO45','VDDA','XTAL_N','XTAL_P','VDDA','GPIO46','CHIP_PU'];
const gpioByPin: Record<number, number> = { 5: 0, 6: 1, 7: 2, 8: 3, 9: 4, 10: 5, 11: 6, 12: 7, 13: 8, 14: 9, 15: 10, 16: 11, 17: 12, 18: 13, 19: 14, 21: 15, 22: 16, 23: 17, 24: 18, 25: 19, 26: 20, 28: 21, 29: 26, 31: 27, 32: 28, 33: 29, 34: 30, 35: 31, 36: 32, 37: 33, 38: 34, 39: 35, 40: 36, 41: 37, 42: 38, 43: 39, 44: 40, 46: 41, 47: 42, 48: 43, 49: 44, 50: 45, 55: 46 };
const powerPins = new Set([1, 3, 4, 20, 27, 30, 45, 51, 54]);
const analogPins = new Set([2, 52, 53]);
const flashGpios = new Set([26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]);
const position = (number: number): PinPosition => number <= 14 ? { side: 'left', order: number } : number <= 28 ? { side: 'bottom', order: number - 14 } : number <= 42 ? { side: 'right', order: 43 - number } : { side: 'top', order: 57 - number };
const unique = <T>(values: T[]) => [...new Set(values)];

function packagePin(number: number): SocPin {
  const name = names[number - 1]; const gpio = gpioByPin[number];
  const type: PinType = powerPins.has(number) ? 'power' : analogPins.has(number) ? 'analog' : number === 56 ? 'control' : 'io';
  const warnings: PinWarning[] = [];
  if (type === 'power') warnings.push('power');
  if (name === 'CHIP_PU') warnings.push('reset');
  if (gpio === 0 || gpio === 45 || gpio === 46) warnings.push('strapping', 'boot');
  if (gpio === 19 || gpio === 20) warnings.push('usb');
  if (gpio === 43 || gpio === 44) warnings.push('uart0');
  if ([39, 40, 41, 42].includes(gpio)) warnings.push('jtag');
  if (gpio !== undefined && flashGpios.has(gpio)) warnings.push('flash');
  const functions = gpio === undefined ? [name === 'CHIP_PU' ? 'Chip enable and reset' : name.includes('XTAL') ? 'Crystal oscillator connection' : name.includes('VDD') ? 'Power supply' : name === 'LNA_IN' ? 'RF antenna interface' : name] : [`GPIO${gpio}`, name];
  if (gpio === 19) functions.push('USB_D-'); if (gpio === 20) functions.push('USB_D+');
  return { id: `esp32s2-pin-${number}`, number, name, type, gpio, position: position(number), mainFunctions: unique(functions), ioMux: gpio === undefined ? undefined : unique([`GPIO${gpio}`, name]), rtc: gpio !== undefined && gpio <= 21 ? [`RTC_GPIO${gpio}`] : undefined, notes: [gpio !== undefined && flashGpios.has(gpio) ? 'Connected to flash or PSRAM in applicable configurations; do not treat as a general-purpose pin.' : type === 'control' ? 'High enables the chip; low resets or disables it.' : type === 'analog' ? 'Dedicated analog/RF/crystal connection; not a general GPIO.' : 'See the official datasheet for IO MUX and electrical constraints.'], warnings: unique(warnings), keywords: unique([name.toLowerCase(), gpio === undefined ? '' : `gpio${gpio}`, ...(warnings ?? [])].filter(Boolean)) };
}

const pins = [...Array(56)].map((_, index) => packagePin(index + 1));
pins.push({ id: 'esp32s2-pin-57', number: 57, name: 'GND', type: 'ground', position: { side: 'center', order: 1 }, mainFunctions: ['Exposed ground pad'], notes: ['Exposed ground pad.'], warnings: ['power'], keywords: ['ground', 'gnd', 'epad'] });

export const esp32s2: SocDefinition = {
  id: 'esp32s2', name: 'ESP32-S2', family: 'ESP32', defaultPackageId: 'esp32s2-qfn56', defaultProfileId: 'esp32s2-devkitc-1', packageName: 'QFN56 (7 x 7 mm), top view', description: 'ESP32-S2 Wi-Fi SoC bare-package pinout.', source, pins,
  chipSpecs: { cpu: 'Single-core Xtensa LX7 up to 240 MHz', wireless: '2.4 GHz Wi-Fi 802.11 b/g/n.', sram: '320 KB SRAM plus 16 KB RTC SRAM.', rom: '128 KB ROM.' },
};

const j1 = ['3V3','3V3','RST','4','5','6','7','15','16','17','18','8','3','46','9','10','11','12','13','14','5V','G'];
const j3 = ['G','TX','RX','1','2','42','41','40','39','38','37','36','35','0','45','34','33','21','20','19','G','G'];
const boardGpio = (label: string) => label === 'TX' ? 43 : label === 'RX' ? 44 : /^\d+$/.test(label) ? Number(label) : undefined;
function headerPins(header: 'J1' | 'J3', labels: string[]) {
  return labels.map((label, index) => { const number = index + 1; const gpio = boardGpio(label); const sourcePin = gpio === undefined ? undefined : pins.find((pin) => pin.gpio === gpio); const type: PinType = label === 'G' ? 'ground' : label === '3V3' || label === '5V' ? 'power' : label === 'RST' ? 'control' : 'io';
    return makeBoardPin({ id: `esp32s2-devkitc-1-${header.toLowerCase()}-${number}`, number, displayNumber: `${header}-${number}`, label, type, gpio, boardHeader: header, position: { side: header === 'J1' ? 'left' : 'right', order: number }, mainFunctions: label === 'RST' ? ['CHIP_PU'] : label === 'G' ? ['Ground'] : label === '3V3' || label === '5V' ? [`${label} power supply`] : sourcePin?.mainFunctions ?? [], sourcePin, note: `${header}-${number} on the ESP32-S2-DevKitC-1 header, silkscreen label ${label}.`, warnings: label === 'RST' ? ['reset'] : gpio === 18 ? ['onboard'] : undefined, notes: gpio === 18 ? ['Drives the on-board addressable RGB LED.'] : undefined, baseKeywords: ['board', 'devkit', 'esp32-s2', 'header'] }); });
}
const devKit: SocPackageVariant = { id: 'esp32s2-devkitc-1', name: 'DevKitC-1', packageName: 'ESP32-S2-DevKitC-1 board headers', kind: 'board', source: boardSource, description: 'Official ESP32-S2 development board based on ESP32-S2-SOLO modules.', chipPackageId: 'esp32s2-qfn56', moduleNames: ['ESP32-S2-SOLO-2', 'ESP32-S2-SOLO-2U', 'ESP32-S2-SOLO', 'ESP32-S2-SOLO-U'], moduleVariants: [{ name: 'ESP32-S2-SOLO-2', antenna: 'PCB antenna', flash: '4 MB or 8 MB SPI flash', psram: 'Optional 2 MB PSRAM', footprint: '18.0 x 25.5 mm module', pinoutImpact: 'GPIO18 RGB LED pull-up differs for SOLO-2 variants.', source: moduleSource }, { name: 'ESP32-S2-SOLO-2U', antenna: 'External antenna connector', flash: '4 MB or 8 MB SPI flash', psram: 'Optional 2 MB PSRAM', footprint: '18.0 x 19.2 mm module', pinoutImpact: 'GPIO18 RGB LED pull-up differs for SOLO-2U variants.', source: moduleSource }], identificationNotes: ['Choose this profile by the ESP32-S2-DevKitC-1 carrier PCB, two 22-pin headers, Micro-USB UART port, ESP32-S2 USB port, Boot and Reset buttons.'], boardSpecs: { power: ['ESP32-S2 USB port, Micro-USB UART port, 5V/GND headers, or 3V3/GND headers; use only one compatible power path.'], programming: ['Flash over the USB-to-UART bridge or the ESP32-S2 USB OTG port.'], onBoardHardware: ['USB-to-UART bridge, Boot and Reset buttons, addressable RGB LED on GPIO18, 5 V to 3.3 V LDO.'] }, pins: [...headerPins('J1', j1), ...headerPins('J3', j3)] };
esp32s2.boardProfiles = [devKit];
