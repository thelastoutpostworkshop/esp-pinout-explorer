import type { BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp32c6DevKitC1Profile } from '@/data/boards/esp32c6/devkitC1';
import { createEsp32c6DevKitM1Profile } from '@/data/boards/esp32c6/devkitM1';
import type { SocPackageVariant } from '@/types/soc';

export { createEsp32c6DevKitC1Profile } from '@/data/boards/esp32c6/devkitC1';
export { createEsp32c6DevKitM1Profile } from '@/data/boards/esp32c6/devkitM1';
export { mini1Source, wroom1Source } from '@/data/boards/esp32c6/moduleSources';

export function createEsp32c6BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant[] {
  return [
    createEsp32c6DevKitM1Profile(resolveSourcePinByGpio),
    createEsp32c6DevKitC1Profile(resolveSourcePinByGpio),
  ];
}
