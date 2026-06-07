<template>
  <div class="pin-search">
    <v-text-field
      :model-value="modelValue"
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
      <div class="pin-search__filters-title">Filter pins</div>
      <div class="pin-search__chips" aria-label="Pin filters">
        <v-chip
          v-for="filter in quickFilters"
          :key="filter"
          class="pin-chip"
          :color="activeFilter === filter ? 'primary' : 'secondary'"
          :variant="activeFilter === filter ? 'flat' : 'tonal'"
          size="small"
          @click="toggleFilter(filter)"
        >
          {{ filter }}
        </v-chip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Search, X } from '@lucide/vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const quickFilters = ['ADC', 'Touch', 'SPI', 'I2C', 'USB', 'JTAG', 'SDIO', 'LP', 'Strapping'];

const activeFilter = computed(() => {
  const normalized = props.modelValue.trim().toLowerCase();
  return quickFilters.find((filter) => filter.toLowerCase() === normalized) ?? '';
});

function emitSearch(value: string | number | null) {
  emit('update:modelValue', String(value ?? ''));
}

function toggleFilter(filter: string) {
  emit('update:modelValue', activeFilter.value === filter ? '' : filter);
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
</style>
