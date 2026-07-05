<template>
  <section class="profile-navigator" aria-label="Profile navigation">
    <v-select
      :model-value="store.selectedSocId"
      class="profile-navigator__select profile-navigator__select--chip"
      density="compact"
      hide-details
      item-title="name"
      item-value="id"
      label="ESP chip"
      :items="store.socs"
      variant="outlined"
      @update:model-value="selectSoc"
    />

    <v-autocomplete
      v-if="selectableProfileOptions.length > 0"
      :model-value="store.selectedPackageId"
      class="profile-navigator__select profile-navigator__select--profile"
      :custom-filter="filterProfile"
      density="compact"
      hide-details
      item-title="name"
      item-value="id"
      label="Board / module / chip profile"
      :items="profileSelectItems"
      variant="outlined"
      @update:model-value="selectPackage"
    >
      <template #item="{ props, item }">
        <v-divider v-if="item.startsGroup && !item.isFirstGroup" class="profile-select__divider" />
        <v-list-subheader v-if="item.startsGroup" class="profile-select__header">
          {{ item.groupLabel }}
        </v-list-subheader>
        <v-list-item
          v-bind="props"
          class="profile-select__item"
          :subtitle="profileVariantSummary(item)"
          :title="item.name"
        />
      </template>
    </v-autocomplete>

    <v-autocomplete
      :model-value="store.selectedModuleMarkingId"
      v-model:search="moduleMarkingSearch"
      class="profile-navigator__select profile-navigator__select--module"
      clearable
      :custom-filter="filterModuleMarking"
      density="compact"
      hide-details
      :item-props="moduleMarkingItemProps"
      item-title="marking"
      item-value="id"
      label="Module marking"
      :items="moduleMarkingSelectItems"
      placeholder="Find printed marking"
      variant="outlined"
      @update:model-value="selectModuleMarking"
    >
      <template #item="{ props, item }">
        <v-divider
          v-if="moduleMarkingSlotItem(item).startsChipGroup && !moduleMarkingSlotItem(item).isFirstChipGroup"
          class="module-marking-select__chip-divider"
        />
        <v-list-subheader
          v-if="moduleMarkingSlotItem(item).startsChipGroup"
          class="module-marking-select__chip-header"
        >
          {{ moduleMarkingSlotItem(item).chipGroupLabel }}
        </v-list-subheader>
        <v-list-subheader
          v-if="moduleMarkingSlotItem(item).startsProfileGroup"
          class="module-marking-select__profile-header"
        >
          {{ moduleMarkingSlotItem(item).profileGroupLabel }}
        </v-list-subheader>
        <v-list-item
          v-bind="moduleMarkingListItemProps(props)"
          class="module-marking-select__item"
        >
          <span class="module-marking-select__row">
            <span class="module-marking-select__marking">{{ moduleMarkingSlotItem(item).marking }}</span>
            <span v-if="moduleMarkingSlotItem(item).duplicateProfileLabel" class="module-marking-select__profile-tag">
              {{ moduleMarkingSlotItem(item).duplicateProfileLabel }}
            </span>
          </span>
        </v-list-item>
      </template>
    </v-autocomplete>

    <button
      class="profile-navigator__info-button"
      type="button"
      aria-label="Open profile information"
      @click="openProfileInfo"
    >
      <PanelRightOpen :size="16" aria-hidden="true" />
      <span>Profile info & Variants</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { PanelRightOpen } from '@lucide/vue';
import { useSocStore } from '@/stores/socStore';
import type { ModuleMarkingOption } from '@/stores/socStore';
import type { PinProfileKind, SocModuleVariant, SocPackageVariant } from '@/types/soc';

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();
const moduleMarkingSearch = ref('');
const selectableProfileOptions = computed(() => store.packageOptions);
const profileSelectItems = computed(() =>
  [...selectableProfileOptions.value]
    .sort((first, second) => profileKindRank(profileKind(first)) - profileKindRank(profileKind(second)))
    .map((profile, index, profiles) => ({
      ...profile,
      groupLabel: profileKindPluralLabel(profileKind(profile)),
      isFirstGroup: index === 0,
      startsGroup: index === 0 || profileKind(profiles[index - 1]) !== profileKind(profile),
    })),
);
const sortedModuleMarkingOptions = computed(() =>
  [...store.moduleMarkingOptions]
    .sort(
      (first, second) =>
        first.socName.localeCompare(second.socName) ||
        moduleMarkingKindRank(first.profileKind) - moduleMarkingKindRank(second.profileKind) ||
        first.marking.localeCompare(second.marking) ||
        first.profileName.localeCompare(second.profileName),
    )
);
const moduleMarkingSelectItems = computed(() =>
  groupModuleMarkingOptions(
    sortedModuleMarkingOptions.value.filter((option) => moduleMarkingMatchesQuery(option, moduleMarkingSearch.value)),
  ),
);

