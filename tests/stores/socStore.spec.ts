import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { hasMakerWarning } from '@/data/pinWarnings';
import { useSocStore } from '@/stores/socStore';

describe('soc store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('defaults to the ESP32-S3 DevKitC board profile', () => {
    const store = useSocStore();

    expect(store.selectedSocId).toBe('esp32s3');
    expect(store.selectedPackage.id).toBe('esp32s3-devkitc-1-v1-1');
    expect(store.selectedPackage.kind).toBe('board');
    expect(store.selectedPins).toHaveLength(44);
  });

  it('persists selected SoC and profile across store instances', () => {
    const store = useSocStore();

    store.selectPackage('esp32s3-usb-otg');

    setActivePinia(createPinia());
    const restoredStore = useSocStore();

    expect(restoredStore.selectedSocId).toBe('esp32s3');
    expect(restoredStore.selectedPackage.id).toBe('esp32s3-usb-otg');

    restoredStore.selectSoc('esp32c6');

    setActivePinia(createPinia());
    const c6Store = useSocStore();

    expect(c6Store.selectedSocId).toBe('esp32c6');
    expect(c6Store.selectedPackage.id).toBe('qfn40');
  });

  it('falls back to valid defaults for stale persisted profile data', () => {
    window.localStorage.setItem(
      'espsocsexplorer:selected-profile',
      JSON.stringify({ socId: 'esp32s3', packageId: 'missing-profile' }),
    );

    const store = useSocStore();

    expect(store.selectedSocId).toBe('esp32s3');
    expect(store.selectedPackage.id).toBe('esp32s3-devkitc-1-v1-1');
  });

  it('resets selected profile state when the selected SoC changes', () => {
    const store = useSocStore();

    store.selectPin(store.selectedPins[0].id);
    store.setSearchQuery('GPIO');
    store.selectSoc('esp32c6');

    expect(store.selectedSocId).toBe('esp32c6');
    expect(store.selectedPackage.id).toBe('qfn40');
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

    store.selectPackage('esp32s3-qfn56');
    store.setSearchQuery('safe use');
    expect(store.filteredPins).toHaveLength(0);
  });
});
