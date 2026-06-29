<template>
  <div class="board-shell" :class="{ 'board-shell--animated': playIntroAnimation }" role="img" :aria-label="ariaLabel">
    <svg v-if="isConnectorGroupLayout" class="board-svg connector-board-svg" viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="connectorBoardBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#0f766e" />
          <stop offset="1" stop-color="#064e3b" />
        </linearGradient>
        <linearGradient id="connectorBoardSheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.16" />
          <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="connectorModuleBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#273540" />
          <stop offset="1" stop-color="#101820" />
        </linearGradient>
        <filter id="connectorBoardShadow" x="-14%" y="-12%" width="128%" height="128%">
          <feDropShadow dx="0" dy="18" flood-color="#0f172a" flood-opacity="0.18" stdDeviation="16" />
        </filter>
        <pattern id="connectorPcbTexture" width="42" height="42" patternUnits="userSpaceOnUse">
          <path d="M0 14H42 M14 0V42 M0 34H42 M34 0V42" stroke="#2dd4bf" stroke-opacity="0.14" stroke-width="1" />
          <circle cx="8" cy="8" r="1.4" fill="#99f6e4" opacity="0.22" />
          <circle cx="30" cy="24" r="1.2" fill="#99f6e4" opacity="0.16" />
        </pattern>
        <clipPath id="connectorBoardBodyClip">
          <rect x="118" y="72" width="724" height="576" rx="22" />
        </clipPath>
      </defs>

      <rect class="board-body" x="118" y="72" width="724" height="576" rx="22" fill="url(#connectorBoardBody)" filter="url(#connectorBoardShadow)" />
      <g clip-path="url(#connectorBoardBodyClip)">
        <rect class="board-texture" x="118" y="72" width="724" height="576" rx="22" fill="url(#connectorPcbTexture)" />
        <rect class="board-sheen" x="-80" y="48" width="180" height="640" fill="url(#connectorBoardSheen)" />
      </g>
      <rect class="board-inner" x="130" y="100" width="700" height="552" rx="16" fill="none" stroke="#34d399" stroke-opacity="0.38" stroke-width="2" />

      <g v-if="isUsbBridgeArtwork" class="connector-board__usb">
        <rect x="421" y="30" width="118" height="40" rx="8" />
        <text x="480" y="55" text-anchor="middle">USB</text>
      </g>
      <g v-else class="connector-board__usb">
        <rect x="320" y="30" width="118" height="40" rx="8" />
        <rect x="522" y="30" width="118" height="40" rx="8" />
        <text x="379" y="55" text-anchor="middle">USB HOST</text>
        <text x="581" y="55" text-anchor="middle">USB DEV</text>
      </g>

      <g class="connector-board__module">
        <rect x="346" y="250" width="268" height="170" rx="9" fill="url(#connectorModuleBody)" stroke="#475569" stroke-width="2" />
        <rect
          x="386"
          y="286"
          width="188"
          height="88"
          rx="5"
          fill="none"
          stroke="#94a3b8"
          stroke-dasharray="8 8"
          stroke-width="2"
          opacity="0.75"
        />
        <text x="480" y="316" class="brand" text-anchor="middle">ESPRESSIF</text>
        <text x="480" y="366" class="chip-name" text-anchor="middle">{{ soc.name }}</text>
        <text x="480" y="398" class="board-details" text-anchor="middle">{{ packageName }}</text>
      </g>

      <template v-if="isUsbBridgeArtwork">
        <g class="connector-board__component connector-board__component--connector">
          <rect x="616" y="206" width="76" height="44" rx="7" />
          <text x="654" y="234" text-anchor="middle">TARGET</text>
        </g>
        <g class="connector-board__component connector-board__component--buttons">
          <rect x="270" y="278" width="76" height="44" rx="7" />
          <text x="308" y="306" text-anchor="middle">BOOT/RST</text>
        </g>
        <g class="connector-board__component connector-board__component--led">
          <rect x="432" y="462" width="96" height="34" rx="7" />
          <text x="480" y="484" text-anchor="middle">WS2812</text>
        </g>
      </template>
      <template v-else>
        <g class="connector-board__component connector-board__component--lcd">
          <rect x="624" y="190" width="64" height="44" rx="7" />
          <text x="656" y="218" text-anchor="middle">LCD</text>
        </g>
        <g class="connector-board__component connector-board__component--sd">
          <rect x="624" y="438" width="64" height="44" rx="7" />
          <text x="656" y="466" text-anchor="middle">SD</text>
        </g>
        <g class="connector-board__component connector-board__component--buttons">
          <rect x="272" y="278" width="66" height="44" rx="7" />
          <text x="305" y="306" text-anchor="middle">BUTTONS</text>
        </g>
        <g class="connector-board__component connector-board__component--power">
          <rect x="342" y="460" width="276" height="34" rx="7" />
          <text x="480" y="482" text-anchor="middle">POWER / EXTENDED</text>
        </g>
      </template>

      <g v-for="group in connectorGroupLabels" :key="group.key" class="connector-board__group-label">
        <text :x="group.x" :y="group.y" :text-anchor="group.anchor">{{ group.label }}</text>
      </g>

      <g
        v-for="pin in pins"
        :key="pin.id"
        class="board-pin connector-board__pin"
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
          class="board-pin__pad"
          :x="connectorPinGeometry(pin).rect.x"
          :y="connectorPinGeometry(pin).rect.y"
          :width="connectorPinGeometry(pin).rect.width"
          :height="connectorPinGeometry(pin).rect.height"
          :rx="connectorPinGeometry(pin).rect.rx"
        />
        <path
          v-if="hasWarning(pin)"
          class="board-pin__warning-badge"
          :d="warningBadgePath(connectorPinGeometry(pin).rect)"
          aria-hidden="true"
        />
        <text
          class="board-pin__label connector-board__pin-label"
          :x="connectorPinGeometry(pin).label.x"
          :y="connectorPinGeometry(pin).label.y"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ boardPinDisplayLabel(pin) }}
        </text>
      </g>
    </svg>

    <svg v-else class="board-svg" viewBox="128 8 684 724" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boardBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#0f766e" />
          <stop offset="1" stop-color="#064e3b" />
        </linearGradient>
        <linearGradient id="boardSheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.16" />
          <stop offset="1" stop-color="#ffffff" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="moduleBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#273540" />
          <stop offset="1" stop-color="#101820" />
        </linearGradient>
        <filter id="boardShadow" x="-14%" y="-12%" width="128%" height="128%">
          <feDropShadow dx="0" dy="18" flood-color="#0f172a" flood-opacity="0.18" stdDeviation="16" />
        </filter>
        <pattern id="pcbTexture" width="42" height="42" patternUnits="userSpaceOnUse">
          <path d="M0 14H42 M14 0V42 M0 34H42 M34 0V42" stroke="#2dd4bf" stroke-opacity="0.14" stroke-width="1" />
          <circle cx="8" cy="8" r="1.4" fill="#99f6e4" opacity="0.22" />
          <circle cx="30" cy="24" r="1.2" fill="#99f6e4" opacity="0.16" />
        </pattern>
        <clipPath id="boardBodyClip">
          <rect x="160" y="52" width="620" height="656" rx="22" />
        </clipPath>
      </defs>

      <rect class="board-body" x="160" y="52" width="620" height="656" rx="22" fill="url(#boardBody)" filter="url(#boardShadow)" />
      <g clip-path="url(#boardBodyClip)">
        <rect class="board-texture" x="160" y="52" width="620" height="656" fill="url(#pcbTexture)" />
        <path class="board-trace" d="M276 144H404Q428 144 428 168V194" />
        <path class="board-trace" d="M664 142H536Q512 142 512 168V194" />
        <path class="board-trace" d="M300 614H430Q454 614 454 590V496" />
        <path class="board-trace" d="M640 614H510Q486 614 486 590V496" />
        <rect class="board-sheen" x="-40" y="40" width="160" height="690" fill="url(#boardSheen)" />
      </g>
      <rect class="board-inner" x="190" y="86" width="560" height="588" rx="14" fill="none" stroke="#34d399" stroke-opacity="0.38" stroke-width="2" />

      <g class="board-usb">
        <rect x="392" y="22" width="70" height="40" rx="7" />
        <rect x="478" y="22" width="70" height="40" rx="7" />
        <text x="427" y="46" text-anchor="middle">UART</text>
        <text x="513" y="46" text-anchor="middle">USB</text>
      </g>

      <text class="header-name" x="232" y="82" text-anchor="middle">{{ leftHeaderName }}</text>
      <text class="header-name" x="708" y="82" text-anchor="middle">{{ rightHeaderName }}</text>

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
        <rect x="326" y="558" width="78" height="30" rx="7" />
        <text x="365" y="577" text-anchor="middle">BOOT</text>
      </g>
      <g class="board-component board-component--rgb">
        <rect x="536" y="558" width="78" height="30" rx="7" />
        <text x="575" y="577" text-anchor="middle">RGB</text>
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
        <rect
          class="board-pin__pad"
          :x="pinGeometry(pin).rect.x"
          :y="pinGeometry(pin).rect.y"
          :width="pinGeometry(pin).rect.width"
          :height="pinGeometry(pin).rect.height"
          :rx="pinGeometry(pin).rect.rx"
        />
        <path
          v-if="hasWarning(pin)"
          class="board-pin__warning-badge"
          :d="warningBadgePath(pinGeometry(pin).rect)"
          aria-hidden="true"
        />
        <text
          class="board-pin__label"
          :x="pinGeometry(pin).label.x"
          :y="pinGeometry(pin).label.y"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ boardPinDisplayLabel(pin) }}
        </text>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { hasMakerWarning } from '@/data/pinWarnings';
