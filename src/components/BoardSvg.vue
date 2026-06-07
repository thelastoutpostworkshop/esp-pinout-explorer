<template>
  <div class="board-shell" :class="{ 'board-shell--animated': playIntroAnimation }" role="img" :aria-label="ariaLabel">
    <svg class="board-svg" viewBox="0 0 940 760" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boardBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#0f766e" />
          <stop offset="1" stop-color="#064e3b" />
        </linearGradient>
        <linearGradient id="moduleBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#273540" />
          <stop offset="1" stop-color="#101820" />
        </linearGradient>
        <filter id="boardShadow" x="-14%" y="-12%" width="128%" height="128%">
          <feDropShadow dx="0" dy="18" flood-color="#0f172a" flood-opacity="0.18" stdDeviation="16" />
        </filter>
      </defs>

      <rect class="board-body" x="160" y="52" width="620" height="656" rx="22" fill="url(#boardBody)" filter="url(#boardShadow)" />
      <rect class="board-inner" x="190" y="86" width="560" height="588" rx="14" fill="none" stroke="#34d399" stroke-opacity="0.38" stroke-width="2" />

      <g class="board-usb">
        <rect x="392" y="22" width="70" height="40" rx="7" />
        <rect x="478" y="22" width="70" height="40" rx="7" />
        <text x="427" y="15" text-anchor="middle">UART</text>
        <text x="513" y="15" text-anchor="middle">USB</text>
      </g>

      <text class="header-name" x="232" y="82" text-anchor="middle">J1</text>
      <text class="header-name" x="708" y="82" text-anchor="middle">J3</text>

      <g class="module">
        <rect x="316" y="194" width="308" height="300" rx="9" fill="url(#moduleBody)" stroke="#475569" stroke-width="2" />
        <rect
          x="354"
          y="238"
          width="232"
          height="212"
          rx="5"
          fill="none"
          stroke="#94a3b8"
          stroke-dasharray="8 8"
          stroke-width="2"
          opacity="0.75"
        />
        <text x="470" y="318" class="brand" text-anchor="middle">ESPRESSIF</text>
        <text x="470" y="374" class="chip-name" text-anchor="middle">{{ soc.name }}</text>
        <text x="470" y="414" class="board-details" text-anchor="middle">{{ packageName }}</text>
        <text x="470" y="436" class="board-details" text-anchor="middle">{{ filteredPinCount }} / {{ totalPinCount }} header pins</text>
      </g>

      <g class="board-component board-component--boot">
        <circle cx="292" cy="566" r="16" />
        <text x="292" y="596" text-anchor="middle">BOOT</text>
      </g>
      <g class="board-component board-component--rgb">
        <circle cx="662" cy="290" r="11" />
        <text x="662" y="318" text-anchor="middle">RGB</text>
      </g>

      <g
        v-for="pin in pins"
        :key="pin.id"
        class="board-pin"
        :class="pinClasses(pin)"
        :style="pinEntranceStyle(pin)"
        tabindex="0"
        role="button"
        :aria-label="pinLabel(pin)"
        @click="emit('pin-click', pin.id)"
        @keydown.enter.prevent="emit('pin-click', pin.id)"
        @keydown.space.prevent="emit('pin-click', pin.id)"
      >
        <title>{{ pinLabel(pin) }}</title>
        <circle class="board-pin__hole" :cx="pinGeometry(pin).hole.x" :cy="pinGeometry(pin).hole.y" r="5.2" />
        <rect
          class="board-pin__pad"
          :x="pinGeometry(pin).rect.x"
          :y="pinGeometry(pin).rect.y"
          :width="pinGeometry(pin).rect.width"
          :height="pinGeometry(pin).rect.height"
          :rx="pinGeometry(pin).rect.rx"
        />
        <text
          class="board-pin__label"
          :x="pinGeometry(pin).label.x"
          :y="pinGeometry(pin).label.y"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ pin.boardLabel ?? pin.name }}
        </text>
        <text
          class="board-pin__number"
          :x="pinGeometry(pin).number.x"
          :y="pinGeometry(pin).number.y"
          :text-anchor="pinGeometry(pin).number.anchor"
          dominant-baseline="middle"
        >
          {{ pin.displayNumber }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { hasMakerWarning } from '@/data/pinWarnings';
import type { PinSide, SocDefinition, SocPin } from '@/types/soc';

const props = defineProps<{
  soc: SocDefinition;
  packageName: string;
  pins: SocPin[];
  selectedPinId: string | null;
  filteredPinIds: Set<string>;
  filteredPinCount: number;
  totalPinCount: number;
  hasFilter: boolean;
}>();

const emit = defineEmits<{
  'pin-click': [pinId: string];
}>();

const pins = computed(() => props.pins);
const playIntroAnimation = ref(false);
let introAnimationFrame = 0;

const ariaLabel = computed(
  () => `${props.soc.name} ${props.packageName} board profile, ${props.filteredPinCount} of ${props.totalPinCount} header pins shown`,
);

interface PointText {
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
}

interface Geometry {
  rect: { x: number; y: number; width: number; height: number; rx: number };
  hole: { x: number; y: number };
  label: PointText;
  number: PointText;
}

const pinStartY = 112;
const pinEndY = 648;

const sideOrders = computed<Record<'left' | 'right', number>>(() => ({
  left: sideMaxOrder('left'),
  right: sideMaxOrder('right'),
}));

function sideMaxOrder(side: 'left' | 'right') {
  return Math.max(
    1,
    ...props.pins.filter((pin) => pin.position.side === side).map((pin) => pin.position.order),
  );
}

function sideCoordinate(side: 'left' | 'right', order: number) {
  const count = sideOrders.value[side];
  if (count <= 1) {
    return (pinStartY + pinEndY) / 2;
  }
  return pinStartY + ((order - 1) * (pinEndY - pinStartY)) / (count - 1);
}

function pinGeometry(pin: SocPin): Geometry {
  const side = pin.position.side === 'right' ? 'right' : 'left';
  const y = sideCoordinate(side, pin.position.order);

  if (side === 'right') {
    return {
      rect: { x: 658, y: y - 12, width: 76, height: 24, rx: 5 },
      hole: { x: 748, y },
      label: { x: 696, y },
      number: { x: 746, y: y - 17, anchor: 'end' },
    };
  }

  return {
    rect: { x: 206, y: y - 12, width: 76, height: 24, rx: 5 },
    hole: { x: 192, y },
    label: { x: 244, y },
    number: { x: 194, y: y - 17, anchor: 'start' },
  };
}

function pinClasses(pin: SocPin) {
  const selected = pin.id === props.selectedPinId;
  const matched = props.filteredPinIds.has(pin.id);
  return {
    'board-pin--selected': selected,
    'board-pin--dimmed': props.hasFilter && !matched,
    'board-pin--matched': props.hasFilter && matched,
    [`board-pin--${pin.type}`]: true,
    'board-pin--warning': hasMakerWarning(pin),
  };
}

function pinEntranceStyle(pin: SocPin) {
  const sideEffects: Record<PinSide, { delay: number; x: string; y: string }> = {
    top: { delay: 520, x: '0', y: '-26px' },
    right: { delay: 700, x: '42px', y: '0' },
    bottom: { delay: 880, x: '0', y: '26px' },
    left: { delay: 700, x: '-42px', y: '0' },
    center: { delay: 760, x: '0', y: '20px' },
  };
  const effect = sideEffects[pin.position.side];

  return {
    '--pin-enter-delay': `${effect.delay}ms`,
    '--pin-enter-x': effect.x,
    '--pin-enter-y': effect.y,
  };
}

function pinLabel(pin: SocPin) {
  const gpio = pin.gpio !== undefined ? `, GPIO${pin.gpio}` : '';
  const header = pin.displayNumber ? `${pin.displayNumber}, ` : '';
  return `${header}${pin.name}${gpio}`;
}

function replayIntroAnimation() {
  if (typeof window === 'undefined') {
    return;
  }

  playIntroAnimation.value = false;
  window.cancelAnimationFrame(introAnimationFrame);
  introAnimationFrame = window.requestAnimationFrame(() => {
    introAnimationFrame = window.requestAnimationFrame(() => {
      playIntroAnimation.value = true;
    });
  });
}

onMounted(replayIntroAnimation);

watch(() => [props.soc.id, props.packageName, props.totalPinCount], replayIntroAnimation);

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.cancelAnimationFrame(introAnimationFrame);
  }
});
</script>

