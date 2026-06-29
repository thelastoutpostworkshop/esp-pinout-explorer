import { hasMakerWarning } from '@/data/pinWarnings';
import type { SocPin } from '@/types/soc';

export function isSafeForMakerUse(pin: SocPin) {
  return Boolean(
    pin.boardHeader &&
      pin.type === 'io' &&
      pin.gpio !== undefined &&
      !hasMakerWarning(pin) &&
      !pin.warnings?.includes('flash'),
  );
}
