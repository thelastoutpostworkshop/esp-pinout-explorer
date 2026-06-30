<template>
  <div
    class="chip-shell"
    :class="{ 'chip-shell--animated': playIntroAnimation, 'chip-shell--compact-labels': compactLayout }"
    role="img"
    :aria-label="`${soc.name} ${packageName} pinout, ${filteredPinCount} of ${totalPinCount} pins shown`"
  >
    <svg class="chip-svg" :viewBox="svgViewBox" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chipBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#26343d" />
          <stop offset="1" stop-color="#101820" />
        </linearGradient>
        <filter id="softShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="18" flood-color="#0f172a" flood-opacity="0.18" stdDeviation="14" />
        </filter>
        <linearGradient id="chipSheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.18" />
          <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <clipPath id="chipBodyClip">
          <rect x="210" y="90" width="540" height="540" rx="7" />
        </clipPath>
      </defs>

      <rect
        class="chip-body-shadow"
        x="178"
        y="58"
        width="604"
        height="604"
        rx="12"
        fill="#1f2933"
        filter="url(#softShadow)"
      />
      <rect class="chip-body" x="210" y="90" width="540" height="540" rx="7" fill="url(#chipBody)" stroke="#334155" stroke-width="2" />
      <g clip-path="url(#chipBodyClip)">
        <rect class="chip-sheen" x="60" y="70" width="180" height="600" fill="url(#chipSheen)" />
      </g>
      <rect class="chip-edge-glow" x="210" y="90" width="540" height="540" rx="7" fill="none" />
      <circle class="chip-orientation-dot" cx="254" cy="132" r="14" fill="#0b1117" stroke="#e5e7eb" stroke-width="4" />

      <image
        class="espressif-logo"
        :href="espressifLogoOnDarkUrl"
        x="330"
        y="274"
        width="300"
        height="54"
        preserveAspectRatio="xMidYMid meet"
      />
      <text x="480" y="396" class="chip-name" text-anchor="middle">{{ soc.name }}</text>
      <text
        v-for="(line, index) in chipCpuLines"
        :key="line"
        x="480"
        :y="432 + index * 18"
        class="chip-cpu"
        text-anchor="middle"
      >
        {{ line }}
      </text>
      <text x="480" :y="chipPinCountY" class="chip-details" text-anchor="middle">
        {{ filteredPinCount }} / {{ totalPinCount }} pins
      </text>

      <g
        v-for="pin in pins"
        :key="pin.id"
        class="pin-node"
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
        <path
          v-if="hasWarning(pin)"
          class="pin-node__warning-badge"
          :d="warningBadgePath(pinGeometry(pin).rect)"
          aria-hidden="true"
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
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import espressifLogoOnDarkUrl from '@/assets/espressif-logo-on-dark.svg';
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
const compactLayout = ref(false);
let introAnimationFrame = 0;
let compactMediaQuery: MediaQueryList | null = null;

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

const svgViewBox = computed(() => (compactLayout.value ? '166 48 628 628' : '0 -60 960 920'));
const chipCpuLines = computed(() => splitCpuSummary(props.soc.chipSpecs?.cpu ?? 'CPU details unavailable'));
const chipPinCountY = computed(() => 452 + Math.max(0, chipCpuLines.value.length - 1) * 18);

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
      label: compactLayout.value ? { x: 236, y, anchor: 'start' } : { x: 176, y, anchor: 'end' },
    };
  }

  if (pin.position.side === 'bottom') {
    const x = sideCoordinate('bottom', pin.position.order);
    return {
      rect: { x: x - 12, y: 610, width: 24, height: 34, rx: 3 },
      number: { x, y: 627, transform: `rotate(90 ${x} 627)` },
      label: compactLayout.value
        ? { x, y: 594, transform: `rotate(90 ${x} 594)`, anchor: 'end' }
        : { x, y: 674, transform: `rotate(90 ${x} 674)`, anchor: 'start' },
    };
  }

  if (pin.position.side === 'right') {
    const y = sideCoordinate('right', pin.position.order);
    return {
      rect: { x: 730, y: y - 12, width: 34, height: 24, rx: 3 },
      number: { x: 747, y },
      label: compactLayout.value ? { x: 724, y, anchor: 'end' } : { x: 784, y, anchor: 'start' },
    };
  }

  if (pin.position.side === 'top') {
    const x = sideCoordinate('top', pin.position.order);
    return {
      rect: { x: x - 12, y: 76, width: 24, height: 34, rx: 3 },
      number: { x, y: 93, transform: `rotate(-90 ${x} 93)` },
      label: compactLayout.value
        ? { x, y: 126, transform: `rotate(-90 ${x} 126)`, anchor: 'end' }
        : { x, y: 56, transform: `rotate(-90 ${x} 56)`, anchor: 'start' },
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
    'pin-node--warning': hasWarning(pin),
  };
}

