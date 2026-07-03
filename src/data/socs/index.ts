import type { SocDefinition } from '@/types/soc';
import { esp32 } from './esp32';
import { esp32c6 } from './esp32c6';
import { esp32h2 } from './esp32h2';
import { esp32s3 } from './esp32s3';
import { esp8266ex } from './esp8266';

export const socs: SocDefinition[] = [esp32s3, esp32c6, esp32h2, esp32, esp8266ex];

export const futureSocPlaceholders = [
  {
    id: 'esp32p4',
    name: 'ESP32-P4',
    status: 'planned',
  },
] as const;
