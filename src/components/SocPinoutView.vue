<template>
  <section class="soc-view" aria-label="SoC pinout">
    <section class="soc-view__stage">
      <button
        v-if="selectedPackage.kind === 'board'"
        :aria-checked="showBoardFunctions"
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
        :package-name="selectedPackage.packageName"
        :pins="store.selectedPins"
        :selected-pin-id="store.selectedPinId"
        :show-main-functions="showBoardFunctions"
        :soc="selectedSoc"
        :total-pin-count="store.selectedPins.length"
        @pin-click="store.selectPin"
      />
    </section>

    <PinInfoDrawer :pin="store.selectedPin" :source="selectedPackage.source ?? selectedSoc.source" @close="store.clearSelectedPin" />
    <ProfileInfoDrawer />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import BoardSvg from '@/components/BoardSvg.vue';
import ChipSvg from '@/components/ChipSvg.vue';
import PinInfoDrawer from '@/components/PinInfoDrawer.vue';
import ProfileInfoDrawer from '@/components/ProfileInfoDrawer.vue';
import { useSocStore } from '@/stores/socStore';

const store = useSocStore();
const selectedSoc = computed(() => store.selectedSoc);
const selectedPackage = computed(() => store.selectedPackage);
const showBoardFunctions = ref(false);

function toggleBoardFunctions() {
  showBoardFunctions.value = !showBoardFunctions.value;
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
  border: 1px solid #d9e2e7;
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px),
    linear-gradient(0deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px),
    #ffffff;
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
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  padding: 3px 9px 3px 6px;
  color: #334155;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
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
  background: #cbd5e1;
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
  background: #ffffff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.25);
  transition:
    transform 160ms ease,
    background 160ms ease;
}

.soc-view__function-toggle[aria-checked='true'] .soc-view__function-toggle-track {
  background: #006d77;
}

.soc-view__function-toggle[aria-checked='true'] .soc-view__function-toggle-track::after {
  transform: translateX(14px);
}

.soc-view__function-toggle:focus-visible {
  border-color: #0e7490;
  box-shadow:
    0 0 0 3px rgba(14, 116, 144, 0.16),
    0 6px 16px rgba(15, 23, 42, 0.12);
}

</style>
