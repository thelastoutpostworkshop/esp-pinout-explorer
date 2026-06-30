<template>
  <div class="board-shell" :class="{ 'board-shell--animated': playIntroAnimation }" role="img" :aria-label="ariaLabel">
    <svg v-if="isConnectorGroupLayout" class="board-svg connector-board-svg" viewBox="0 0 960 720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="connectorBoardBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#1f2937" />
          <stop offset="0.52" stop-color="#111827" />
          <stop offset="1" stop-color="#070b12" />
        </linearGradient>
        <linearGradient id="connectorBoardSheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.1" />
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
          <path d="M0 14H42 M14 0V42 M0 34H42 M34 0V42" stroke="#94a3b8" stroke-opacity="0.08" stroke-width="1" />
          <circle cx="8" cy="8" r="1.35" fill="#cbd5e1" opacity="0.2" />
          <circle cx="30" cy="24" r="1.15" fill="#d6a84f" opacity="0.22" />
        </pattern>
        <radialGradient id="connectorPlatedHole" cx="50%" cy="50%" r="58%">
          <stop offset="0" stop-color="#111827" />
          <stop offset="0.48" stop-color="#111827" />
          <stop offset="0.52" stop-color="#e5e7eb" />
          <stop offset="1" stop-color="#94a3b8" />
        </radialGradient>
        <clipPath id="connectorBoardBodyClip">
          <rect x="118" y="72" width="724" height="576" rx="22" />
        </clipPath>
      </defs>

      <rect class="board-body" x="118" y="72" width="724" height="576" rx="22" fill="url(#connectorBoardBody)" filter="url(#connectorBoardShadow)" />
      <g clip-path="url(#connectorBoardBodyClip)">
        <rect class="board-texture" x="118" y="72" width="724" height="576" rx="22" fill="url(#connectorPcbTexture)" />
        <path class="board-trace board-trace--copper" d="M260 164H396Q420 164 420 188V238" />
        <path class="board-trace board-trace--copper" d="M700 164H566Q540 164 540 188V238" />
        <path class="board-trace board-trace--copper" d="M248 536H398Q426 536 426 508V420" />
        <path class="board-trace board-trace--copper" d="M712 536H562Q534 536 534 508V420" />
        <rect class="board-sheen" x="-80" y="48" width="180" height="640" fill="url(#connectorBoardSheen)" />
      </g>
      <rect class="board-inner" x="130" y="100" width="700" height="552" rx="16" fill="none" stroke="#f8fafc" stroke-opacity="0.32" stroke-width="1.6" />
      <g class="board-mounting-holes" aria-hidden="true">
        <circle cx="150" cy="104" r="12" fill="url(#connectorPlatedHole)" />
        <circle cx="810" cy="104" r="12" fill="url(#connectorPlatedHole)" />
        <circle cx="150" cy="616" r="12" fill="url(#connectorPlatedHole)" />
        <circle cx="810" cy="616" r="12" fill="url(#connectorPlatedHole)" />
      </g>
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
        <image
          class="espressif-logo connector-board__module-logo"
          :href="espressifLogoOnDarkUrl"
          :x="connectorCenterLayout.logoX"
          :y="connectorCenterLayout.logoY"
          :width="connectorCenterLayout.logoWidth"
          :height="connectorCenterLayout.logoHeight"
          preserveAspectRatio="xMidYMid meet"
        />
        <text :x="connectorCenterLayout.textX" :y="connectorCenterLayout.nameY" class="chip-name" text-anchor="middle">{{ soc.name }}</text>
        <text
          v-for="(line, index) in chipCpuLines"
          :key="line"
          :x="connectorCenterLayout.textX"
          :y="connectorCenterLayout.cpuY + index * connectorCenterLayout.cpuLineHeight"
          class="board-cpu"
          text-anchor="middle"
        >
          {{ line }}
        </text>
        <text :x="connectorCenterLayout.textX" :y="connectorCenterLayout.detailsY" class="board-details" text-anchor="middle">{{ filteredPinCount }} / {{ totalPinCount }} pins</text>
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
          :class="{ 'connector-board__pin-label--functions': showMainFunctions }"
          :x="connectorPinGeometry(pin).label.x"
          :y="connectorPinGeometry(pin).label.y"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          {{ connectorPinDisplayLabel(pin) }}
        </text>
      </g>
    </svg>

    <svg v-else class="board-svg" :viewBox="dualHeaderViewBox" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="boardBody" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#1f2937" />
          <stop offset="0.52" stop-color="#111827" />
          <stop offset="1" stop-color="#070b12" />
        </linearGradient>
        <linearGradient id="boardSheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.1" />
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
          <path d="M0 14H42 M14 0V42 M0 34H42 M34 0V42" stroke="#94a3b8" stroke-opacity="0.08" stroke-width="1" />
          <circle cx="8" cy="8" r="1.35" fill="#cbd5e1" opacity="0.2" />
          <circle cx="30" cy="24" r="1.15" fill="#d6a84f" opacity="0.22" />
        </pattern>
        <linearGradient id="headerSocketBody" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#020617" />
          <stop offset="0.5" stop-color="#111827" />
          <stop offset="1" stop-color="#020617" />
        </linearGradient>
        <radialGradient id="platedHole" cx="50%" cy="50%" r="58%">
          <stop offset="0" stop-color="#111827" />
          <stop offset="0.48" stop-color="#111827" />
          <stop offset="0.52" stop-color="#e5e7eb" />
          <stop offset="1" stop-color="#94a3b8" />
        </radialGradient>
        <clipPath id="boardBodyClip">
          <rect x="160" y="52" width="620" height="656" rx="22" />
        </clipPath>
      </defs>

      <rect class="board-body" x="160" y="52" width="620" height="656" rx="22" fill="url(#boardBody)" filter="url(#boardShadow)" />
      <g clip-path="url(#boardBodyClip)">
        <rect class="board-texture" x="160" y="52" width="620" height="656" fill="url(#pcbTexture)" />
        <path class="board-trace board-trace--copper" d="M276 144H404Q428 144 428 168V194" />
        <path class="board-trace board-trace--copper" d="M664 142H536Q512 142 512 168V194" />
        <path class="board-trace board-trace--copper" d="M300 614H430Q454 614 454 590V496" />
        <path class="board-trace board-trace--copper" d="M640 614H510Q486 614 486 590V496" />
        <path class="board-trace" d="M226 132V648 M714 132V648 M226 132H306 M714 132H634" />
        <rect class="board-sheen" x="-40" y="40" width="160" height="690" fill="url(#boardSheen)" />
      </g>
      <rect class="board-inner" x="190" y="86" width="560" height="588" rx="14" fill="none" stroke="#f8fafc" stroke-opacity="0.32" stroke-width="1.6" />
      <g class="board-mounting-holes" aria-hidden="true">
        <circle cx="186" cy="82" r="12" fill="url(#platedHole)" />
        <circle cx="754" cy="82" r="12" fill="url(#platedHole)" />
        <circle cx="186" cy="678" r="12" fill="url(#platedHole)" />
        <circle cx="754" cy="678" r="12" fill="url(#platedHole)" />
      </g>
      <g class="board-header-sockets" aria-hidden="true">
        <rect class="board-header-socket" x="174" y="98" width="36" height="562" rx="7" fill="url(#headerSocketBody)" />
        <rect class="board-header-socket" x="730" y="98" width="36" height="562" rx="7" fill="url(#headerSocketBody)" />
        <circle
          v-for="pin in dualHeaderPins"
          :key="`${pin.id}-header-hole`"
          class="board-header-hole"
          :cx="headerHoleGeometry(pin).x"
          :cy="headerHoleGeometry(pin).y"
          r="5.1"
        />
      </g>
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
        <image
          class="espressif-logo"
          :href="espressifLogoOnDarkUrl"
          :x="dualHeaderCenterLayout.logoX"
          :y="dualHeaderCenterLayout.logoY"
          :width="dualHeaderCenterLayout.logoWidth"
          :height="dualHeaderCenterLayout.logoHeight"
          preserveAspectRatio="xMidYMid meet"
        />
        <text :x="dualHeaderCenterLayout.textX" :y="dualHeaderCenterLayout.nameY" class="chip-name" text-anchor="middle">{{ soc.name }}</text>
        <text
          v-for="(line, index) in chipCpuLines"
          :key="line"
          :x="dualHeaderCenterLayout.textX"
          :y="dualHeaderCenterLayout.cpuY + index * dualHeaderCenterLayout.cpuLineHeight"
          class="board-cpu"
          text-anchor="middle"
        >
          {{ line }}
        </text>
        <text :x="dualHeaderCenterLayout.textX" :y="dualHeaderCenterLayout.detailsY" class="board-details" text-anchor="middle">{{ filteredPinCount }} / {{ totalPinCount }} header pins</text>
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

      <g v-if="showMainFunctions" class="board-function-labels" aria-hidden="true">
        <g
          v-for="(pin, pinIndex) in functionLabelPins"
          :key="`${pin.id}-functions`"
          class="board-function-label"
          :class="[
            `board-function-label--${pin.type}`,
            `board-function-label--${pin.position.side === 'right' ? 'right' : 'left'}`,
          ]"
          :style="functionLabelStyle(pinIndex)"
        >
          <line
            class="board-function-label__leader"
            :x1="functionLabelGeometry(pin).line.x1"
            :x2="functionLabelGeometry(pin).line.x2"
            :y1="functionLabelGeometry(pin).line.y"
            :y2="functionLabelGeometry(pin).line.y"
          />
          <g
            v-for="(badge, badgeIndex) in functionBadgesForPin(pin)"
            :key="`${pin.id}-${badge.label}`"
            class="board-function-badge"
            :class="`board-function-badge--${badge.tone}`"
            :style="functionBadgeStyle(pinIndex, badgeIndex)"
          >
            <rect
              class="board-function-badge__pill"
              :x="badge.x"
              :y="badge.y"
              :width="badge.width"
              :height="badge.height"
              :rx="badge.rx"
            />
            <text
              class="board-function-badge__text"
              :x="badge.textX"
              :y="badge.textY"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              {{ badge.label }}
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import espressifLogoOnDarkUrl from '@/assets/espressif-logo-on-dark.svg';
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
  showMainFunctions?: boolean;
}>();

