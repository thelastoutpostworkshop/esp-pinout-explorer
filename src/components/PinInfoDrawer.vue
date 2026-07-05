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
        <section
          v-if="makerDecision"
          class="pin-info__decision"
          :class="`pin-info__decision--${makerDecision.tone}`"
          aria-label="Maker decision summary"
        >
          <div class="pin-info__decision-heading">
            <span class="pin-info__decision-icon" aria-hidden="true">
              <ShieldCheck v-if="makerDecision.tone === 'good'" :size="18" />
              <Info v-else-if="makerDecision.tone === 'neutral'" :size="18" />
              <AlertTriangle v-else :size="18" />
            </span>
            <div>
              <h2>{{ makerDecision.title }}</h2>
              <p>{{ makerDecision.body }}</p>
            </div>
          </div>
          <ul class="pin-info__decision-reasons">
            <li
              v-for="reason in makerDecision.reasons"
              :key="`${reason.label}-${reason.description}`"
              :class="`pin-info__decision-reason--${reason.tone}`"
            >
              <strong>{{ reason.label }}</strong>
              <span>{{ reason.description }}</span>
            </li>
          </ul>
        </section>

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

        <section v-if="nativeFixedFunctions.length" class="pin-info__section pin-info__section--native-functions">
          <div class="pin-info__section-heading">
            <h2>Native Fixed Functions</h2>
            <InfoTooltip
              label="What are native fixed functions?"
              text="Native fixed functions are IO MUX signals available directly on this physical pin. This section only shows fixed functions that are not already listed in Main Functions."
            />
          </div>
          <div class="pin-info__chips">
            <FunctionChip
              v-for="item in nativeFixedFunctions"
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
import { AlertTriangle, BookOpen, Info, ShieldCheck, X } from '@lucide/vue';
import FunctionChip from '@/components/FunctionChip.vue';
import InfoTooltip from '@/components/InfoTooltip.vue';
import { getFunctionDescription } from '@/data/functionDescriptions';
import { getBoardDesignWarnings, getMakerWarnings, getWarningLabel } from '@/data/pinWarnings';
import type { PinWarning, SocPin, SocSource } from '@/types/soc';

const props = defineProps<{
  pin: SocPin | null;
  source: SocSource;
}>();

const emit = defineEmits<{
  close: [];
}>();

type MakerDecisionTone = 'good' | 'caution' | 'avoid' | 'neutral';

interface MakerDecisionReason {
  label: string;
  description: string;
  tone: MakerDecisionTone;
}

interface MakerDecision {
  title: string;
  body: string;
  tone: MakerDecisionTone;
  reasons: MakerDecisionReason[];
}

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

const makerDecision = computed(() => (props.pin ? buildMakerDecision(props.pin) : null));

const nativeFixedFunctions = computed(() => {
  if (!props.pin?.ioMux?.length) {
    return [];
  }

  const mainFunctionKeys = new Set(props.pin.mainFunctions.map(normalizeFunctionKey));
  return props.pin.ioMux.filter((item) => !mainFunctionKeys.has(normalizeFunctionKey(item)));
});

function onDrawerUpdate(value: boolean) {
  if (!value) {
    emit('close');
  }
}