function splitCpuSummary(value: string) {
  const normalized = value.replace(/;.*$/, '').replace(/,\s*plus\s+/i, ', plus ').trim();
  const maxLineLength = 44;

  if (normalized.length <= maxLineLength) {
    return [normalized];
  }

  const breakIndex = normalized.lastIndexOf(',', maxLineLength);
  if (breakIndex > 20) {
    return [normalized.slice(0, breakIndex).trim(), normalized.slice(breakIndex + 1).trim()];
  }

  const words = normalized.split(/\s+/);
  const lines: string[] = [''];
  for (const word of words) {
    const current = lines[lines.length - 1];
    if (current && `${current} ${word}`.length > maxLineLength && lines.length < 2) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = current ? `${current} ${word}` : word;
    }
  }

  return lines.slice(0, 2);
}

function hasWarning(pin: SocPin) {
  return hasMakerWarning(pin);
}

function warningBadgePath(rect: Geometry['rect']) {
  const size = Math.min(11, rect.width * 0.4, rect.height * 0.55);
  const x = rect.x + rect.width;
  const y = rect.y;
  return `M ${x - size} ${y} H ${x - rect.rx} Q ${x} ${y} ${x} ${y + rect.rx} V ${y + size} Z`;
}

function pinEntranceStyle(pin: SocPin) {
  const sideEffects: Record<PinSide, { delay: number; x: string; y: string }> = {
    top: { delay: 540, x: '0', y: '-42px' },
    right: { delay: 680, x: '42px', y: '0' },
    bottom: { delay: 820, x: '0', y: '42px' },
    left: { delay: 960, x: '-42px', y: '0' },
    center: { delay: 820, x: '0', y: '26px' },
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
  return `Pin ${pin.number}, ${pin.name}${gpio}`;
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

onMounted(() => {
  compactMediaQuery = window.matchMedia('(max-width: 760px)');
  compactLayout.value = compactMediaQuery.matches;
  compactMediaQuery.addEventListener('change', onCompactMediaQueryChange);
});

watch(() => [props.soc.id, props.packageName, props.totalPinCount], replayIntroAnimation);

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.cancelAnimationFrame(introAnimationFrame);
  }
  compactMediaQuery?.removeEventListener('change', onCompactMediaQueryChange);
});

function onCompactMediaQueryChange(event: MediaQueryListEvent) {
  compactLayout.value = event.matches;
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
  max-height: calc(100vh - 96px);
  min-height: 440px;
  transform-origin: center;
}

