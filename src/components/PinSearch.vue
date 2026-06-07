<template>
  <div class="pin-search">
    <v-text-field
      :model-value="modelValue"
      class="pin-search__field"
      color="primary"
      density="comfortable"
      hide-details
      label="Search"
      placeholder="GPIO, ADC, SPI, I2C, USB"
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
}

.pin-search__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pin-search__field :deep(.v-field) {
  border-radius: 8px;
}
</style>
