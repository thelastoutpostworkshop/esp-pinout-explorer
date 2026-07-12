import { describe, expect, it } from 'vitest';
import { createBoardDataset } from '@/services/export-mcp-board-dataset';

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
