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
      v-if="selectableProfileOptions.length > 1"
      :model-value="store.selectedPackageId"
      class="profile-navigator__select profile-navigator__select--profile"
      auto-select-first="exact"
      clear-on-select
      clearable
      :custom-filter="filterProfileItem"
      density="compact"
      hide-details
      item-title="name"
      item-value="id"
      label="Board / chip package"
      no-data-text="No matching profiles"
      placeholder="Search boards or chip packages"
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
import { computed } from 'vue';
import { PanelRightOpen } from '@lucide/vue';
import { useSocStore } from '@/stores/socStore';
import type { PinProfileKind, SocModuleVariant, SocPackageVariant } from '@/types/soc';
import type { FilterFunction, InternalItem } from 'vuetify';

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();
const selectableProfileOptions = computed(() =>
  store.packageOptions.filter((profile) => profileKind(profile) !== 'module'),
);
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

type ProfileSelectItem = SocPackageVariant & {
  groupLabel: string;
  isFirstGroup: boolean;
  startsGroup: boolean;
};

function selectSoc(socId: string) {
  store.selectSoc(socId);
  emit('changed');
}

function selectPackage(packageId: string | null) {
  store.selectPackage(packageId);
  emit('changed');
}

function profileKind(profile: Pick<SocPackageVariant, 'kind'>): PinProfileKind {
  return profile.kind ?? 'package';
}

function profileKindRank(kind: PinProfileKind) {
  return {
    board: 0,
    package: 1,
    module: 2,
  }[kind];
}

function profileKindPluralLabel(kind: PinProfileKind) {
  return {
    board: 'Dev boards',
    module: 'Modules',
    package: 'Chip packages',
  }[kind];
}

function profileVariantSummary(profile: SocPackageVariant) {
  if (profileKind(profile) !== 'board') {
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

const filterProfileItem: FilterFunction = (_value: string, query: string, item?: InternalItem<ProfileSelectItem>) => {
  const tokens = normalizeSearchText(query).split(/\s+/).filter(Boolean);

  if (!tokens.length) {
    return true;
  }

  const searchText = profileSearchText(item?.raw);
  return tokens.every((token) => searchText.includes(token));
};

function profileSearchText(profile: ProfileSelectItem | undefined) {
  if (!profile) {
    return '';
  }

  return normalizeSearchText(
    [
      profile.id,
      profile.name,
      profile.packageName,
      profile.groupLabel,
      profileKind(profile),
      profile.source?.title,
      profile.source?.sections.join(' '),
      ...(profile.moduleNames ?? []),
      ...(profile.identificationNotes ?? []),
      ...(profile.moduleVariants ?? []).flatMap(moduleVariantSearchValues),
    ]
      .filter(Boolean)
      .join(' '),
  );
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

function normalizeSearchText(value: string) {
  return value.toLowerCase().replace(/[_/+-]/g, ' ');
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
  flex: 0 1 210px;
  min-width: 190px;
}

.profile-navigator__select--profile {
  flex: 1 1 300px;
}

:deep(.profile-select__divider) {
  margin: 6px 0;
}

:deep(.profile-select__header) {
  min-height: 28px;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 900;
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
  .profile-navigator__select--profile {
    flex-basis: auto;
  }

  .profile-navigator__info-button {
    justify-self: start;
  }
}
</style>
