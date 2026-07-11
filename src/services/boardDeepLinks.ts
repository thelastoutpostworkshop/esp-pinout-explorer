import { boardRecognitionMetadata } from '@/data/mcp-board-recognition';
import { socs } from '@/data/socs';

export interface BoardDeepLinkTarget {
  apiBoardId: string;
  socId: string;
  profileId: string;
  mode: string | null;
  highlightGpios: string[];
}

const boardRoutePattern = /^\/boards\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/;
const gpioPattern = /^GPIO(?:[0-9]|[1-9][0-9]{1,2})$/;

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

  return { apiBoardId: metadata.apiId, socId: soc.id, profileId: metadata.profileId, mode, highlightGpios: [...new Set(highlightGpios)] };
}

/** Apply a valid board route to the existing store without changing normal selection behavior. */
export function applyBoardDeepLink(
  target: BoardDeepLinkTarget,
  selectSoc: (socId: string) => void,
  selectPackage: (profileId: string) => void,
) {
  selectSoc(target.socId);
  selectPackage(target.profileId);
}
