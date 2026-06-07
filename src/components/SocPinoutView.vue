<template>
  <section class="soc-view" aria-label="SoC pinout">
    <section class="soc-view__stage">
      <ChipSvg
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
    </section>

    <PinInfoDrawer :pin="store.selectedPin" :source="selectedSoc.source" @close="store.clearSelectedPin" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ChipSvg from '@/components/ChipSvg.vue';
import PinInfoDrawer from '@/components/PinInfoDrawer.vue';
import { useSocStore } from '@/stores/socStore';

const store = useSocStore();
const selectedSoc = computed(() => store.selectedSoc);
const selectedPackage = computed(() => store.selectedPackage);
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

</style>
