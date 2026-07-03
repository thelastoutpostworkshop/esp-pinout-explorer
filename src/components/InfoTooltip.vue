<template>
  <v-menu location="top" open-on-click open-on-focus open-on-hover>
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        :aria-label="label"
        class="info-tooltip__button"
        density="compact"
        icon
        size="x-small"
        variant="text"
      >
        <Info :size="15" aria-hidden="true" />
      </v-btn>
    </template>

    <v-card class="info-tooltip__card" elevation="8">
      <v-card-text class="info-tooltip__text">
        {{ text }}
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { Info } from '@lucide/vue';

defineProps<{
  label: string;
  text: string;
}>();
</script>

<style scoped>
.info-tooltip__button {
  color: var(--app-link);
}

.info-tooltip__card {
  max-width: min(320px, calc(100vw - 32px));
  border: 1px solid var(--app-border);
  border-radius: 8px;
  color: var(--app-text);
  background: var(--app-surface-bg);
  box-shadow: var(--app-panel-shadow);
}

.info-tooltip__text {
  color: inherit;
  font-size: 0.86rem;
  font-weight: 500;
  line-height: 1.42;
}
</style>
