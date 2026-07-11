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
      recognition: { board_markings: ['ESP32-S3-DevKitC-1'], header_pin_counts: [22, 22] },
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
});
