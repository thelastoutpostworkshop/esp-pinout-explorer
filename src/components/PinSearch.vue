<template>
  <div class="pin-search">
    <v-text-field
      :model-value="displayValue"
      class="pin-search__field"
      color="primary"
      density="comfortable"
      hide-details
      label="Search pins"
      persistent-placeholder
      placeholder="Pin, GPIO, function, warning"
      variant="outlined"
      @update:model-value="emitSearch"
    >
      <template #prepend-inner>
        <Search :size="18" aria-hidden="true" />
      </template>
      <template v-if="modelValue" #append-inner>
        <v-btn
          aria-label="Clear search"
          density="comfortable"
          icon
          size="x-small"
          variant="text"
          @click.stop="emit('update:modelValue', '')"
        >
          <X :size="16" aria-hidden="true" />
        </v-btn>
      </template>
    </v-text-field>

    <div class="pin-search__filters">
      <div class="pin-search__filters-title">
        <span>Quick filters</span>
        <InfoTooltip
          label="What do quick filters include?"
          text="Quick filters are curated shortcuts for common maker categories. Use search for exact functions such as MTDI, CLK_OUT1, FSPIHD, GPIO numbers, or board labels."
        />
      </div>
      <div class="pin-search__chips" aria-label="Quick pin filters">
        <v-chip
          v-for="filter in visibleQuickFilters"
          :key="filter.label"
          class="pin-chip"
          :class="{ 'pin-search__chip--safe': filter.query === safeUseQuery }"
          :color="activeFilter === filter.query ? 'primary' : 'secondary'"
          :variant="activeFilter === filter.query ? 'flat' : 'tonal'"
          size="small"
          @click="toggleFilter(filter)"
        >
          {{ filter.label }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { Search, X } from '@lucide/vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import { useSocStore } from '@/stores/socStore';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const store = useSocStore();

interface QuickFilter {
  label: string;
  query: string;
}

const safeUseQuery = 'safe use';

const quickFilters: QuickFilter[] = [
  { label: 'Safe use', query: safeUseQuery },
  { label: 'GPIO', query: 'type:io' },
  { label: 'Analog', query: 'type:analog' },
  { label: 'Power', query: 'type:power' },
  { label: 'Ground', query: 'type:ground' },
  { label: 'Control', query: 'type:control' },
  { label: 'ADC', query: 'ADC' },
  { label: 'Touch', query: 'Touch' },
  { label: 'RTC', query: 'RTC' },
  { label: 'SPI', query: 'SPI' },
  { label: 'I2C', query: 'I2C' },
  { label: 'UART', query: 'UART' },
  { label: 'USB', query: 'USB' },
  { label: 'JTAG', query: 'JTAG' },
  { label: 'SDIO', query: 'SDIO' },
  { label: 'LP', query: 'LP' },
  { label: 'Boot', query: 'Boot' },
  { label: 'Strapping', query: 'Strapping' },
  { label: 'PSRAM', query: 'PSRAM' },
  { label: 'RGB LED', query: 'RGB LED' },
];

const activeFilter = computed(() => {
  const normalized = props.modelValue.trim().toLowerCase();
  return quickFilters.find((filter) => filter.query.toLowerCase() === normalized)?.query ?? '';
});

const visibleQuickFilters = computed(() => quickFilters.filter((filter) => store.countPinsForQuery(filter.query) > 0));

const displayValue = computed(() => {
  return quickFilters.find((filter) => filter.query === props.modelValue)?.label ?? props.modelValue;
});

watch(
  [visibleQuickFilters, activeFilter],
  ([filters, active]) => {
    if (active && !filters.some((filter) => filter.query === active)) {
      emit('update:modelValue', '');
    }
  },
  { immediate: true },
);

function emitSearch(value: string | number | null) {
  emit('update:modelValue', String(value ?? ''));
}

function toggleFilter(filter: QuickFilter) {
  emit('update:modelValue', activeFilter.value === filter.query ? '' : filter.query);
}
</script>

<style scoped>
.pin-search {
  display: grid;
  gap: 12px;
  min-width: 0;
  max-width: 100%;
}

.pin-search__field {
  min-width: 0;
}

.pin-search__filters {
  display: grid;
  gap: 7px;
}

.pin-search__filters-title {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  justify-self: start;
  color: #64748b;
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pin-search__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
  max-width: 100%;
}

.pin-search__field :deep(.v-field) {
  border-radius: 8px;
}

.pin-search__chip--safe {
  border: 1px solid rgba(22, 101, 52, 0.26);
  background: rgba(187, 247, 208, 0.72);
}
</style>
