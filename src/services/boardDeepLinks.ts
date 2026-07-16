import { boardRecognitionMetadata } from '@/data/mcp-board-recognition';
import { socs } from '@/data/socs';

export interface BoardDeepLinkTarget {
  apiBoardId: string;
  socId: string;
  profileId: string;
  mode: string | null;
  highlightGpios: string[];
  searchQuery: string;
}

export interface ModuleDeepLinkTarget {
  apiModuleId: string;
  socId: string;
  profileId: string;
  searchQuery: string;
}

const boardRoutePattern = /^\/boards\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/;
const moduleRoutePattern = /^\/modules\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/;
const gpioPattern = /^GPIO(?:[0-9]|[1-9][0-9]{1,2})$/;
const modeSearchQuery: Record<string, string> = {
  gpio: 'type:io',
  i2c: 'I2C',
  spi: 'SPI',
  uart: 'UART',
  adc: 'ADC',
  pwm: 'PWM',
  touch: 'Touch',
  usb: 'USB',
  jtag: 'JTAG',
};

export function resolveBoardDeepLink(pathname: string, search = ''): BoardDeepLinkTarget | null {
  const match = boardRoutePattern.exec(pathname);
  if (!match) return null;

  const metadata = boardRecognitionMetadata.find((candidate) => candidate.apiId === match[1]);
  if (!metadata) return null;

  const soc = socs.find((candidate) => candidate.boardProfiles?.some((profile) => profile.id === metadata.profileId));
  if (!soc) return null;

  const parameters = new URLSearchParams(search);
  const requestedMode = parameters.get('mode');
  const mode = requestedMode && /^[a-z0-9-]{1,32}$/i.test(requestedMode) ? requestedMode : null;
  const highlightGpios = (parameters.get('highlight') ?? '')
    .split(',')
    .map((value) => value.trim().toUpperCase())
    .filter((value) => gpioPattern.test(value));
  const requestedSearch = parameters.get('search')?.trim() ?? '';
  const searchQuery = /^[\w\s+.-]{1,120}$/.test(requestedSearch) ? requestedSearch : '';

  return { apiBoardId: metadata.apiId, socId: soc.id, profileId: metadata.profileId, mode, highlightGpios: [...new Set(highlightGpios)], searchQuery };
}

export function resolveModuleDeepLink(pathname: string, search = ''): ModuleDeepLinkTarget | null {
  const match = moduleRoutePattern.exec(pathname);
  if (!match) return null;

  const soc = socs.find((candidate) => candidate.packageVariants?.some((profile) => profile.id === match[1] && profile.kind === 'module'));
  if (!soc) return null;

  const requestedSearch = new URLSearchParams(search).get('search')?.trim() ?? '';
  const searchQuery = /^[\w\s+.-]{1,120}$/.test(requestedSearch) ? requestedSearch : '';
  return { apiModuleId: match[1], socId: soc.id, profileId: match[1], searchQuery };
}

/** Apply a valid board route to the existing store without changing normal selection behavior. */
export function applyBoardDeepLink(
  target: BoardDeepLinkTarget,
  selectSoc: (socId: string) => void,
  selectPackage: (profileId: string) => void,
  setSearchQuery: (query: string) => void,
  selectGpio: (gpio: string) => void,
) {
  selectSoc(target.socId);
  selectPackage(target.profileId);
  setSearchQuery(target.searchQuery || (target.mode ? (modeSearchQuery[target.mode.toLowerCase()] ?? '') : ''));
  if (target.highlightGpios.length === 1) selectGpio(target.highlightGpios[0]);
}

/** Apply a valid module route to the existing store without changing normal selection behavior. */
export function applyModuleDeepLink(
  target: ModuleDeepLinkTarget,
  selectSoc: (socId: string) => void,
  selectPackage: (profileId: string) => void,
  setSearchQuery: (query: string) => void,
) {
  selectSoc(target.socId);
  selectPackage(target.profileId);
  setSearchQuery(target.searchQuery);
}
