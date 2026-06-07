import type { SocDefinition } from '@/types/soc';
import { esp32s3 } from './esp32s3';

export const socs: SocDefinition[] = [esp32s3];

export const futureSocPlaceholders = [
  {
    id: 'esp32c6',
    name: 'ESP32-C6',
    status: 'planned',
  },
  {
    id: 'esp32p4',
    name: 'ESP32-P4',
    status: 'planned',
  },
] as const;
