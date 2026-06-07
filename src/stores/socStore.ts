import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { getBoardDesignWarnings, hasMakerWarning } from '@/data/pinWarnings';
import { socs } from '@/data/socs';
import type { SocDefinition, SocPackageVariant, SocPin } from '@/types/soc';

function normalize(value: string) {
  return value.toLowerCase().replace(/[_/+-]/g, ' ');
}

function pinSearchText(pin: SocPin) {
  const typeSearchText = pin.type === 'io' ? 'type:io gpio' : `type:${pin.type}`;
  return normalize(
    [
      pin.number,
      pin.displayNumber ?? '',
      pin.name,
      pin.boardHeader ?? '',
      pin.boardLabel ?? '',
      typeSearchText,
      pin.gpio !== undefined ? `GPIO${pin.gpio}` : '',
      ...(pin.mainFunctions ?? []),
      ...(pin.ioMux ?? []),
      ...(pin.rtc ?? []),
      ...(pin.analog ?? []),
      ...(pin.matrixSignals ?? []),
      ...(pin.notes ?? []),
      pin.warnings?.length ? 'warning' : '',
      hasMakerWarning(pin) ? 'maker warning' : '',
      getBoardDesignWarnings(pin.warnings).length ? 'board design note advanced warning' : '',
      ...(pin.warnings ?? []),
      ...(pin.keywords ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );
}

function filterPinsByQuery(pins: SocPin[], search: string) {
  const query = normalize(search.trim());
  if (!query) {
    return pins;
  }

  const tokens = query.split(/\s+/).filter(Boolean);
  return pins.filter((pin) => {
    const text = pinSearchText(pin);
    return tokens.every((token) => text.includes(token));
  });
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
      defaultProfileForSoc(selectedSoc.value)
    );
  });

  const selectedPins = computed(() => selectedPackage.value.pins);

  const selectedPin = computed(() => selectedPins.value.find((pin) => pin.id === selectedPinId.value) ?? null);

  const filteredPins = computed(() => filterPinsByQuery(selectedPins.value, searchQuery.value));

  const filteredPinIds = computed(() => new Set(filteredPins.value.map((pin) => pin.id)));

  function selectSoc(socId: string) {
    const soc = socs.find((candidate) => candidate.id === socId);
    if (soc) {
      selectedSocId.value = socId;
      selectedPackageId.value = defaultProfileForSoc(soc).id;
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

  function countPinsForQuery(query: string) {
    return filterPinsByQuery(selectedPins.value, query).length;
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
    countPinsForQuery,
  };
});

function buildPackageOptions(soc: SocDefinition): SocPackageVariant[] {
  return [
    {
      id: soc.defaultPackageId ?? 'default',
      name: soc.packageName.split(' ')[0],
      packageName: soc.packageName,
      kind: 'package',
      pins: soc.pins,
    },
    ...(soc.packageVariants ?? []),
    ...(soc.boardProfiles ?? []),
  ];
}

function defaultProfileForSoc(soc: SocDefinition): SocPackageVariant {
  const options = buildPackageOptions(soc);
  return options.find((option) => option.id === soc.defaultProfileId) ?? options[0];
}