<style scoped>
.board-shell {
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden;
}

.board-svg {
  width: min(100%, 940px);
  height: auto;
  max-height: calc(100vh - 96px);
  min-height: 520px;
  transform-origin: center;
}

.board-shell--animated .board-svg {
  animation: board-scene-enter 900ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.board-body,
.board-inner,
.module,
.board-usb,
.board-component {
  transform-box: fill-box;
  transform-origin: center;
}

.board-shell--animated .board-body {
  animation: board-body-enter 850ms 80ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.board-shell--animated .module {
  animation: module-enter 760ms 310ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.board-shell--animated .board-usb,
.board-shell--animated .board-component {
  animation: component-enter 560ms 520ms ease-out both;
}

.board-usb rect {
  fill: #e2e8f0;
  stroke: #64748b;
  stroke-width: 2;
}

.board-usb text,
.board-component text,
.header-name {
  fill: #334155;
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 0;
}

.board-component circle {
  fill: #f8fafc;
  stroke: #0f172a;
  stroke-width: 2;
}

.board-component--rgb circle {
  fill: #f97316;
  filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.75));
}

.brand {
  fill: #d7dde3;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0;
}

.chip-name {
  fill: #ffffff;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 0;
}

.board-details {
  fill: #cbd5e1;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0;
}

.board-pin {
  --pin-enter-delay: 220ms;
  --pin-enter-x: 0;
  --pin-enter-y: 0;
  cursor: pointer;
  outline: none;
  transform-box: fill-box;
  transform-origin: center;
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}

.board-shell--animated .board-pin {
  animation: pin-edge-enter 620ms var(--pin-enter-delay) cubic-bezier(0.16, 1.05, 0.26, 1) both;
}

.board-pin__pad {
  fill: #f8fafc;
  stroke: #334155;
  stroke-width: 1.6;
  transition:
    fill 150ms ease,
    stroke 150ms ease,
    stroke-width 150ms ease;
}

.board-pin__hole {
  fill: #ecfeff;
  stroke: #0f172a;
  stroke-width: 1.4;
}

.board-pin--io .board-pin__pad {
  fill: #93c5fd;
}

.board-pin--analog .board-pin__pad {
  fill: #86efac;
}

.board-pin--power .board-pin__pad {
  fill: #f87171;
}

.board-pin--ground .board-pin__pad {
  fill: #e2e8f0;
}

.board-pin--control .board-pin__pad {
  fill: #fbbf24;
}

.board-pin--warning .board-pin__pad {
  filter: drop-shadow(0 0 1px rgba(66, 32, 6, 0.95)) drop-shadow(0 0 5px rgba(250, 204, 21, 0.95));
  stroke: #facc15;
  stroke-width: 3.6;
}

.board-pin--matched .board-pin__pad {
  fill: #ccfbf1;
  stroke: #0f766e;
  stroke-width: 2.6;
}

.board-pin--selected {
  animation: selected-pin-pop 420ms cubic-bezier(0.2, 1.35, 0.35, 1);
  transform: scale(1.2);
}

.board-pin--selected .board-pin__pad {
  fill: #2563eb;
  stroke: #1e3a8a;
  stroke-width: 3.2;
}

.board-pin--dimmed {
  opacity: 0.25 !important;
}

.board-pin:hover .board-pin__pad,
.board-pin:focus .board-pin__pad {
  stroke: #0f766e;
  stroke-width: 3;
}

.board-pin__label {
  fill: #0f172a;
  font-size: 12px;
  font-weight: 900;
  pointer-events: none;
}

.board-pin--selected .board-pin__label {
  fill: #ffffff;
  font-size: 14px;
}

.board-pin__number {
  fill: #dbeafe;
  font-size: 9px;
  font-weight: 850;
  pointer-events: none;
}

@keyframes board-scene-enter {
  0% {
    opacity: 0;
    filter: blur(3px);
    transform: translateY(24px) scale(0.9);
  }

  58% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(-4px) scale(1.018);
  }

  100% {
    opacity: 1;
    filter: blur(0);
    transform: translateY(0) scale(1);
  }
}

@keyframes board-body-enter {
  0% {
    opacity: 0;
    transform: translateY(28px) scale(0.88);
  }

  68% {
    opacity: 1;
    transform: translateY(-5px) scale(1.025);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes module-enter {
  0% {
    opacity: 0;
    transform: scale(0.82);
  }

  72% {
    opacity: 1;
    transform: scale(1.018);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes component-enter {
  0% {
    opacity: 0;
    transform: scale(0.76);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes selected-pin-pop {
  0% {
    transform: scale(1);
  }

  58% {
    transform: scale(1.34);
  }

  100% {
    transform: scale(1.2);
  }
}

@keyframes pin-edge-enter {
  0% {
    opacity: 0;
    transform: translate(var(--pin-enter-x), var(--pin-enter-y)) scale(0.78);
  }

  68% {
    opacity: 1;
    transform: translate(0, 0) scale(1.06);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .board-svg,
  .board-body,
  .module,
  .board-usb,
  .board-component,
  .board-pin,
  .board-pin--selected {
    animation: none;
  }
}

@media (max-width: 760px) {
  .board-svg {
    width: min(100%, 700px);
    min-height: 0;
    max-height: calc(100vh - 92px);
  }

  .board-pin__number {
    display: none;
  }
}
</style>
