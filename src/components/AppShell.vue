<template>
  <v-app-bar class="app-shell__bar" density="compact" elevation="0" height="80">
    <v-btn
      aria-label="Open explorer controls"
      class="app-shell__menu"
      density="comfortable"
      icon
      variant="text"
      @click="mobileDrawerOpen = true"
    >
      <Menu :size="22" aria-hidden="true" />
    </v-btn>
    <div class="app-shell__identity" aria-label="ESP Pinout Explorer">
      <div class="app-shell__logo" aria-hidden="true">
        <CircuitBoard :size="22" />
      </div>
      <v-app-bar-title class="app-shell__brand">
        <span class="app-shell__title-row">
          <span class="app-shell__title">ESP Pinout Explorer</span>
          <span class="app-shell__version">v{{ appVersion }}</span>
        </span>
        <span class="app-shell__subtitle">Your atlas for ESP boards and chips.</span>
      </v-app-bar-title>
    </div>
    <ProfileNavigator class="app-shell__navigator" />
    <div class="app-shell__actions">
      <v-tooltip :text="toggleLabel">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            :aria-label="toggleLabel"
            class="app-shell__theme-toggle"
            density="comfortable"
            icon
            variant="text"
            @click="toggleTheme"
          >
            <Sun v-if="isDark" :size="21" aria-hidden="true" />
            <Moon v-else :size="21" aria-hidden="true" />
          </v-btn>
        </template>
      </v-tooltip>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-model="mobileDrawerOpen"
    class="app-shell__mobile-drawer"
    location="left"
    temporary
    width="320"
  >
    <ExplorerSidebar @changed="mobileDrawerOpen = false" />
  </v-navigation-drawer>

  <v-main class="app-shell__main">
    <div class="app-shell__layout">
      <div class="app-shell__sidebar">
        <ExplorerSidebar :show-profile-controls="false" />
      </div>
      <MakerToolsPage v-if="store.activeView === 'makerTools'" />
      <AboutPage v-else-if="store.activeView === 'about'" />
      <SocPinoutView v-else />
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CircuitBoard, Menu, Moon, Sun } from '@lucide/vue';
import AboutPage from '@/components/AboutPage.vue';
import ExplorerSidebar from '@/components/ExplorerSidebar.vue';
import MakerToolsPage from '@/components/MakerToolsPage.vue';
import ProfileNavigator from '@/components/ProfileNavigator.vue';
import SocPinoutView from '@/components/SocPinoutView.vue';
import { useColorMode } from '@/composables/useColorMode';
import { useSocStore } from '@/stores/socStore';
import packageJson from '../../package.json';

const mobileDrawerOpen = ref(false);
const store = useSocStore();
const appVersion = packageJson.version;
const { isDark, toggleLabel, toggleTheme } = useColorMode();
</script>

<style scoped>
.app-shell__bar {
  border-bottom: 1px solid var(--app-border);
  background: var(--app-bar-bg);
  color: var(--app-text);
}

.app-shell__bar :deep(.v-toolbar__content) {
  overflow: visible;
}

.app-shell__identity {
  display: flex;
  align-items: center;
  gap: 11px;
  flex: 0 0 auto;
  min-width: 250px;
  padding-left: 12px;
}

.app-shell__logo {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid #99f6e4;
  border-radius: 8px;
  color: #ffffff;
  background:
    linear-gradient(135deg, rgba(15, 118, 110, 0.95), rgba(14, 116, 144, 0.95)),
    #0f766e;
  border-color: var(--app-icon-panel-border);
  box-shadow: 0 6px 16px var(--app-icon-panel-shadow);
}

.app-shell__brand {
  display: grid;
  min-width: 0;
  line-height: 1.15;
}

.app-shell__brand :deep(.v-toolbar-title__placeholder) {
  display: grid;
  gap: 2px;
  overflow: visible;
  line-height: 1.15;
}

.app-shell__title-row {
  display: inline-flex;
  align-items: baseline;
  gap: 7px;
  min-width: 0;
}

.app-shell__title {
  color: var(--app-text);
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0;
}

.app-shell__version {
  color: var(--app-text);
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0;
}

.app-shell__subtitle {
  display: block;
  color: var(--app-muted);
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0;
}

.app-shell__navigator {
  flex: 1 1 auto;
  max-width: 980px;
  min-width: 640px;
  margin-left: clamp(12px, 3vw, 34px);
}

.app-shell__actions {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  margin-left: auto;
  padding: 0 12px 0 8px;
}

.app-shell__theme-toggle {
  color: var(--app-muted);
}

.app-shell__menu {
  display: none;
  color: var(--app-muted);
}

.app-shell__main {
  background: var(--app-main-bg);
  height: 100vh;
  overflow: hidden;
}

.app-shell__layout {
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  height: calc(100vh - var(--v-layout-top, 80px));
  min-height: 0;
}

.app-shell__sidebar {
  min-width: 0;
  border-right: 1px solid var(--app-border);
  background: var(--app-sidebar-bg);
}

@media (max-width: 980px) {
  .app-shell__menu {
    display: inline-flex;
  }

  .app-shell__identity {
    min-width: 0;
    padding-left: 0;
  }

  .app-shell__logo {
    width: 30px;
    height: 30px;
  }

  .app-shell__title {
    font-size: 0.92rem;
  }

  .app-shell__version {
    font-size: 0.92rem;
  }

  .app-shell__subtitle {
    font-size: 0.66rem;
  }

  .app-shell__navigator {
    display: none;
  }

  .app-shell__layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .app-shell__sidebar {
    display: none;
  }
}
</style>
