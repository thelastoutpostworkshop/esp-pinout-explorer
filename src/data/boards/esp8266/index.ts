import type { BoardProfileFactory, BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp8266DevKitCProfile } from './devkitC';

export { wroom02DuSource } from './moduleSources';

const esp8266BoardFactories: BoardProfileFactory[] = [createEsp8266DevKitCProfile];

export function createEsp8266BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver) {
  return esp8266BoardFactories.map((factory) => factory(resolveSourcePinByGpio));
}
