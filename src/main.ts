import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { vuetify } from './plugins/vuetify';
import { applyBoardDeepLink, applyModuleDeepLink, resolveBoardDeepLink, resolveModuleDeepLink } from './services/boardDeepLinks';
import { useSocStore } from './stores/socStore';
import './styles/main.css';

const pinia = createPinia();
const store = useSocStore(pinia);
const fallbackRoute = new URLSearchParams(window.location.search).get('board-route');
const validFallbackRoute = fallbackRoute && /^(?:boards|modules)\/[a-z0-9-]+\/?(?:\?.*)?$/.test(fallbackRoute);
const routeUrl = validFallbackRoute ? new URL(`/${fallbackRoute}`, window.location.origin) : window.location;
const boardTarget = resolveBoardDeepLink(routeUrl.pathname, routeUrl.search);
const moduleTarget = resolveModuleDeepLink(routeUrl.pathname);

if (boardTarget) {
  applyBoardDeepLink(boardTarget, store.selectSoc, store.selectPackage, store.setSearchQuery);

  // GitHub Pages serves 404.html for direct nested routes. Restore the clean
  // permanent URL after that fallback has loaded the SPA at its base path.
  if (validFallbackRoute && fallbackRoute) {
    const basePath = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
    window.history.replaceState(null, '', `${basePath}${fallbackRoute}`);
  }
} else if (moduleTarget) {
  applyModuleDeepLink(moduleTarget, store.selectSoc, store.selectPackage);

  // GitHub Pages serves 404.html for direct nested routes. Restore the clean
  // permanent URL after that fallback has loaded the SPA at its base path.
  if (validFallbackRoute && fallbackRoute) {
    const basePath = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
    window.history.replaceState(null, '', `${basePath}${fallbackRoute}`);
  }
}

createApp(App).use(pinia).use(vuetify).mount('#app');
