import type { SocSource } from '@/types/soc';

export const mini1Source: SocSource = {
  title: 'ESP32-C6-MINI-1 & ESP32-C6-MINI-1U Datasheet',
  version: 'v1.5',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c6-mini-1_mini-1u_datasheet_en.pdf',
  sections: [
    'Table 1-1 ESP32-C6-MINI-1 (ANT) Series Comparison',
    'Table 1-2 ESP32-C6-MINI-1U (CONN) Series Comparison',
    'Figure 3-1 Pin Layout (Top View)',
    'Table 3-1 Pin Definitions',
    'Chapter 4 Boot Configurations',
    'Figure 8-1 ESP32-C6-MINI-1 Schematics',
    'Figure 8-2 ESP32-C6-MINI-1U Schematics',
    'Figure 10-1 ESP32-C6-MINI-1 Physical Dimensions',
    'Figure 10-2 ESP32-C6-MINI-1U Physical Dimensions',
    'Figure 10-3 Dimensions of External Antenna Connector',
    'Figure 11-1 ESP32-C6-MINI-1 Recommended PCB Land Pattern',
    'Figure 11-2 ESP32-C6-MINI-1U Recommended PCB Land Pattern',
  ],
};

export const wroom1Source: SocSource = {
  title: 'ESP32-C6-WROOM-1 & ESP32-C6-WROOM-1U Datasheet',
  version: 'v1.4',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp32-c6-wroom-1_wroom-1u_datasheet_en.pdf',
  sections: [
    'Series Comparison',
    'Pin Definitions',
    'Physical Dimensions',
    'Dimensions of External Antenna Connector',
    'PCB Land Pattern',
  ],
};
