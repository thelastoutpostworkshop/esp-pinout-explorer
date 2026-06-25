import { describe, expect, it } from 'vitest';
import { getFunctionDescription } from '@/data/functionDescriptions';
import { isSafeForMakerUse } from '@/data/pinSafety';
import { getBoardDesignWarnings, getMakerWarnings, hasMakerWarning } from '@/data/pinWarnings';
import type { SocPin } from '@/types/soc';

describe('pin warning helpers', () => {
  it('splits maker warnings from board design notes', () => {
    const warnings = ['strapping', 'usb', 'flash', 'jtag'] as const;

    expect(getMakerWarnings([...warnings])).toEqual(['strapping', 'usb']);
    expect(getBoardDesignWarnings([...warnings])).toEqual(['flash', 'jtag']);
    expect(hasMakerWarning({ warnings: ['flash', 'jtag'] })).toBe(false);
    expect(hasMakerWarning({ warnings: ['boot'] })).toBe(true);
  });
});

describe('safe use helper', () => {
  it('only treats exposed board GPIO pins without maker warnings as safe', () => {
    expect(isSafeForMakerUse(makePin())).toBe(true);
    expect(isSafeForMakerUse(makePin({ boardHeader: undefined }))).toBe(false);
    expect(isSafeForMakerUse(makePin({ gpio: undefined }))).toBe(false);
    expect(isSafeForMakerUse(makePin({ type: 'power', gpio: undefined, mainFunctions: ['3.3 V power supply'] }))).toBe(false);
    expect(isSafeForMakerUse(makePin({ warnings: ['boot'] }))).toBe(false);
    expect(isSafeForMakerUse(makePin({ warnings: ['glitch'] }))).toBe(true);
  });
});

describe('function descriptions', () => {
  it('describes common generated function label patterns', () => {
    expect(getFunctionDescription(' GPIO10 ')).toContain('general-purpose digital I/O');
    expect(getFunctionDescription('ADC1_CH0')).toContain('analog-to-digital converter');
    expect(getFunctionDescription('USB_D+')).toContain('native USB differential data signal');
    expect(getFunctionDescription('U0TXD')).toContain('UART transmit data signal');
    expect(getFunctionDescription('FSPIIO7')).toContain('Fast SPI data line');
    expect(getFunctionDescription('NoMatchSignal')).toBeNull();
  });
});

function makePin(overrides: Partial<SocPin> = {}): SocPin {
  return {
    boardHeader: 'J1',
    boardLabel: '1',
    displayNumber: 'J1-1',
    gpio: 1,
    id: 'test-pin',
    mainFunctions: ['GPIO1'],
    name: 'GPIO1',
    number: 1,
    position: { side: 'left', order: 1 },
    type: 'io',
    ...overrides,
  };
}
