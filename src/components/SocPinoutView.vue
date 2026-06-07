<template>
  <v-container class="soc-view" fluid>
    <header class="soc-view__header">
      <div class="soc-view__identity">
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
          density="compact"
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
          density="compact"
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

    <section class="soc-view__legend" aria-label="Pin color legend">
      <div v-for="item in legendItems" :key="item.label" class="legend-item">
        <span class="legend-item__swatch" :class="item.className" aria-hidden="true"></span>
        <span>{{ item.label }}</span>
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

const legendItems = [
  { label: 'GPIO', className: 'legend-item__swatch--io' },
  { label: 'Analog', className: 'legend-item__swatch--analog' },
  { label: 'Power', className: 'legend-item__swatch--power' },
  { label: 'Ground', className: 'legend-item__swatch--ground' },
  { label: 'Warning', className: 'legend-item__swatch--warning' },
] as const;
</script>

<style scoped>
.soc-view {
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  min-width: 0;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
  padding: clamp(14px, 2.2vw, 24px);
}

.soc-view__header {
  display: grid;
  grid-template-columns: minmax(0, 680px);
  justify-content: start;
  gap: 10px;
  min-width: 0;
}

.soc-view__identity {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  min-width: 0;
}

.soc-view__header h1 {
  margin: 0;
  color: #102027;
  font-size: clamp(1.9rem, 3.4vw, 3rem);
  font-weight: 900;
  letter-spacing: 0;
  line-height: 0.96;
}

.soc-view__subtitle {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.soc-view__selectors {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
  min-width: 0;
  max-width: 100%;
}

.soc-view__select {
  flex: 0 1 min(270px, calc(50vw - 22px));
  max-width: 270px;
  width: min(270px, calc(50vw - 22px));
}

.soc-view__tools {
  display: grid;
  grid-template-columns: minmax(260px, 680px) max-content;
  align-items: end;
  gap: 16px;
  min-width: 0;
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

.soc-view__legend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  min-width: 0;
  max-width: 100%;
  color: #334155;
  font-size: 0.88rem;
  font-weight: 750;
}

.legend-item {
  display: inline-flex;
  flex: 0 1 auto;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 24px;
  white-space: nowrap;
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

@media (max-width: 820px) {
  .soc-view__tools {
    grid-template-columns: minmax(0, 1fr);
  }

  .soc-view__select {
    max-width: none;
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

  .soc-view__legend {
    gap: 8px 10px;
  }

  .legend-item {
    flex-basis: calc(50% - 5px);
  }
}
</style>
