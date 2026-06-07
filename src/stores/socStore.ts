import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { socs } from '@/data/socs';
import type { SocPin } from '@/types/soc';

function normalize(value: string) {
  return value.toLowerCase().replace(/[_/+-]/g, ' ');
}

function pinSearchText(pin: SocPin) {
  return normalize(
    [
      pin.number,
      pin.name,
      pin.gpio !== undefined ? `GPIO${pin.gpio}` : '',
      ...(pin.mainFunctions ?? []),
      ...(pin.ioMux ?? []),
      ...(pin.rtc ?? []),
      ...(pin.analog ?? []),
      ...(pin.matrixSignals ?? []),
      ...(pin.notes ?? []),
      ...(pin.warnings ?? []),
      ...(pin.keywords ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

export const useSocStore = defineStore('soc', () => {
  const selectedSocId = ref('esp32s3');
  const selectedPinId = ref<string | null>(null);
  const searchQuery = ref('');

  const selectedSoc = computed(() => socs.find((soc) => soc.id === selectedSocId.value) ?? socs[0]);

  const selectedPin = computed(() =>
    selectedSoc.value.pins.find((pin) => pin.id === selectedPinId.value) ?? null,
  );

  const filteredPins = computed(() => {
    const query = normalize(searchQuery.value.trim());
    if (!query) {
      return selectedSoc.value.pins;
    }

    const tokens = query.split(/\s+/).filter(Boolean);
    return selectedSoc.value.pins.filter((pin) => {
      const text = pinSearchText(pin);
      return tokens.every((token) => text.includes(token));
    });
  });

  const filteredPinIds = computed(() => new Set(filteredPins.value.map((pin) => pin.id)));

  function selectSoc(socId: string) {
    if (socs.some((soc) => soc.id === socId)) {
      selectedSocId.value = socId;
      selectedPinId.value = null;
      searchQuery.value = '';
    }
  }

  function selectPin(pinId: string) {
    selectedPinId.value = pinId;
  }

  function clearSelectedPin() {
    selectedPinId.value = null;
  }

  function setSearchQuery(query: string) {
    searchQuery.value = query;
  }

  return {
    socs,
    selectedSocId,
    selectedSoc,
    selectedPinId,
    selectedPin,
    searchQuery,
    filteredPins,
    filteredPinIds,
    selectSoc,
    selectPin,
    clearSelectedPin,
    setSearchQuery,
  };
});