function groupModuleMarkingOptions(options: ModuleMarkingOption[]): ModuleMarkingSelectItem[] {
  const duplicateCounts = options.reduce((counts, option) => {
    const key = moduleMarkingDuplicateKey(option);
    counts.set(key, (counts.get(key) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());

  return options.map((option, index) => ({
      ...option,
      chipGroupLabel: option.socName,
      profileGroupLabel: moduleMarkingKindGroupLabel(option.profileKind),
      duplicateProfileLabel: (duplicateCounts.get(moduleMarkingDuplicateKey(option)) ?? 0) > 1 ? option.profileName : '',
      isFirstChipGroup: index === 0,
      startsChipGroup: index === 0 || options[index - 1].socName !== option.socName,
      startsProfileGroup:
        index === 0 || options[index - 1].socName !== option.socName || options[index - 1].profileKind !== option.profileKind,
    }));
}

type ProfileSelectItem = SocPackageVariant & {
  groupLabel: string;
  isFirstGroup: boolean;
  startsGroup: boolean;
};
type ModuleMarkingSelectItem = ModuleMarkingOption & {
  chipGroupLabel: string;
  duplicateProfileLabel: string;
  profileGroupLabel: string;
  isFirstChipGroup: boolean;
  startsChipGroup: boolean;
  startsProfileGroup: boolean;
};
type VuetifySlotItem<T> = T & {
  raw?: T;
};

function selectSoc(socId: string) {
  store.selectSoc(socId);
  emit('changed');
}

function selectPackage(packageId: string | null) {
  store.selectPackage(packageId);
  emit('changed');
}

function selectModuleMarking(optionId: string | null) {
  store.selectModuleMarking(optionId);
  emit('changed');
}

function profileKind(profile: Pick<SocPackageVariant, 'kind'>): PinProfileKind {
  return profile.kind ?? 'package';
}

function profileKindRank(kind: PinProfileKind) {
  return {
    board: 0,
    module: 1,
    package: 2,
  }[kind];
}

function profileKindPluralLabel(kind: PinProfileKind) {
  return {
    board: 'Dev boards',
    module: 'Module pads',
    package: 'Chip packages',
  }[kind];
}

function moduleMarkingKindRank(kind: PinProfileKind) {
  return {
    board: 0,
    module: 1,
    package: 2,
  }[kind];
}

function moduleMarkingKindGroupLabel(kind: PinProfileKind) {
  return {
    board: 'Dev boards',
    module: 'Module pads',
    package: 'Chip packages',
  }[kind];
}

function profileVariantSummary(profile: SocPackageVariant) {
  const kind = profileKind(profile);

  if (kind === 'module') {
    return 'PCB/module pads, not dev-board headers.';
  }

  if (kind !== 'board') {
    return '';
  }

  const variantNames = profile.moduleVariants?.length
    ? profile.moduleVariants.map((variant) => compactVariantName(variant.name))
    : profile.moduleNames?.map(compactVariantName) ?? [];

  if (!variantNames.length) {
    return '';
  }

  return `${variantNames.length === 1 ? 'Variant' : 'Variants'}: ${variantNames.join(' / ')}`;
}

function filterProfile(_value: string, query: string, item?: { raw?: ProfileSelectItem }) {
  const profile = item?.raw;
  if (!profile) {
    return false;
  }

  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return true;
  }

  const searchableText = normalizeSearch(
    [
      profile.name,
      profile.packageName,
      profile.description,
      profile.groupLabel,
      ...(profile.moduleNames ?? []),
      ...(profile.moduleVariants ?? []).flatMap(moduleVariantSearchValues),
      ...(profile.identificationNotes ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );

  return tokens.every((token) => searchableText.includes(token));
}

function filterModuleMarking(_value: string, query: string, item?: { raw?: ModuleMarkingOption }) {
  const option = item?.raw;
  if (!option) {
    return false;
  }

  return moduleMarkingMatchesQuery(option, query);
}

function moduleMarkingMatchesQuery(option: ModuleMarkingOption, query: string) {
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) {
    return true;
  }

  const searchableText = shouldSearchExactMarking(query, tokens) ? option.markingSearchText : option.searchText;
  return tokens.every((token) => searchTextMatchesToken(searchableText, token));
}

function moduleMarkingItemProps(option: ModuleMarkingOption) {
  return {
    title: option.marking,
  };
}

function moduleMarkingSlotItem(item: VuetifySlotItem<ModuleMarkingSelectItem>): ModuleMarkingSelectItem {
  return item.raw ?? item;
}

function moduleMarkingListItemProps(props: Record<string, unknown>) {
  const { title: _title, subtitle: _subtitle, ...listItemProps } = props;
  return listItemProps;
}

function moduleMarkingDuplicateKey(option: Pick<ModuleMarkingOption, 'marking' | 'profileKind' | 'socName'>) {
  return `${option.socName}|${option.profileKind}|${option.marking}`;
}

function moduleVariantSearchValues(variant: SocModuleVariant) {
  return [
    variant.name,
    compactVariantName(variant.name),
    variant.antenna,
    variant.flash,
    variant.psram,
    variant.footprint,
    variant.pinoutImpact,
    variant.source?.title,
  ];
}

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[_/+-]/g, ' ');
}

function searchTextMatchesToken(text: string, token: string) {
  if (token.length === 1) {
    return text.split(/\s+/).some((candidate) => candidate === token);
  }

  if (!tokenHasDigit(token)) {
    return text.includes(token);
  }

  return text.split(/\s+/).some((candidate) => digitTokenMatches(candidate, token));
}

function digitTokenMatches(candidate: string, token: string) {
  if (candidate === token) {
    return true;
  }

  if (!candidate.startsWith(token)) {
    return false;
  }

  return !/^\d+$/.test(token) || !/\d/.test(candidate.charAt(token.length));
}

function tokenHasDigit(token: string) {
  return /\d/.test(token);
}

function shouldSearchExactMarking(query: string, tokens: string[]) {
  return /[_/+-]/.test(query) || tokens.some((token) => tokenHasDigit(token) || token.length === 1);
}

function compactVariantName(name: string) {
  const socPrefix = `${store.selectedSoc.name}-`;
  return name.startsWith(socPrefix) ? name.slice(socPrefix.length) : name;
}

function openProfileInfo() {
  store.openProfileInfo();
  emit('changed');
}
</script>

<style scoped>
.profile-navigator {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.profile-navigator__select {
  min-width: 0;
}

.profile-navigator__select--chip {
  flex: 0 1 170px;
  min-width: 150px;
}

.profile-navigator__select--profile {
  flex: 1 1 240px;
  min-width: 190px;
}

.profile-navigator__select--module {
  flex: 1 1 230px;
  min-width: 190px;
}

:deep(.profile-select__divider) {
  margin: 8px 0 4px;
}

:deep(.profile-select__header) {
  min-height: 34px;
  border-top: 1px solid color-mix(in srgb, var(--app-link) 24%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--app-link) 18%, transparent);
  background: color-mix(in srgb, var(--app-active-bg) 82%, var(--app-surface-bg));
}

:deep(.profile-select__header .v-list-subheader__text) {
  color: var(--app-active-text);
  font-size: 0.82rem;
  font-weight: 950;
  letter-spacing: 0;
  text-transform: uppercase;
}

:deep(.profile-select__item) {
  align-items: start;
  min-height: 54px;
  padding-top: 8px;
  padding-bottom: 8px;
}

:deep(.profile-select__item .v-list-item-subtitle) {
  display: -webkit-box;
  overflow: hidden;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 650;
  letter-spacing: 0;
  line-height: 1.25;
  opacity: 1;
  white-space: normal;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

:global(.module-marking-select__chip-divider) {
  margin: 8px 0 4px;
}

:global(.module-marking-select__chip-header) {
  min-height: 34px;
  border-top: 1px solid color-mix(in srgb, var(--app-link) 26%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--app-link) 20%, transparent);
  background: color-mix(in srgb, var(--app-active-bg) 82%, var(--app-surface-bg));
}

:global(.module-marking-select__chip-header .v-list-subheader__text) {
  color: var(--app-active-text);
  font-size: 0.86rem;
  font-weight: 950;
  letter-spacing: 0;
  text-transform: uppercase;
}

:global(.module-marking-select__profile-header) {
  min-height: 24px;
  background: color-mix(in srgb, var(--app-surface-muted) 88%, transparent);
}

:global(.module-marking-select__profile-header .v-list-subheader__text) {
  color: var(--app-muted);
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

:global(.module-marking-select__item.v-list-item) {
  align-items: center;
  min-height: 38px !important;
  padding-top: 4px;
  padding-bottom: 4px;
}

:global(.module-marking-select__item .v-list-item-title) {
  overflow: hidden;
  font-size: 0.92rem;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.module-marking-select__row) {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  width: 100%;
}

:global(.module-marking-select__marking) {
  overflow: hidden;
  flex: 1 1 auto;
  min-width: 0;
  font-size: 0.92rem;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:global(.module-marking-select__profile-tag) {
  overflow: hidden;
  flex: 0 1 auto;
  max-width: 46%;
  border: 1px solid color-mix(in srgb, var(--app-border) 86%, transparent);
  border-radius: 999px;
  padding: 2px 7px;
  color: var(--app-muted);
  background: color-mix(in srgb, var(--app-surface-muted) 84%, transparent);
  font-size: 0.68rem;
  font-weight: 850;
  letter-spacing: 0;
  line-height: 1.15;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-navigator__info-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  min-height: 34px;
  border: 1px solid var(--app-border);
  border-radius: 6px;
  padding: 0 10px;
  color: var(--app-link);
  background: var(--app-surface-bg);
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    color 150ms ease;
}

.profile-navigator__info-button:hover,
.profile-navigator__info-button:focus-visible {
  border-color: var(--app-link);
  color: var(--app-active-text);
  background: var(--app-active-bg);
}

@media (max-width: 980px) {
  .profile-navigator {
    display: grid;
    gap: 12px;
  }

  .profile-navigator__select--chip,
  .profile-navigator__select--profile,
  .profile-navigator__select--module {
    flex-basis: auto;
  }

  .profile-navigator__info-button {
    justify-self: start;
  }
}
</style>
