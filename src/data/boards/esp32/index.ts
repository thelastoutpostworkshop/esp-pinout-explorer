import { createEsp32DevKitCV4Profile } from '@/data/boards/esp32/devkitCV4';
import { createEsp32DevKitM1Profile } from '@/data/boards/esp32/devkitM1';
import type { SocPackageVariant, SocPin } from '@/types/soc';

export { createEsp32DevKitCV4Profile } from '@/data/boards/esp32/devkitCV4';
export { createEsp32DevKitM1Profile } from '@/data/boards/esp32/devkitM1';
export { mini1Source, solo1Source, wroom32ESource, wroverESource } from '@/data/boards/esp32/moduleSources';

type SourcePinResolver = (gpio: number | undefined) => SocPin | undefined;

export function createEsp32BoardProfiles(resolveSourcePinByGpio: SourcePinResolver): SocPackageVariant[] {
  return [
    createEsp32DevKitCV4Profile(resolveSourcePinByGpio),
    createEsp32DevKitM1Profile(resolveSourcePinByGpio),
  ];
}
