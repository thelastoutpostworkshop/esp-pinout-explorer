import { describe, expect, it } from 'vitest';
import { createBoardDataset } from '@/services/export-mcp-board-dataset';
import { createModuleDataset } from '@/services/export-mcp-module-dataset';

describe('public board dataset', () => {
  const dataset = createBoardDataset('2026-01-01T00:00:00.000Z');
  const devKitC = dataset.boards.find((board) => board.id === 'esp32-s3-devkitc-1');

  it('emits schema version 1 and required public fields', () => {
    expect(dataset.schema_version).toBe(1);
    expect(dataset.generated_at).toBe('2026-01-01T00:00:00.000Z');
    expect(devKitC).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      manufacturer: 'Espressif',
      chip_family: expect.any(String),
      aliases: expect.any(Array),
      module_variants: expect.any(Array),
      route: expect.any(String),
      recognition: expect.any(Object),
      pinout_summary: expect.any(Object),
    });
  });

  it('exports the DevKitC canonical identity and a conservative pin summary', () => {
    expect(devKitC).toMatchObject({
      id: 'esp32-s3-devkitc-1',
      route: '/boards/esp32-s3-devkitc-1',
      module_variants: expect.arrayContaining(['ESP32-S3-WROOM-1', 'ESP32-S3-WROOM-2']),
      recognition: { board_markings: ['ESP32-S3-DevKitC-1'], header_pin_counts: [44] },
    });
    expect(devKitC?.pinout_summary.safe_general_purpose_pins).toContain('GPIO4');
    expect(devKitC?.pinout_summary.safe_general_purpose_pins).not.toContain('GPIO0');
  });

  it('derives caution and internal-memory information from profile warnings only', () => {
    expect(devKitC?.pinout_summary.caution_pins).toEqual(
      expect.arrayContaining([expect.objectContaining({ gpio: 'GPIO0', warning: expect.stringContaining('Boot') })]),
    );
    expect(devKitC?.pinout_summary.reserved_or_internal_pins).toEqual(
      expect.arrayContaining([expect.objectContaining({ gpio: 'GPIO35', reason: expect.stringContaining('PSRAM') })]),
    );
  });

  it('exports the next official DevKit profiles with their canonical identities', () => {
    expect(dataset.boards).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'esp32-lcdkit', name: 'ESP32-LCDKit', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp8266-devkitc', name: 'ESP8266-DevKitC', chip_family: 'ESP8266EX' }),
      expect.objectContaining({ id: 'esp8266-devkits', name: 'ESP8266-DevKitS', chip_family: 'ESP8266EX' }),
      expect.objectContaining({ id: 'esp-launcher', name: 'ESP-Launcher', chip_family: 'ESP8266EX' }),
      expect.objectContaining({ id: 'esp32p4x-function-ev-board', chip_family: 'ESP32-P4' }),
      expect.objectContaining({ id: 'esp32p4-function-ev-board-v1-5-2', chip_family: 'ESP32-P4' }),
      expect.objectContaining({ id: 'esp32p4x-eye', name: 'ESP32-P4X-EYE', chip_family: 'ESP32-P4' }),
      expect.objectContaining({ id: 'esp32p4-eye', name: 'ESP32-P4-EYE', chip_family: 'ESP32-P4' }),
      expect.objectContaining({ id: 'esp32s3-thread-br-zigbee-gw-v1-2', chip_family: 'ESP32-S3' }),
      expect.objectContaining({ id: 'esp32s3-usb-otg', name: 'ESP32-S3-USB-OTG', chip_family: 'ESP32-S3' }),
      expect.objectContaining({ id: 'esp32s3-usb-bridge', name: 'ESP32-S3-USB-Bridge', chip_family: 'ESP32-S3' }),
      expect.objectContaining({ id: 'esp32s3-lcd-ev-board-v1-5', chip_family: 'ESP32-S3' }),
      expect.objectContaining({ id: 'esp-vocat-v1-2', chip_family: 'ESP32-S3' }),
      expect.objectContaining({ id: 'esp-dualkey', name: 'ESP-DualKey', chip_family: 'ESP32-S3' }),
      expect.objectContaining({ id: 'esp32-pico-kit-1', name: 'ESP32-PICO-KIT-1', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp32-ethernet-kit-v1-2', name: 'ESP32-Ethernet-Kit v1.2', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp-wrover-kit-v4-1', name: 'ESP-WROVER-KIT v4.1', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp32-devkitm-1', name: 'ESP32-DevKitM-1', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp32-pico-devkitm-2', name: 'ESP32-PICO-DevKitM-2', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp32-pico-kit-v4', name: 'ESP32-PICO-KIT v4/v4.1', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp32-devkitc-v4', name: 'ESP32-DevKitC V4', chip_family: 'ESP32' }),
      expect.objectContaining({ id: 'esp32-s3-devkitm-1', name: 'ESP32-S3-DevKitM-1', chip_family: 'ESP32-S3' }),
      expect.objectContaining({ id: 'esp32-c6-devkitc-1', name: 'ESP32-C6-DevKitC-1', chip_family: 'ESP32-C6' }),
      expect.objectContaining({ id: 'esp32-c6-devkitm-1', name: 'ESP32-C6-DevKitM-1', chip_family: 'ESP32-C6' }),
      expect.objectContaining({ id: 'esp32-h2-devkitm-1', name: 'ESP32-H2-DevKitM-1', chip_family: 'ESP32-H2' }),
    ]));
  });

  it('maps the classic WROOM-32 marking to a DevKitC-compatible candidate without changing module variants', () => {
    const devKitCV4 = dataset.boards.find((board) => board.id === 'esp32-devkitc-v4');
    expect(devKitCV4).toMatchObject({
      recognition: { module_markings: expect.arrayContaining(['ESP-WROOM-32']), header_pin_counts: [38] },
      module_variants: expect.not.arrayContaining(['ESP-WROOM-32']),
    });
  });
});

