import { describe, expect, it } from 'vitest';
import { socs } from '@/data/socs';
import type { PinSide, PinType, PinWarning, SocDefinition, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

const pinTypes: readonly PinType[] = ['io', 'analog', 'power', 'ground', 'control'];
const pinSides: readonly PinSide[] = ['left', 'bottom', 'right', 'top', 'center'];
const pinWarnings: readonly PinWarning[] = [
  'strapping',
  'boot',
  'usb',
  'flash',
  'psram',
  'jtag',
  'uart0',
  'onboard',
  'glitch',
  'power',
  'reset',
  'voltage',
];

const expectedPinCounts: Record<string, number> = {
  'esp32s3:esp32s3-qfn56': 57,
  'esp32s3:esp32s3-devkitc-1-v1-1': 44,
  'esp32c6:qfn40': 41,
  'esp32c6:qfn32': 33,
};

interface ProfileEntry {
  soc: SocDefinition;
  id: string;
  kind: 'package' | 'board';
  packageName: string;
  source?: SocSource;
  pins: SocPin[];
}

function profilesForSoc(soc: SocDefinition): ProfileEntry[] {
  return [
    {
      soc,
      id: soc.defaultPackageId ?? 'default',
      kind: 'package',
      packageName: soc.packageName,
      source: soc.source,
      pins: soc.pins,
    },
    ...(soc.packageVariants ?? []).map((profile) => packageProfile(soc, profile)),
    ...(soc.boardProfiles ?? []).map((profile) => boardProfile(soc, profile)),
  ];
}

function packageProfile(soc: SocDefinition, profile: SocPackageVariant): ProfileEntry {
  return {
    soc,
    id: profile.id,
    kind: profile.kind ?? 'package',
    packageName: profile.packageName,
    source: profile.source,
    pins: profile.pins,
  };
}

function boardProfile(soc: SocDefinition, profile: SocPackageVariant): ProfileEntry {
  return {
    soc,
    id: profile.id,
    kind: 'board',
    packageName: profile.packageName,
    source: profile.source,
    pins: profile.pins,
  };
}

function allProfiles() {
  return socs.flatMap(profilesForSoc);
}

function expectValidSource(source: SocSource) {
  expect(source.title.trim()).not.toBe('');
  expect(source.version.trim()).not.toBe('');
  expect(source.url).toMatch(/^https:\/\//);
  expect(source.sections.length).toBeGreaterThan(0);
  expect(source.sections.every((section) => section.trim().length > 0)).toBe(true);
}

describe('SoC data invariants', () => {
  it('keeps implemented profile counts explicit', () => {
    const implementedProfiles = allProfiles().map((profile) => `${profile.soc.id}:${profile.id}`).sort();

    expect(implementedProfiles).toEqual(Object.keys(expectedPinCounts).sort());

    for (const profile of allProfiles()) {
      expect(profile.pins).toHaveLength(expectedPinCounts[`${profile.soc.id}:${profile.id}`]);
    }
  });

  it('has complete SoC, profile, and source metadata', () => {
    const socIds = new Set<string>();

    for (const soc of socs) {
      expect(socIds.has(soc.id)).toBe(false);
      socIds.add(soc.id);

      expect(soc.id.trim()).not.toBe('');
      expect(soc.name.trim()).not.toBe('');
      expect(soc.family.trim()).not.toBe('');
      expect(soc.packageName.trim()).not.toBe('');
      expect(soc.description.trim()).not.toBe('');
      expectValidSource(soc.source);

      const profileIds = new Set<string>();
      for (const profile of profilesForSoc(soc)) {
        expect(profileIds.has(profile.id)).toBe(false);
        profileIds.add(profile.id);
        expect(profile.id.trim()).not.toBe('');
        expect(profile.packageName.trim()).not.toBe('');
        expectValidSource(profile.source ?? soc.source);
      }

      expect(profileIds.has(soc.defaultPackageId ?? 'default')).toBe(true);
      if (soc.defaultProfileId) {
        expect(profileIds.has(soc.defaultProfileId)).toBe(true);
      }
    }
  });

  it('keeps package pins well-formed and position-stable', () => {
    for (const profile of allProfiles().filter((item) => item.kind === 'package')) {
      const pinIds = new Set<string>();
      const pinNumbers = new Set<number>();
      const positions = new Set<string>();

      for (const pin of profile.pins) {
        expectValidPin(pin);
        expect(pinIds.has(pin.id)).toBe(false);
        pinIds.add(pin.id);

        expect(pinNumbers.has(pin.number)).toBe(false);
        pinNumbers.add(pin.number);

        const positionKey = `${pin.position.side}:${pin.position.order}`;
        expect(positions.has(positionKey)).toBe(false);
        positions.add(positionKey);
      }

      expect([...pinNumbers].sort((a, b) => a - b)).toEqual(range(1, profile.pins.length));
    }
  });

  it('keeps board header pins mapped back to package GPIO metadata', () => {
    for (const profile of allProfiles().filter((item) => item.kind === 'board')) {
      const displayNumbers = new Set<string>();
      const positions = new Set<string>();
      const packagePinsByGpio = new Map(profile.soc.pins.filter((pin) => pin.gpio !== undefined).map((pin) => [pin.gpio, pin]));

      for (const pin of profile.pins) {
        expectValidPin(pin);
        expect(pin.displayNumber).toBe(`${pin.boardHeader}-${pin.number}`);
        expect(pin.boardHeader).toMatch(/^J\d+$/);
        expect(pin.boardLabel?.trim()).not.toBe('');
        expect(pin.position.side === 'left' || pin.position.side === 'right').toBe(true);

        expect(displayNumbers.has(pin.displayNumber ?? '')).toBe(false);
        displayNumbers.add(pin.displayNumber ?? '');

        const positionKey = `${pin.position.side}:${pin.position.order}`;
        expect(positions.has(positionKey)).toBe(false);
        positions.add(positionKey);

        if (pin.gpio !== undefined) {
          const sourcePin = packagePinsByGpio.get(pin.gpio);
          expect(sourcePin, `${profile.id} ${pin.displayNumber} GPIO${pin.gpio} should map to a package pin`).toBeDefined();
          expect(pin.mainFunctions).toContain(`GPIO${pin.gpio}`);

          for (const warning of sourcePin?.warnings ?? []) {
            expect(pin.warnings ?? []).toContain(warning);
          }
        }
      }
    }
  });
});

function expectValidPin(pin: SocPin) {
  expect(pin.id.trim()).not.toBe('');
  expect(Number.isInteger(pin.number)).toBe(true);
  expect(pin.number).toBeGreaterThan(0);
  expect(pin.name.trim()).not.toBe('');
  expect(pinTypes).toContain(pin.type);
  expect(pinSides).toContain(pin.position.side);
  expect(Number.isInteger(pin.position.order)).toBe(true);
  expect(pin.position.order).toBeGreaterThan(0);
  expect(pin.mainFunctions.length).toBeGreaterThan(0);
  expect(pin.mainFunctions.every((item) => item.trim().length > 0)).toBe(true);

  if (pin.type === 'io') {
    expect(Number.isInteger(pin.gpio)).toBe(true);
    expect(pin.gpio).toBeGreaterThanOrEqual(0);
  }

  for (const warning of pin.warnings ?? []) {
    expect(pinWarnings).toContain(warning);
  }

  expect((pin.ioMux ?? []).every((item) => item.trim().length > 0)).toBe(true);
  expect((pin.rtc ?? []).every((item) => item.trim().length > 0)).toBe(true);
  expect((pin.analog ?? []).every((item) => item.trim().length > 0)).toBe(true);
  expect((pin.matrixSignals ?? []).every((item) => item.trim().length > 0)).toBe(true);
  expect((pin.notes ?? []).every((item) => item.trim().length > 0)).toBe(true);
  expect((pin.keywords ?? []).every((item) => item.trim().length > 0)).toBe(true);
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