const emit = defineEmits<{
  'pin-click': [pinId: string];
}>();

const pins = computed(() => props.pins);
const playIntroAnimation = ref(false);
let introAnimationFrame = 0;

const isConnectorGroupLayout = computed(() => props.boardLayout === 'connector-groups');
const isUsbBridgeArtwork = computed(() => props.boardArtwork === 'usb-bridge');
const showMainFunctions = computed(() => props.showMainFunctions ?? false);
const boardPinLabel = computed(() => (isConnectorGroupLayout.value ? 'connector pins' : 'header pins'));
const functionModeLabel = computed(() => (showMainFunctions.value ? ', main functions shown' : ''));
const ariaLabel = computed(
  () =>
    `${props.soc.name} ${props.packageName} board profile, ${props.filteredPinCount} of ${props.totalPinCount} ${boardPinLabel.value} shown${functionModeLabel.value}`,
);
const leftHeaderName = computed(() => headerNameForSide('left', 'J1'));
const rightHeaderName = computed(() => headerNameForSide('right', 'J3'));
const dualHeaderViewBox = computed(() => (showMainFunctions.value ? '-100 8 1140 724' : '128 8 684 724'));
const chipCpuLines = computed(() => splitCpuSummary(props.soc.chipSpecs?.cpu ?? 'CPU details unavailable'));
const connectorCenterLayout = computed(() =>
  centerContentLayout({
    centerX: 480,
    centerY: 335,
    logoWidth: 208,
    logoHeight: 38,
    logoToNameGap: 16,
    nameLineHeight: 34,
    nameBaseline: 27,
    nameToCpuGap: 10,
    cpuLineHeight: 16,
    cpuBaseline: 10,
    cpuToDetailsGap: 6,
    detailsBaseline: 11,
  }),
);
const dualHeaderCenterLayout = computed(() =>
  centerContentLayout({
    centerX: 470,
    centerY: 344,
    logoWidth: 240,
    logoHeight: 44,
    logoToNameGap: 20,
    nameLineHeight: 34,
    nameBaseline: 27,
    nameToCpuGap: 12,
    cpuLineHeight: 16,
    cpuBaseline: 10,
    cpuToDetailsGap: 6,
    detailsBaseline: 11,
  }),
);
const dualHeaderPins = computed(() =>
  props.pins.filter((pin) => pin.position.side === 'left' || pin.position.side === 'right'),
);
const functionLabelPins = computed(() =>
  props.pins.filter(
    (pin) => (pin.position.side === 'left' || pin.position.side === 'right') && functionLabelsForPin(pin).length > 0,
  ),
);