import type { BoardArtwork, BoardLayout, PinSide, SocDefinition, SocPin } from '@/types/soc';

const props = defineProps<{
  soc: SocDefinition;
  packageName: string;
  pins: SocPin[];
  selectedPinId: string | null;
  filteredPinIds: Set<string>;
  filteredPinCount: number;
  totalPinCount: number;
  hasFilter: boolean;
  boardLayout?: BoardLayout;
  boardArtwork?: BoardArtwork;
}>();

const emit = defineEmits<{
  'pin-click': [pinId: string];
}>();

const pins = computed(() => props.pins);
const playIntroAnimation = ref(false);
let introAnimationFrame = 0;

const isConnectorGroupLayout = computed(() => props.boardLayout === 'connector-groups');
const isUsbBridgeArtwork = computed(() => props.boardArtwork === 'usb-bridge');
const boardPinLabel = computed(() => (isConnectorGroupLayout.value ? 'connector pins' : 'header pins'));
const ariaLabel = computed(
  () => `${props.soc.name} ${props.packageName} board profile, ${props.filteredPinCount} of ${props.totalPinCount} ${boardPinLabel.value} shown`,
);
const leftHeaderName = computed(() => headerNameForSide('left', 'J1'));
const rightHeaderName = computed(() => headerNameForSide('right', 'J3'));

