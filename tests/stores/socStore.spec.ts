import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { hasMakerWarning } from '@/data/pinWarnings';
import { useSocStore } from '@/stores/socStore';

const profileStorageKey = 'esp-pinout-explorer:selected-profile';
const legacyProfileStorageKey = 'espsocsexplorer:selected-profile';

describe('soc store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('defaults to the ESP32-S3 DevKitC board profile', () => {
    const store = useSocStore();

    expect(store.activeView).toBe('pinout');
    expect(store.selectedSocId).toBe('esp32s3');
    expect(store.selectedPackage.id).toBe('esp32s3-devkitc-1-v1-1');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPins).toHaveLength(44);
  });

  it('persists selected SoC and profile across store instances', () => {
    const store = useSocStore();

    store.selectPackage('esp32s3-usb-otg');

    expect(window.localStorage.getItem(profileStorageKey)).toContain('esp32s3-usb-otg');
    expect(window.localStorage.getItem(legacyProfileStorageKey)).toBeNull();

    setActivePinia(createPinia());
    const restoredStore = useSocStore();

    expect(restoredStore.selectedSocId).toBe('esp32s3');
    expect(restoredStore.selectedPackage.id).toBe('esp32s3-usb-otg');

    restoredStore.selectSoc('esp32c6');

    setActivePinia(createPinia());
    const c6Store = useSocStore();

    expect(c6Store.selectedSocId).toBe('esp32c6');
    expect(c6Store.selectedPackage.id).toBe('esp32c6-devkitm-1');
  });

  it('falls back to valid defaults for stale persisted profile data', () => {
    window.localStorage.setItem(
      profileStorageKey,
      JSON.stringify({ socId: 'esp32s3', packageId: 'missing-profile' }),
    );

    const store = useSocStore();

    expect(store.selectedSocId).toBe('esp32s3');
    expect(store.selectedPackage.id).toBe('esp32s3-devkitc-1-v1-1');
  });

  it('restores module profiles selected through module marking lookup', () => {
    window.localStorage.setItem(
      profileStorageKey,
      JSON.stringify({ socId: 'esp32c6', packageId: 'esp32c6-mini-1' }),
    );

    const store = useSocStore();

    expect(store.selectedSocId).toBe('esp32c6');
    expect(store.selectedPackage.id).toBe('esp32c6-mini-1');
    expect(store.selectedPackage.kind).toBe('module');
  });

  it('selects SoC and profile from a printed module marking', () => {
    const store = useSocStore();
    const devKitVariant = store.moduleMarkingOptions.find(
      (option) => option.marking === 'ESP32-S3-WROOM-2-N32R16V' && option.profileId === 'esp32s3-devkitc-1-v1-1',
    );
    const c6Module = store.moduleMarkingOptions.find(
      (option) => option.marking === 'ESP32-C6-MINI-1' && option.profileId === 'esp32c6-mini-1',
    );

    expect(devKitVariant).toBeDefined();
    expect(c6Module).toBeDefined();
    expect(devKitVariant?.subtitle).toBe('ESP32-S3 - Dev board: DevKitC-1 v1.1 (WROOM)');
    expect(devKitVariant?.compactMarking).toBe('WROOM-2-N32R16V');

    store.selectModuleMarking(devKitVariant!.id);

    expect(store.selectedSocId).toBe('esp32s3');
    expect(store.selectedPackage.id).toBe('esp32s3-devkitc-1-v1-1');
    expect(store.selectedModuleMarkingId).toBe(devKitVariant?.id);
    expect(store.activeView).toBe('pinout');
    expect(window.localStorage.getItem(profileStorageKey)).toContain('esp32s3-devkitc-1-v1-1');

    store.selectModuleMarking(c6Module!.id);

    expect(store.selectedSocId).toBe('esp32c6');
    expect(store.selectedPackage.id).toBe('esp32c6-mini-1');
    expect(store.selectedPackage.kind).toBe('module');
    expect(store.selectedModuleMarkingId).toBe(c6Module?.id);

    store.selectModuleMarking(null);

    expect(store.selectedPackage.id).toBe('esp32c6-mini-1');
    expect(store.selectedModuleMarkingId).toBeNull();
  });

  it('reads legacy persisted profile data after the app rename', () => {
    window.localStorage.setItem(
      legacyProfileStorageKey,
      JSON.stringify({ socId: 'esp32s3', packageId: 'esp32s3-devkitm-1' }),
    );

    const store = useSocStore();

    expect(store.selectedSocId).toBe('esp32s3');
    expect(store.selectedPackage.id).toBe('esp32s3-devkitm-1');

    store.selectPackage('esp32s3-usb-otg');

    expect(window.localStorage.getItem(profileStorageKey)).toContain('esp32s3-usb-otg');
    expect(window.localStorage.getItem(legacyProfileStorageKey)).toBeNull();
  });

  it('resets selected profile state when the selected SoC changes', () => {
    const store = useSocStore();

    store.selectPin(store.selectedPins[0].id);
    store.setSearchQuery('GPIO');
    store.selectSoc('esp32c6');

    expect(store.selectedSocId).toBe('esp32c6');
    expect(store.selectedPackage.id).toBe('esp32c6-devkitm-1');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPinId).toBeNull();
    expect(store.searchQuery).toBe('');
  });

  it('ignores invalid SoC and package ids', () => {
    const store = useSocStore();

    store.selectSoc('esp32c6');
    store.selectPackage('qfn32');
    store.selectSoc('missing-soc');
    store.selectPackage('missing-package');

    expect(store.selectedSocId).toBe('esp32c6');
    expect(store.selectedPackage.id).toBe('qfn32');
  });

  it('clears a selected pin when switching profiles', () => {
    const store = useSocStore();

    store.selectSoc('esp32c6');
    store.selectPin(store.selectedPins[0].id);
    store.selectPackage('qfn32');

    expect(store.selectedPackage.id).toBe('qfn32');
    expect(store.selectedPinId).toBeNull();
  });

  it('can select the ESP32-S3 DevKitM-1 board profile', () => {
    const store = useSocStore();

    store.selectPackage('esp32s3-devkitm-1');

    expect(store.selectedPackage.name).toBe('DevKitM-1 (MINI)');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-S3-MINI-1', 'ESP32-S3-MINI-1U']);
    expect(store.selectedPins).toHaveLength(44);

    store.setSearchQuery('J3 RX');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J3-5']);

    store.setSearchQuery('mini-1');
    expect(store.filteredPins).toHaveLength(44);
  });

  it('can select the ESP32-S3 USB-OTG connector-group profile', () => {
    const store = useSocStore();

    store.selectPackage('esp32s3-usb-otg');

    expect(store.selectedPackage.name).toBe('USB-OTG (MINI)');
    expect(store.selectedPackage.boardLayout).toBe('connector-groups');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-S3-MINI-1-N8']);
    expect(store.selectedPins).toHaveLength(32);

    store.setSearchQuery('usb switch');
    expect(store.filteredPins.map((pin) => pin.boardLabel)).toEqual(['USB_SEL', 'USB_D-', 'USB_D+']);

    store.setSearchQuery('gpio48 free_3');
    expect(store.filteredPins.map((pin) => pin.boardLabel)).toEqual(['FREE_3']);

    store.setSearchQuery('mini-1-n8');
    expect(store.filteredPins).toHaveLength(32);
  });

  it('can select the ESP32-S3 USB-Bridge connector-group profile', () => {
    const store = useSocStore();

    store.selectPackage('esp32s3-usb-bridge');

    expect(store.selectedPackage.name).toBe('USB-Bridge (MINI)');
    expect(store.selectedPackage.boardLayout).toBe('connector-groups');
    expect(store.selectedPackage.boardArtwork).toBe('usb-bridge');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-S3-MINI-1-N4R2']);
    expect(store.selectedPins).toHaveLength(14);

    store.setSearchQuery('gpio2 tdo');
    expect(store.filteredPins.map((pin) => pin.boardLabel)).toEqual(['TDO']);

    store.setSearchQuery('gpio40 bridge rx');
    expect(store.filteredPins.map((pin) => pin.boardLabel)).toEqual(['RX']);

    store.setSearchQuery('mini-1-n4r2');
    expect(store.filteredPins).toHaveLength(14);
  });

  it('can select the ESP32-C6-MINI-1 module profile', () => {
    const store = useSocStore();

    store.selectSoc('esp32c6');
    store.selectPackage('esp32c6-mini-1');

    expect(store.selectedPackage.name).toBe('MINI-1');
    expect(store.selectedPackage.kind).toBe('module');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-C6-MINI-1']);
    expect(store.selectedPins).toHaveLength(53);

    store.setSearchQuery('mini-1');
    expect(store.filteredPins).toHaveLength(53);

    store.setSearchQuery('gpio12 usb');
    expect(store.filteredPins.map((pin) => pin.name)).toEqual(['IO12', 'IO13']);
  });

  it('can select the ESP32-C6-MINI-1U module profile', () => {
    const store = useSocStore();

    store.selectSoc('esp32c6');
    store.selectPackage('esp32c6-mini-1u');

    expect(store.selectedPackage.name).toBe('MINI-1U');
    expect(store.selectedPackage.kind).toBe('module');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-C6-MINI-1U']);
    expect(store.selectedPins).toHaveLength(53);

    store.setSearchQuery('mini-1u external antenna');
    expect(store.filteredPins).toHaveLength(53);

    store.setSearchQuery('gpio13 usb');
    expect(store.filteredPins.map((pin) => pin.name)).toEqual(['IO12', 'IO13']);
  });

  it('can select the ESP32-C6 DevKitM-1 board profile', () => {
    const store = useSocStore();

    store.selectSoc('esp32c6');
    store.selectPackage('esp32c6-devkitm-1');

    expect(store.selectedPackage.name).toBe('DevKitM-1 (MINI)');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-C6-MINI-1', 'ESP32-C6-MINI-1U']);
    expect(store.selectedPins).toHaveLength(30);

    store.setSearchQuery('gpio0 dtrn');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J1-7']);

    store.setSearchQuery('rgb led');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J1-9']);
  });

  it('can select the ESP32-C6 DevKitC-1 board profile', () => {
    const store = useSocStore();

    store.selectSoc('esp32c6');
    store.selectPackage('esp32c6-devkitc-1');

    expect(store.selectedPackage.name).toBe('DevKitC-1 (WROOM)');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-C6-WROOM-1', 'ESP32-C6-WROOM-1U']);
    expect(store.selectedPins).toHaveLength(32);

    store.setSearchQuery('gpio10');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J1-10']);

    store.setSearchQuery('no connection');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J1-16', 'J3-16']);

    store.setSearchQuery('wroom-1u');
    expect(store.filteredPins).toHaveLength(32);
  });

  it('can select the classic ESP32 DevKitC V4 board profile', () => {
    const store = useSocStore();

    store.selectSoc('esp32');

    expect(store.selectedPackage.id).toBe('esp32-devkitc-v4');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPackage.moduleNames).toEqual([
      'ESP32-WROOM-32E',
      'ESP32-WROOM-32UE',
      'ESP32-WROVER-E',
      'ESP32-WROVER-IE',
      'ESP32-SOLO-1',
    ]);
    expect(store.selectedPins).toHaveLength(38);

    store.setSearchQuery('j2 vp input only');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J2-3']);

    store.setSearchQuery('input only');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J2-3', 'J2-4', 'J2-5', 'J2-6']);

    store.setSearchQuery('wrover psram');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J3-11', 'J3-12']);

    store.selectPackage('esp32-qfn48-6x6');
    expect(store.selectedPins).toHaveLength(49);
  });

  it('can select the ESP32-PICO-DevKitM-2 board profile', () => {
    const store = useSocStore();

    store.selectSoc('esp32');
    store.selectPackage('esp32-pico-devkitm-2');

    expect(store.selectedPackage.name).toBe('PICO-DevKitM-2');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP32-PICO-MINI-02', 'ESP32-PICO-MINI-02U']);
    expect(store.selectedPins).toHaveLength(36);

    store.setSearchQuery('gpio20 pico');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J2-1']);

    store.setSearchQuery('usb to uart');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J2-10', 'J2-11']);

    store.setSearchQuery('mtdi voltage');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J3-10']);
  });

  it('can select the ESP8266EX QFN32 package profile', () => {
    const store = useSocStore();

    store.selectSoc('esp8266ex');
    store.selectPackage('esp8266ex-qfn32');

    expect(store.selectedPackage.id).toBe('esp8266ex-qfn32');
    expect(store.selectedPackage.kind).toBe('package');
    expect(store.selectedPins).toHaveLength(33);

    store.setSearchQuery('gpio0 download');
    expect(store.filteredPins.map((pin) => pin.name)).toEqual(['GPIO0']);

    store.setSearchQuery('external flash sdio');
    expect(store.filteredPins.map((pin) => pin.name)).toEqual([
      'SDIO_DATA_2',
      'SDIO_DATA_3',
      'SDIO_CMD',
      'SDIO_CLK',
      'SDIO_DATA_0',
      'SDIO_DATA_1',
    ]);
  });

  it('can select ESP-WROOM-02D and ESP-WROOM-02U module profiles', () => {
    const store = useSocStore();

    store.selectSoc('esp8266ex');
    store.selectPackage('esp-wroom-02d');

    expect(store.selectedPackage.name).toBe('WROOM-02D');
    expect(store.selectedPackage.kind).toBe('module');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP-WROOM-02D']);
    expect(store.selectedPins).toHaveLength(19);

    store.setSearchQuery('io15 pull down');
    expect(store.filteredPins.map((pin) => pin.name)).toEqual(['IO15']);

    store.setSearchQuery('pin 19 thermal');
    expect(store.filteredPins.map((pin) => pin.number)).toEqual([19]);

    store.selectPackage('esp-wroom-02u');

    expect(store.selectedPackage.name).toBe('WROOM-02U');
    expect(store.selectedPackage.kind).toBe('module');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP-WROOM-02U']);
    expect(store.selectedPins).toHaveLength(19);

    store.setSearchQuery('external antenna');
    expect(store.filteredPins).toHaveLength(19);
  });

  it('defaults ESP8266EX to the DevKitC board profile', () => {
    const store = useSocStore();

    store.selectSoc('esp8266ex');

    expect(store.selectedPackage.id).toBe('esp8266-devkitc');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPackage.boardLayout).toBe('connector-groups');
    expect(store.selectedPackage.boardArtwork).toBe('esp8266-devkitc');
    expect(store.selectedPackage.moduleNames).toEqual(['ESP-WROOM-02D', 'ESP-WROOM-02U']);
    expect(store.selectedPins).toHaveLength(30);

    store.setSearchQuery('boot button');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['Bottom header-11']);

    store.setSearchQuery('flow control');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['Bottom header-8', 'Bottom header-9']);

    store.setSearchQuery('micro usb power');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['Bottom header-13']);

    store.setSearchQuery('wroom-02u');
    expect(store.filteredPins).toHaveLength(30);
  });

  it('searches board labels, headers, GPIO names, functions, and multi-token matches', () => {
    const store = useSocStore();

    store.setSearchQuery('J3 TX');
    expect(store.filteredPins.map((pin) => pin.displayNumber)).toEqual(['J3-2']);

    store.setSearchQuery('GPIO38 RGB');
    expect(store.filteredPins).toHaveLength(1);
    expect(store.filteredPins[0].boardLabel).toBe('38');

    store.setSearchQuery('wroom-1');
    expect(store.filteredPins).toHaveLength(44);

    store.selectSoc('esp32c6');
    store.selectPackage('qfn40');
    store.setSearchQuery('gpio12 usb');
    expect(store.filteredPins.map((pin) => pin.gpio)).toEqual([12, 13]);

    store.setSearchQuery('gpio12 uart0');
    expect(store.filteredPins).toHaveLength(0);
  });

  it('limits safe use to board GPIO pins without maker warnings', () => {
    const store = useSocStore();

    store.setSearchQuery('safe use');
    expect(store.filteredPins.length).toBeGreaterThan(0);
    expect(store.filteredPins.every((pin) => pin.boardHeader && pin.type === 'io' && pin.gpio !== undefined)).toBe(true);
    expect(store.filteredPins.every((pin) => !hasMakerWarning(pin))).toBe(true);

    store.selectSoc('esp32');
    store.setSearchQuery('safe use');
    expect(store.filteredPins.every((pin) => !pin.warnings?.includes('flash'))).toBe(true);
    expect(store.filteredPins.map((pin) => pin.displayNumber)).not.toEqual(
      expect.arrayContaining(['J2-16', 'J2-17', 'J2-18', 'J3-17', 'J3-18', 'J3-19']),
    );

    store.selectSoc('esp32s3');
    store.selectPackage('esp32s3-qfn56');
    store.setSearchQuery('safe use');
    expect(store.filteredPins).toHaveLength(0);
  });
});
