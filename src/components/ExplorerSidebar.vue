<template>
  <aside class="explorer-sidebar" aria-label="Explorer controls">
    <section class="explorer-sidebar__section">
      <div class="explorer-sidebar__chips">
        <v-chip class="pin-chip" color="primary" size="small" variant="flat">{{ selectedSoc.name }}</v-chip>
        <v-chip class="pin-chip" color="secondary" size="small" variant="tonal">{{ selectedPackage.name }}</v-chip>
        <v-chip class="pin-chip" size="small" variant="tonal">{{ selectedProfileKindLabel }}</v-chip>
      </div>

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

      <div
        v-if="selectedProfileKind !== 'board'"
        class="explorer-sidebar__profile-context"
        :class="`explorer-sidebar__profile-context--${selectedProfileKind}`"
      >
        <span>{{ selectedProfileKindLabel }}</span>
        <p>{{ selectedProfileSummary }}</p>
      </div>

      <div v-if="chipSpecItems.length" class="explorer-sidebar__chip-specs">
        <span>Chip</span>
        <dl>
          <div v-for="item in chipSpecItems" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
      </div>

      <div v-if="moduleDisplay" class="explorer-sidebar__module">
        <div class="explorer-sidebar__module-heading">
          <span>Module</span>
          <button
            v-if="moduleVariants.length"
            class="explorer-sidebar__module-action"
            type="button"
            aria-label="View module variant details"
            @click="openModuleDetails"
          >
            <List :size="14" aria-hidden="true" />
            <span>{{ moduleDetailsActionLabel }}</span>
          </button>
        </div>
        <strong>{{ moduleDisplay }}</strong>
        <dl v-if="moduleMemorySummaryItems.length" class="explorer-sidebar__module-specs">
          <div v-for="item in moduleMemorySummaryItems" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </div>
        </dl>
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

          <div v-if="moduleDetailsIntro" class="module-details__intro">
            <p>{{ moduleDetailsIntro }}</p>
          </div>

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
                :class="{
                  'reference-images__image-link--loading': isReferenceImageLoading(figure.url),
                  'reference-images__image-link--error': hasReferenceImageError(figure.url),
                }"
                :href="figure.url"
                rel="noreferrer"
                target="_blank"
                :aria-label="`Open ${figure.title}`"
              >
                <span
                  v-if="isReferenceImageLoading(figure.url)"
                  class="reference-images__loading"
                  role="status"
                  aria-label="Loading reference image"
                >
                  <span class="reference-images__spinner" aria-hidden="true"></span>
                </span>
                <span v-if="hasReferenceImageError(figure.url)" class="reference-images__error">Image unavailable</span>
                <img
                  :src="figure.url"
                  :alt="figure.alt"
                  loading="lazy"
                  decoding="async"
                  :class="{
                    'reference-images__image--loading': isReferenceImageLoading(figure.url),
                    'reference-images__image--error': hasReferenceImageError(figure.url),
                  }"
                  @load="markReferenceImageLoaded(figure.url)"
                  @error="markReferenceImageFailed(figure.url)"
                />
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
import PinSearch from '@/components/PinSearch.vue';
import { useSocStore } from '@/stores/socStore';
import type { PinProfileKind, SocPackageVariant } from '@/types/soc';

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();
const selectedSoc = computed(() => store.selectedSoc);
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
const selectedProfileKind = computed(() => profileKind(selectedPackage.value));
const selectedProfileKindLabel = computed(() => profileKindLabel(selectedProfileKind.value));
const selectedProfileSummary = computed(() => profileKindSummary(selectedProfileKind.value));
const selectedSource = computed(() => selectedPackage.value.source ?? selectedSoc.value.source);
const sourceLinkTitle = computed(() => `${selectedSource.value.title} ${selectedSource.value.version}`);
const sourceFigures = computed(() => selectedSource.value.figures ?? []);
const chipSpecItems = computed(() => {
  const cpu = selectedSoc.value.chipSpecs?.cpu;

  return cpu ? [{ label: 'CPU', value: cpu }] : [];
});
const referenceImagesOpen = ref(false);
const loadingReferenceImageUrls = ref(new Set<string>());
const erroredReferenceImageUrls = ref(new Set<string>());
const moduleDisplay = computed(() => formatModuleNames(selectedPackage.value.moduleNames ?? []));
const moduleVariants = computed(() => selectedPackage.value.moduleVariants ?? []);
const moduleDetailsActionLabel = computed(() => (moduleVariants.value.length === 1 ? 'Details' : 'Variants'));
const moduleMemorySummaryItems = computed(() =>
  [
    { label: 'Flash', value: summarizeVariantValues(moduleVariants.value.map((variant) => variant.flash)) },
    { label: 'PSRAM', value: summarizeVariantValues(moduleVariants.value.map((variant) => variant.psram)) },
  ].filter((item) => item.value),
);
const moduleDetailsOpen = ref(false);
const moduleDetailsIntro = computed(() => {
  const note = selectedPackage.value.identificationNotes?.[0];
  const helpText = {
    board:
      'The printed metal-can name is the module. The dev-board profile controls header pins, buttons, USB, LEDs, and safe-use warnings.',
    module:
      'This profile shows module pads for PCB design, not dev-board headers. Use a DevKit profile when you want board headers and on-board hardware.',
    package:
      'This profile shows the bare SoC package. It can differ from modules and development-board headers.',
  }[selectedProfileKind.value];

  return [
    helpText,
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

function profileKindLabel(kind: PinProfileKind) {
  return {
    board: 'Dev board',
    module: 'Module',
    package: 'Chip package',
  }[kind];
}

function profileKindPluralLabel(kind: PinProfileKind) {
  return {
    board: 'Dev boards',
    module: 'Modules',
    package: 'Chip packages',
  }[kind];
}

function profileKindSummary(kind: PinProfileKind) {
  return {
    board: 'Header pins, silkscreen labels, and on-board parts.',
    module: 'Module pads for PCB design, not dev-board headers.',
    package: 'Bare SoC package pins from the datasheet.',
  }[kind];
}

function formatModuleNames(moduleNames: string[]) {
  const firstPrefix = moduleNames[0]?.match(/^(ESP32-[A-Z0-9]+-)/)?.[1];
  return moduleNames.map((name, index) => (index === 0 || !firstPrefix ? name : name.replace(firstPrefix, ''))).join(' / ');
}

function valueOrDash(value: string | undefined) {
  return value?.trim() || '-';
}

function summarizeVariantValues(values: Array<string | undefined>) {
  const cleanValues = values.flatMap((value) => {
    const trimmedValue = value?.trim();
    return trimmedValue ? [trimmedValue] : [];
  });

  return uniqueValues(cleanValues).join(' / ');
}

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function openReferenceImages() {
  initializeReferenceImageLoading();
  referenceImagesOpen.value = true;
}

function closeReferenceImages() {
  referenceImagesOpen.value = false;
  loadingReferenceImageUrls.value = new Set();
  erroredReferenceImageUrls.value = new Set();
}

function openModuleDetails() {
  moduleDetailsOpen.value = true;
}

function closeModuleDetails() {
  moduleDetailsOpen.value = false;
}

function initializeReferenceImageLoading() {
  loadingReferenceImageUrls.value = new Set(sourceFigures.value.map((figure) => figure.url));
  erroredReferenceImageUrls.value = new Set();
}

function isReferenceImageLoading(url: string) {
  return loadingReferenceImageUrls.value.has(url);
}

function hasReferenceImageError(url: string) {
  return erroredReferenceImageUrls.value.has(url);
}

function markReferenceImageLoaded(url: string) {
  const loadingUrls = new Set(loadingReferenceImageUrls.value);
  loadingUrls.delete(url);
  loadingReferenceImageUrls.value = loadingUrls;
}

function markReferenceImageFailed(url: string) {
  markReferenceImageLoaded(url);
  erroredReferenceImageUrls.value = new Set([...erroredReferenceImageUrls.value, url]);
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

.explorer-sidebar__profile-context {
  display: grid;
  gap: 3px;
  min-width: 0;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  padding: 9px 11px;
  background: #ffffff;
}

.explorer-sidebar__profile-context span {
  color: #006d77;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.explorer-sidebar__profile-context p {
  margin: 0;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1.3;
}

.explorer-sidebar__profile-context--module span {
  color: #7c3aed;
}

.explorer-sidebar__profile-context--package span {
  color: #475569;
}

.explorer-sidebar__chip-specs {
  display: grid;
  gap: 6px;
  min-width: 0;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  padding: 9px 11px;
  background: #ffffff;
}

.explorer-sidebar__chip-specs > span {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.explorer-sidebar__chip-specs dl,
.explorer-sidebar__module-specs {
  display: grid;
  gap: 5px;
  min-width: 0;
  margin: 0;
}

.explorer-sidebar__chip-specs dl > div,
.explorer-sidebar__module-specs > div {
  display: grid;
  grid-template-columns: minmax(46px, max-content) minmax(0, 1fr);
  gap: 8px;
  align-items: baseline;
  min-width: 0;
}

.explorer-sidebar__chip-specs dt,
.explorer-sidebar__module-specs dt {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.explorer-sidebar__chip-specs dd,
.explorer-sidebar__module-specs dd {
  min-width: 0;
  margin: 0;
  color: #0f172a;
  font-size: 0.8rem;
  font-weight: 750;
  line-height: 1.3;
  overflow-wrap: anywhere;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
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
  min-height: 24px;
  flex: 0 0 auto;
  text-transform: none;
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
  position: relative;
  min-height: 180px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  overflow: hidden;
}

.reference-images__image-link img {
  display: block;
  width: 100%;
  max-height: 320px;
  object-fit: contain;
  opacity: 1;
  transition: opacity 140ms ease;
}

.reference-images__image--loading,
.reference-images__image--error {
  opacity: 0;
}

.reference-images__loading,
.reference-images__error {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  background: #ffffff;
}

.reference-images__spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #dbeafe;
  border-top-color: #006d77;
  border-radius: 999px;
  animation: reference-image-spin 800ms linear infinite;
}

.reference-images__error {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 800;
}

@keyframes reference-image-spin {
  to {
    transform: rotate(360deg);
  }
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

.module-details__intro {
  border-left: 3px solid #006d77;
  padding: 2px 0 2px 12px;
}

.module-details__intro p {
  margin: 0;
  color: #475569;
  font-size: 0.86rem;
  font-weight: 700;
  line-height: 1.45;
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