interface PointText {
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
}

interface Geometry {
  rect: { x: number; y: number; width: number; height: number; rx: number };
  label: PointText;
}

const pinStartY = 112;
const pinEndY = 648;
const connectorTopStartX = 238;
const connectorTopEndX = 722;
const connectorLeftStartY = 190;
const connectorLeftEndY = 460;
const connectorRightStartY = 190;
const connectorRightEndY = 520;
const connectorBottomRowStartX = 205;
const connectorBottomRowEndX = 755;
const connectorBottomTopRowY = 560;
const connectorBottomBottomRowY = 622;
const connectorBottomPinsPerRow = 6;

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

function headerNameForSide(side: 'left' | 'right', fallback: string) {
  return props.pins.find((pin) => pin.position.side === side && pin.boardHeader)?.boardHeader ?? fallback;
}

function sideCoordinate(side: 'left' | 'right', order: number) {
  const count = sideOrders.value[side];
  if (count <= 1) {
    return (pinStartY + pinEndY) / 2;
  }
  return pinStartY + ((order - 1) * (pinEndY - pinStartY)) / (count - 1);
}

const connectorSideOrders = computed<Record<Exclude<PinSide, 'center'>, number>>(() => ({
  left: connectorSideMaxOrder('left'),
  bottom: connectorSideMaxOrder('bottom'),
  right: connectorSideMaxOrder('right'),
  top: connectorSideMaxOrder('top'),
}));

function connectorSideMaxOrder(side: Exclude<PinSide, 'center'>) {
  return Math.max(
    1,
    ...props.pins.filter((pin) => pin.position.side === side).map((pin) => pin.position.order),
  );
}

