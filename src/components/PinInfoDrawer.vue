<template>
  <v-navigation-drawer
    :model-value="Boolean(pin)"
    location="right"
    :scrim="false"
    temporary
    width="420"
    @update:model-value="onDrawerUpdate"
  >
    <v-card v-if="pin" class="pin-info" flat>
      <v-card-title class="pin-info__title">
        <div>
          <div class="pin-info__eyebrow">Pin {{ pin.number }}</div>
          <div class="pin-info__name">{{ pin.name }}</div>
        </div>
        <v-btn aria-label="Close pin details" icon variant="text" @click="emit('close')">
          <X :size="20" aria-hidden="true" />
        </v-btn>
      </v-card-title>

      <v-card-text class="pin-info__content">
        <div class="pin-info__summary">
          <div class="pin-info__stat">
            <span>GPIO</span>
            <strong>{{ pin.gpio !== undefined ? `GPIO${pin.gpio}` : 'None' }}</strong>
          </div>
          <div class="pin-info__stat">
            <span>Type</span>
            <strong>{{ typeLabel }}</strong>
          </div>
        </div>

        <section class="pin-info__section">
          <div class="pin-info__section-heading">
            <h2>Main Functions</h2>
            <InfoTooltip
              label="What are main functions?"
              text="Main functions are the primary official functions shown for this package pin, including GPIO, fixed peripheral signals, analog or low-power functions, memory signals, clocks, boot controls, and power-related roles."
            />
          </div>
          <div class="pin-info__chips">
            <FunctionChip
              v-for="item in pin.mainFunctions"
              :key="item"
              color="primary"
              :description="getFunctionDescription(item)"
              :label="item"
              size="small"
              variant="tonal"
            />
          </div>
        </section>

        <section v-if="pin.ioMux?.length" class="pin-info__section">
          <div class="pin-info__section-heading">
            <h2>IO MUX</h2>
            <InfoTooltip
              label="What is IO MUX?"
              text="IO MUX functions are fixed hardware alternate functions available directly on this physical pin. They are less flexible than GPIO Matrix routing, but are often preferred for high-speed or timing-sensitive signals."
            />
          </div>
          <div class="pin-info__chips">
            <v-chip v-for="item in pin.ioMux" :key="item" class="pin-chip" color="info" size="small" variant="tonal">
              {{ item }}
            </v-chip>
          </div>
        </section>

        <section v-if="pin.analog?.length" class="pin-info__section">
          <h2>Analog</h2>
          <div class="pin-info__chips">
            <v-chip
              v-for="item in pin.analog"
              :key="item"
              class="pin-chip"
              color="success"
              size="small"
              variant="tonal"
            >
              {{ item }}
            </v-chip>
          </div>
        </section>

        <section v-if="pin.rtc?.length" class="pin-info__section">
          <h2>RTC</h2>
          <div class="pin-info__chips">
            <v-chip v-for="item in pin.rtc" :key="item" class="pin-chip" color="secondary" size="small" variant="tonal">
              {{ item }}
            </v-chip>
          </div>
        </section>

        <section v-if="pin.matrixSignals?.length" class="pin-info__section">
          <div class="pin-info__section-heading">
            <h2>GPIO Matrix</h2>
            <InfoTooltip
              label="What is GPIO Matrix?"
              text="GPIO Matrix lets ESP32-series chips route many peripheral signals, such as UART, I2C, SPI, PWM, and RMT, to flexible GPIO pins in software. Check pin warnings before choosing a pin."
            />
          </div>
          <div class="pin-info__chips">
            <v-chip
              v-for="item in pin.matrixSignals"
              :key="item"
              class="pin-chip"
              color="secondary"
              size="x-small"
              variant="outlined"
            >
              {{ item }}
            </v-chip>
          </div>
        </section>

        <section v-if="pin.warnings?.length" class="pin-info__section">
          <h2>Warnings</h2>
          <div class="pin-info__chips">
            <v-chip
              v-for="item in warningLabels"
              :key="item"
              class="pin-chip"
              color="warning"
              size="small"
              variant="flat"
            >
              <AlertTriangle :size="14" aria-hidden="true" />
              {{ item }}
            </v-chip>
          </div>
        </section>

        <section v-if="pin.notes?.length" class="pin-info__section">
          <h2>Notes</h2>
          <ul class="pin-info__notes">
            <li v-for="note in pin.notes" :key="note">{{ note }}</li>
          </ul>
        </section>

        <v-divider />

        <div class="pin-info__source">
          <BookOpen :size="16" aria-hidden="true" />
          <span>
            Source:
            <a :href="source.url" rel="noreferrer" target="_blank">{{ source.title }} {{ source.version }}</a>.
            Sections: package layout, pin overview, IO MUX, low-power/RTC/analog functions, restrictions, memory
            mapping, boot.
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, BookOpen, X } from '@lucide/vue';
import FunctionChip from '@/components/FunctionChip.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import { getFunctionDescription } from '@/data/functionDescriptions';
import type { PinWarning, SocPin, SocSource } from '@/types/soc';

const props = defineProps<{
  pin: SocPin | null;
  source: SocSource;
}>();

const emit = defineEmits<{
  close: [];
}>();

const warningText: Record<PinWarning, string> = {
  strapping: 'Strapping',
  boot: 'Boot',
  usb: 'USB',
  'flash-psram': 'Flash/PSRAM',
  jtag: 'JTAG',
  uart0: 'UART0',
  glitch: 'Power-up glitch',
  power: 'Power',
  reset: 'Reset',
  voltage: 'Voltage',
};

const typeLabel = computed(() => {
  if (!props.pin) {
    return '';
  }
  return props.pin.type === 'io' ? 'I/O' : props.pin.type[0].toUpperCase() + props.pin.type.slice(1);
});

const warningLabels = computed(() => props.pin?.warnings?.map((warning) => warningText[warning]) ?? []);

function onDrawerUpdate(value: boolean) {
  if (!value) {
    emit('close');
  }
}
</script>

<style scoped>
.pin-info {
  min-height: 100%;
}

.pin-info__title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 20px 12px;
}

.pin-info__eyebrow {
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.pin-info__name {
  color: #0f172a;
  font-size: clamp(1.45rem, 5vw, 2.2rem);
  font-weight: 800;
  letter-spacing: 0;
  line-height: 1.05;
}

.pin-info__content {
  display: grid;
  gap: 18px;
  padding: 12px 20px 26px;
}

.pin-info__summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.pin-info__stat {
  display: grid;
  gap: 3px;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.pin-info__stat span {
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
}

.pin-info__stat strong {
  color: #0f172a;
  font-size: 1.08rem;
}

.pin-info__section {
  display: grid;
  gap: 10px;
}

.pin-info__section h2 {
  margin: 0;
  color: #334155;
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
}

.pin-info__section-heading {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  justify-self: start;
}

.pin-info__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.pin-info__chips :deep(.v-chip__content) {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.pin-info__notes {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 18px;
  color: #334155;
  line-height: 1.45;
}

.pin-info__source {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #64748b;
  font-size: 0.82rem;
  line-height: 1.35;
}

.pin-info__source a {
  color: #006d77;
  font-weight: 700;
  text-decoration: none;
}
</style>