function buildMakerDecision(pin: SocPin): MakerDecision {
  const warnings = pin.warnings ?? [];
  const makerWarnings = getMakerWarnings(warnings);
  const boardDesignWarnings = getBoardDesignWarnings(warnings);
  const reasons = warningReasons(warnings);

  if (pin.type === 'power') {
    return {
      title: 'Power only',
      body: 'Use this as a supply or reference rail, not as a GPIO signal.',
      tone: 'neutral',
      reasons: [
        { label: 'Power rail', description: 'Do not use this pin for digital or analog I/O.', tone: 'neutral' },
        ...reasons,
      ],
    };
  }

  if (pin.type === 'ground') {
    return {
      title: 'Ground reference',
      body: 'Use this for ground return or reference connections, not as a GPIO signal.',
      tone: 'neutral',
      reasons: [
        { label: 'Ground', description: 'Tie this to circuit ground where needed.', tone: 'neutral' },
        ...reasons,
      ],
    };
  }

  if (pin.type === 'control') {
    return {
      title: 'Board control',
      body: 'This pin controls board or chip behavior. Avoid using it as normal project I/O.',
      tone: 'avoid',
      reasons: [
        { label: 'Control signal', description: 'Changing this signal can affect reset, boot, or board operation.', tone: 'avoid' },
        ...reasons,
      ],
    };
  }

  if (pin.gpio === undefined) {
    return {
      title: 'Not a GPIO',
      body: 'Use this only for the named board or package role.',
      tone: 'neutral',
      reasons: [
        { label: 'No GPIO number', description: 'It is not available as software-controlled I/O.', tone: 'neutral' },
        ...reasons,
      ],
    };
  }

  if (warnings.includes('flash') || warnings.includes('reset')) {
    return {
      title: 'Avoid for normal projects',
      body: 'This pin has a fixed or high-risk role. Pick another GPIO unless you specifically need this signal.',
      tone: 'avoid',
      reasons,
    };
  }

  if (makerWarnings.length > 0) {
    return {
      title: 'Use with caution',
      body: 'This GPIO can be useful, but its board or boot role can affect ordinary projects.',
      tone: 'caution',
      reasons,
    };
  }

  if (isInputOnlyPin(pin)) {
    return {
      title: 'Input-only GPIO',
      body: 'Good for sensing signals, but do not use it where output drive is required.',
      tone: 'caution',
      reasons: [
        { label: 'Input only', description: 'Use as an input; choose another GPIO for output, PWM, or bus drive.', tone: 'caution' },
        ...reasons,
      ],
    };
  }

  if (boardDesignWarnings.length > 0) {
    return {
      title: 'Usable with design notes',
      body: 'No maker-warning categories are present, but check the notes before using this pin in sensitive circuits.',
      tone: 'neutral',
      reasons,
    };
  }

  return {
    title: pin.boardHeader ? 'Good general GPIO' : 'GPIO candidate',
    body: pin.boardHeader
      ? 'No maker warnings are recorded for this exposed board-header GPIO.'
      : 'No maker warnings are recorded for this package pin. Check module or board context before wiring.',
    tone: 'good',
    reasons: [
      {
        label: pin.boardHeader ? 'Board-header GPIO' : 'GPIO',
        description: pin.boardHeader ? 'Exposed on this selected board profile.' : 'Available as a GPIO on this package profile.',
        tone: 'good',
      },
      { label: 'No maker warnings', description: 'No boot, USB, UART0, reset, PSRAM, voltage, or onboard-hardware warning is recorded.', tone: 'good' },
    ],
  };
}

function warningReasons(warnings: PinWarning[]): MakerDecisionReason[] {
  return warnings.map((warning) => ({
    label: getWarningLabel(warning),
    description: warningDecisionText[warning],
    tone: warningDecisionTone(warning),
  }));
}

function warningDecisionTone(warning: PinWarning): MakerDecisionTone {
  if (warning === 'flash' || warning === 'reset') {
    return 'avoid';
  }

  if (getMakerWarnings([warning]).length > 0) {
    return 'caution';
  }

  return 'neutral';
}

const warningDecisionText: Record<PinWarning, string> = {
  boot: 'Can affect startup or flashing behavior.',
  flash: 'Reserved for flash-memory communication on relevant packages or boards.',
  glitch: 'May change state briefly during power-up or reset.',
  jtag: 'May be used by debug hardware or fixed debug functions.',
  onboard: 'Connected to onboard hardware, so external circuits can interfere.',
  power: 'Has power-domain or supply-role constraints.',
  psram: 'May be constrained by module PSRAM or memory wiring.',
  reset: 'Controls reset or chip enable; do not use as normal I/O.',
  strapping: 'Sampled at reset, so external circuits can change boot mode.',
  uart0: 'Shared with default serial programming, logs, or USB-UART bridge paths.',
  usb: 'Shared with native USB signals or board USB routing.',
  voltage: 'Voltage-sensitive; check the official limits before wiring.',
};

