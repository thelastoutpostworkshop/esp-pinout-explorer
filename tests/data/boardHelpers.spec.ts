import { describe, expect, it } from 'vitest';
import { boardGpioLabel, boardPinName, makeBoardPin } from '@/data/boards/helpers';
import type { SocPin } from '@/types/soc';

describe('board data helpers', () => {
  it('builds board pins with inherited package metadata', () => {
    const sourcePin = makeSourcePin();
    const pin = makeBoardPin({
      id: 'test-board-j1-1',
      number: 1,
      displayNumber: 'J1-1',
      label: '1',
      type: 'io',
      gpio: 1,
      boardHeader: 'J1',
      position: { side: 'left', order: 1 },
      mainFunctions: ['GPIO1'],
      sourcePin,
      note: 'J1-1 board header pin, silkscreen label 1.',
      notes: ['Board-specific note.'],
      warnings: ['onboard'],
      baseKeywords: ['board', 'devkit'],
      keywords: ['silkscreen-one'],
    });

    expect(pin.name).toBe('GPIO1');
    expect(pin.boardLabel).toBe('1');
    expect(pin.ioMux).toEqual(['GPIO1']);
    expect(pin.notes).toEqual([
      'J1-1 board header pin, silkscreen label 1.',
      'Board-specific note.',
      'Source note.',
    ]);
    expect(pin.warnings).toEqual(['onboard', 'strapping']);
    expect(pin.keywords).toEqual([
      'board',
      'devkit',
      'J1',
      'J1-1',
      '1',
      'GPIO1',
      'silkscreen-one',
      'source-keyword',
    ]);
  });

  it('supports board-specific source metadata omissions', () => {
    const pin = makeBoardPin({
      id: 'test-board-j1-2',
      number: 2,
      displayNumber: 'J1-2',
      label: '2',
      type: 'io',
      gpio: 2,
      boardHeader: 'J1',
      position: { side: 'left', order: 2 },
      mainFunctions: ['GPIO2'],
      sourcePin: makeSourcePin({ gpio: 2, name: 'GPIO2', warnings: ['flash', 'jtag'] }),
      omitSourceWarnings: ['flash'],
      omitSourceNotes: ['Source note.'],
      omitSourceKeywords: ['source-keyword'],
    });

    expect(pin.warnings).toEqual(['jtag']);
    expect(pin.notes).toEqual([]);
    expect(pin.keywords).not.toContain('source-keyword');
  });

  it('keeps serial labels when they are more useful than GPIO names', () => {
    expect(boardGpioLabel(43)).toBe('GPIO43');
    expect(boardGpioLabel(undefined)).toBe('');
    expect(boardPinName('TX', 43)).toBe('TX');
    expect(boardPinName('IO43', 43)).toBe('GPIO43');
    expect(boardPinName('TXD0', 1, ['TX', 'RX', 'TXD0', 'RXD0'])).toBe('TXD0');
  });
});

function makeSourcePin(overrides: Partial<SocPin> = {}): SocPin {
  return {
    id: 'source-gpio1',
    number: 1,
    name: 'GPIO1',
    type: 'io',
    gpio: 1,
    position: { side: 'left', order: 1 },
    mainFunctions: ['GPIO1'],
    ioMux: ['GPIO1'],
    rtc: ['RTC_GPIO1'],
    analog: ['ADC1_CH0'],
    matrixSignals: ['GPIO matrix'],
    notes: ['Source note.'],
    warnings: ['strapping'],
    keywords: ['source-keyword'],
    ...overrides,
  };
}
