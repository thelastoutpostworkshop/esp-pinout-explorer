<template>
  <aside class="explorer-sidebar" aria-label="Explorer controls">
    <section v-if="showProfileControls" class="explorer-sidebar__section">
      <ProfileNavigator @changed="emit('changed')" />
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

    <ResourcesSection @changed="emit('changed')" />
  </aside>
</template>

<script setup lang="ts">
import PinSearch from '@/components/PinSearch.vue';
import ProfileNavigator from '@/components/ProfileNavigator.vue';
import ResourcesSection from '@/components/ResourcesSection.vue';
import { useSocStore } from '@/stores/socStore';

withDefaults(
  defineProps<{
    showProfileControls?: boolean;
  }>(),
  {
    showProfileControls: true,
  },
);

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();

const legendItems = [
  { label: 'GPIO', className: 'legend-item__swatch--io' },
  { label: 'Analog', className: 'legend-item__swatch--analog' },
  { label: 'Power', className: 'legend-item__swatch--power' },
  { label: 'Ground', className: 'legend-item__swatch--ground' },
  { label: 'Control', className: 'legend-item__swatch--control' },
  { label: 'Maker warning', className: 'legend-item__swatch--warning' },
] as const;
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
  color: var(--app-muted);
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

.legend-item {
  display: inline-flex;
  flex: 0 1 calc(50% - 4px);
  align-items: center;
  gap: 6px;
  min-width: 112px;
  min-height: 24px;
  color: var(--app-text);
  font-size: 0.86rem;
  font-weight: 750;
}

.legend-item__swatch {
  display: inline-block;
  position: relative;
  width: 18px;
  height: 14px;
  border: 1.6px solid var(--app-muted);
  border-radius: 3px;
  background: var(--app-surface-muted);
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
