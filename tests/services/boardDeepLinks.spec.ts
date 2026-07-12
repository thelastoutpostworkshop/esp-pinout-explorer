import { describe, expect, it } from 'vitest';
import { resolveBoardDeepLink } from '@/services/boardDeepLinks';

describe('board deep links', () => {
  it('safely ignores unknown or malformed board routes', () => {
    expect(resolveBoardDeepLink('/boards/not-a-board')).toBeNull();
    expect(resolveBoardDeepLink('/boards/ESP32-S3-DEVKITC-1')).toBeNull();
    expect(resolveBoardDeepLink('/boards/esp32-s3-devkitc-1/extra')).toBeNull();
  });

  it('resolves a valid board route and validates optional query values', () => {
    expect(resolveBoardDeepLink('/boards/esp32-s3-devkitc-1', '?mode=i2c&highlight=GPIO8%2CGPIO9%2Cbad')).toEqual({
      apiBoardId: 'esp32-s3-devkitc-1',
      socId: 'esp32s3',
      profileId: 'esp32s3-devkitc-1-v1-1',
      mode: 'i2c',
      highlightGpios: ['GPIO8', 'GPIO9'],
    });
  });

  it('resolves a newly published official DevKit route', () => {
    expect(resolveBoardDeepLink('/boards/esp32-c6-devkitc-1')).toMatchObject({
      apiBoardId: 'esp32-c6-devkitc-1',
      socId: 'esp32c6',
      profileId: 'esp32c6-devkitc-1',
    });
  });

  it('resolves the classic DevKitC V4 compatibility profile', () => {
    expect(resolveBoardDeepLink('/boards/esp32-devkitc-v4')).toMatchObject({
      apiBoardId: 'esp32-devkitc-v4',
      socId: 'esp32',
      profileId: 'esp32-devkitc-v4',
    });
  });

  it('resolves the classic PICO-DevKitM-2 profile', () => {
    expect(resolveBoardDeepLink('/boards/esp32-pico-devkitm-2')).toMatchObject({
      apiBoardId: 'esp32-pico-devkitm-2',
      socId: 'esp32',
      profileId: 'esp32-pico-devkitm-2',
    });
  });

  it('resolves the Ethernet-Kit profile', () => {
    expect(resolveBoardDeepLink('/boards/esp32-ethernet-kit-v1-2')).toMatchObject({
      apiBoardId: 'esp32-ethernet-kit-v1-2',
      socId: 'esp32',
      profileId: 'esp32-ethernet-kit-v1-2',
    });
  });
});
