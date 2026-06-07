export type PinType = 'io' | 'analog' | 'power' | 'ground';

export type PinSide = 'left' | 'bottom' | 'right' | 'top' | 'center';

export type PinWarning =
  | 'strapping'
  | 'boot'
  | 'usb'
  | 'flash'
  | 'psram'
  | 'jtag'
  | 'uart0'
  | 'glitch'
  | 'power'
  | 'reset'
  | 'voltage';

export interface PinPosition {
  side: PinSide;
  order: number;
}

export interface SocPin {
  id: string;
  number: number;
  name: string;
  type: PinType;
  gpio?: number;
  position: PinPosition;
  mainFunctions: string[];
  ioMux?: string[];
  rtc?: string[];
  analog?: string[];
  matrixSignals?: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

export interface SocSource {
  title: string;
  version: string;
  url: string;
  sections: string[];
}

export interface SocPackageVariant {
  id: string;
  name: string;
  packageName: string;
  pins: SocPin[];
}

export interface SocDefinition {
  id: string;
  name: string;
  family: string;
  defaultPackageId?: string;
  packageName: string;
  description: string;
  source: SocSource;
  pins: SocPin[];
  packageVariants?: SocPackageVariant[];
}