.chip-shell--animated .chip-svg {
  animation: chip-scene-enter 900ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.chip-body-shadow,
.chip-body,
.chip-edge-glow,
.chip-orientation-dot {
  transform-box: fill-box;
  transform-origin: center;
}

.chip-body-shadow {
  opacity: 1;
}

.chip-shell--animated .chip-body-shadow {
  animation: chip-body-enter 900ms 80ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.chip-body {
  opacity: 1;
}

.chip-shell--animated .chip-body {
  animation: chip-core-enter 940ms 130ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.chip-sheen {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.chip-shell--animated .chip-sheen {
  animation:
    chip-sheen-sweep 1300ms 560ms ease-out both,
    chip-sheen-idle 6200ms 2400ms ease-in-out infinite;
}

.chip-edge-glow {
  opacity: 0;
  stroke: #67e8f9;
  stroke-width: 2.6;
  filter: drop-shadow(0 0 7px rgba(103, 232, 249, 0.8));
}

.chip-shell--animated .chip-edge-glow {
  animation: chip-edge-pulse 1250ms 260ms ease-out both;
}

.chip-orientation-dot {
  opacity: 1;
}

.chip-shell--compact-labels .chip-orientation-dot {
  display: none;
}

.chip-shell--animated .chip-orientation-dot {
  animation: chip-dot-enter 560ms 560ms cubic-bezier(0.18, 1.55, 0.34, 1) both;
}

.espressif-logo {
  pointer-events: none;
}

.chip-shell--animated .espressif-logo {
  animation: chip-text-enter 620ms 520ms ease-out both;
}

.chip-name {
  fill: #ffffff;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: 0;
}

.chip-shell--animated .chip-name {
  animation: chip-text-enter 620ms 650ms ease-out both;
}

.chip-details {
  fill: #cbd5e1;
  font-size: 14px;
  font-weight: 750;
  letter-spacing: 0;
}

.chip-cpu {
  fill: #dbeafe;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0;
}

.chip-shell--animated .chip-details {
  animation: chip-text-enter 620ms 780ms ease-out both;
}

.chip-shell--animated .chip-cpu {
  animation: chip-text-enter 620ms 720ms ease-out both;
}

.pin-node {
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

.chip-shell--animated .pin-node {
  animation: pin-edge-enter 620ms var(--pin-enter-delay) cubic-bezier(0.16, 1.05, 0.26, 1) both;
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

.pin-node--control rect {
  fill: #fbbf24;
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
  opacity: 0.28 !important;
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
  fill: var(--chip-edge-label);
  stroke: var(--chip-edge-label-halo);
  stroke-linejoin: round;
  stroke-width: 3px;
  paint-order: stroke fill;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: 0;
  pointer-events: none;
}

.chip-shell--compact-labels .pin-label {
  fill: #dbeafe;
  stroke: transparent;
  stroke-width: 0;
  font-size: 8.5px;
  font-weight: 850;
}

.pin-node--selected .pin-label {
  fill: var(--chip-selected-edge-label);
  font-size: 16px;
  font-weight: 900;
}

.chip-shell--compact-labels .pin-node--selected .pin-label {
  fill: #ffffff;
  font-size: 9.5px;
}

.pin-node__warning-badge {
  fill: #facc15;
  stroke: #422006;
  stroke-linejoin: round;
  stroke-width: 0.9;
  filter: drop-shadow(0 0 2px rgba(250, 204, 21, 0.8));
  pointer-events: none;
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

@keyframes chip-scene-enter {
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

@keyframes chip-body-enter {
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

@keyframes chip-core-enter {
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

@keyframes chip-sheen-sweep {
  0% {
    opacity: 0;
    transform: translateX(-240px) skewX(-16deg);
  }

  30% {
    opacity: 0.95;
  }

  100% {
    opacity: 0;
    transform: translateX(840px) skewX(-16deg);
  }
}

@keyframes chip-sheen-idle {
  0%,
  72%,
  100% {
    opacity: 0;
    transform: translateX(-240px) skewX(-16deg);
  }

  82% {
    opacity: 0.62;
  }

  94% {
    opacity: 0;
    transform: translateX(840px) skewX(-16deg);
  }
}

@keyframes chip-edge-pulse {
  0% {
    opacity: 0;
    stroke-width: 2;
    transform: scale(0.96);
  }

  34% {
    opacity: 0.95;
    stroke-width: 3.4;
  }

  100% {
    opacity: 0;
    stroke-width: 1.8;
    transform: scale(1.035);
  }
}

@keyframes chip-dot-enter {
  0% {
    opacity: 0;
    transform: scale(0.4);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes chip-text-enter {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
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
  .chip-svg,
  .chip-body-shadow,
  .chip-body,
  .chip-sheen,
  .chip-edge-glow,
  .chip-orientation-dot,
  .espressif-logo,
  .chip-name,
  .chip-cpu,
  .chip-details,
  .pin-node,
  .pin-node--selected {
    animation: none;
  }
}

@media (max-width: 760px) {
  .chip-svg {
    width: min(100%, 560px);
    min-height: 0;
    max-height: calc(100vh - 92px);
  }

  .pin-label {
    font-size: 8.5px;
  }
}
</style>
