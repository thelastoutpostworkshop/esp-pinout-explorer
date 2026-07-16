import { describe, expect, it } from 'vitest';
import { applyBoardDeepLink, resolveBoardDeepLink, resolveModuleDeepLink } from '@/services/boardDeepLinks';

describe('board deep links', () => {
  it('safely ignores unknown or malformed board routes', () => {
    expect(resolveBoardDeepLink('/boards/not-a-board')).toBeNull();
    expect(resolveBoardDeepLink('/boards/ESP32-S3-DEVKITC-1')).toBeNull();
    expect(resolveBoardDeepLink('/boards/esp32-s3-devkitc-1/extra')).toBeNull();
  });

  it('resolves a valid board route and validates optional query values', () => {
    expect(resolveBoardDeepLink('/boards/esp32-s3-devkitc-1', '?mode=i2c&highlight=GPIO8%2CGPIO9%2Cbad&search=I2C')).toEqual({
      apiBoardId: 'esp32-s3-devkitc-1',
      socId: 'esp32s3',
      profileId: 'esp32s3-devkitc-1-v1-1',
      mode: 'i2c',
      highlightGpios: ['GPIO8', 'GPIO9'],
      searchQuery: 'I2C',
    });
  });

  it('resolves a newly published official DevKit route', () => {
    expect(resolveBoardDeepLink('/boards/esp32-c6-devkitc-1')).toMatchObject({
      apiBoardId: 'esp32-c6-devkitc-1',
      socId: 'esp32c6',
      profileId: 'esp32c6-devkitc-1',
    });
  });

  it('uses a mode as the Explorer search when no explicit search is supplied', () => {
    const target = resolveBoardDeepLink('/boards/esp32-s3-devkitc-1', '?mode=touch')!;
    const selected: string[] = [];
    applyBoardDeepLink(target, (id) => selected.push(id), (id) => selected.push(id), (query) => selected.push(query));
    expect(selected).toEqual(['esp32s3', 'esp32s3-devkitc-1-v1-1', 'Touch']);
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

  it('resolves the USB-OTG profile', () => {
    expect(resolveBoardDeepLink('/boards/esp32s3-usb-otg')).toMatchObject({
      apiBoardId: 'esp32s3-usb-otg',
      socId: 'esp32s3',
      profileId: 'esp32s3-usb-otg',
    });
  });

  it('resolves the P4X-EYE profile', () => {
    expect(resolveBoardDeepLink('/boards/esp32p4x-eye')).toMatchObject({
      apiBoardId: 'esp32p4x-eye',
      socId: 'esp32p4',
      profileId: 'esp32p4x-eye',
    });
  });

  it('resolves the ESP8266-DevKitC profile', () => {
    expect(resolveBoardDeepLink('/boards/esp8266-devkitc')).toMatchObject({
      apiBoardId: 'esp8266-devkitc',
      socId: 'esp8266ex',
      profileId: 'esp8266-devkitc',
    });
  });

  it('resolves the LCDKit carrier profile', () => {
    expect(resolveBoardDeepLink('/boards/esp32-lcdkit')).toMatchObject({
      apiBoardId: 'esp32-lcdkit',
      socId: 'esp32',
      profileId: 'esp32-lcdkit',
    });
  });
});

describe('module deep links', () => {
  it('resolves an ESP32-C3-MINI-1 module route', () => {
    expect(resolveModuleDeepLink('/modules/esp32c3-mini-1')).toEqual({
      apiModuleId: 'esp32c3-mini-1',
      socId: 'esp32c3',
      profileId: 'esp32c3-mini-1',
      searchQuery: '',
    });
  });

  it('preserves a module pin-function search query', () => {
    expect(resolveModuleDeepLink('/modules/esp32c3-mini-1', '?search=JTAG')).toMatchObject({
      profileId: 'esp32c3-mini-1',
      searchQuery: 'JTAG',
    });
  });

  it('rejects unknown module routes', () => {
    expect(resolveModuleDeepLink('/modules/unknown-module')).toBeNull();
  });
});
