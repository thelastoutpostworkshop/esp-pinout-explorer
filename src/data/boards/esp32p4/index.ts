import type { BoardProfileFactory, BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp32p4FunctionEvBoardProfile } from './functionEvBoard';
import { createEsp32p4XEyeBoardProfile } from './p4xEye';

const esp32p4BoardFactories: BoardProfileFactory[] = [createEsp32p4FunctionEvBoardProfile, createEsp32p4XEyeBoardProfile];

export function createEsp32p4BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver) {
  return esp32p4BoardFactories.map((factory) => factory(resolveSourcePinByGpio));
}
