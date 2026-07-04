import { describe, expect, it } from 'vitest';
import { socs } from '@/data/socs';
import type {
  PinSide,
  PinProfileKind,
  PinType,
  PinWarning,
  SocDefinition,
  SocModuleVariant,
  SocPackageVariant,
  SocPin,
  SocSource,
} from '@/types/soc';

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

const sourceDocumentTypes: readonly SocSource['documentType'][] = ['datasheet', 'user-guide', 'schematic', 'documentation'];
const sourceFigureKinds: readonly NonNullable<SocSource['figures']>[number]['kind'][] = [
  'board-photo',
  'component-layout',
  'pin-layout',
  'block-diagram',
  'schematic-excerpt',
];

const officialEspressifHosts = new Set([
  'docs.espressif.com',
  'documentation.espressif.com',
  'www.espressif.com',
  'dl.espressif.com',
]);

const expectedPinCounts: Record<string, number> = {
  'esp32:esp32-qfn48-6x6': 49,
  'esp32:esp32-devkitc-v4': 38,
  'esp32:esp32-devkitm-1': 34,
  'esp32:esp32-ethernet-kit-v1-2': 16,
  'esp32:esp-wrover-kit-v4-1': 67,
  'esp32:esp32-pico-devkitm-2': 36,
  'esp32:esp32-pico-kit-v4': 40,
  'esp32:esp32-pico-kit-1': 36,
  'esp32:esp32-lcdkit': 63,
  'esp32s3:esp32s3-qfn56': 57,
  'esp32s3:esp32s3-devkitc-1-v1-1': 44,
  'esp32s3:esp32s3-devkitm-1': 44,
  'esp32s3:esp32s3-usb-otg': 32,
  'esp32s3:esp32s3-usb-bridge': 14,
  'esp32s3:esp32s3-lcd-ev-board-v1-5': 57,
  'esp32s3:esp-vocat-v1-2': 32,
  'esp32s3:esp-dualkey': 17,
  'esp32c6:qfn40': 41,
  'esp32c6:qfn32': 33,
  'esp32c6:esp32c6-mini-1': 53,
  'esp32c6:esp32c6-mini-1u': 53,
  'esp32c6:esp32c6-devkitm-1': 30,
  'esp32c6:esp32c6-devkitc-1': 32,
  'esp32h2:esp32h2-qfn32': 33,
  'esp32h2:esp32h2-devkitm-1': 30,
  'esp8266ex:esp8266ex-qfn32': 33,
  'esp8266ex:esp-wroom-02d': 19,
  'esp8266ex:esp-wroom-02u': 19,
  'esp8266ex:esp8266-devkitc': 30,
  'esp8266ex:esp8266-devkits': 30,
};

interface ProfileEntry {
  soc: SocDefinition;
  id: string;
  kind: PinProfileKind;
  boardLayout?: SocPackageVariant['boardLayout'];
  boardSpecs?: SocPackageVariant['boardSpecs'];
  packageName: string;
  source?: SocSource;
  moduleNames?: string[];
  moduleVariants?: SocModuleVariant[];
  identificationNotes?: string[];
  pins: SocPin[];
}

