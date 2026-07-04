import type { BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp32DevKitCV4Profile } from '@/data/boards/esp32/devkitCV4';
import { createEsp32DevKitM1Profile } from '@/data/boards/esp32/devkitM1';
import { createEsp32PicoKitV4Profile } from '@/data/boards/esp32/picoKitV4';
import { createEsp32PicoKit1Profile } from '@/data/boards/esp32/picoKit1';
import { createEsp32PicoDevKitM2Profile } from '@/data/boards/esp32/picoDevKitM2';
import type { SocPackageVariant } from '@/types/soc';

export { createEsp32DevKitCV4Profile } from '@/data/boards/esp32/devkitCV4';
export { createEsp32DevKitM1Profile } from '@/data/boards/esp32/devkitM1';
export { createEsp32PicoKitV4Profile } from '@/data/boards/esp32/picoKitV4';
export { createEsp32PicoKit1Profile } from '@/data/boards/esp32/picoKit1';
export { createEsp32PicoDevKitM2Profile } from '@/data/boards/esp32/picoDevKitM2';
export { mini1Source, picoMini02Source, solo1Source, wroom32ESource, wroverESource } from '@/data/boards/esp32/moduleSources';

export function createEsp32BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant[] {
  return [
    createEsp32DevKitCV4Profile(resolveSourcePinByGpio),
    createEsp32DevKitM1Profile(resolveSourcePinByGpio),
    createEsp32PicoKitV4Profile(resolveSourcePinByGpio),
    createEsp32PicoKit1Profile(resolveSourcePinByGpio),
    createEsp32PicoDevKitM2Profile(resolveSourcePinByGpio),
  ];
}
