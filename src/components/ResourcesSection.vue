<template>
  <section class="resources-section" aria-label="Resources">
    <h2>Resources</h2>
    <nav class="resources-section__list" aria-label="Resource links">
      <a
        v-for="link in resourceLinks"
        :key="link.label"
        class="resources-section__item"
        :href="link.href"
        rel="noreferrer"
        target="_blank"
      >
        <component :is="link.icon" :size="16" aria-hidden="true" />
        <span>{{ link.label }}</span>
        <ExternalLink :size="13" class="resources-section__external" aria-hidden="true" />
      </a>

      <button
        class="resources-section__item resources-section__item--button"
        :class="{ 'resources-section__item--active': store.activeView === 'about' }"
        type="button"
        @click="openAbout"
      >
        <Compass :size="16" aria-hidden="true" />
        <span>About</span>
      </button>

      <button
        class="resources-section__item resources-section__item--button"
        :class="{ 'resources-section__item--active': store.activeView === 'makerTools' }"
        type="button"
        @click="openMakerTools"
      >
        <Wrench :size="16" aria-hidden="true" />
        <span>Maker Tools</span>
      </button>
    </nav>
  </section>
</template>

<script setup lang="ts">
import { Coffee, Compass, ExternalLink, LifeBuoy, Play, Wrench } from '@lucide/vue';
import { useSocStore } from '@/stores/socStore';

const emit = defineEmits<{
  changed: [];
}>();

const store = useSocStore();

const resourceLinks = [
  {
    label: 'Tutorial',
    href: 'https://youtu.be/-nhDKzBxHiI',
    icon: Play,
  },
  {
    label: 'Buy Me a Coffee',
    href: 'https://buymeacoffee.com/thelastoutpostworkshop',
    icon: Coffee,
  },
  {
    label: 'Get Help',
    href: 'https://github.com/thelastoutpostworkshop/ESPSocsExplorer',
    icon: LifeBuoy,
  },
] as const;

function openMakerTools() {
  store.showMakerTools();
  emit('changed');
}

function openAbout() {
  store.showAbout();
  emit('changed');
}
</script>

<style scoped>
.resources-section {
  display: grid;
  gap: 9px;
  min-width: 0;
  border-top: 1px solid var(--app-border);
  padding-top: 14px;
}

.resources-section h2 {
  margin: 0;
  color: var(--app-muted);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: 0;
  text-transform: uppercase;
}

.resources-section__list {
  display: grid;
  gap: 4px;
}

.resources-section__item {
  display: grid;
  grid-template-columns: 20px minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 9px;
  color: var(--app-text);
  background: transparent;
  font-family: inherit;
  font-size: 0.88rem;
  font-weight: 750;
  line-height: 1.2;
  text-align: left;
  text-decoration: none;
}

.resources-section__item--button {
  cursor: pointer;
}

.resources-section__item:hover,
.resources-section__item:focus-visible {
  border-color: var(--app-border);
  background: var(--app-hover-bg);
  color: var(--app-link);
}

.resources-section__item--active {
  border-color: var(--app-icon-panel-border);
  color: var(--app-active-text);
  background: var(--app-active-bg);
}

.resources-section__item span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resources-section__external {
  color: var(--app-muted);
}
</style>
