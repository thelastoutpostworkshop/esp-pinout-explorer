<template>
  <div class="chip-shell" role="img" :aria-label="`${soc.name} package pinout`">
    <svg class="chip-svg" viewBox="0 -60 960 920" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chipBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#26343d" />
          <stop offset="1" stop-color="#101820" />
        </linearGradient>
        <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="18" flood-color="#0f172a" flood-opacity="0.18" stdDeviation="14" />
        </filter>
      </defs>

      <rect x="178" y="58" width="604" height="604" rx="12" fill="#1f2933" filter="url(#softShadow)" />
      <rect x="210" y="90" width="540" height="540" rx="7" fill="url(#chipBody)" stroke="#334155" stroke-width="2" />
      <rect
        x="300"
        y="180"
        width="360"
        height="360"
        rx="4"
        fill="none"
        stroke="#9ca3af"
        stroke-dasharray="8 8"
        stroke-width="2"
        opacity="0.75"
      />
      <circle cx="254" cy="132" r="14" fill="#0b1117" stroke="#e5e7eb" stroke-width="4" />

      <text x="480" y="316" class="brand" text-anchor="middle">ESPRESSIF</text>
      <text x="480" y="396" class="chip-name" text-anchor="middle">{{ soc.name }}</text>

      <g
        v-for="pin in pins"
        :key="pin.id"
        class="pin-node"
        :class="pinClasses(pin)"
        tabindex="0"
        role="button"
        :aria-label="pinLabel(pin)"
        @click="emit('pin-click', pin.id)"
        @keydown.enter.prevent="emit('pin-click', pin.id)"
        @keydown.space.prevent="emit('pin-click', pin.id)"
      >
        <title>{{ pinLabel(pin) }}</title>
        <rect
          v-if="pin.position.side !== 'center'"
          :x="pinGeometry(pin).rect.x"
          :y="pinGeometry(pin).rect.y"
          :width="pinGeometry(pin).rect.width"
          :height="pinGeometry(pin).rect.height"
          :rx="pinGeometry(pin).rect.rx"
        />
        <rect
          v-else
          :x="pinGeometry(pin).rect.x"
          :y="pinGeometry(pin).rect.y"
          :width="pinGeometry(pin).rect.width"
          :height="pinGeometry(pin).rect.height"
          :rx="pinGeometry(pin).rect.rx"
          stroke-dasharray="7 7"
        />
        <text
          class="pin-number"
          :x="pinGeometry(pin).number.x"
          :y="pinGeometry(pin).number.y"
          :transform="pinGeometry(pin).number.transform"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ pin.number }}
        </text>
        <text
          class="pin-label"
          :x="pinGeometry(pin).label.x"
          :y="pinGeometry(pin).label.y"
          :transform="pinGeometry(pin).label.transform"
          :text-anchor="pinGeometry(pin).label.anchor"
          dominant-baseline="middle"
        >
          {{ pin.name }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PinSide, SocDefinition, SocPin } from '@/types/soc';

const props = defineProps<{
  soc: SocDefinition;
  pins: SocPin[];
  selectedPinId: string | null;
  filteredPinIds: Set<string>;
  hasFilter: boolean;
}>();

const emit = defineEmits<{
  'pin-click': [pinId: string];
}>();

const pins = computed(() => props.pins);

interface PointText {
  x: number;
  y: number;
  transform?: string;
  anchor?: 'start' | 'middle' | 'end';
}

interface Geometry {
  rect: { x: number; y: number; width: number; height: number; rx: number };
  number: PointText;
  label: PointText;
}

const verticalStart = 128;
const verticalEnd = 552;
const horizontalStart = 230;
const horizontalEnd = 730;

const sideOrders = computed<Record<Exclude<PinSide, 'center'>, number>>(() => ({
  left: sideMaxOrder('left'),
  bottom: sideMaxOrder('bottom'),
  right: sideMaxOrder('right'),
  top: sideMaxOrder('top'),
}));

function sideMaxOrder(side: Exclude<PinSide, 'center'>) {
  return Math.max(
    1,
    ...props.pins.filter((pin) => pin.position.side === side).map((pin) => pin.position.order),
  );
}

function sideCoordinate(side: Exclude<PinSide, 'center'>, order: number) {
  const start = side === 'left' || side === 'right' ? verticalStart : horizontalStart;
  const end = side === 'left' || side === 'right' ? verticalEnd : horizontalEnd;
  const count = sideOrders.value[side];
  if (count <= 1) {
    return (start + end) / 2;
  }
  return start + ((order - 1) * (end - start)) / (count - 1);
}