interface PointText {
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
}

interface Geometry {
  rect: { x: number; y: number; width: number; height: number; rx: number };
  label: PointText;
}

interface FunctionBadge {
  label: string;
  tone: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rx: number;
  textX: number;
  textY: number;
}

interface CenterContentOptions {
  centerX: number;
  centerY: number;
  logoWidth: number;
  logoHeight: number;
  logoToNameGap: number;
  nameLineHeight: number;
  nameBaseline: number;
  nameToCpuGap: number;
  cpuLineHeight: number;
  cpuBaseline: number;
  cpuToDetailsGap: number;
  detailsBaseline: number;
}

function centerContentLayout(options: CenterContentOptions) {
  const cpuLineCount = Math.max(1, chipCpuLines.value.length);
  const detailsLineHeight = 16;
  const stackHeight =
    options.logoHeight +
    options.logoToNameGap +
    options.nameLineHeight +
    options.nameToCpuGap +
    cpuLineCount * options.cpuLineHeight +
    options.cpuToDetailsGap +
    detailsLineHeight;
  const top = options.centerY - stackHeight / 2;
  const nameTop = top + options.logoHeight + options.logoToNameGap;
  const cpuTop = nameTop + options.nameLineHeight + options.nameToCpuGap;
  const detailsTop = cpuTop + cpuLineCount * options.cpuLineHeight + options.cpuToDetailsGap;

  return {
    textX: options.centerX,
    logoX: options.centerX - options.logoWidth / 2,
    logoY: top,
    logoWidth: options.logoWidth,
    logoHeight: options.logoHeight,
    nameY: nameTop + options.nameBaseline,
    cpuY: cpuTop + options.cpuBaseline,
    cpuLineHeight: options.cpuLineHeight,
    detailsY: detailsTop + options.detailsBaseline,
  };
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

function splitCpuSummary(value: string) {
  const normalized = value.replace(/;.*$/, '').replace(/,\s*plus\s+/i, ', plus ').trim();
  const maxLineLength = 42;

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

function headerHoleGeometry(pin: SocPin): PointText {
  const side = pin.position.side === 'right' ? 'right' : 'left';
  return {
    x: side === 'right' ? 748 : 192,
    y: pinGeometry(pin).label.y,
  };
}

function functionLabelGeometry(pin: SocPin): { line: { x1: number; x2: number; y: number }; text: PointText } {
  const geometry = pinGeometry(pin);
  const side = pin.position.side === 'right' ? 'right' : 'left';
  const y = geometry.label.y;

  if (side === 'right') {
    return {
      line: { x1: geometry.rect.x + geometry.rect.width + 4, x2: 742, y },
      text: { x: 770, y, anchor: 'start' },
    };
  }

  return {
    line: { x1: 198, x2: geometry.rect.x - 4, y },
    text: { x: 170, y, anchor: 'end' },
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

function connectorPinDisplayLabel(pin: SocPin) {
  if (!showMainFunctions.value) {
    return boardPinDisplayLabel(pin);
  }

  return boardPinFunctionLabel(pin, 2) || boardPinDisplayLabel(pin);
}

function functionBadgesForPin(pin: SocPin): FunctionBadge[] {
  const geometry = functionLabelGeometry(pin);
  const pinRect = pinGeometry(pin).rect;
  const side = pin.position.side === 'right' ? 'right' : 'left';
  const height = pinRect.height;
  const gap = 3;
  const rawBadges = boardPinFunctionLabels(pin, 5).map((label) => ({
    label,
    tone: functionBadgeTone(label, pin),
    width: functionBadgeWidth(label),
  }));
  const totalWidth = rawBadges.reduce((total, badge) => total + badge.width, 0) + Math.max(0, rawBadges.length - 1) * gap;
  let x = side === 'right' ? geometry.text.x : geometry.text.x - totalWidth;

  return rawBadges.map((badge) => {
    const result = {
      ...badge,
      x,
      y: pinRect.y,
      height,
      rx: pinRect.rx,
      textX: x + badge.width / 2,
      textY: geometry.text.y + 0.15,
    };
    x += badge.width + gap;
    return result;
  });
}

function functionLabelStyle(index: number) {
  return {
    '--function-label-delay': `${Math.min(index * 12, 180)}ms`,
  };
}

function functionBadgeStyle(pinIndex: number, badgeIndex: number) {
  return {
    '--function-badge-delay': `${Math.min(pinIndex * 12 + badgeIndex * 24, 260)}ms`,
  };
}

function boardPinFunctionLabel(pin: SocPin, limit: number) {
  const labels = functionLabelsForPin(pin);
  const visibleLabels = labels.slice(0, limit);
  const hiddenCount = labels.length - visibleLabels.length;

  return `${visibleLabels.join(' ')}${hiddenCount > 0 ? ` +${hiddenCount}` : ''}`;
}

function boardPinFunctionLabels(pin: SocPin, limit: number) {
  const labels = functionLabelsForPin(pin);
  const visibleLabels = labels.slice(0, limit);
  const hiddenCount = labels.length - visibleLabels.length;

  if (hiddenCount > 0) {
    return [...visibleLabels, `+${hiddenCount}`];
  }

  return visibleLabels;
}

function functionLabelsForPin(pin: SocPin) {
  const labels = uniqueValues(
    (pin.mainFunctions.length ? pin.mainFunctions : [boardPinDisplayLabel(pin)]).map(compactFunctionLabel),
  );

  return labels.filter((label) => !isRedundantFunctionLabel(pin, label));
}

function isRedundantFunctionLabel(pin: SocPin, label: string) {
  const normalizedLabel = normalizeFunctionLabel(label);
  const normalizedDisplayLabel = normalizeFunctionLabel(boardPinDisplayLabel(pin));

  if (normalizedLabel === normalizedDisplayLabel) {
    return true;
  }

  if (pin.gpio === undefined || normalizedLabel !== `GPIO${pin.gpio}`) {
    return false;
  }

  return (
    normalizedDisplayLabel === `${pin.gpio}` ||
    normalizedDisplayLabel === `IO${pin.gpio}` ||
    normalizedDisplayLabel === `GPIO${pin.gpio}`
  );
}

function normalizeFunctionLabel(label: string) {
  return label.toUpperCase().replace(/[\s_/-]+/g, '');
}

function functionBadgeWidth(label: string) {
  return Math.max(26, Math.min(190, label.length * 5.9 + 14));
}

function functionBadgeTone(label: string, pin: SocPin) {
  const normalized = label.toUpperCase();

  if (pin.type === 'power' || /^(?:3V3|5V|VDD|VDDA|VBUS)/.test(normalized)) {
    return 'power';
  }

  if (pin.type === 'ground' || normalized === 'GND') {
    return 'ground';
  }

  if (pin.type === 'control' || /RESET|RST|EN|CHIP_PU/.test(normalized)) {
    return 'control';
  }

  if (/^GPIO\d+$/.test(normalized)) {
    return 'gpio';
  }

  if (/^ADC/.test(normalized)) {
    return 'analog';
  }

  if (/^TOUCH/.test(normalized)) {
    return 'touch';
  }

  if (/^RTC/.test(normalized) || /32K/.test(normalized)) {
    return 'rtc';
  }

  if (/USB/.test(normalized)) {
    return 'usb';
  }

  if (/^U\d|UART|TXD|RXD|RTS|CTS/.test(normalized)) {
    return 'uart';
  }

  if (/EMAC/.test(normalized)) {
    return 'ethernet';
  }

  if (/SPI|SDIO|SD_|HS\d|FSPI|VSPI|HSPI|CLK|CMD|D\d/.test(normalized)) {
    return 'spi';
  }

  if (/BOOT/.test(normalized)) {
    return 'boot';
  }

  return 'other';
}

function compactFunctionLabel(label: string) {
  return label
    .replace(/^3\.3 V power supply$/i, '3V3')
    .replace(/^5 V power supply$/i, '5V')
    .replace(/^ground$/i, 'GND')
    .replace(/^reset$/i, 'RESET')
    .replace(/\s+power supply$/i, ' PWR');
}

function uniqueValues<T>(values: T[]): T[] {
  return [...new Set(values)];
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
.board-mounting-holes,
.board-header-sockets,
.board-silkscreen,
.module,
.board-usb,
.board-component {
  transform-box: fill-box;
  transform-origin: center;
}

.board-body {
  stroke: rgba(226, 232, 240, 0.32);
  stroke-width: 1.2;
}

.board-shell--animated .board-body {
  animation: board-body-enter 850ms 80ms cubic-bezier(0.16, 0.95, 0.22, 1) both;
}

.board-texture {
  opacity: 0.88;
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
  stroke: #cbd5e1;
  stroke-linecap: round;
  stroke-opacity: 0.14;
  stroke-width: 1.4;
}

.board-trace--copper {
  stroke: #d6a84f;
  stroke-opacity: 0.28;
  stroke-width: 2;
}

.board-mounting-holes {
  filter: drop-shadow(0 1px 1px rgba(2, 6, 23, 0.55));
}

.board-header-socket {
  stroke: rgba(226, 232, 240, 0.2);
  stroke-width: 1.2;
  filter: drop-shadow(0 1px 2px rgba(2, 6, 23, 0.55));
}

.board-header-hole {
  fill: #020617;
  stroke: #cbd5e1;
  stroke-width: 1.45;
}

.board-silkscreen {
  pointer-events: none;
}

.board-silkscreen path {
  fill: none;
  stroke: #e5e7eb;
  stroke-linecap: round;
  stroke-opacity: 0.52;
  stroke-width: 1.25;
}

.board-silkscreen text {
  fill: #e5e7eb;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 0;
  opacity: 0.82;
}

.board-shell--animated .board-trace,
.board-shell--animated .board-inner,
.board-shell--animated .board-mounting-holes,
.board-shell--animated .board-header-sockets,
.board-shell--animated .board-silkscreen {
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
  fill: #e5e7eb;
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
  fill: #f8fafc;
  opacity: 0.9;
}

.board-component rect {
  fill: rgba(15, 23, 42, 0.72);
  stroke: rgba(226, 232, 240, 0.46);
  stroke-width: 2;
}

.board-component--rgb rect {
  fill: rgba(249, 115, 22, 0.4);
  stroke: rgba(254, 215, 170, 0.75);
  filter: drop-shadow(0 0 7px rgba(249, 115, 22, 0.55));
}

.connector-board__component rect {
  fill: rgba(15, 23, 42, 0.72);
  stroke: rgba(226, 232, 240, 0.46);
  stroke-width: 2;
}

.connector-board__component--lcd rect {
  fill: rgba(37, 99, 235, 0.38);
}

.connector-board__component--sd rect {
  fill: rgba(51, 65, 85, 0.82);
}

.connector-board__component--power rect {
  fill: rgba(180, 83, 9, 0.42);
}

.connector-board__component--led rect {
  fill: rgba(180, 83, 9, 0.42);
  stroke: rgba(254, 215, 170, 0.75);
}

.connector-board__group-label text {
  fill: #f8fafc;
  font-size: 12px;
  opacity: 0.92;
  text-transform: uppercase;
}

.espressif-logo {
  pointer-events: none;
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

.board-cpu {
  fill: #dbeafe;
  font-size: 11.5px;
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
  fill: #0f172a;
}

.board-pin--control .board-pin__pad {
  fill: #fbbf24;
}

.board-pin--matched .board-pin__pad {
  fill: #dbeafe;
  stroke: #2563eb;
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
  stroke: #2563eb;
  stroke-width: 3;
}

.board-pin__label {
  fill: #0f172a;
  font-size: 12px;
  font-weight: 900;
  pointer-events: none;
}

.board-pin--ground .board-pin__label {
  fill: #ffffff;
}

.board-pin--matched .board-pin__label {
  fill: #0f172a;
}

.connector-board__pin-label {
  font-size: 8.7px;
}

.connector-board__pin-label--functions {
  font-size: 7.4px;
}

.board-function-labels {
  pointer-events: none;
}

.board-function-label {
  --function-badge-enter-x: 0;
  --function-label-delay: 0ms;
}

.board-function-label--left {
  --function-badge-enter-x: 8px;
}

.board-function-label--right {
  --function-badge-enter-x: -8px;
}

.board-function-label__leader {
  stroke: rgba(15, 23, 42, 0.36);
  stroke-linecap: round;
  stroke-width: 1.4;
  transform-box: fill-box;
  animation: function-leader-enter 220ms var(--function-label-delay) ease-out both;
}

.board-function-label--left .board-function-label__leader {
  transform-origin: right center;
}

.board-function-label--right .board-function-label__leader {
  transform-origin: left center;
}

.board-function-badge {
  --function-badge-delay: 0ms;
  transform-box: fill-box;
  transform-origin: center;
  animation: function-badge-enter 300ms var(--function-badge-delay) cubic-bezier(0.2, 1.18, 0.34, 1) both;
}

.board-function-badge__pill {
  fill: #cbd5e1;
  stroke: rgba(255, 255, 255, 0.78);
  stroke-width: 0.65;
}

.board-function-badge__text {
  fill: #ffffff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 8.7px;
  font-weight: 800;
  letter-spacing: 0;
  pointer-events: none;
  text-rendering: geometricPrecision;
}

.board-function-badge--gpio .board-function-badge__text,
.board-function-badge--analog .board-function-badge__text,
.board-function-badge--touch .board-function-badge__text,
.board-function-badge--rtc .board-function-badge__text,
.board-function-badge--spi .board-function-badge__text,
.board-function-badge--uart .board-function-badge__text,
.board-function-badge--ethernet .board-function-badge__text,
.board-function-badge--power .board-function-badge__text,
.board-function-badge--ground .board-function-badge__text,
.board-function-badge--control .board-function-badge__text,
.board-function-badge--other .board-function-badge__text {
  fill: #0f172a;
}

.board-function-badge--gpio .board-function-badge__pill {
  fill: #93c5fd;
}

.board-function-badge--analog .board-function-badge__pill {
  fill: #86efac;
}

.board-function-badge--touch .board-function-badge__pill {
  fill: #f97316;
}

.board-function-badge--rtc .board-function-badge__pill {
  fill: #3b82f6;
}

.board-function-badge--spi .board-function-badge__pill {
  fill: #d9a70d;
}

.board-function-badge--uart .board-function-badge__pill {
  fill: #758195;
}

.board-function-badge--usb .board-function-badge__pill,
.board-function-badge--boot .board-function-badge__pill {
  fill: #e11d48;
}

.board-function-badge--ethernet .board-function-badge__pill {
  fill: #ca8a04;
}

.board-function-badge--power .board-function-badge__pill {
  fill: #f87171;
}

.board-function-badge--ground .board-function-badge__pill {
  fill: #e2e8f0;
}

.board-function-badge--control .board-function-badge__pill {
  fill: #fbbf24;
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

@keyframes function-leader-enter {
  0% {
    opacity: 0;
    transform: scaleX(0.22);
  }

  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}

@keyframes function-badge-enter {
  0% {
    opacity: 0;
    transform: translateX(var(--function-badge-enter-x)) scale(0.88);
  }

  70% {
    opacity: 1;
    transform: translateX(0) scale(1.04);
  }

  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
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
  .board-mounting-holes,
  .board-header-sockets,
  .board-silkscreen,
  .module,
  .board-usb,
  .board-component,
  .board-pin,
  .board-pin--selected,
  .board-function-label__leader,
  .board-function-badge {
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
