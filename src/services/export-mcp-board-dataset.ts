import { boardRecognitionMetadata } from '@/data/mcp-board-recognition';
import { isSafeForMakerUse } from '@/data/pinSafety';
import { getMakerWarnings, getWarningLabel } from '@/data/pinWarnings';
import { socs } from '@/data/socs';
import type { PinWarning, SocDefinition, SocPackageVariant, SocPin } from '@/types/soc';

export interface BoardDataset {
  schema_version: 1;
  generated_at: string;
  boards: BoardDefinition[];
}

export interface BoardDefinition {
  id: string;
  name: string;
  manufacturer: string;
  chip_family: string;
  aliases: string[];
  module_variants: string[];
  route: string;
  recognition: {
    board_markings: string[];
    module_markings: string[];
    memory_markings: string[];
    visible_features: string[];
    button_labels: string[];
    visible_pin_labels: string[];
    header_pin_counts: number[];
    usb_connector_count?: number;
    usb_connector_types: string[];
  };
  pinout_summary: {
    safe_general_purpose_pins: string[];
    caution_pins: Array<{ gpio: string; warning: string }>;
    reserved_or_internal_pins: Array<{ gpio: string; reason: string }>;
    peripheral_notes: Array<{ peripheral: string; summary: string; candidate_pins: string[] }>;
    general_warnings: string[];
  };
}

function gpioName(pin: SocPin) {
  return `GPIO${pin.gpio}`;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function boardProfile(profileId: string) {
  for (const soc of socs) {
    const profile = soc.boardProfiles?.find((candidate) => candidate.id === profileId);
    if (profile) return { soc, profile };
  }
  return null;
}

function hasFunction(pin: SocPin, expression: RegExp) {
  return pin.mainFunctions.some((value) => expression.test(value));
}

function peripheralNotes(pins: SocPin[]) {
  const usbPins = pins.filter((pin) => pin.gpio !== undefined && hasFunction(pin, /^USB_D[+-]$/));
  const uart0Pins = pins.filter((pin) => pin.gpio !== undefined && hasFunction(pin, /^U0(?:TXD|RXD)$/));

  return [
    ...(usbPins.length
      ? [{
          peripheral: 'Native USB',
          summary: 'Header pins with documented native USB data functions.',
          candidate_pins: usbPins.map(gpioName),
        }]
      : []),
    ...(uart0Pins.length
      ? [{
          peripheral: 'UART0',
          summary: 'Header pins with documented UART0 data functions; check the pin cautions before use.',
          candidate_pins: uart0Pins.map(gpioName),
        }]
      : []),
  ];
}

function warningText(warnings: PinWarning[]) {
  return warnings.map(getWarningLabel).join(', ');
}

function createBoardDefinition(
  metadata: (typeof boardRecognitionMetadata)[number],
  soc: SocDefinition,
  profile: SocPackageVariant,
): BoardDefinition {
  const gpioPins = profile.pins.filter((pin) => pin.gpio !== undefined);
  const headerPinCounts = Object.values(
    profile.pins.reduce<Record<string, number>>((counts, pin) => {
      if (pin.boardHeader) counts[pin.boardHeader] = (counts[pin.boardHeader] ?? 0) + 1;
      return counts;
    }, {}),
  );
  const cautionPins = gpioPins.flatMap((pin) => {
    const makerWarnings = getMakerWarnings(pin.warnings);
    return makerWarnings.length ? [{ gpio: gpioName(pin), warning: warningText(makerWarnings) }] : [];
  });
  const reservedPins = gpioPins.flatMap((pin) => {
    const internalWarnings = (pin.warnings ?? []).filter((warning) => warning === 'flash' || warning === 'psram');
    return internalWarnings.length ? [{ gpio: gpioName(pin), reason: warningText(internalWarnings) }] : [];
  });

  return {
    id: metadata.apiId,
    name: 'ESP32-S3-DevKitC-1',
    manufacturer: 'Espressif',
    chip_family: soc.name,
    aliases: metadata.aliases,
    module_variants: unique([...(profile.moduleNames ?? []), ...(profile.moduleVariants?.map((variant) => variant.name) ?? [])]),
    route: `/boards/${metadata.apiId}`,
    recognition: {
      board_markings: metadata.boardMarkings,
      module_markings: unique([...(profile.moduleNames ?? []), ...(profile.moduleVariants?.map((variant) => variant.name) ?? [])]),
      memory_markings: metadata.memoryMarkings,
      visible_features: metadata.visibleFeatures,
      button_labels: metadata.buttonLabels,
      visible_pin_labels: unique(profile.pins.map((pin) => pin.boardLabel).filter((label): label is string => Boolean(label))),
      header_pin_counts: headerPinCounts,
      ...(metadata.usbConnectorCount === undefined ? {} : { usb_connector_count: metadata.usbConnectorCount }),
      usb_connector_types: metadata.usbConnectorTypes,
    },
    pinout_summary: {
      safe_general_purpose_pins: gpioPins.filter(isSafeForMakerUse).map(gpioName),
      caution_pins: cautionPins,
      reserved_or_internal_pins: reservedPins,
      peripheral_notes: peripheralNotes(gpioPins),
      general_warnings: unique([
        'Confirm the exact module variant before using header GPIOs reserved for on-module memory.',
        ...(cautionPins.length ? ['Review each listed caution before wiring a board-header GPIO.'] : []),
      ]),
    },
  };
}

/** Build the public API data without reading files or fetching at runtime. */
export function createBoardDataset(generatedAt = new Date().toISOString()): BoardDataset {
  const boards = boardRecognitionMetadata.flatMap((metadata) => {
    const resolved = boardProfile(metadata.profileId);
    return resolved ? [createBoardDefinition(metadata, resolved.soc, resolved.profile)] : [];
  });

  return { schema_version: 1, generated_at: generatedAt, boards };
}
