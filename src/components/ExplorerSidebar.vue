<template>
  <aside class="explorer-sidebar" aria-label="Explorer controls">
    <section class="explorer-sidebar__section">
      <div class="explorer-sidebar__chips">
        <v-chip class="pin-chip" color="primary" size="small" variant="flat">{{ selectedSoc.name }}</v-chip>
        <v-chip class="pin-chip" color="secondary" size="small" variant="tonal">{{ selectedPackage.name }}</v-chip>
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
        label="Profile"
        :items="store.packageOptions"
        variant="outlined"
        @update:model-value="selectPackage"
      />

      <div v-if="moduleDisplay" class="explorer-sidebar__module">
        <div class="explorer-sidebar__module-heading">
          <span>Module</span>
          <InfoTooltip label="Board or module name?" :text="moduleTooltip" />
        </div>
        <strong>{{ moduleDisplay }}</strong>
      </div>

      <a
        class="explorer-sidebar__source"
        :href="selectedSource.url"
        :aria-label="`Open ${sourceLinkTitle}`"
        rel="noreferrer"
        target="_blank"
        :title="sourceLinkTitle"
      >
        <ExternalLink :size="14" aria-hidden="true" />
        <span>Official docs</span>
      </a>
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
import { ExternalLink } from '@lucide/vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import PinSearch from '@/components/PinSearch.vue';
import { useSocStore } from '@/stores/socStore';

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();
const selectedSoc = computed(() => store.selectedSoc);
const selectedPackage = computed(() => store.selectedPackage);
const selectedSource = computed(() => selectedPackage.value.source ?? selectedSoc.value.source);
const sourceLinkTitle = computed(() => `${selectedSource.value.title} ${selectedSource.value.version}`);
const moduleDisplay = computed(() => formatModuleNames(selectedPackage.value.moduleNames ?? []));
const moduleTooltip = computed(() => {
  const note = selectedPackage.value.identificationNotes?.[0];
  return [
    'The printed metal-can name is the module. The dev-board profile controls header pins, buttons, USB, LEDs, and safe-use warnings.',
    note,
  ]
    .filter(Boolean)
    .join(' ');
});

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

function formatModuleNames(moduleNames: string[]) {
  return moduleNames.map((name, index) => (index === 0 ? name : name.replace(/^ESP32-S3-/, ''))).join(' / ');
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

.explorer-sidebar__module {
  display: grid;
  gap: 4px;
  min-width: 0;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  padding: 10px 12px;
  background: #ffffff;
}

.explorer-sidebar__module-heading {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  justify-self: start;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.explorer-sidebar__module strong {
  min-width: 0;
  color: #0f172a;
  font-size: 0.84rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.explorer-sidebar__source {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-self: start;
  min-height: 28px;
  color: #006d77;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.2;
  text-decoration: none;
}

.explorer-sidebar__source:hover,
.explorer-sidebar__source:focus-visible {
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

.legend-item__swatch--control {
  background: #fbbf24;
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
