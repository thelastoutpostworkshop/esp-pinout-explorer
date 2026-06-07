<template>
  <aside class="explorer-sidebar" aria-label="Explorer controls">
    <section class="explorer-sidebar__section">
      <div class="explorer-sidebar__chips">
        <v-chip class="pin-chip" color="primary" size="small" variant="flat">{{ selectedSoc.name }}</v-chip>
        <v-chip class="pin-chip" color="secondary" size="small" variant="tonal">
          {{ selectedPackage.packageName }}
        </v-chip>
      </div>

      <v-select
        :model-value="store.selectedSocId"
        class="explorer-sidebar__select"
        density="compact"
        hide-details
        item-title="name"
        item-value="id"
        label="SoC"
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
        label="Package"
        :items="store.packageOptions"
        variant="outlined"
        @update:model-value="selectPackage"
      />
    </section>

    <section class="explorer-sidebar__section">
      <PinSearch :model-value="store.searchQuery" @update:model-value="store.setSearchQuery" />
      <div class="explorer-sidebar__count">
        <Cpu :size="18" aria-hidden="true" />
        <span>{{ store.filteredPins.length }} / {{ store.selectedPins.length }} pins</span>
      </div>
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
import { Cpu } from '@lucide/vue';
import PinSearch from '@/components/PinSearch.vue';
import { useSocStore } from '@/stores/socStore';

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();
const selectedSoc = computed(() => store.selectedSoc);
const selectedPackage = computed(() => store.selectedPackage);

const legendItems = [
  { label: 'GPIO', className: 'legend-item__swatch--io' },
  { label: 'Analog', className: 'legend-item__swatch--analog' },
  { label: 'Power', className: 'legend-item__swatch--power' },
  { label: 'Ground', className: 'legend-item__swatch--ground' },
  { label: 'Warning', className: 'legend-item__swatch--warning' },
] as const;

function selectSoc(socId: string) {
  store.selectSoc(socId);
  emit('changed');
}

function selectPackage(packageId: string) {
  store.selectPackage(packageId);
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

.explorer-sidebar__chips,
.explorer-sidebar__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.explorer-sidebar__select {
  min-width: 0;
}

.explorer-sidebar__count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  color: #334155;
  font-weight: 850;
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
  width: 18px;
  height: 14px;
  border: 1.6px solid #334155;
  border-radius: 3px;
  background: #f8fafc;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.12);
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

.legend-item__swatch--warning {
  background: #f8fafc;
  border-color: #facc15;
  border-width: 3px;
  box-shadow:
    0 0 0 1px rgba(66, 32, 6, 0.55),
    0 0 5px rgba(250, 204, 21, 0.75);
}
</style>
