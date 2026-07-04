import type { SocSource } from '@/types/soc';

export const wroom02Source: SocSource = {
  title: 'ESP-WROOM-02 Datasheet',
  version: 'v3.7',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/0c-esp-wroom-02_datasheet_en.pdf',
  sections: [
    'Overview',
    'Pin Description',
    'Functional Description',
    'Electrical Characteristics',
    'Schematics',
    'Peripheral Schematics',
    'Dimensions',
    'Recommended PCB Land Pattern',
    'Appendix—Learning Resources',
  ],
};

export const wroom02DuSource: SocSource = {
  title: 'ESP-WROOM-02D & ESP-WROOM-02U Datasheet',
  version: 'v2.3',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://documentation.espressif.com/esp-wroom-02u_esp-wroom-02d_datasheet_en.pdf',
  sections: [
    'Module Overview',
    'Ordering Information',
    'Figure 1 Pin Layout',
    'Table 2 Pin Definitions',
    'Table 3 Functional Description',
    'Peripheral Schematics',
    'Physical Dimensions and PCB Land Pattern',
  ],
};
