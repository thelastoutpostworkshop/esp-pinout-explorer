import type { SocDefinition } from '@/types/soc';
import { esp32c6 } from './esp32c6';
import { esp32s3 } from './esp32s3';

export const socs: SocDefinition[] = [esp32s3, esp32c6];

export const futureSocPlaceholders = [
  {
    id: 'esp32p4',
    name: 'ESP32-P4',
    status: 'planned',
  },
] as const;
