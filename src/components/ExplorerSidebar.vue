<template>
  <aside class="explorer-sidebar" aria-label="Explorer controls">
    <section class="explorer-sidebar__section">
      <v-select
        :model-value="store.selectedSocId"
        class="explorer-sidebar__select"
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
        class="explorer-sidebar__select"
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
        class="explorer-sidebar__profile-info-button"
        type="button"
        aria-label="Open profile information"
        @click="openProfileInfo"
      >
        <PanelRightOpen :size="16" aria-hidden="true" />
        <span>Profile info</span>
      </button>
    </section>

    <section class="explorer-sidebar__section">
      <PinSearch :model-value="store.searchQuery" @update:model-value="store.setSearchQuery" />
    </section>

    <section class="explorer-sidebar__section" aria-label="Pin color legend">
      <h2>Legend</h2>
      <div class="explorer-sidebar__legend">
        <div v-for="item in legendItems" :key="item.label" class="legend-item">
          <span class="legend-item__swatch" :class="item.className" aria-hidden="true"></span>
          <span>{{ item.label }}</span>
        </div>
      </div>
    </section>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PanelRightOpen } from '@lucide/vue';
import PinSearch from '@/components/PinSearch.vue';
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

const legendItems = [
  { label: 'GPIO', className: 'legend-item__swatch--io' },
  { label: 'Analog', className: 'legend-item__swatch--analog' },
  { label: 'Power', className: 'legend-item__swatch--power' },
  { label: 'Ground', className: 'legend-item__swatch--ground' },
  { label: 'Control', className: 'legend-item__swatch--control' },
  { label: 'Maker warning', className: 'legend-item__swatch--warning' },
] as const;

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
.explorer-sidebar {
  display: grid;
  align-content: start;
  gap: 18px;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
}

.explorer-sidebar__section {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.explorer-sidebar__section h2 {
  margin: 0;
  color: #334155;
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.explorer-sidebar__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.explorer-sidebar__select {
  min-width: 0;
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

.explorer-sidebar__profile-info-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-self: start;
  min-height: 30px;
  border: 0;
  padding: 0;
  color: #006d77;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.2;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
}

.explorer-sidebar__profile-info-button:hover,
.explorer-sidebar__profile-info-button:focus-visible {
  color: #004f58;
  text-decoration: underline;
}

.legend-item {
  display: inline-flex;
  flex: 0 1 calc(50% - 4px);
  align-items: center;
  gap: 6px;
  min-width: 112px;
  min-height: 24px;
  color: #334155;
  font-size: 0.86rem;
  font-weight: 750;
}

.legend-item__swatch {
  display: inline-block;
  position: relative;
  width: 18px;
  height: 14px;
  border: 1.6px solid #334155;
  border-radius: 3px;
  background: #f8fafc;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.legend-item__swatch--io {
  background: #93c5fd;
}

.legend-item__swatch--analog {
  background: #86efac;
}

.legend-item__swatch--power {
  background: #f87171;
}

.legend-item__swatch--ground {
  background: #e2e8f0;
}

.legend-item__swatch--control {
  background: #fbbf24;
}

.legend-item__swatch--warning {
  background: #93c5fd;
}

.legend-item__swatch--warning::after {
  content: '';
  position: absolute;
  top: -1px;
  right: -1px;
  width: 10px;
  height: 10px;
  background: #facc15;
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  filter: drop-shadow(0 0 2px rgba(250, 204, 21, 0.8));
}
</style>
