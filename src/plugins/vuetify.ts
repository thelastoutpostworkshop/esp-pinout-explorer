import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'makerLight',
    themes: {
      makerLight: {
        dark: false,
        colors: {
          background: '#f6f8f7',
          surface: '#ffffff',
          primary: '#006d77',
          secondary: '#334155',
          accent: '#f59e0b',
          error: '#b42318',
          info: '#2563eb',
          success: '#0f7b45',
          warning: '#b45309',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      rounded: 'lg',
    },
    VTextField: {
      color: 'primary',
      variant: 'outlined',
    },
  },
});