function profilesForSoc(soc: SocDefinition): ProfileEntry[] {
  return [
    {
      soc,
      id: soc.defaultPackageId ?? 'default',
      kind: 'package',
      boardLayout: undefined,
      boardSpecs: undefined,
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
    boardLayout: profile.boardLayout,
    boardSpecs: profile.boardSpecs,
    packageName: profile.packageName,
    source: profile.source,
    moduleNames: profile.moduleNames,
    moduleVariants: profile.moduleVariants,
    identificationNotes: profile.identificationNotes,
    pins: profile.pins,
  };
}

function boardProfile(soc: SocDefinition, profile: SocPackageVariant): ProfileEntry {
  return {
    soc,
    id: profile.id,
    kind: 'board',
    boardLayout: profile.boardLayout,
    boardSpecs: profile.boardSpecs,
    packageName: profile.packageName,
    source: profile.source,
    moduleNames: profile.moduleNames,
    moduleVariants: profile.moduleVariants,
    identificationNotes: profile.identificationNotes,
    pins: profile.pins,
  };
}

function allProfiles() {
  return socs.flatMap(profilesForSoc);
}

function expectValidSource(source: SocSource) {
  expect(source.title.trim()).not.toBe('');
  expect(source.version.trim()).not.toBe('');
  expect(source.publisher).toBe('Espressif');
  expect(sourceDocumentTypes).toContain(source.documentType);
  expectOfficialEspressifUrl(source.url);
  expect(source.sections.length).toBeGreaterThan(0);
  expect(source.sections.every((section) => section.trim().length > 0)).toBe(true);

  for (const figure of source.figures ?? []) {
    expect(figure.title.trim()).not.toBe('');
    expect(sourceFigureKinds).toContain(figure.kind);
    expectOfficialEspressifUrl(figure.url);
    expect(figure.alt.trim()).not.toBe('');
    expect(figure.sourceSection.trim()).not.toBe('');
  }
}

function expectOfficialEspressifUrl(url: string) {
  const parsed = new URL(url);

  expect(parsed.protocol).toBe('https:');
  expect(officialEspressifHosts.has(parsed.hostname)).toBe(true);
}

function isAllowedBoardSourceWarningOverride(profile: ProfileEntry, pin: SocPin, warning: PinWarning) {
  if (profile.id === 'esp32-devkitm-1' && warning === 'flash' && (pin.gpio === 9 || pin.gpio === 10)) {
    return true;
  }

  if (profile.id === 'esp32-pico-kit-1' && warning === 'flash' && [7, 8, 9, 10].includes(pin.gpio ?? -1)) {
    return true;
  }

  return profile.id === 'esp32-pico-devkitm-2' && warning === 'flash' && (pin.gpio === 7 || pin.gpio === 8);
}

function isAllowedModuleOnlyBoardGpio(profile: ProfileEntry, pin: SocPin) {
  return (profile.id === 'esp32-pico-devkitm-2' || profile.id === 'esp32-pico-kit-1') && pin.gpio === 20;
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
      expect(soc.chipSpecs?.cpu.trim()).not.toBe('');
      expectValidSource(soc.source);

      const profileIds = new Set<string>();
      for (const profile of profilesForSoc(soc)) {
        expect(profileIds.has(profile.id)).toBe(false);
        profileIds.add(profile.id);
        expect(profile.id.trim()).not.toBe('');
        expect(profile.packageName.trim()).not.toBe('');
        expectValidSource(profile.source ?? soc.source);
        if (profile.kind === 'board') {
          expect(profile.source?.figures?.length).toBeGreaterThan(0);
        }
      }

      expect(profileIds.has(soc.defaultPackageId ?? 'default')).toBe(true);
      if (soc.defaultProfileId) {
        expect(profileIds.has(soc.defaultProfileId)).toBe(true);
      }
    }
  });

  it('keeps package pins well-formed and position-stable', () => {
    for (const profile of allProfiles().filter((item) => item.kind !== 'board')) {
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
      const isConnectorGroupLayout = profile.boardLayout === 'connector-groups';
      const displayNumbers = new Set<string>();
      const positions = new Set<string>();
      const packagePinsByGpio = new Map(
        [
          ...profile.soc.pins,
          ...(profile.soc.packageVariants ?? [])
            .filter((packageProfile) => (packageProfile.kind ?? 'package') !== 'board')
            .flatMap((packageProfile) => packageProfile.pins),
        ]
          .filter((pin) => pin.gpio !== undefined)
          .map((pin) => [pin.gpio, pin]),
      );

      for (const pin of profile.pins) {
        expectValidPin(pin);
        expect(pin.displayNumber?.trim()).not.toBe('');
        expect(pin.boardLabel?.trim()).not.toBe('');

        if (isConnectorGroupLayout) {
          expect(pin.boardHeader?.trim()).not.toBe('');
          expect(pin.boardGroup?.trim()).not.toBe('');
        } else {
          expect(pin.displayNumber).toBe(`${pin.boardHeader}-${pin.number}`);
          expect(pin.boardHeader).toMatch(/^(J\d+|GPIO Header \d+)$/);
          expect(pin.position.side === 'left' || pin.position.side === 'right').toBe(true);
        }

        expect(displayNumbers.has(pin.displayNumber ?? '')).toBe(false);
        displayNumbers.add(pin.displayNumber ?? '');

        const positionKey = `${pin.position.side}:${pin.position.order}`;
        expect(positions.has(positionKey)).toBe(false);
        positions.add(positionKey);

        if (pin.gpio !== undefined) {
          const sourcePin = packagePinsByGpio.get(pin.gpio);
          if (isAllowedModuleOnlyBoardGpio(profile, pin)) {
            expect(sourcePin).toBeUndefined();
          } else {
            expect(sourcePin, `${profile.id} ${pin.displayNumber} GPIO${pin.gpio} should map to a package pin`).toBeDefined();
          }
          expect(pin.mainFunctions).toContain(`GPIO${pin.gpio}`);

          if (!isConnectorGroupLayout && sourcePin) {
            for (const warning of sourcePin?.warnings ?? []) {
              if (isAllowedBoardSourceWarningOverride(profile, pin, warning)) {
                continue;
              }
              expect(pin.warnings ?? []).toContain(warning);
            }
          }
        }
      }
    }
  });

  it('records maker-visible module identity for board profiles', () => {
    for (const profile of allProfiles().filter((item) => item.kind === 'board')) {
      expect(profile.moduleNames?.length).toBeGreaterThan(0);
      expect(profile.moduleNames?.every((name) => name.startsWith('ESP'))).toBe(true);
      expect(profile.moduleVariants?.length).toBeGreaterThan(0);
      for (const variant of profile.moduleVariants ?? []) {
        expectValidModuleVariant(variant);
      }
      expect(profile.identificationNotes?.length).toBeGreaterThan(0);
      expect(profile.identificationNotes?.every((note) => note.trim().length > 0)).toBe(true);
      expect(profile.identificationNotes?.some((note) => note.includes('carrier PCB'))).toBe(true);
      expect(profile.boardSpecs?.power.length).toBeGreaterThan(0);
      expect(profile.boardSpecs?.programming.length).toBeGreaterThan(0);
      expect(profile.boardSpecs?.onBoardHardware.length).toBeGreaterThan(0);
      expect(profile.boardSpecs?.power.every((item) => item.trim().length > 0)).toBe(true);
      expect(profile.boardSpecs?.programming.every((item) => item.trim().length > 0)).toBe(true);
      expect(profile.boardSpecs?.onBoardHardware.every((item) => item.trim().length > 0)).toBe(true);
    }
  });

  it('keeps module pad profiles separate from dev-board profiles', () => {
    const moduleProfiles = allProfiles().filter((item) => item.kind === 'module');

    expect(moduleProfiles.map((profile) => `${profile.soc.id}:${profile.id}`).sort()).toEqual([
      'esp32c6:esp32c6-mini-1',
      'esp32c6:esp32c6-mini-1u',
      'esp8266ex:esp-wroom-02d',
      'esp8266ex:esp-wroom-02u',
    ]);

    for (const profile of moduleProfiles) {
      expect(profile.packageName.toLowerCase()).toContain('module');
      expect(profile.moduleNames?.length).toBeGreaterThan(0);
      expect(profile.moduleVariants?.length).toBeGreaterThan(0);
      for (const variant of profile.moduleVariants ?? []) {
        expectValidModuleVariant(variant);
      }
      expect(profile.identificationNotes?.some((note) => note.includes('not the bare'))).toBe(true);
      expect(profile.boardLayout).toBeUndefined();
    }
  });

  it('keeps ESP8266-DevKitC as two dense 15-pin connector rows', () => {
    const profile = allProfiles().find((item) => item.id === 'esp8266-devkitc');
    const topPins = profile?.pins.filter((pin) => pin.boardHeader === 'Top header') ?? [];
    const bottomPins = profile?.pins.filter((pin) => pin.boardHeader === 'Bottom header') ?? [];

    expect(profile?.boardLayout).toBe('connector-groups');
    expect(topPins).toHaveLength(15);
    expect(bottomPins).toHaveLength(15);
    expect(topPins.every((pin) => pin.position.side === 'top')).toBe(true);
    expect(bottomPins.every((pin) => pin.position.side === 'bottom')).toBe(true);
    expect(topPins.map((pin) => pin.position.order).sort((a, b) => a - b)).toEqual(range(1, 15));
    expect(bottomPins.map((pin) => pin.position.order).sort((a, b) => a - b)).toEqual(range(1, 15));
  });

  it('keeps ESP8266-DevKitS as two 15-pin side headers', () => {
    const profile = allProfiles().find((item) => item.id === 'esp8266-devkits');
    const leftPins = profile?.pins.filter((pin) => pin.boardHeader === 'J1') ?? [];
    const rightPins = profile?.pins.filter((pin) => pin.boardHeader === 'J2') ?? [];

    expect(profile?.boardLayout).toBe('dual-header');
    expect(leftPins).toHaveLength(15);
    expect(rightPins).toHaveLength(15);
    expect(leftPins.every((pin) => pin.position.side === 'left')).toBe(true);
    expect(rightPins.every((pin) => pin.position.side === 'right')).toBe(true);
    expect(leftPins.map((pin) => pin.position.order).sort((a, b) => a - b)).toEqual(range(1, 15));
    expect(rightPins.map((pin) => pin.position.order).sort((a, b) => a - b)).toEqual(range(1, 15));
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

function expectValidModuleVariant(variant: SocModuleVariant) {
  expect(variant.name.trim()).not.toBe('');
  expect(variant.name).toMatch(/^ESP/);
  expect(variant.antenna?.trim()).not.toBe('');
  expect(variant.flash?.trim()).not.toBe('');
  expect(variant.psram?.trim()).not.toBe('');
  expect(variant.footprint?.trim()).not.toBe('');
  expect(variant.pinoutImpact?.trim()).not.toBe('');
  expectValidSource(variant.source!);
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