function connectorSideCoordinate(side: Exclude<PinSide, 'center'>, order: number) {
  const start = side === 'top' ? connectorTopStartX : side === 'right' ? connectorRightStartY : connectorLeftStartY;
  const end = side === 'top' ? connectorTopEndX : side === 'right' ? connectorRightEndY : connectorLeftEndY;
  const count = connectorSideOrders.value[side];
  if (count <= 1) {
    return (start + end) / 2;
  }
  return start + ((order - 1) * (end - start)) / (count - 1);
}

function connectorPinGeometry(pin: SocPin): Geometry {
  if (pin.position.side === 'top') {
    const x = connectorSideCoordinate('top', pin.position.order);
    return {
      rect: { x: x - 44, y: 118, width: 88, height: 30, rx: 5 },
      label: { x, y: 133 },
    };
  }

  if (pin.position.side === 'bottom') {
    const rowOrder = ((pin.position.order - 1) % connectorBottomPinsPerRow) + 1;
    const rowIndex = Math.floor((pin.position.order - 1) / connectorBottomPinsPerRow);
    const x =
      connectorBottomRowStartX +
      ((rowOrder - 1) * (connectorBottomRowEndX - connectorBottomRowStartX)) / (connectorBottomPinsPerRow - 1);
    const y = rowIndex === 0 ? connectorBottomTopRowY : connectorBottomBottomRowY;
    return {
      rect: { x: x - 52, y: y - 14, width: 104, height: 28, rx: 5 },
      label: { x, y },
    };
  }

  if (pin.position.side === 'right') {
    const y = connectorSideCoordinate('right', pin.position.order);
    return {
      rect: { x: 700, y: y - 13, width: 118, height: 26, rx: 5 },
      label: { x: 759, y },
    };
  }

  const y = connectorSideCoordinate('left', pin.position.order);
  return {
    rect: { x: 142, y: y - 13, width: 118, height: 26, rx: 5 },
    label: { x: 201, y },
  };
}

const connectorGroupLabels = computed(() => {
  const groups = new Map<string, SocPin[]>();
  for (const pin of props.pins) {
    const group = pin.boardGroup;
    if (!group) {
      continue;
    }
    groups.set(group, [...(groups.get(group) ?? []), pin]);
  }

  return [...groups.entries()].map(([label, groupPins]) => {
    const geometries = groupPins.map((pin) => connectorPinGeometry(pin));
    const minX = Math.min(...geometries.map((geometry) => geometry.rect.x));
    const maxX = Math.max(...geometries.map((geometry) => geometry.rect.x + geometry.rect.width));
    const minY = Math.min(...geometries.map((geometry) => geometry.rect.y));
    const maxY = Math.max(...geometries.map((geometry) => geometry.rect.y + geometry.rect.height));
    const side = groupPins[0].position.side;

    if (side === 'top') {
      return { key: label, label, x: (minX + maxX) / 2, y: minY - 14, anchor: 'middle' as const };
    }

    if (side === 'bottom') {
      return { key: label, label, x: (minX + maxX) / 2, y: maxY + 20, anchor: 'middle' as const };
    }

    return { key: label, label, x: (minX + maxX) / 2, y: minY - 14, anchor: 'middle' as const };
  });
});

