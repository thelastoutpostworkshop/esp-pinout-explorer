import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { isSafeForMakerUse } from '@/data/pinSafety';
import { getBoardDesignWarnings, hasMakerWarning } from '@/data/pinWarnings';
import { socs } from '@/data/socs';
import type { SocDefinition, SocPackageVariant, SocPin } from '@/types/soc';

const profileStorageKey = 'esp-pinout-explorer:selected-profile';
const legacyProfileStorageKey = 'espsocsexplorer:selected-profile';

interface PersistedProfileSelection {
  socId: string;
  packageId: string;
}

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
      pin.boardGroup ?? '',
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
      isSafeForMakerUse(pin) ? 'safe use maker safe recommended gpio' : '',
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
  const initialSelection = readInitialSelection();
  const selectedSocId = ref(initialSelection.socId);
  const selectedPackageId = ref<string | null>(initialSelection.packageId);
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
      persistSelectedProfile(selectedSocId.value, selectedPackageId.value);
    }
  }

  function selectPackage(packageId: string) {
    if (packageOptions.value.some((packageOption) => packageOption.id === packageId)) {
      selectedPackageId.value = packageId;
      selectedPinId.value = null;
      persistSelectedProfile(selectedSocId.value, selectedPackageId.value);
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

function readInitialSelection(): PersistedProfileSelection {
  const fallbackSoc = socs[0];
  const fallbackProfile = defaultProfileForSoc(fallbackSoc);
  const fallback = { socId: fallbackSoc.id, packageId: fallbackProfile.id };
  const persisted = readPersistedProfile();

  if (!persisted) {
    return fallback;
  }

  const soc = socs.find((candidate) => candidate.id === persisted.socId);
  if (!soc) {
    return fallback;
  }

  const profile = buildPackageOptions(soc).find((candidate) => candidate.id === persisted.packageId);
  return {
    socId: soc.id,
    packageId: profile?.id ?? defaultProfileForSoc(soc).id,
  };
}

function readPersistedProfile(): PersistedProfileSelection | null {
  try {
    const rawValue = window.localStorage.getItem(profileStorageKey) ?? window.localStorage.getItem(legacyProfileStorageKey);
    if (!rawValue) {
      return null;
    }

    const parsed = JSON.parse(rawValue) as Partial<PersistedProfileSelection>;
    if (typeof parsed.socId === 'string' && typeof parsed.packageId === 'string') {
      return {
        socId: parsed.socId,
        packageId: parsed.packageId,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function persistSelectedProfile(socId: string, packageId: string) {
  try {
    window.localStorage.setItem(profileStorageKey, JSON.stringify({ socId, packageId }));
    window.localStorage.removeItem(legacyProfileStorageKey);
  } catch {
    // Ignore storage failures so the explorer still works in restricted browsing modes.
  }
}
