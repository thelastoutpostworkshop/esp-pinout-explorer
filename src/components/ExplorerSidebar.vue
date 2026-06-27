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
        <button
          v-if="moduleVariants.length"
          class="explorer-sidebar__module-action"
          type="button"
          aria-label="View module variant details"
          @click="openModuleDetails"
        >
          <List :size="14" aria-hidden="true" />
          <span>Module variants</span>
        </button>
      </div>

      <div
        v-if="moduleDetailsOpen"
        class="module-details"
        role="dialog"
        aria-label="Module variant details"
        aria-modal="true"
        tabindex="-1"
        @click.self="closeModuleDetails"
        @keydown.esc="closeModuleDetails"
      >
        <section class="module-details__panel">
          <header class="module-details__header">
            <div>
              <h2>Module variants</h2>
              <p>{{ selectedPackage.name }}</p>
            </div>
            <button
              class="module-details__close"
              type="button"
              aria-label="Close module variant details"
              @click="closeModuleDetails"
            >
              <X :size="18" aria-hidden="true" />
            </button>
          </header>

          <div class="module-details__table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Module</th>
                  <th scope="col">Antenna</th>
                  <th scope="col">Flash</th>
                  <th scope="col">PSRAM</th>
                  <th scope="col">Footprint</th>
                  <th scope="col">Pinout impact</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="variant in moduleVariants" :key="variant.name">
                  <th scope="row">
                    <a v-if="variant.source" :href="variant.source.url" rel="noreferrer" target="_blank">
                      {{ variant.name }}
                    </a>
                    <span v-else>{{ variant.name }}</span>
                  </th>
                  <td>{{ valueOrDash(variant.antenna) }}</td>
                  <td>{{ valueOrDash(variant.flash) }}</td>
                  <td>{{ valueOrDash(variant.psram) }}</td>
                  <td>{{ valueOrDash(variant.footprint) }}</td>
                  <td>{{ valueOrDash(variant.pinoutImpact) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div class="explorer-sidebar__source-actions">
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

        <button
          v-if="sourceFigures.length"
          class="explorer-sidebar__figure-button"
          type="button"
          :aria-label="`View reference images from ${sourceLinkTitle}`"
          :title="sourceLinkTitle"
          @click="openReferenceImages"
        >
          <ImageIcon :size="14" aria-hidden="true" />
          <span>Reference images</span>
        </button>
      </div>

      <div
        v-if="referenceImagesOpen"
        class="reference-images"
        role="dialog"
        aria-label="Reference images"
        aria-modal="true"
        tabindex="-1"
        @click.self="closeReferenceImages"
        @keydown.esc="closeReferenceImages"
      >
        <section class="reference-images__panel">
          <header class="reference-images__header">
            <div>
              <h2>Reference images</h2>
              <p>{{ sourceLinkTitle }}</p>
            </div>
            <button
              class="reference-images__close"
              type="button"
              aria-label="Close reference images"
              @click="closeReferenceImages"
            >
              <X :size="18" aria-hidden="true" />
            </button>
          </header>

          <div class="reference-images__grid">
            <figure v-for="figure in sourceFigures" :key="figure.url" class="reference-images__figure">
              <a
                class="reference-images__image-link"
                :href="figure.url"
                rel="noreferrer"
                target="_blank"
                :aria-label="`Open ${figure.title}`"
              >
                <img :src="figure.url" :alt="figure.alt" loading="lazy" decoding="async" />
              </a>
              <figcaption>
                <strong>{{ figure.title }}</strong>
                <span>{{ figure.sourceSection }}</span>
              </figcaption>
            </figure>
          </div>
        </section>
      </div>
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
import { computed, ref, watch } from 'vue';
import { ExternalLink, Image as ImageIcon, List, X } from '@lucide/vue';
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
const sourceFigures = computed(() => selectedSource.value.figures ?? []);
const referenceImagesOpen = ref(false);
const moduleDisplay = computed(() => formatModuleNames(selectedPackage.value.moduleNames ?? []));
const moduleVariants = computed(() => selectedPackage.value.moduleVariants ?? []);
const moduleDetailsOpen = ref(false);
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

watch(sourceFigures, (figures) => {
  if (!figures.length) {
    closeReferenceImages();
  }
});

watch(moduleVariants, (variants) => {
  if (!variants.length) {
    closeModuleDetails();
  }
});

function selectSoc(socId: string) {
  store.selectSoc(socId);
  closeReferenceImages();
  closeModuleDetails();
  emit('changed');
}

function selectPackage(packageId: string) {
  store.selectPackage(packageId);
  closeReferenceImages();
  closeModuleDetails();
  emit('changed');
}

function formatModuleNames(moduleNames: string[]) {
  return moduleNames.map((name, index) => (index === 0 ? name : name.replace(/^ESP32-S3-/, ''))).join(' / ');
}

function valueOrDash(value: string | undefined) {
  return value?.trim() || '-';
}

function openReferenceImages() {
  referenceImagesOpen.value = true;
}

function closeReferenceImages() {
  referenceImagesOpen.value = false;
}

function openModuleDetails() {
  moduleDetailsOpen.value = true;
}

function closeModuleDetails() {
  moduleDetailsOpen.value = false;
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

.explorer-sidebar__source-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}

.explorer-sidebar__source,
.explorer-sidebar__figure-button,
.explorer-sidebar__module-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 28px;
  color: #006d77;
  font-size: 0.84rem;
  font-weight: 800;
  line-height: 1.2;
  text-decoration: none;
}

.explorer-sidebar__module-action {
  justify-self: start;
  min-height: 24px;
}

.explorer-sidebar__figure-button,
.explorer-sidebar__module-action {
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
  font-family: inherit;
}

.explorer-sidebar__source:hover,
.explorer-sidebar__source:focus-visible,
.explorer-sidebar__figure-button:hover,
.explorer-sidebar__figure-button:focus-visible,
.explorer-sidebar__module-action:hover,
.explorer-sidebar__module-action:focus-visible {
  color: #004f58;
  text-decoration: underline;
}

.reference-images {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.55);
}