function pinGeometry(pin: SocPin): Geometry {
  const side = pin.position.side === 'right' ? 'right' : 'left';
  const y = sideCoordinate(side, pin.position.order);

  if (side === 'right') {
    return {
      rect: { x: 658, y: y - 12, width: 76, height: 24, rx: 5 },
      label: { x: 696, y },
    };
  }

  return {
    rect: { x: 206, y: y - 12, width: 76, height: 24, rx: 5 },
    label: { x: 244, y },
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
    'board-pin--warning': hasWarning(pin),
  };
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

function boardPinDisplayLabel(pin: SocPin) {
  const label = pin.boardLabel ?? pin.name;
  const numericGpioLabel = label.match(/^(?:GPIO|IO)(\d+)$/i);

  if (numericGpioLabel && pin.gpio === Number(numericGpioLabel[1])) {
    return numericGpioLabel[1];
  }

  return label;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.board-svg {
  width: 100%;
  height: 100%;
  min-height: 0;
  transform-origin: center;
}

.connector-board-svg {
  width: min(100%, 1040px);
}

.board-shell--animated .board-svg {
  animation: board-scene-enter 900ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.board-body,
.board-texture,
.board-trace,
.board-sheen,
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

.board-texture {
  opacity: 0.72;
}

.board-sheen {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
}

.board-shell--animated .board-sheen {
  animation:
    board-sheen-sweep 1300ms 560ms ease-out both,
    board-sheen-idle 6200ms 2400ms ease-in-out infinite;
}

.board-trace {
  fill: none;
  stroke: #5eead4;
  stroke-linecap: round;
  stroke-opacity: 0.18;
  stroke-width: 2;
}

.board-shell--animated .board-trace,
.board-shell--animated .board-inner {
  animation: board-detail-enter 720ms 260ms ease-out both;
}

.board-shell--animated .module {
  animation: module-enter 760ms 310ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.board-shell--animated .board-usb,
.board-shell--animated .board-component,
.board-shell--animated .connector-board__usb,
.board-shell--animated .connector-board__component {
  animation: component-enter 560ms 520ms ease-out both;
}

.board-usb rect {
  fill: #e2e8f0;
  stroke: #64748b;
  stroke-width: 2;
}

.connector-board__usb rect {
  fill: #e2e8f0;
  stroke: #64748b;
  stroke-width: 2;
}

.board-usb text,
.board-component text,
.header-name,
.connector-board__usb text,
.connector-board__component text,
.connector-board__group-label text {
  fill: #ccfbf1;
  font-size: 13px;
  font-weight: 850;
  letter-spacing: 0;
}

.board-usb text,
.connector-board__usb text {
  fill: #334155;
  font-size: 12px;
}

.header-name {
  fill: #99f6e4;
  opacity: 0.9;
}

.board-component rect {
  fill: rgba(15, 23, 42, 0.42);
  stroke: rgba(153, 246, 228, 0.48);
  stroke-width: 2;
}

.board-component--rgb rect {
  fill: rgba(249, 115, 22, 0.4);
  stroke: rgba(254, 215, 170, 0.75);
  filter: drop-shadow(0 0 7px rgba(249, 115, 22, 0.55));
}

.connector-board__component rect {
  fill: rgba(15, 23, 42, 0.42);
  stroke: rgba(153, 246, 228, 0.48);
  stroke-width: 2;
}

.connector-board__component--lcd rect {
  fill: rgba(37, 99, 235, 0.38);
}

.connector-board__component--sd rect {
  fill: rgba(22, 101, 52, 0.44);
}

.connector-board__component--power rect {
  fill: rgba(180, 83, 9, 0.42);
}

.connector-board__component--led rect {
  fill: rgba(180, 83, 9, 0.42);
  stroke: rgba(254, 215, 170, 0.75);
}

.connector-board__group-label text {
  fill: #ccfbf1;
  font-size: 12px;
  opacity: 0.92;
  text-transform: uppercase;
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

.connector-board__pin-label {
  font-size: 8.7px;
}

.board-pin__warning-badge {
  fill: #facc15;
  stroke: #422006;
  stroke-linejoin: round;
  stroke-width: 0.9;
  filter: drop-shadow(0 0 2px rgba(250, 204, 21, 0.8));
  pointer-events: none;
}

.board-pin--selected .board-pin__label {
  fill: #ffffff;
  font-size: 14px;
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

@keyframes board-detail-enter {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

@keyframes board-sheen-sweep {
  0% {
    opacity: 0;
    transform: translateX(-220px) skewX(-16deg);
  }

  30% {
    opacity: 0.85;
  }

  100% {
    opacity: 0;
    transform: translateX(920px) skewX(-16deg);
  }
}

@keyframes board-sheen-idle {
  0%,
  72%,
  100% {
    opacity: 0;
    transform: translateX(-220px) skewX(-16deg);
  }

  82% {
    opacity: 0.52;
  }

  94% {
    opacity: 0;
    transform: translateX(920px) skewX(-16deg);
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
  .board-texture,
  .board-trace,
  .board-sheen,
  .board-inner,
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
    width: 100%;
    height: 100%;
    min-height: 0;
  }

}
</style>
