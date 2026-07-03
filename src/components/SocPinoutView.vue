<template>
  <section class="soc-view" aria-label="SoC pinout">
    <section class="soc-view__stage">
      <button
        v-if="canShowBoardFunctions"
        :aria-checked="effectiveShowBoardFunctions"
        aria-label="Show main functions on board pins"
        class="soc-view__function-toggle"
        role="switch"
        type="button"
        @click="toggleBoardFunctions"
      >
        <span class="soc-view__function-toggle-track" aria-hidden="true"></span>
        <span>Functions</span>
      </button>
      <ChipSvg
        v-if="selectedPackage.kind !== 'board'"
        :key="`${store.selectedSocId}-${selectedPackage.id}`"
        :filtered-pin-ids="store.filteredPinIds"
        :filtered-pin-count="store.filteredPins.length"
        :has-filter="Boolean(store.searchQuery.trim())"
        :package-name="selectedPackage.packageName"
        :pins="store.selectedPins"
        :selected-pin-id="store.selectedPinId"
        :soc="selectedSoc"
        :total-pin-count="store.selectedPins.length"
        @pin-click="store.selectPin"
      />
      <BoardSvg
        v-else
        :key="`${store.selectedSocId}-${selectedPackage.id}`"
        :filtered-pin-ids="store.filteredPinIds"
        :filtered-pin-count="store.filteredPins.length"
        :has-filter="Boolean(store.searchQuery.trim())"
        :board-layout="selectedPackage.boardLayout"
        :board-artwork="selectedPackage.boardArtwork"
        :chip-package-id="chipPackageOption?.id"
        :chip-package-label="chipPackageOption?.name"
        :package-name="selectedPackage.packageName"
        :pins="store.selectedPins"
        :selected-pin-id="store.selectedPinId"
        :show-main-functions="effectiveShowBoardFunctions"
        :soc="selectedSoc"
        :total-pin-count="store.selectedPins.length"
        @chip-package-click="store.selectPackage"
        @pin-click="store.selectPin"
        @profile-info-click="store.openProfileInfo"
      />
    </section>

    <PinInfoDrawer :pin="store.selectedPin" :source="selectedPackage.source ?? selectedSoc.source" @close="store.clearSelectedPin" />
    <ProfileInfoDrawer />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BoardSvg from '@/components/BoardSvg.vue';
import ChipSvg from '@/components/ChipSvg.vue';
import PinInfoDrawer from '@/components/PinInfoDrawer.vue';
import ProfileInfoDrawer from '@/components/ProfileInfoDrawer.vue';
import { useSocStore } from '@/stores/socStore';

const store = useSocStore();
const selectedSoc = computed(() => store.selectedSoc);
const selectedPackage = computed(() => store.selectedPackage);
const canShowBoardFunctions = computed(
  () => selectedPackage.value.kind === 'board' && selectedPackage.value.boardLayout !== 'connector-groups',
);
const effectiveShowBoardFunctions = computed(() => canShowBoardFunctions.value && store.showBoardFunctions);
const chipPackageOption = computed(() => {
  const packageOptions = store.packageOptions.filter((option) => (option.kind ?? 'package') === 'package');
  const targetPackageId = selectedPackage.value.chipPackageId ?? selectedSoc.value.defaultPackageId ?? 'default';

  return packageOptions.find((option) => option.id === targetPackageId) ?? packageOptions[0] ?? null;
});

function toggleBoardFunctions() {
  store.toggleBoardFunctions();
}
</script>

<style scoped>
.soc-view {
  box-sizing: border-box;
  display: grid;
  min-width: 0;
  min-height: 0;
  height: 100%;
  padding: clamp(10px, 1.8vw, 20px);
}

.soc-view__stage {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
  min-height: 0;
  border: 1px solid var(--app-stage-border);
  border-radius: 8px;
  background:
    linear-gradient(90deg, var(--app-stage-grid) 1px, transparent 1px),
    linear-gradient(0deg, var(--app-stage-grid) 1px, transparent 1px),
    var(--app-stage-bg);
  background-size: 28px 28px;
  padding: clamp(10px, 2vw, 24px);
}

.soc-view__function-toggle {
  display: inline-flex;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  align-items: center;
  gap: 7px;
  min-height: 30px;
  border: 1px solid var(--app-border);
  border-radius: 999px;
  padding: 3px 9px 3px 6px;
  color: var(--app-text);
  background: var(--app-floating-control-bg);
  box-shadow: 0 6px 16px var(--app-floating-control-shadow);
  font-family: inherit;
  font-size: 0.78rem;
  font-weight: 850;
  line-height: 1;
  cursor: pointer;
}

.soc-view__function-toggle-track {
  display: inline-block;
  position: relative;
  width: 30px;
  height: 16px;
  border-radius: 999px;
  background: var(--app-switch-track);
  box-shadow: inset 0 0 0 1px rgba(51, 65, 85, 0.18);
}

.soc-view__function-toggle-track::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--app-switch-knob);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
  transition:
    transform 160ms ease,
    background 160ms ease;
}

.soc-view__function-toggle[aria-checked='true'] .soc-view__function-toggle-track {
  background: var(--app-link);
}

.soc-view__function-toggle[aria-checked='true'] .soc-view__function-toggle-track::after {
  transform: translateX(14px);
  background: var(--app-surface-bg);
}

.soc-view__function-toggle:focus-visible {
  border-color: var(--app-link);
  box-shadow:
    0 0 0 3px rgba(14, 116, 144, 0.16),
    0 6px 16px var(--app-floating-control-shadow);
}

</style>
