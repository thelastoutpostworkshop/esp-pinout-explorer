import { getMakerWarnings, getWarningLabel } from '@/data/pinWarnings';
import { socs } from '@/data/socs';
import type { PinWarning, SocPackageVariant, SocPin } from '@/types/soc';

export interface ModuleDataset {
  schema_version: 1;
  generated_at: string;
  modules: ModuleDefinition[];
}

export interface ModuleDefinition {
  id: string;
  name: string;
  chip_family: string;
  module_markings: string[];
  module_variant_details: Array<{
    name: string;
    antenna: string | null;
    flash: string | null;
    psram: string | null;
    footprint: string | null;
    pinout_impact: string | null;
  }>;
  route: string;
  general_purpose_candidates: string[];
  caution_pins: Array<{ gpio: string; warning: string }>;
  pin_functions: Array<{
    gpio: string;
    functions: string[];
    warnings: string[];
    notes: string[];
  }>;
  peripheral_notes: Array<{ peripheral: string; summary: string; candidate_pins: string[] }>;
  general_warnings: string[];
  sources: Array<{ title: string; url: string; sections: string[] }>;
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
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
    ...(usbPins.length ? [{ peripheral: 'Native USB', summary: 'Documented module pads with native USB data functions.', candidate_pins: usbPins.map(gpioName) }] : []),
    ...(uart0Pins.length ? [{ peripheral: 'UART0', summary: 'Documented module pads with UART0 data functions; reserve them when serial flashing or boot logs are required.', candidate_pins: uart0Pins.map(gpioName) }] : []),
  ];
}

function createModuleDefinition(chipFamily: string, profile: SocPackageVariant): ModuleDefinition {
  const gpioPins = profile.pins.filter((pin) => pin.gpio !== undefined);
  const cautionPins = gpioPins.flatMap((pin) => {
    const warnings = getMakerWarnings(pin.warnings);
    return warnings.length ? [{ gpio: gpioName(pin), warning: warningText(warnings) }] : [];
  });
  const markings = unique([...(profile.moduleNames ?? []), ...(profile.moduleVariants?.map((variant) => variant.name) ?? [])]);
  const source = profile.source;

  return {
    id: profile.id,
    name: markings[0] ?? profile.name,
    chip_family: chipFamily,
    module_markings: markings,
    module_variant_details: (profile.moduleVariants ?? []).map((variant) => ({
      name: variant.name,
      antenna: variant.antenna ?? null,
      flash: variant.flash ?? null,
      psram: variant.psram ?? null,
      footprint: variant.footprint ?? null,
      pinout_impact: variant.pinoutImpact ?? null,
    })),
    route: `/modules/${profile.id}`,
    general_purpose_candidates: gpioPins.filter(isGeneralPurposeCandidate).map(gpioName),
    caution_pins: cautionPins,
    pin_functions: gpioPins.map((pin) => ({
      gpio: gpioName(pin),
      functions: pin.mainFunctions,
      warnings: (pin.warnings ?? []).map(getWarningLabel),
      notes: pin.notes ?? [],
    })),
    peripheral_notes: peripheralNotes(gpioPins),
    general_warnings: unique([
      'Module-level guidance only: this does not identify a carrier board or guarantee that a header pin is unused.',
      'A carrier board can connect exposed GPIOs to LEDs, USB bridges, buttons, power circuitry, or other peripherals.',
      ...(profile.identificationNotes ?? []),
    ]),
    sources: source ? [{ title: source.title, url: source.url, sections: source.sections }] : [],
  };
}

/** Build public module guidance from authoritative Explorer module profiles. */
export function createModuleDataset(generatedAt = new Date().toISOString()): ModuleDataset {
  const modules = socs.flatMap((soc) => (soc.packageVariants ?? [])
    .filter((profile) => profile.kind === 'module')
    .map((profile) => createModuleDefinition(soc.name, profile)));

  return { schema_version: 1, generated_at: generatedAt, modules };
}