function pinGeometry(pin: SocPin): Geometry {
  if (pin.position.side === 'left') {
    const y = sideCoordinate('left', pin.position.order);
    return {
      rect: { x: 196, y: y - 12, width: 34, height: 24, rx: 3 },
      number: { x: 213, y },
      label: { x: 176, y, anchor: 'end' },
    };
  }

  if (pin.position.side === 'bottom') {
    const x = sideCoordinate('bottom', pin.position.order);
    return {
      rect: { x: x - 12, y: 610, width: 24, height: 34, rx: 3 },
      number: { x, y: 627, transform: `rotate(90 ${x} 627)` },
      label: { x, y: 700, transform: `rotate(90 ${x} 700)`, anchor: 'start' },
    };
  }

  if (pin.position.side === 'right') {
    const y = sideCoordinate('right', pin.position.order);
    return {
      rect: { x: 730, y: y - 12, width: 34, height: 24, rx: 3 },
      number: { x: 747, y },
      label: { x: 784, y, anchor: 'start' },
    };
  }

  if (pin.position.side === 'top') {
    const x = sideCoordinate('top', pin.position.order);
    return {
      rect: { x: x - 12, y: 76, width: 24, height: 34, rx: 3 },
      number: { x, y: 93, transform: `rotate(-90 ${x} 93)` },
      label: { x, y: 56, transform: `rotate(-90 ${x} 56)`, anchor: 'start' },
    };
  }

  return {
    rect: { x: 604, y: 488, width: 76, height: 34, rx: 4 },
    number: { x: 620, y: 505 },
    label: { x: 640, y: 505, anchor: 'start' },
  };
}

function pinClasses(pin: SocPin) {
  const selected = pin.id === props.selectedPinId;
  const matched = props.filteredPinIds.has(pin.id);
  return {
    'pin-node--selected': selected,
    'pin-node--dimmed': props.hasFilter && !matched,
    'pin-node--matched': props.hasFilter && matched,
    [`pin-node--${pin.type}`]: true,
    'pin-node--warning': Boolean(pin.warnings?.length),
  };
}

function pinLabel(pin: SocPin) {
  const gpio = pin.gpio !== undefined ? `, GPIO${pin.gpio}` : '';
  return `Pin ${pin.number}, ${pin.name}${gpio}`;
}
</script>

<style scoped>
.chip-shell {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}

.chip-svg {
  width: min(100%, 980px);
  height: auto;
  max-height: calc(100vh - 220px);
  min-height: 440px;
}

.brand {
  fill: #d7dde3;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: 0;
}

.chip-name {
  fill: #ffffff;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: 0;
}

.pin-node {
  cursor: pointer;
  outline: none;
  transform-box: fill-box;
  transform-origin: center;
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.pin-node rect {
  fill: #f8fafc;
  stroke: #334155;
  stroke-width: 1.6;
  transition:
    fill 150ms ease,
    stroke 150ms ease,
    stroke-width 150ms ease;
}

.pin-node--io rect {
  fill: #93c5fd;
}

.pin-node--analog rect {
  fill: #86efac;
}

.pin-node--power rect {
  fill: #f87171;
}

.pin-node--ground rect {
  fill: #e2e8f0;
}

.pin-node--warning rect {
  filter: drop-shadow(0 0 1px rgba(66, 32, 6, 0.95)) drop-shadow(0 0 4px rgba(250, 204, 21, 0.85));
  stroke: #facc15;
  stroke-width: 3.6;
}

.pin-node--matched rect {
  fill: #ccfbf1;
  stroke: #0f766e;
  stroke-width: 2.6;
}

.pin-node--selected rect {
  fill: #2563eb;
  stroke: #1e3a8a;
  stroke-width: 3.2;
}

.pin-node--selected {
  animation: selected-pin-pop 420ms cubic-bezier(0.2, 1.35, 0.35, 1);
  transform: scale(1.22);
}

.pin-node--dimmed {
  opacity: 0.28;
}

.pin-node:hover rect,
.pin-node:focus rect {
  stroke: #0f766e;
  stroke-width: 3;
}

.pin-number {
  fill: #0f172a;
  font-size: 12px;
  font-weight: 800;
  pointer-events: none;
}

.pin-node--selected .pin-number {
  fill: #ffffff;
  font-size: 14px;
}

.pin-label {
  fill: #1f2937;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0;
  pointer-events: none;
}

.pin-node--selected .pin-label {
  fill: #1d4ed8;
  font-size: 16px;
  font-weight: 900;
}

@keyframes selected-pin-pop {
  0% {
    transform: scale(1);
  }

  58% {
    transform: scale(1.38);
  }

  100% {
    transform: scale(1.22);
  }
}

@media (max-width: 760px) {
  .chip-svg {
    min-height: 380px;
  }

  .pin-label {
    font-size: 12px;
  }
}
</style>
