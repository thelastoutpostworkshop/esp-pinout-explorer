import { getMakerWarnings, getWarningLabel } from '@/data/pinWarnings';
import { socs } from '@/data/socs';
import type { PinWarning, SocDefinition, SocPin } from '@/types/soc';

export interface ChipDataset {
  schema_version: 1;
  generated_at: string;
  chips: ChipDefinition[];
}

export interface ChipDefinition {
  id: string;
  name: string;
  chip_family: string;
  package_name: string;
  route: string | null;
  raw_pin_data_available: boolean;
  chip_specs: {
    cpu: string | null;
    wireless: string | null;
    sram: string | null;
    rom: string | null;
  };
  general_purpose_candidates: string[];
  caution_pins: Array<{ gpio: string; warning: string }>;
  pin_functions: Array<{
    gpio: string;
    functions: string[];
    warnings: string[];
    notes: string[];
    analog: string[];
    io_mux: string[];
    matrix_signals: string[];
  }>;
  peripheral_notes: Array<{ peripheral: string; summary: string; candidate_pins: string[] }>;
  general_warnings: string[];
  sources: Array<{ title: string; url: string; sections: string[] }>;
}

function gpioName(pin: SocPin) {
  return `GPIO${pin.gpio}`;
}

function warningText(warnings: PinWarning[]) {
  return warnings.map(getWarningLabel).join(', ');
}

function isGeneralPurposeCandidate(pin: SocPin) {
  const warnings = pin.warnings ?? [];
  return pin.type === 'io'
    && pin.gpio !== undefined
    && !warnings.some((warning) => ['strapping', 'boot', 'usb', 'uart0', 'flash', 'psram', 'onboard', 'power', 'reset', 'voltage'].includes(warning));
}

function peripheralNotes(pins: SocPin[]) {
  const usbPins = pins.filter((pin) => pin.gpio !== undefined && pin.mainFunctions.some((value) => /^USB_D[+-]$/.test(value)));
  const uart0Pins = pins.filter((pin) => pin.gpio !== undefined && pin.mainFunctions.some((value) => /^U0(?:TXD|RXD)$/.test(value)));

  return [
    ...(usbPins.length ? [{ peripheral: 'Native USB', summary: 'Documented raw-chip USB data GPIOs.', candidate_pins: usbPins.map(gpioName) }] : []),
    ...(uart0Pins.length ? [{ peripheral: 'UART0', summary: 'Documented raw-chip UART0 data GPIOs; reserve them when serial flashing or boot logs are required.', candidate_pins: uart0Pins.map(gpioName) }] : []),
  ];
}

function createChipDefinition(soc: SocDefinition): ChipDefinition {
  const gpioPins = soc.pins.filter((pin) => pin.gpio !== undefined);
  const hasRawPinData = soc.pins.length > 0;
  const cautionPins = gpioPins.flatMap((pin) => {
    const makerWarnings = getMakerWarnings(pin.warnings);
    return makerWarnings.length ? [{ gpio: gpioName(pin), warning: warningText(makerWarnings) }] : [];
  });

  return {
    id: soc.id,
    name: soc.name,
    chip_family: soc.name,
    package_name: soc.packageName,
    route: hasRawPinData ? `/chips/${soc.id}` : null,
    raw_pin_data_available: hasRawPinData,
    chip_specs: {
      cpu: soc.chipSpecs?.cpu ?? null,
      wireless: soc.chipSpecs?.wireless ?? null,
      sram: soc.chipSpecs?.sram ?? null,
      rom: soc.chipSpecs?.rom ?? null,
    },
    general_purpose_candidates: gpioPins.filter(isGeneralPurposeCandidate).map(gpioName),
    caution_pins: cautionPins,
    pin_functions: gpioPins.map((pin) => ({
      gpio: gpioName(pin),
      functions: pin.mainFunctions,
      warnings: (pin.warnings ?? []).map(getWarningLabel),
      notes: pin.notes ?? [],
      analog: pin.analog ?? [],
      io_mux: pin.ioMux ?? [],
      matrix_signals: pin.matrixSignals ?? [],
    })),
    peripheral_notes: peripheralNotes(gpioPins),
    general_warnings: [
      'Raw-chip guidance only: this does not identify a module or carrier board, verify header exposure, or guarantee that a GPIO is unused by carrier hardware.',
      ...(hasRawPinData
        ? []
        : ['Explorer does not yet export a source-backed raw package pin map for this chip family; do not infer GPIO assignments from board profiles.']),
    ],
    sources: [{ title: soc.source.title, url: soc.source.url, sections: soc.source.sections }],
  };
}

/** Build public raw-chip fallback guidance from Explorer's authoritative SoC definitions. */
export function createChipDataset(generatedAt = new Date().toISOString()): ChipDataset {
  return {
    schema_version: 1,
    generated_at: generatedAt,
    chips: socs.map(createChipDefinition),
  };
}
