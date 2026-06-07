<template>
  <v-menu v-if="description" location="top" open-on-click open-on-focus open-on-hover>
    <template #activator="{ props: activatorProps }">
      <v-chip
        v-bind="activatorProps"
        :aria-label="`${label}: ${description}`"
        class="pin-chip function-chip function-chip--described"
        :color="color"
        :size="size"
        tabindex="0"
        :variant="variant"
      >
        {{ label }}
      </v-chip>
    </template>

    <v-card class="function-chip__card" elevation="8">
      <v-card-title class="function-chip__title">{{ label }}</v-card-title>
      <v-card-text class="function-chip__text">
        {{ description }}
      </v-card-text>
    </v-card>
  </v-menu>

  <v-chip v-else class="pin-chip function-chip" :color="color" :size="size" :variant="variant">
    {{ label }}
  </v-chip>
</template>

<script setup lang="ts">
type ChipVariant = 'text' | 'flat' | 'tonal' | 'elevated' | 'outlined' | 'plain';

withDefaults(
  defineProps<{
    label: string;
    description?: string | null;
    color?: string;
    size?: string;
    variant?: ChipVariant;
  }>(),
  {
    color: 'primary',
    description: null,
    size: 'small',
    variant: 'tonal',
  },
);
</script>

<style scoped>
.function-chip--described {
  cursor: help;
}

.function-chip__card {
  max-width: min(320px, calc(100vw - 32px));
  border: 1px solid #dbe3ea;
  border-radius: 8px;
}

.function-chip__title {
  min-height: auto;
  padding: 12px 14px 0;
  color: #0f172a;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0;
}

.function-chip__text {
  padding: 8px 14px 14px;
  color: #334155;
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.42;
}
</style>
