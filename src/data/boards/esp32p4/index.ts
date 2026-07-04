import type { BoardProfileFactory, BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp32p4FunctionEvBoardProfile, createEsp32p4FunctionEvBoardV152Profile } from './functionEvBoard';
import { createEsp32p4EyeBoardProfile } from './p4Eye';
import { createEsp32p4XEyeBoardProfile } from './p4xEye';

const esp32p4BoardFactories: BoardProfileFactory[] = [
  createEsp32p4FunctionEvBoardProfile,
  createEsp32p4XEyeBoardProfile,
  createEsp32p4FunctionEvBoardV152Profile,
  createEsp32p4EyeBoardProfile,
];

export function createEsp32p4BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver) {
  return esp32p4BoardFactories.map((factory) => factory(resolveSourcePinByGpio));
}