function isInputOnlyPin(pin: SocPin) {
  const searchableText = [
    pin.name,
    ...pin.mainFunctions,
    ...(pin.ioMux ?? []),
    ...(pin.notes ?? []),
    ...(pin.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase();

  return searchableText.includes('input only') || searchableText.includes('input-only');
}

function normalizeFunctionKey(value: string) {
  return value.toUpperCase().replace(/[\s_]+/g, '');
}
</script>

<style scoped>
.pin-info {
  min-height: 100%;
  border-left: 1px solid var(--app-panel-highlight);
  color: var(--app-text);
  background: var(--app-surface-bg);
  box-shadow:
    inset 1px 0 0 var(--app-panel-highlight),
    var(--app-panel-shadow);
}

.pin-info__title {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 20px 12px;
}

.pin-info__eyebrow {
  color: var(--app-muted);
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
}

.pin-info__name {
  color: var(--app-text);
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

.pin-info__decision {
  display: grid;
  gap: 11px;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  padding: 12px;
  background: var(--app-surface-muted);
}

.pin-info__decision--good {
  border-color: color-mix(in srgb, var(--app-link) 38%, var(--app-border));
  background: color-mix(in srgb, var(--app-accent-soft-bg) 62%, var(--app-surface-bg));
}

.pin-info__decision--caution {
  border-color: color-mix(in srgb, var(--app-warning-soft-text) 52%, var(--app-border));
  background: color-mix(in srgb, var(--app-warning-soft-bg) 70%, var(--app-surface-bg));
}

.pin-info__decision--avoid {
  border-color: rgba(248, 113, 113, 0.78);
  background: color-mix(in srgb, #f87171 14%, var(--app-surface-bg));
}

.pin-info__decision--neutral {
  border-color: color-mix(in srgb, var(--app-info-soft-text) 35%, var(--app-border));
  background: color-mix(in srgb, var(--app-info-soft-bg) 56%, var(--app-surface-bg));
}

.pin-info__decision-heading {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 9px;
  align-items: start;
}

.pin-info__decision-icon {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  color: var(--app-link);
  background: var(--app-surface-bg);
}

.pin-info__decision--caution .pin-info__decision-icon {
  color: var(--app-warning-soft-text);
}

.pin-info__decision--avoid .pin-info__decision-icon {
  color: #b91c1c;
}

.pin-info__decision-heading h2 {
  margin: 0;
  color: var(--app-text);
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0;
  line-height: 1.2;
}

.pin-info__decision-heading p {
  margin: 3px 0 0;
  color: var(--app-text);
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.38;
}

.pin-info__decision-reasons {
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.pin-info__decision-reasons li {
  display: grid;
  gap: 2px;
  border-left: 3px solid var(--app-border);
  padding-left: 8px;
}

.pin-info__decision-reason--good {
  border-left-color: var(--app-link);
}

.pin-info__decision-reason--caution {
  border-left-color: var(--app-warning-soft-text);
}

.pin-info__decision-reason--avoid {
  border-left-color: #dc2626;
}

.pin-info__decision-reason--neutral {
  border-left-color: var(--app-info-soft-text);
}

.pin-info__decision-reasons strong {
  color: var(--app-text);
  font-size: 0.76rem;
  font-weight: 900;
  line-height: 1.2;
}

.pin-info__decision-reasons span {
  color: var(--app-muted);
  font-size: 0.8rem;
  font-weight: 650;
  line-height: 1.35;
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
  border: 1px solid var(--app-border);
  border-radius: 999px;
  padding: 5px 9px;
  background: var(--app-surface-muted);
}

.pin-info__stat span {
  color: var(--app-muted);
  font-size: 0.66rem;
  font-weight: 850;
  line-height: 1;
  text-transform: uppercase;
}

.pin-info__stat strong {
  min-width: 0;
  color: var(--app-text);
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
  color: var(--app-muted);
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
  color: var(--app-text);
  line-height: 1.45;
}

.pin-info__source {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--app-muted);
  font-size: 0.82rem;
  line-height: 1.35;
}

.pin-info__source a {
  color: var(--app-link);
  font-weight: 700;
  text-decoration: none;
}
</style>
