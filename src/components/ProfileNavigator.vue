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

    <v-select
      v-if="store.packageOptions.length > 1"
      :model-value="selectedPackage.id"
      class="profile-navigator__select profile-navigator__select--profile"
      density="compact"
      hide-details
      item-title="name"
      item-value="id"
      label="Board / module / package"
      :items="profileSelectItems"
      variant="outlined"
      @update:model-value="selectPackage"
    >
      <template #item="{ props, item }">
        <v-divider v-if="item.startsGroup && !item.isFirstGroup" class="profile-select__divider" />
        <v-list-subheader v-if="item.startsGroup" class="profile-select__header">
          {{ item.groupLabel }}
        </v-list-subheader>
        <v-list-item v-bind="props" :title="item.name" />
      </template>
    </v-select>

    <button
      class="profile-navigator__info-button"
      type="button"
      aria-label="Open profile information"
      @click="openProfileInfo"
    >
      <PanelRightOpen :size="16" aria-hidden="true" />
      <span>Profile info</span>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PanelRightOpen } from '@lucide/vue';
import { useSocStore } from '@/stores/socStore';
import type { PinProfileKind, SocPackageVariant } from '@/types/soc';

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();
const selectedPackage = computed(() => store.selectedPackage);
const profileSelectItems = computed(() =>
  [...store.packageOptions]
    .sort((first, second) => profileKindRank(profileKind(first)) - profileKindRank(profileKind(second)))
    .map((profile, index, profiles) => ({
      ...profile,
      groupLabel: profileKindPluralLabel(profileKind(profile)),
      isFirstGroup: index === 0,
      startsGroup: index === 0 || profileKind(profiles[index - 1]) !== profileKind(profile),
    })),
);

function selectSoc(socId: string) {
  store.selectSoc(socId);
  emit('changed');
}

function selectPackage(packageId: string) {
  store.selectPackage(packageId);
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
    module: 'Modules',
    package: 'Chip packages',
  }[kind];
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
}

.profile-navigator__select--profile {
  flex: 1 1 280px;
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

.profile-navigator__info-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: 0 0 auto;
  min-height: 34px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0 10px;
  color: #006d77;
  background: #ffffff;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.2;
  cursor: pointer;
}

.profile-navigator__info-button:hover,
.profile-navigator__info-button:focus-visible {
  border-color: #0e7490;
  background: #ecfeff;
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
