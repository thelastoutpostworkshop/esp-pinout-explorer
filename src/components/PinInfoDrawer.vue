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
          <div class="pin-info__eyebrow">Pin {{ pinDisplayNumber }}</div>
          <div class="pin-info__name">{{ pin.name }}</div>
        </div>
        <v-btn aria-label="Close pin details" icon variant="text" @click="emit('close')">
          <X :size="20" aria-hidden="true" />
        </v-btn>
      </v-card-title>

      <v-card-text class="pin-info__content">
        <div class="pin-info__summary">
          <dl v-for="item in summaryItems" :key="item.label" class="pin-info__stat">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </dl>
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
            <FunctionChip
              v-for="item in pin.ioMux"
              :key="item"
              color="info"
              :description="getFunctionDescription(item)"
              :label="item"
              size="small"
              variant="tonal"
            />
          </div>
        </section>

        <section v-if="pin.analog?.length" class="pin-info__section">
          <h2>Analog</h2>
          <div class="pin-info__chips">
            <FunctionChip
              v-for="item in pin.analog"
              :key="item"
              color="success"
              :description="getFunctionDescription(item)"
              :label="item"
              size="small"
              variant="tonal"
            />
          </div>
        </section>

        <section v-if="pin.rtc?.length" class="pin-info__section">
          <h2>RTC</h2>
          <div class="pin-info__chips">
            <FunctionChip
              v-for="item in pin.rtc"
              :key="item"
              color="secondary"
              :description="getFunctionDescription(item)"
              :label="item"
              size="small"
              variant="tonal"
            />
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
            <FunctionChip
              v-for="item in pin.matrixSignals"
              :key="item"
              color="secondary"
              :description="getFunctionDescription(item)"
              :label="item"
              size="x-small"
              variant="outlined"
            />
          </div>
        </section>

        <section v-if="makerWarningLabels.length" class="pin-info__section">
          <div class="pin-info__section-heading">
            <h2>Maker Warnings</h2>
            <InfoTooltip
              label="What are maker warnings?"
              text="Maker warnings are the pin cautions most likely to affect ordinary development-board projects, such as boot, flashing, USB, reset, voltage, UART0, or optional PSRAM-related pins."
            />
          </div>
          <div class="pin-info__chips">
            <v-chip
              v-for="item in makerWarningLabels"
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

        <section v-if="boardDesignWarningLabels.length" class="pin-info__section">
          <div class="pin-info__section-heading">
            <h2>Board Design Notes</h2>
            <InfoTooltip
              label="What are board design notes?"
              text="Board design notes are lower-priority datasheet cautions that matter mainly when designing custom hardware or connecting sensitive external circuits. They stay searchable, but do not add a yellow pin border."
            />
          </div>
          <div class="pin-info__chips">
            <v-chip
              v-for="item in boardDesignWarningLabels"
              :key="item"
              class="pin-chip"
              color="secondary"
              size="small"
              variant="tonal"
            >
              <Info :size="14" aria-hidden="true" />
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
            <a :href="source.url" rel="noreferrer" target="_blank">{{ source.title }} {{ source.version }}</a>
          </span>
        </div>
      </v-card-text>
    </v-card>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, BookOpen, Info, X } from '@lucide/vue';
import FunctionChip from '@/components/FunctionChip.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import { getFunctionDescription } from '@/data/functionDescriptions';
import { getBoardDesignWarnings, getMakerWarnings, getWarningLabel } from '@/data/pinWarnings';
import type { SocPin, SocSource } from '@/types/soc';

const props = defineProps<{
  pin: SocPin | null;
  source: SocSource;
}>();

const emit = defineEmits<{
  close: [];
}>();

const typeLabel = computed(() => {
  if (!props.pin) {
    return '';
  }
  return props.pin.type === 'io' ? 'I/O' : props.pin.type[0].toUpperCase() + props.pin.type.slice(1);
});

const pinDisplayNumber = computed(() => props.pin?.displayNumber ?? props.pin?.number ?? '');

const summaryItems = computed(() => {
  if (!props.pin) {
    return [];
  }

  return [
    props.pin.boardHeader ? { label: 'Header', value: props.pin.boardHeader } : null,
    props.pin.boardLabel ? { label: 'Board Label', value: props.pin.boardLabel } : null,
    { label: 'GPIO', value: props.pin.gpio !== undefined ? `GPIO${props.pin.gpio}` : 'None' },
    { label: 'Type', value: typeLabel.value },
  ].filter((item): item is { label: string; value: string } => Boolean(item));
});

const makerWarningLabels = computed(() => getMakerWarnings(props.pin?.warnings).map(getWarningLabel));

const boardDesignWarningLabels = computed(() => getBoardDesignWarnings(props.pin?.warnings).map(getWarningLabel));

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
  gap: 16px;
  padding: 12px 20px 26px;
}

.pin-info__summary {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding-bottom: 2px;
}

.pin-info__stat {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
  margin: 0;
  border: 1px solid #dbe3ea;
  border-radius: 999px;
  padding: 5px 9px;
  background: #f8fafc;
}

.pin-info__stat span {
  color: #64748b;
  font-size: 0.66rem;
  font-weight: 850;
  line-height: 1;
  text-transform: uppercase;
}

.pin-info__stat strong {
  min-width: 0;
  color: #0f172a;
  font-size: 0.82rem;
  font-weight: 850;
  line-height: 1.1;
  overflow-wrap: anywhere;
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
