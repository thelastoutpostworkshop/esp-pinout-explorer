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
        <Info :size="16" aria-hidden="true" />
        <span>Profile info</span>
      </button>

      <div
        v-if="profileInfoOpen"
        class="profile-info"
        role="dialog"
        aria-label="Profile information"
        aria-modal="true"
        tabindex="-1"
        @click.self="closeProfileInfo"
        @keydown.esc="closeProfileInfo"
      >
        <aside class="profile-info__panel">
          <header class="profile-info__header">
            <div>
              <h2>Profile info</h2>
              <p>{{ selectedSoc.name }} / {{ selectedPackage.name }}</p>
            </div>
            <button
              class="profile-info__close"
              type="button"
              aria-label="Close profile information"
              @click="closeProfileInfo"
            >
              <X :size="18" aria-hidden="true" />
            </button>
          </header>

          <section class="profile-info__section">
            <h3>Profile</h3>
            <dl class="profile-info__spec-list">
              <div>
                <dt>Type</dt>
                <dd>{{ selectedProfileKindLabel }}</dd>
              </div>
              <div>
                <dt>View</dt>
                <dd>{{ selectedProfileSummary }}</dd>
              </div>
              <div>
                <dt>Source</dt>
                <dd>
                  <a
                    class="profile-info__source"
                    :href="selectedSource.url"
                    :aria-label="`Open ${sourceLinkTitle}`"
                    rel="noreferrer"
                    target="_blank"
                    :title="sourceLinkTitle"
                  >
                    <span>Official docs</span>
                    <ExternalLink :size="14" aria-hidden="true" />
                  </a>
                </dd>
              </div>
            </dl>
            <p v-if="profileInfoIntro" class="profile-info__note">{{ profileInfoIntro }}</p>
          </section>

          <section v-if="chipSpecItems.length" class="profile-info__section">
            <h3>Chip</h3>
            <dl class="profile-info__spec-list">
              <div v-for="item in chipSpecItems" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="moduleDisplay" class="profile-info__section">
            <h3>Module</h3>
            <strong>{{ moduleDisplay }}</strong>
            <dl v-if="moduleMemorySummaryItems.length" class="profile-info__spec-list">
              <div v-for="item in moduleMemorySummaryItems" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>

            <div v-if="moduleVariants.length" class="profile-info__table-wrap">
              <h4>Module variants</h4>
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

          <section v-if="boardSpecItems.length" class="profile-info__section">
            <h3>Board</h3>
            <dl class="profile-info__spec-list">
              <div v-for="item in boardSpecItems" :key="item.label">
                <dt>{{ item.label }}</dt>
                <dd>{{ item.value }}</dd>
              </div>
            </dl>
          </section>

          <section v-if="sourceFigures.length" class="profile-info__section">
            <h3>Reference images</h3>
            <div class="profile-info__image-grid">
              <figure v-for="figure in sourceFigures" :key="figure.url" class="profile-info__figure">
                <a
                  class="profile-info__image-link"
                  :class="{
                    'profile-info__image-link--loading': isReferenceImageLoading(figure.url),
                    'profile-info__image-link--error': hasReferenceImageError(figure.url),
                  }"
                  :href="figure.url"
                  rel="noreferrer"
                  target="_blank"
                  :aria-label="`Open ${figure.title}`"
                >
                  <span
                    v-if="isReferenceImageLoading(figure.url)"
                    class="profile-info__image-loading"
                    role="status"
                    aria-label="Loading reference image"
                  >
                    <span class="profile-info__spinner" aria-hidden="true"></span>
                  </span>
                  <span v-if="hasReferenceImageError(figure.url)" class="profile-info__image-error">Image unavailable</span>
                  <img
                    :src="figure.url"
                    :alt="figure.alt"
                    loading="lazy"
                    decoding="async"
                    :class="{
                      'profile-info__image--loading': isReferenceImageLoading(figure.url),
                      'profile-info__image--error': hasReferenceImageError(figure.url),
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
        </aside>
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
import { ExternalLink, Info, X } from '@lucide/vue';
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
const profileInfoOpen = ref(false);
const loadingReferenceImageUrls = ref(new Set<string>());
const erroredReferenceImageUrls = ref(new Set<string>());
const moduleDisplay = computed(() => formatModuleNames(selectedPackage.value.moduleNames ?? []));
const moduleVariants = computed(() => selectedPackage.value.moduleVariants ?? []);
const moduleMemorySummaryItems = computed(() =>
  [
    { label: 'Flash', value: summarizeVariantValues(moduleVariants.value.map((variant) => variant.flash)) },
    { label: 'PSRAM', value: summarizeVariantValues(moduleVariants.value.map((variant) => variant.psram)) },
  ].filter((item) => item.value),
);
const boardSpecItems = computed(() => {
  const specs = selectedPackage.value.boardSpecs;

  if (!specs || selectedProfileKind.value !== 'board') {
    return [];
  }

  return [
    { label: 'Power', value: specs.power.join(' ') },
    { label: 'Program', value: specs.programming.join(' ') },
    { label: 'On-board', value: specs.onBoardHardware.join(' ') },
  ].filter((item) => item.value.trim());
});
const profileInfoIntro = computed(() => {
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

watch(sourceFigures, () => {
  if (profileInfoOpen.value) {
    initializeReferenceImageLoading();
  }
});

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

function openProfileInfo() {
  initializeReferenceImageLoading();
  profileInfoOpen.value = true;
}

function closeProfileInfo() {
  profileInfoOpen.value = false;
  loadingReferenceImageUrls.value = new Set();
  erroredReferenceImageUrls.value = new Set();
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

.profile-info {
  position: fixed;
  inset: 0;
  z-index: 54;
  display: grid;
  justify-items: end;
  background: rgba(15, 23, 42, 0.55);
}

.profile-info__panel {
  display: grid;
  align-content: start;
  gap: 18px;
  width: min(560px, 100%);
  height: 100%;
  overflow: auto;
  border-left: 1px solid #cbd5e1;
  padding: 20px;
  background: #ffffff;
  box-shadow: -20px 0 60px rgba(15, 23, 42, 0.22);
}

.profile-info__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.profile-info__header h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1.04rem;
  font-weight: 850;
  letter-spacing: 0;
}

.profile-info__header p {
  margin: 3px 0 0;
  color: #64748b;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.35;
}

.profile-info__close {
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

.profile-info__close:hover,
.profile-info__close:focus-visible {
  border-color: #94a3b8;
  background: #e2e8f0;
}

.profile-info__section {
  display: grid;
  gap: 10px;
  min-width: 0;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}

.profile-info__section:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.profile-info__section h3 {
  margin: 0;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.profile-info__section strong {
  color: #0f172a;
  font-size: 0.88rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.profile-info__note {
  margin: 0;
  color: #475569;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.4;
}

.profile-info__spec-list {
  display: grid;
  gap: 7px;
  min-width: 0;
  margin: 0;
}

.profile-info__spec-list > div {
  display: grid;
  grid-template-columns: minmax(70px, max-content) minmax(0, 1fr);
  gap: 10px;
  align-items: baseline;
  min-width: 0;
}

.profile-info__spec-list dt {
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.profile-info__spec-list dd {
  min-width: 0;
  margin: 0;
  color: #0f172a;
  font-size: 0.84rem;
  font-weight: 750;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.profile-info__source,
.profile-info__table-wrap a {
  color: #006d77;
  font-weight: 850;
  text-decoration: none;
}

.profile-info__source {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.profile-info__source:hover,
.profile-info__source:focus-visible,
.profile-info__table-wrap a:hover,
.profile-info__table-wrap a:focus-visible {
  color: #004f58;
  text-decoration: underline;
}

.profile-info__table-wrap {
  overflow-x: auto;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
}

.profile-info__table-wrap h4 {
  margin: 0;
  padding: 9px 10px;
  color: #0f172a;
  background: #f8fafc;
  font-size: 0.78rem;
  font-weight: 850;
}

.profile-info__table-wrap table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
  color: #334155;
  font-size: 0.8rem;
  line-height: 1.35;
}

.profile-info__table-wrap th,
.profile-info__table-wrap td {
  border-bottom: 1px solid #e2e8f0;
  padding: 9px 10px;
  text-align: left;
  vertical-align: top;
}

.profile-info__table-wrap thead th {
  color: #0f172a;
  background: #f1f5f9;
  font-size: 0.72rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.profile-info__table-wrap tbody th {
  color: #0f172a;
  font-weight: 850;
}

.profile-info__table-wrap tbody tr:last-child th,
.profile-info__table-wrap tbody tr:last-child td {
  border-bottom: 0;
}

.profile-info__image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 12px;
}

.profile-info__figure {
  display: grid;
  gap: 8px;
  min-width: 0;
  margin: 0;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  padding: 9px;
  background: #f8fafc;
}

.profile-info__image-link {
  display: grid;
  place-items: center;
  position: relative;
  min-height: 150px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  overflow: hidden;
}

.profile-info__image-link img {
  display: block;
  width: 100%;
  max-height: 260px;
  object-fit: contain;
  opacity: 1;
  transition: opacity 140ms ease;
}

.profile-info__image--loading,
.profile-info__image--error {
  opacity: 0;
}

.profile-info__image-loading,
.profile-info__image-error {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  background: #ffffff;
}

.profile-info__spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #dbeafe;
  border-top-color: #006d77;
  border-radius: 999px;
  animation: profile-info-spin 800ms linear infinite;
}

.profile-info__image-error {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 800;
}

@keyframes profile-info-spin {
  to {
    transform: rotate(360deg);
  }
}

.profile-info__figure figcaption {
  display: grid;
  gap: 3px;
}

.profile-info__figure strong {
  color: #0f172a;
  font-size: 0.84rem;
  line-height: 1.3;
}

.profile-info__figure span {
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 700;
  line-height: 1.3;
}

@media (max-width: 640px) {
  .profile-info__panel {
    width: 100%;
    padding: 16px;
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
