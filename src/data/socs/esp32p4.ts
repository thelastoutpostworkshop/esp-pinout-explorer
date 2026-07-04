import { createEsp32p4BoardProfiles } from '@/data/boards/esp32p4';
import type { SocDefinition, SocPin, SocSource } from '@/types/soc';

const source: SocSource = {
  title: 'ESP32-P4 Series Datasheet',
  version: 'Pre-release v0.6',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-p4_datasheet_en.pdf',
  sections: [
    'Figure 2-1 Pin Layout (Top View)',
    'Table 2-1 ESP32-P4 Pin Definitions',
    'Chapter 3 Power Domains',
    'Chapter 4 Strapping Pins',
    'Chapter 5 Peripheral Overview',
    'Chapter 6 Electrical Characteristics',
  ],
};

const esp32p4PackagePins: SocPin[] = [];

export const esp32p4: SocDefinition = {
  id: 'esp32p4',
  name: 'ESP32-P4',
  family: 'ESP32',
  defaultProfileId: 'esp32p4x-function-ev-board',
  chipSpecs: {
    cpu: 'Dual-core 32-bit RISC-V high-performance CPU plus single-core low-power RISC-V CPU',
    sram: 'Large internal memory with package PSRAM options on selected variants.',
    rom: 'Boot ROM and low-power subsystem ROM.',
  },
  packageName: 'QFN104 package placeholder',
  description:
    'ESP32-P4 board-family with the ESP32-P4X-Function-EV-Board, ESP32-P4X-EYE, legacy ESP32-P4-Function-EV-Board v1.5.2, and legacy ESP32-P4-EYE profiles implemented from official board documentation.',
  source,
  pins: [],
  boardProfiles: createEsp32p4BoardProfiles(findP4PinByGpio),
};

function findP4PinByGpio(gpio: number | undefined) {
  if (gpio === undefined) {
    return undefined;
  }

  return esp32p4PackagePins.find((pin) => pin.gpio === gpio);
}