describe('public module dataset', () => {
  const dataset = createModuleDataset('2026-01-01T00:00:00.000Z');
  const mini1 = dataset.modules.find((module) => module.id === 'esp32c3-mini-1');

  it('exports ESP32-C3-MINI-1 as module-level guidance', () => {
    expect(dataset.schema_version).toBe(1);
    expect(dataset.generated_at).toBe('2026-01-01T00:00:00.000Z');
    expect(mini1).toMatchObject({
      id: 'esp32c3-mini-1',
      name: 'ESP32-C3-MINI-1',
      chip_family: 'ESP32-C3',
      module_markings: ['ESP32-C3-MINI-1'],
      route: '/modules/esp32c3-mini-1',
    });
    expect(mini1?.general_purpose_candidates).toContain('GPIO4');
    expect(mini1?.pin_functions).toEqual(expect.arrayContaining([
      expect.objectContaining({ gpio: 'GPIO4', functions: expect.arrayContaining(['MTMS']), warnings: expect.arrayContaining(['JTAG']) }),
    ]));
    expect(mini1?.caution_pins).toEqual(expect.arrayContaining([
      expect.objectContaining({ gpio: 'GPIO9', warning: expect.stringContaining('Boot') }),
      expect.objectContaining({ gpio: 'GPIO18', warning: expect.stringContaining('USB') }),
    ]));
    expect(mini1?.general_warnings[0]).toContain('Module-level guidance only');
    expect(mini1?.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({ url: expect.stringContaining('esp32-c3-mini-1') }),
    ]));
  });

  it('exports all implemented ESP32-C3 module profiles', () => {
    expect(dataset.modules).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'esp32c3-mini-1u', name: 'ESP32-C3-MINI-1U' }),
      expect.objectContaining({ id: 'esp32c3-wroom-02', name: 'ESP32-C3-WROOM-02' }),
      expect.objectContaining({ id: 'esp32c3-wroom-02u', name: 'ESP32-C3-WROOM-02U' }),
    ]));
  });

  it('exports C6 WROOM module profiles with their documented module pads', () => {
    const wroom1 = dataset.modules.find((module) => module.id === 'esp32c6-wroom-1');
    const wroom1u = dataset.modules.find((module) => module.id === 'esp32c6-wroom-1u');

    expect(wroom1).toMatchObject({
      name: 'ESP32-C6-WROOM-1',
      chip_family: 'ESP32-C6',
      module_markings: ['ESP32-C6-WROOM-1'],
      route: '/modules/esp32c6-wroom-1',
    });
    expect(wroom1?.pin_functions).toEqual(expect.arrayContaining([
      expect.objectContaining({ gpio: 'GPIO4', functions: expect.arrayContaining(['MTMS']) }),
      expect.objectContaining({ gpio: 'GPIO12', functions: expect.arrayContaining(['USB_D-']) }),
      expect.objectContaining({ gpio: 'GPIO17', functions: expect.arrayContaining(['U0RXD']) }),
    ]));
    expect(wroom1?.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({ url: expect.stringContaining('esp32-c6-wroom-1_wroom-1u') }),
    ]));
    expect(wroom1u).toMatchObject({
      name: 'ESP32-C6-WROOM-1U',
      module_markings: ['ESP32-C6-WROOM-1U'],
      route: '/modules/esp32c6-wroom-1u',
    });
  });

  it('keeps carrier boards and bare chip or SiP markings out of module guidance', () => {
    const forbiddenModuleMarkings = [
      'ESP32-DevKitC V4',
      'ESP32-S3FN8',
      'ESP32-SOLO-1',
      'ESP32-PICO-V3',
      'ESP32-PICO-D4',
    ];
    const exportedModuleNames = dataset.modules.flatMap((module) => [
      module.id,
      module.name,
      ...module.module_markings,
    ]);

    for (const marking of forbiddenModuleMarkings) {
      expect(exportedModuleNames).not.toContain(marking);
    }
  });
});
