import { computed } from 'vue';
import { useTheme } from 'vuetify';

const storageKey = 'esp-pinout-explorer:theme';
const lightThemeName = 'makerLight';
const darkThemeName = 'makerDark';

type ColorThemeName = typeof lightThemeName | typeof darkThemeName;

function isColorThemeName(value: string | null): value is ColorThemeName {
  return value === lightThemeName || value === darkThemeName;
}

function systemTheme(): ColorThemeName {
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return darkThemeName;
  }

  return lightThemeName;
}

function storedTheme(): ColorThemeName {
  if (typeof window === 'undefined') {
    return lightThemeName;
  }

  const value = window.localStorage.getItem(storageKey);
  return isColorThemeName(value) ? value : systemTheme();
}

function applyDocumentTheme(themeName: ColorThemeName) {
  if (typeof document === 'undefined') {
    return;
  }

  const mode = themeName === darkThemeName ? 'dark' : 'light';
  document.documentElement.dataset.appTheme = mode;
  document.documentElement.style.colorScheme = mode;
}

export function useColorMode() {
  const theme = useTheme();
  const initialTheme = storedTheme();

  theme.change(initialTheme);
  applyDocumentTheme(initialTheme);

  const isDark = computed(() => theme.global.name.value === darkThemeName);
  const toggleLabel = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'));

  function setTheme(themeName: ColorThemeName) {
    theme.change(themeName);
    applyDocumentTheme(themeName);

    try {
      window.localStorage.setItem(storageKey, themeName);
    } catch {
      // Ignore storage failures so theme switching still works in restricted browsing modes.
    }
  }

  function toggleTheme() {
    setTheme(isDark.value ? lightThemeName : darkThemeName);
  }

  return {
    isDark,
    toggleLabel,
    toggleTheme,
  };
}
