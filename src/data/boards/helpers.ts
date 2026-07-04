import type { PinPosition, PinType, PinWarning, SocPackageVariant, SocPin } from '@/types/soc';

export type BoardSourcePinResolver = (gpio: number | undefined) => SocPin | undefined;

export type BoardProfileFactory = (resolveSourcePinByGpio: BoardSourcePinResolver) => SocPackageVariant;

export interface BoardPinInput {
  id: string;
  number: number;
  displayNumber: string;
  label: string;
  type: PinType;
  gpio?: number;
  position: PinPosition;
  mainFunctions: string[];
  boardHeader?: string;
  boardGroup?: string;
  name?: string;
  sourcePin?: SocPin;
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
  baseKeywords?: string[];
  note?: string;
  inheritSourceNotes?: boolean;
  inheritSourceWarnings?: boolean;
  inheritSourceKeywords?: boolean;
  omitSourceNotes?: string[];
  omitSourceWarnings?: PinWarning[];
  omitSourceKeywords?: string[];
}

export function boardGpioLabel(gpio: number | undefined) {
  return gpio !== undefined ? `GPIO${gpio}` : '';
}

export function boardPinName(label: string, gpio: number | undefined, keepLabelFor: string[] = ['TX', 'RX']) {
  if (gpio === undefined || keepLabelFor.includes(label)) {
    return label;
  }

  return boardGpioLabel(gpio);
}

export function makeBoardPin(input: BoardPinInput): SocPin {
  const inheritSourceNotes = input.inheritSourceNotes ?? true;
  const inheritSourceWarnings = input.inheritSourceWarnings ?? true;
  const inheritSourceKeywords = input.inheritSourceKeywords ?? true;
  const sourceNotes = inheritSourceNotes
    ? (input.sourcePin?.notes ?? []).filter((note) => !(input.omitSourceNotes ?? []).includes(note))
    : [];
  const sourceWarnings = inheritSourceWarnings
    ? (input.sourcePin?.warnings ?? []).filter((warning) => !(input.omitSourceWarnings ?? []).includes(warning))
    : [];
  const sourceKeywords = inheritSourceKeywords
    ? (input.sourcePin?.keywords ?? []).filter((keyword) => !(input.omitSourceKeywords ?? []).includes(keyword))
    : [];

  return {
    id: input.id,
    number: input.number,
    displayNumber: input.displayNumber,
    name: input.name ?? boardPinName(input.label, input.gpio),
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.boardHeader,
    boardLabel: input.label,
    boardGroup: input.boardGroup,
    position: input.position,
    mainFunctions: uniqueValues([boardGpioLabel(input.gpio), ...input.mainFunctions].filter(Boolean)),
    ioMux: input.sourcePin?.ioMux,
    rtc: input.sourcePin?.rtc,
    analog: input.sourcePin?.analog,
    matrixSignals: input.sourcePin?.matrixSignals,
    notes: uniqueValues([input.note, ...(input.notes ?? []), ...sourceNotes].filter(Boolean) as string[]),
    warnings: uniqueValues([...(input.warnings ?? []), ...sourceWarnings]),
    keywords: uniqueValues([
      ...(input.baseKeywords ?? []),
      input.boardHeader ?? '',
      input.boardGroup ?? '',
      input.displayNumber,
      input.label,
      boardGpioLabel(input.gpio),
      ...(input.keywords ?? []),
      ...sourceKeywords,
    ].filter(Boolean)),
  };
}

export function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}
