export type PinType = 'io' | 'analog' | 'power' | 'ground' | 'control';

export type PinSide = 'left' | 'bottom' | 'right' | 'top' | 'center';

export type PinProfileKind = 'package' | 'board';

export type BoardLayout = 'dual-header' | 'connector-groups';

export type PinWarning =
  | 'strapping'
  | 'boot'
  | 'usb'
  | 'flash'
  | 'psram'
  | 'jtag'
  | 'uart0'
  | 'onboard'
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
  displayNumber?: string;
  name: string;
  type: PinType;
  gpio?: number;
  boardHeader?: string;
  boardLabel?: string;
  boardGroup?: string;
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
  publisher: 'Espressif';
  documentType: 'datasheet' | 'user-guide' | 'schematic' | 'documentation';
  url: string;
  sections: string[];
  figures?: SocSourceFigure[];
}

export interface SocSourceFigure {
  title: string;
  kind: 'board-photo' | 'component-layout' | 'pin-layout' | 'block-diagram' | 'schematic-excerpt';
  url: string;
  alt: string;
  sourceSection: string;
}

export interface SocPackageVariant {
  id: string;
  name: string;
  packageName: string;
  kind?: PinProfileKind;
  boardLayout?: BoardLayout;
  source?: SocSource;
  moduleNames?: string[];
  identificationNotes?: string[];
  pins: SocPin[];
}

export interface SocDefinition {
  id: string;
  name: string;
  family: string;
  defaultPackageId?: string;
  defaultProfileId?: string;
  packageName: string;
  description: string;
  source: SocSource;
  pins: SocPin[];
  packageVariants?: SocPackageVariant[];
  boardProfiles?: SocPackageVariant[];
}
