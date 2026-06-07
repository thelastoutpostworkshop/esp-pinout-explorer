<template>
  <v-container class="soc-view" fluid>
    <header class="soc-view__header">
      <div>
        <h1>ESPSocsExplorer</h1>
        <div class="soc-view__subtitle">
          <v-chip class="pin-chip" color="primary" size="small" variant="flat">{{ selectedSoc.name }}</v-chip>
          <v-chip class="pin-chip" color="secondary" size="small" variant="tonal">
            {{ selectedPackage.packageName }}
          </v-chip>
        </div>
      </div>

      <div class="soc-view__selectors">
        <v-select
          :model-value="store.selectedSocId"
          class="soc-view__select"
          density="comfortable"
          hide-details
          item-title="name"
          item-value="id"
          label="SoC"
          :items="store.socs"
          variant="outlined"
          @update:model-value="store.selectSoc"
        />

        <v-select
          v-if="store.packageOptions.length > 1"
          :model-value="selectedPackage.id"
          class="soc-view__select"
          density="comfortable"
          hide-details
          item-title="name"
          item-value="id"
          label="Package"
          :items="store.packageOptions"
          variant="outlined"
          @update:model-value="store.selectPackage"
        />
      </div>
    </header>

    <section class="soc-view__tools">
      <PinSearch :model-value="store.searchQuery" @update:model-value="store.setSearchQuery" />
      <div class="soc-view__count">
        <Cpu :size="18" aria-hidden="true" />
        <span>{{ store.filteredPins.length }} / {{ store.selectedPins.length }} pins</span>
      </div>
    </section>

    <section class="soc-view__stage">
      <ChipSvg
        :filtered-pin-ids="store.filteredPinIds"
        :has-filter="Boolean(store.searchQuery.trim())"
        :pins="store.selectedPins"
        :selected-pin-id="store.selectedPinId"
        :soc="selectedSoc"
        @pin-click="store.selectPin"
      />
    </section>

    <PinInfoDrawer :pin="store.selectedPin" :source="selectedSoc.source" @close="store.clearSelectedPin" />
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Cpu } from '@lucide/vue';
import ChipSvg from '@/components/ChipSvg.vue';
import PinInfoDrawer from '@/components/PinInfoDrawer.vue';
import PinSearch from '@/components/PinSearch.vue';
import { useSocStore } from '@/stores/socStore';

const store = useSocStore();
const selectedSoc = computed(() => store.selectedSoc);
const selectedPackage = computed(() => store.selectedPackage);
</script>

<style scoped>
.soc-view {
  display: grid;
  gap: 20px;
  min-height: 100vh;
  padding: clamp(16px, 3vw, 34px);
}

.soc-view__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.soc-view__header h1 {
  margin: 0;
  color: #102027;
  font-size: clamp(2rem, 4.2vw, 3.6rem);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1;
}

.soc-view__subtitle {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.soc-view__selectors {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  gap: 12px;
}

.soc-view__select {
  width: min(280px, 30vw);
}

.soc-view__tools {
  display: grid;
  grid-template-columns: minmax(260px, 680px) max-content;
  align-items: end;
  gap: 16px;
}

.soc-view__count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  color: #334155;
  font-weight: 800;
  white-space: nowrap;
}

.soc-view__stage {
  display: grid;
  place-items: center;
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

@media (max-width: 820px) {
  .soc-view__header,
  .soc-view__tools {
    grid-template-columns: 1fr;
  }

  .soc-view__header {
    display: grid;
  }

  .soc-view__select {
    width: 100%;
  }

  .soc-view__selectors {
    display: grid;
    justify-content: stretch;
    width: 100%;
  }

  .soc-view__tools {
    display: grid;
  }

  .soc-view__count {
    justify-self: start;
  }
}
</style>