.reference-images__panel {
  display: grid;
  gap: 18px;
  width: min(960px, 100%);
  max-height: min(760px, calc(100vh - 48px));
  overflow: auto;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
}

.reference-images__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.reference-images__header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: none;
}

.reference-images__header p {
  margin: 3px 0 0;
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.35;
}

.reference-images__close {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #334155;
  background: #f8fafc;
  cursor: pointer;
}

.reference-images__close:hover,
.reference-images__close:focus-visible {
  border-color: #94a3b8;
  background: #e2e8f0;
}

.reference-images__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.reference-images__figure {
  display: grid;
  gap: 9px;
  min-width: 0;
  margin: 0;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;
}

.reference-images__image-link {
  display: grid;
  place-items: center;
  min-height: 180px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
}

.reference-images__image-link img {
  display: block;
  width: 100%;
  max-height: 320px;
  object-fit: contain;
}

.reference-images__figure figcaption {
  display: grid;
  gap: 3px;
}

.reference-images__figure strong {
  color: #0f172a;
  font-size: 0.88rem;
  line-height: 1.3;
}

.reference-images__figure span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  line-height: 1.3;
}

.module-details {
  position: fixed;
  inset: 0;
  z-index: 52;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.55);
}

.module-details__panel {
  display: grid;
  gap: 16px;
  width: min(1040px, 100%);
  max-height: min(720px, calc(100vh - 48px));
  overflow: auto;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.28);
}

.module-details__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.module-details__header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 850;
  letter-spacing: 0;
}

.module-details__header p {
  margin: 3px 0 0;
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.35;
}

.module-details__close {
  display: inline-grid;
  flex: 0 0 auto;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  color: #334155;
  background: #f8fafc;
  cursor: pointer;
}

.module-details__close:hover,
.module-details__close:focus-visible {
  border-color: #94a3b8;
  background: #e2e8f0;
}

.module-details__table-wrap {
  overflow-x: auto;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
}

.module-details table {
  width: 100%;
  min-width: 840px;
  border-collapse: collapse;
  color: #334155;
  font-size: 0.82rem;
  line-height: 1.35;
}

.module-details th,
.module-details td {
  border-bottom: 1px solid #e2e8f0;
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
}

.module-details thead th {
  color: #0f172a;
  background: #f1f5f9;
  font-size: 0.74rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.module-details tbody th {
  color: #0f172a;
  font-weight: 850;
}

.module-details tbody tr:last-child th,
.module-details tbody tr:last-child td {
  border-bottom: 0;
}

.module-details a {
  color: #006d77;
  font-weight: 850;
  text-decoration: none;
}

.module-details a:hover,
.module-details a:focus-visible {
  color: #004f58;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .reference-images {
    padding: 12px;
  }

  .reference-images__panel {
    max-height: calc(100vh - 24px);
    padding: 14px;
  }

  .module-details {
    padding: 12px;
  }

  .module-details__panel {
    max-height: calc(100vh - 24px);
    padding: 14px;
  }
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
