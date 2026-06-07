import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { socs } from '@/data/socs';
import type { SocDefinition, SocPackageVariant, SocPin } from '@/types/soc';

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
  const selectedPackageId = ref<string | null>(null);
  const selectedPinId = ref<string | null>(null);
  const searchQuery = ref('');

  const selectedSoc = computed(() => socs.find((soc) => soc.id === selectedSocId.value) ?? socs[0]);

  const packageOptions = computed(() => buildPackageOptions(selectedSoc.value));

  const selectedPackage = computed(() => {
    return (
      packageOptions.value.find((packageOption) => packageOption.id === selectedPackageId.value) ??
      packageOptions.value[0]
    );
  });

  const selectedPins = computed(() => selectedPackage.value.pins);

  const selectedPin = computed(() => selectedPins.value.find((pin) => pin.id === selectedPinId.value) ?? null);

  const filteredPins = computed(() => {
    const query = normalize(searchQuery.value.trim());
    if (!query) {
      return selectedPins.value;
    }

    const tokens = query.split(/\s+/).filter(Boolean);
    return selectedPins.value.filter((pin) => {
      const text = pinSearchText(pin);
      return tokens.every((token) => text.includes(token));
    });
  });

  const filteredPinIds = computed(() => new Set(filteredPins.value.map((pin) => pin.id)));

  function selectSoc(socId: string) {
    const soc = socs.find((candidate) => candidate.id === socId);
    if (soc) {
      selectedSocId.value = socId;
      selectedPackageId.value = buildPackageOptions(soc)[0].id;
      selectedPinId.value = null;
      searchQuery.value = '';
    }
  }

  function selectPackage(packageId: string) {
    if (packageOptions.value.some((packageOption) => packageOption.id === packageId)) {
      selectedPackageId.value = packageId;
      selectedPinId.value = null;
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
    selectedPackageId,
    packageOptions,
    selectedPackage,
    selectedPins,
    selectedPinId,
    selectedPin,
    searchQuery,
    filteredPins,
    filteredPinIds,
    selectSoc,
    selectPackage,
    selectPin,
    clearSelectedPin,
    setSearchQuery,
  };
});

function buildPackageOptions(soc: SocDefinition): SocPackageVariant[] {
  return [
    {
      id: soc.defaultPackageId ?? 'default',
      name: soc.packageName.split(' ')[0],
      packageName: soc.packageName,
      pins: soc.pins,
    },
    ...(soc.packageVariants ?? []),
  ];
}
