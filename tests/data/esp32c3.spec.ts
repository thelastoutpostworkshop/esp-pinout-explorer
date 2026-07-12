import { describe, expect, it } from 'vitest';
import { esp32c3 } from '@/data/socs/esp32c3';

describe('ESP32-C3 data', () => {
  it('keeps the two official QFN32 bonding variants distinct', () => {
    const reducedPackage = esp32c3.packageVariants?.find((profile) => profile.id === 'esp32c3-qfn32-16-gpio');

    expect(esp32c3.pins.find((pin) => pin.number === 19)).toMatchObject({ gpio: 12, name: 'SPIHD' });
    expect(reducedPackage?.pins.find((pin) => pin.number === 19)).toMatchObject({ name: 'NC', gpio: undefined });
    expect(reducedPackage?.pins.filter((pin) => pin.name === 'NC').map((pin) => pin.number)).toEqual([19, 20, 21, 22, 23, 24]);
  });

  it('preserves authoritative C3 cautions and module-only pad layouts', () => {
    const gpio8 = esp32c3.pins.find((pin) => pin.gpio === 8);
    const gpio12 = esp32c3.pins.find((pin) => pin.gpio === 12);
    const mini = esp32c3.packageVariants?.find((profile) => profile.id === 'esp32c3-mini-1');
    const wroom = esp32c3.packageVariants?.find((profile) => profile.id === 'esp32c3-wroom-02');

    expect(gpio8?.warnings).toEqual(expect.arrayContaining(['strapping', 'boot']));
    expect(gpio12?.warnings).toContain('flash');
    expect(mini?.pins.find((pin) => pin.number === 30)).toMatchObject({ name: 'RXD0', gpio: 20 });
    expect(wroom?.pins.find((pin) => pin.number === 11)).toMatchObject({ name: 'RXD', gpio: 20 });
  });
});
