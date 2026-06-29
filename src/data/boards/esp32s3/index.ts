import type { BoardSourcePinResolver } from '@/data/boards/helpers';
import { createEsp32s3DevKitC1V11Profile } from '@/data/boards/esp32s3/devkitC1V11';
import { createEsp32s3DevKitM1Profile } from '@/data/boards/esp32s3/devkitM1';
import { createEsp32s3UsbBridgeProfile } from '@/data/boards/esp32s3/usbBridge';
import { createEsp32s3UsbOtgProfile } from '@/data/boards/esp32s3/usbOtg';
import type { SocPackageVariant } from '@/types/soc';

export { createEsp32s3DevKitC1V11Profile } from '@/data/boards/esp32s3/devkitC1V11';
export { createEsp32s3DevKitM1Profile } from '@/data/boards/esp32s3/devkitM1';
export { createEsp32s3UsbOtgProfile } from '@/data/boards/esp32s3/usbOtg';
export { createEsp32s3UsbBridgeProfile } from '@/data/boards/esp32s3/usbBridge';
export {
  esp32s3Mini1ModuleSource,
  esp32s3Wroom1ModuleSource,
  esp32s3Wroom2ModuleSource,
} from '@/data/boards/esp32s3/moduleSources';

export function createEsp32s3BoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant[] {
  return [
    createEsp32s3DevKitC1V11Profile(resolveSourcePinByGpio),
    createEsp32s3DevKitM1Profile(resolveSourcePinByGpio),
    createEsp32s3UsbOtgProfile(resolveSourcePinByGpio),
    createEsp32s3UsbBridgeProfile(resolveSourcePinByGpio),
  ];
}
