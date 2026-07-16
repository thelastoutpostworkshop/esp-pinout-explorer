import { boardRecognitionMetadata } from '@/data/mcp-board-recognition';
import { isSafeForMakerUse } from '@/data/pinSafety';
import { getBoardDesignWarnings, getMakerWarnings, getWarningLabel } from '@/data/pinWarnings';
import { socs } from '@/data/socs';
import type { PinWarning, SocDefinition, SocPackageVariant, SocPin } from '@/types/soc';

export interface BoardDataset {
  schema_version: 1;
  generated_at: string;
  boards: BoardDefinition[];
}

export interface BoardIndexDataset {
  schema_version: 1;
  generated_at: string;
  boards: Array<Pick<BoardDefinition, 'id' | 'name' | 'manufacturer' | 'chip_family' | 'aliases' | 'module_variants' | 'route' | 'sources' | 'recognition'> & { pinout_summary: Pick<BoardDefinition['pinout_summary'], 'safe_general_purpose_pins' | 'caution_pins' | 'reserved_or_internal_pins' | 'peripheral_notes' | 'general_warnings'> }>;
}

export interface BoardDefinition {
  id: string;
  name: string;
  manufacturer: string;
  chip_family: string;
  aliases: string[];
  module_variants: string[];
  route: string;
  sources: Array<{ title: string; url: string; sections: string[] }>;
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
    pin_functions: Array<{ gpio: string; board_label: string | null; functions: string[]; warnings: string[] }>;
    pin_details: Array<{
      gpio: string;
      board_label: string | null;
      board_header: string | null;
      main_functions: string[];
      maker_warnings: string[];
      board_design_warnings: string[];
      notes: string[];
      analog: string[];
      io_mux: string[];
      matrix_signals: string[];
    }>;
    general_warnings: string[];
  };
  hardware_summary: {
    power: string[];
    programming: string[];
    onboard_hardware: string[];
    usb_connectors: { count: number | null; types: string[] };
    buttons: string[];
    documented_gpio_sharing: Array<{
      gpio: string;
      board_label: string | null;
      main_functions: string[];
      notes: string[];
      warnings: string[];
    }>;
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

function pinFunctions(pins: SocPin[]) {
  return pins
    .filter((pin) => pin.gpio !== undefined)
    .map((pin) => ({
      gpio: gpioName(pin),
      board_label: pin.boardLabel ?? null,
      functions: pin.mainFunctions,
      warnings: unique((pin.warnings ?? []).map(getWarningLabel)),
    }));
}

function pinDetails(pins: SocPin[]) {
  return pins
    .filter((pin) => pin.gpio !== undefined)
    .map((pin) => ({
      gpio: gpioName(pin),
      board_label: pin.boardLabel ?? null,
      board_header: pin.boardHeader ?? null,
      main_functions: pin.mainFunctions,
      maker_warnings: getMakerWarnings(pin.warnings).map(getWarningLabel),
      board_design_warnings: getBoardDesignWarnings(pin.warnings).map(getWarningLabel),
      notes: pin.notes ?? [],
      analog: pin.analog ?? [],
      io_mux: pin.ioMux ?? [],
      matrix_signals: pin.matrixSignals ?? [],
    }));
}

function documentedGpioSharing(pins: SocPin[]) {
  return pins
    .filter((pin) => pin.gpio !== undefined && (pin.warnings ?? []).includes('onboard'))
    .map((pin) => ({
      gpio: gpioName(pin),
      board_label: pin.boardLabel ?? null,
      main_functions: pin.mainFunctions,
      notes: pin.notes ?? [],
      warnings: (pin.warnings ?? []).map(getWarningLabel),
    }));
}

function createBoardDefinition(
  metadata: (typeof boardRecognitionMetadata)[number],
  soc: SocDefinition,
  profile: SocPackageVariant,
): BoardDefinition {
  const gpioPins = profile.pins.filter((pin) => pin.gpio !== undefined);
  const headerPinCounts = [profile.pins.filter((pin) => pin.boardHeader).length];
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
    name: metadata.boardName,
    manufacturer: 'Espressif',
    chip_family: soc.name,
    aliases: metadata.aliases,
    module_variants: unique([...(profile.moduleNames ?? []), ...(profile.moduleVariants?.map((variant) => variant.name) ?? [])]),
    route: `/boards/${metadata.apiId}`,
    sources: profile.source ? [{
      title: profile.source.title,
      url: profile.source.url,
      sections: profile.source.sections,
    }] : [],
    recognition: {
      board_markings: metadata.boardMarkings,
      module_markings: unique([...(metadata.moduleMarkings ?? []), ...(profile.moduleNames ?? []), ...(profile.moduleVariants?.map((variant) => variant.name) ?? [])]),
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
      pin_functions: pinFunctions(gpioPins),
      pin_details: pinDetails(gpioPins),
      general_warnings: unique([
        'Confirm the exact module variant before using header GPIOs reserved for on-module memory.',
        ...(cautionPins.length ? ['Review each listed caution before wiring a board-header GPIO.'] : []),
      ]),
    },
    hardware_summary: {
      power: profile.boardSpecs?.power ?? [],
      programming: profile.boardSpecs?.programming ?? [],
      onboard_hardware: profile.boardSpecs?.onBoardHardware ?? [],
      usb_connectors: {
        count: metadata.usbConnectorCount ?? null,
        types: metadata.usbConnectorTypes,
      },
      buttons: metadata.buttonLabels,
      documented_gpio_sharing: documentedGpioSharing(gpioPins),
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

/** Lightweight discovery dataset for MCP board identification. */
export function createBoardIndexDataset(generatedAt = new Date().toISOString()): BoardIndexDataset {
  const { boards } = createBoardDataset(generatedAt);
  return {
    schema_version: 1,
    generated_at: generatedAt,
    boards: boards.map(({ pinout_summary, ...board }) => ({
      ...board,
      pinout_summary: {
        safe_general_purpose_pins: pinout_summary.safe_general_purpose_pins,
        caution_pins: pinout_summary.caution_pins,
        reserved_or_internal_pins: pinout_summary.reserved_or_internal_pins,
        peripheral_notes: pinout_summary.peripheral_notes,
        general_warnings: pinout_summary.general_warnings,
      },
    })),
  };
}
