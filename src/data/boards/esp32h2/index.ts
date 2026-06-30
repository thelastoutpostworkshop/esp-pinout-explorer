import type { BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp32h2DevKitM1Profile } from '@/data/boards/esp32h2/devkitM1';
import type { SocPackageVariant } from '@/types/soc';

export { createEsp32h2DevKitM1Profile } from '@/data/boards/esp32h2/devkitM1';
export { mini1Source } from '@/data/boards/esp32h2/moduleSources';

export function createEsp32h2BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant[] {
  return [createEsp32h2DevKitM1Profile(resolveSourcePinByGpio)];
}
