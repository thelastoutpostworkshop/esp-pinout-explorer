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
        <span class="app-shell__subtitle">Your atlas for ESP chips, modules, and boards.</span>
      </v-app-bar-title>
    </div>
    <ProfileNavigator class="app-shell__navigator" />
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
      <SocPinoutView v-else />
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CircuitBoard, Menu } from '@lucide/vue';
import ExplorerSidebar from '@/components/ExplorerSidebar.vue';
import MakerToolsPage from '@/components/MakerToolsPage.vue';
import ProfileNavigator from '@/components/ProfileNavigator.vue';
import SocPinoutView from '@/components/SocPinoutView.vue';
import { useSocStore } from '@/stores/socStore';
import packageJson from '../../package.json';

const mobileDrawerOpen = ref(false);
const store = useSocStore();
const appVersion = packageJson.version;
</script>

<style scoped>
.app-shell__bar {
  border-bottom: 1px solid #dbe3ea;
  background: #f8fafc;
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
  box-shadow: 0 6px 16px rgba(15, 118, 110, 0.22);
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
  color: #102027;
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0;
}

.app-shell__version {
  color: #102027;
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0;
}

.app-shell__subtitle {
  display: block;
  color: #64748b;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0;
}

.app-shell__navigator {
  flex: 1 1 auto;
  max-width: 620px;
  min-width: 360px;
  margin-left: clamp(12px, 3vw, 34px);
}

.app-shell__menu {
  display: none;
}

.app-shell__main {
  background: #f6f8f7;
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
  border-right: 1px solid #dbe3ea;
  background: #f8fafc;
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
