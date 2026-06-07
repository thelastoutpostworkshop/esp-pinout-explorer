import type { PinWarning, SocPin } from '@/types/soc';

export type PinWarningAudience = 'maker' | 'board-design';

interface PinWarningInfo {
  audience: PinWarningAudience;
  label: string;
}

const warningInfo: Record<PinWarning, PinWarningInfo> = {
  strapping: {
    audience: 'maker',
    label: 'Strapping',
  },
  boot: {
    audience: 'maker',
    label: 'Boot',
  },
  usb: {
    audience: 'maker',
    label: 'USB',
  },
  'flash-psram': {
    audience: 'maker',
    label: 'Flash/PSRAM',
  },
  uart0: {
    audience: 'maker',
    label: 'UART0',
  },
  reset: {
    audience: 'maker',
    label: 'Reset',
  },
  voltage: {
    audience: 'maker',
    label: 'Voltage',
  },
  jtag: {
    audience: 'board-design',
    label: 'JTAG',
  },
  glitch: {
    audience: 'board-design',
    label: 'Power-up glitch',
  },
  power: {
    audience: 'board-design',
    label: 'Power domain',
  },
};

export function getWarningLabel(warning: PinWarning) {
  return warningInfo[warning].label;
}

export function getWarningAudience(warning: PinWarning) {
  return warningInfo[warning].audience;
}

export function getMakerWarnings(warnings: PinWarning[] = []) {
  return warnings.filter((warning) => getWarningAudience(warning) === 'maker');
}

export function getBoardDesignWarnings(warnings: PinWarning[] = []) {
  return warnings.filter((warning) => getWarningAudience(warning) === 'board-design');
}

export function hasMakerWarning(pin: Pick<SocPin, 'warnings'>) {
  return getMakerWarnings(pin.warnings).length > 0;
}
