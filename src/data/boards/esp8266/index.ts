import type { BoardProfileFactory, BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp8266DevKitCProfile } from './devkitC';
import { createEsp8266DevKitSProfile } from './devkitS';

export { wroom02Source, wroom02DuSource } from './moduleSources';

const esp8266BoardFactories: BoardProfileFactory[] = [createEsp8266DevKitCProfile, createEsp8266DevKitSProfile];

export function createEsp8266BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver) {
  return esp8266BoardFactories.map((factory) => factory(resolveSourcePinByGpio));
}
