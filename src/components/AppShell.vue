<template>
  <v-app-bar class="app-shell__bar" density="compact" elevation="0" height="52">
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
    <v-app-bar-title class="app-shell__title">ESPSocsExplorer</v-app-bar-title>
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
        <ExplorerSidebar />
      </div>
      <SocPinoutView />
    </div>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Menu } from '@lucide/vue';
import ExplorerSidebar from '@/components/ExplorerSidebar.vue';
import SocPinoutView from '@/components/SocPinoutView.vue';

const mobileDrawerOpen = ref(false);
</script>

<style scoped>
.app-shell__bar {
  border-bottom: 1px solid #dbe3ea;
  background: #f8fafc;
}

.app-shell__title {
  color: #102027;
  font-size: 1.05rem;
  font-weight: 900;
  letter-spacing: 0;
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
  height: calc(100vh - var(--v-layout-top, 52px));
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

  .app-shell__layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .app-shell__sidebar {
    display: none;
  }
}
</style>
