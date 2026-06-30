<template>
  <section class="about-page" aria-label="About ESP Pinout Explorer">
    <header class="about-page__hero">
      <svg class="about-page__atlas" viewBox="0 0 1180 480" role="img" aria-label="Animated atlas map of ESP board routes">
        <defs>
          <pattern id="atlasGrid" width="46" height="46" patternUnits="userSpaceOnUse">
            <path d="M46 0H0V46" fill="none" stroke="rgba(226, 232, 240, 0.16)" stroke-width="1" />
          </pattern>
          <linearGradient id="atlasSea" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#102a43" />
            <stop offset="0.48" stop-color="#0f3f4a" />
            <stop offset="1" stop-color="#111827" />
          </linearGradient>
          <linearGradient id="atlasRouteGlow" x1="0" x2="1">
            <stop offset="0" stop-color="#f59e0b" />
            <stop offset="0.5" stop-color="#5eead4" />
            <stop offset="1" stop-color="#60a5fa" />
          </linearGradient>
        </defs>

        <rect width="1180" height="480" fill="url(#atlasSea)" />
        <rect class="about-page__atlas-grid" width="1180" height="480" fill="url(#atlasGrid)" />
        <g class="about-page__land" aria-hidden="true">
          <path d="M90 300C160 220 208 218 286 246C350 269 420 202 502 226C595 253 605 346 706 338C790 332 815 254 907 258C1002 262 1045 317 1106 284V480H90Z" />
          <path d="M0 92C68 74 117 95 152 132C202 186 294 148 344 96C398 40 468 36 532 86C592 133 659 122 720 80C808 19 887 36 942 96C1006 166 1110 146 1180 104V0H0Z" />
        </g>
        <g class="about-page__contours" aria-hidden="true">
          <path d="M136 296C222 246 326 276 403 240C503 193 602 238 653 298C711 366 819 342 875 284C932 225 1024 234 1098 294" />
          <path d="M188 320C260 288 333 304 426 278C535 248 608 274 672 332C732 386 830 376 898 312C960 254 1031 264 1080 312" />
          <path d="M92 126C153 111 198 150 247 150C320 150 353 84 426 72C495 61 552 126 626 124C709 122 754 50 836 58C920 66 951 144 1031 148C1088 151 1132 124 1180 92" />
        </g>
        <path class="about-page__route" d="M150 342C246 242 336 384 428 286C520 188 626 346 724 236C829 118 900 330 1030 162" />
        <g class="about-page__route-pins" aria-hidden="true">
          <circle cx="150" cy="342" r="8" />
          <circle cx="428" cy="286" r="8" />
          <circle cx="724" cy="236" r="8" />
          <circle cx="1030" cy="162" r="8" />
        </g>
        <g class="about-page__compass" aria-hidden="true">
          <circle cx="972" cy="342" r="54" />
          <path d="M972 284L986 342L972 400L958 342Z" />
          <path d="M914 342L972 328L1030 342L972 356Z" />
          <circle cx="972" cy="342" r="10" />
          <text x="972" y="275" text-anchor="middle">N</text>
        </g>
      </svg>

      <div class="about-page__hero-copy">
        <p class="about-page__eyebrow">About this atlas</p>
        <h1>ESP Pinout Explorer</h1>
        <p class="about-page__subtitle">
          A bench-side atlas for finding the right ESP pin before wires, boot straps, USB signals, flash pins, and board hardware collide.
        </p>
        <p class="about-page__credit">
          Brought to you by
          <a href="https://www.youtube.com/channel/UCnnU_HGvTr8ewpqvHe2llDw" rel="noreferrer" target="_blank">
            The Last Outpost Workshop
          </a>
        </p>
        <div class="about-page__actions" aria-label="About actions">
          <a
            class="about-page__action about-page__action--primary"
            href="https://www.youtube.com/channel/UCnnU_HGvTr8ewpqvHe2llDw"
            rel="noreferrer"
            target="_blank"
          >
            <Play :size="16" aria-hidden="true" />
            <span>Visit the workshop</span>
            <ExternalLink :size="13" aria-hidden="true" />
          </a>
          <button class="about-page__action about-page__action--back" type="button" @click="store.showPinout">
            <ArrowLeft :size="16" aria-hidden="true" />
            <span>Back to pinout</span>
          </button>
        </div>
      </div>
    </header>

    <section class="about-page__stats" aria-label="Explorer coverage">
      <article v-for="stat in stats" :key="stat.label" class="about-page__stat">
        <span>{{ stat.value }}</span>
        <p>{{ stat.label }}</p>
      </article>
    </section>

    <section class="about-page__section" aria-labelledby="about-purpose">
      <div class="about-page__section-heading">
        <p class="about-page__eyebrow">Purpose</p>
        <h2 id="about-purpose">Made for careful wiring</h2>
      </div>
      <div class="about-page__principles">
        <article v-for="principle in principles" :key="principle.title" class="about-page__principle">
          <div class="about-page__icon" aria-hidden="true">
            <component :is="principle.icon" :size="22" />
          </div>
          <h3>{{ principle.title }}</h3>
          <p>{{ principle.body }}</p>
        </article>
      </div>
    </section>

    <section class="about-page__field" aria-labelledby="about-field-notes">
      <div class="about-page__field-copy">
        <p class="about-page__eyebrow">Maker field notes</p>
        <h2 id="about-field-notes">Useful checks before the solder cools</h2>
        <p>
          Pin labels on a board are only the start. This explorer keeps the package pin, board header, warnings, functions, and source trail near each other so decisions happen with context.
        </p>
      </div>
      <div class="about-page__notes">
        <article v-for="note in fieldNotes" :key="note.title" class="about-page__note">
          <span>{{ note.index }}</span>
          <div>
            <h3>{{ note.title }}</h3>
            <p>{{ note.body }}</p>
          </div>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, ArrowLeft, BookOpenCheck, Cpu, ExternalLink, Play } from '@lucide/vue';
import { useSocStore } from '@/stores/socStore';

const store = useSocStore();

const stats = computed(() => {
  const socCount = store.socs.length;
  const boardCount = store.socs.reduce((total, soc) => total + (soc.boardProfiles?.length ?? 0), 0);
  const profileCount = store.socs.reduce(
    (total, soc) => total + 1 + (soc.packageVariants?.length ?? 0) + (soc.boardProfiles?.length ?? 0),
    0,
  );

  return [
    { value: socCount, label: 'SoC families charted' },
    { value: boardCount, label: 'development board profiles' },
    { value: profileCount, label: 'package, module, and board views' },
  ];
});

const principles = [
  {
    title: 'Official-source first',
    body: 'Datasheets, user guides, schematics, and Espressif documentation are the authority for every pin profile.',
    icon: BookOpenCheck,
  },
  {
    title: 'Board reality matters',
    body: 'A GPIO can look free on the chip and still be tied to USB, flash, PSRAM, UART bridges, LEDs, or boot controls on a dev board.',
    icon: Cpu,
  },
  {
    title: 'Risk should be visible',
    body: 'Maker warnings stay close to the pin so boot, strapping, voltage, reset, and on-board hardware constraints are harder to miss.',
    icon: AlertTriangle,
  },
] as const;

const fieldNotes = [
  {
    index: '01',
    title: 'Start with the exact board profile',
    body: 'Match the module marking, revision, and header labels before choosing a pin.',
  },
  {
    index: '02',
    title: 'Treat boot and strapping pins with suspicion',
    body: 'A circuit that drives one of these pins at reset can change how the board starts.',
  },
  {
    index: '03',
    title: 'Check shared hardware paths',
    body: 'USB, UART0, flash, PSRAM, RGB LEDs, and buttons can make an otherwise valid GPIO awkward in real projects.',
  },
  {
    index: '04',
    title: 'Keep the source trail open',
    body: 'Use Profile info when a pin looks surprising; the source link is part of the map.',
  },
] as const;
</script>

<style scoped>
.about-page {
  display: grid;
  align-content: start;
  gap: 16px;
  min-width: 0;
  height: 100%;
  overflow: auto;
  padding: clamp(16px, 2vw, 24px);
  background:
    linear-gradient(90deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px),
    linear-gradient(0deg, rgba(15, 23, 42, 0.035) 1px, transparent 1px),
    #f6f8f7;
  background-size: 28px 28px;
}

.about-page__hero {
  position: relative;
  min-height: clamp(450px, 52vh, 560px);
  overflow: hidden;
  border: 1px solid #1f3b4d;
  border-radius: 8px;
  color: #ffffff;
  background: #102a43;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.18);
}

.about-page__atlas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.about-page__land path {
  fill: rgba(244, 162, 97, 0.22);
  stroke: rgba(251, 191, 36, 0.2);
  stroke-width: 2;
}

.about-page__contours path {
  fill: none;
  stroke: rgba(248, 250, 252, 0.24);
  stroke-dasharray: 7 10;
  stroke-linecap: round;
  stroke-width: 2;
}

.about-page__route {
  fill: none;
  stroke: url(#atlasRouteGlow);
  stroke-dasharray: 18 14;
  stroke-linecap: round;
  stroke-width: 4;
  filter: drop-shadow(0 0 8px rgba(94, 234, 212, 0.42));
  animation: atlas-route 12s linear infinite;
}

.about-page__route-pins circle {
  fill: #f8fafc;
  stroke: #f59e0b;
  stroke-width: 4;
  animation: atlas-pin 2200ms ease-in-out infinite;
}

.about-page__route-pins circle:nth-child(2) {
  animation-delay: 180ms;
}

.about-page__route-pins circle:nth-child(3) {
  animation-delay: 360ms;
}

.about-page__route-pins circle:nth-child(4) {
  animation-delay: 540ms;
}

.about-page__compass {
  transform-box: fill-box;
  transform-origin: center;
  animation: atlas-compass 18s ease-in-out infinite;
}

.about-page__compass circle:first-child {
  fill: rgba(15, 23, 42, 0.34);
  stroke: rgba(248, 250, 252, 0.72);
  stroke-width: 2;
}

.about-page__compass path {
  fill: rgba(248, 250, 252, 0.82);
  stroke: rgba(245, 158, 11, 0.74);
  stroke-width: 1.4;
}

.about-page__compass circle:nth-of-type(2) {
  fill: #f59e0b;
}

.about-page__compass text {
  fill: #f8fafc;
  font-size: 16px;
  font-weight: 900;
}

.about-page__hero-copy {
  position: relative;
  z-index: 1;
  display: grid;
  align-content: end;
  max-width: 780px;
  min-height: inherit;
  padding: clamp(24px, 5vw, 56px);
  background:
    linear-gradient(90deg, rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.64) 54%, transparent),
    linear-gradient(0deg, rgba(15, 23, 42, 0.72), transparent 58%);
}

.about-page__eyebrow {
  margin: 0 0 6px;
  color: #0e7490;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.about-page__hero .about-page__eyebrow {
  color: #99f6e4;
}

.about-page h1,
.about-page h2,
.about-page h3,
.about-page p {
  letter-spacing: 0;
}

.about-page h1 {
  margin: 0;
  color: #ffffff;
  font-size: clamp(2.4rem, 7vw, 5.8rem);
  font-weight: 950;
  line-height: 0.95;
}

.about-page__subtitle {
  max-width: 700px;
  margin: 16px 0 0;
  color: #dbeafe;
  font-size: clamp(1rem, 1.8vw, 1.32rem);
  font-weight: 700;
  line-height: 1.45;
}

.about-page__credit {
  margin: 16px 0 0;
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 750;
}

.about-page__credit a {
  color: #fbbf24;
  text-decoration: none;
}

.about-page__credit a:hover,
.about-page__credit a:focus-visible {
  text-decoration: underline;
}

.about-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.about-page__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 38px;
  border: 1px solid rgba(226, 232, 240, 0.38);
  border-radius: 6px;
  padding: 0 12px;
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.42);
  font-family: inherit;
  font-size: 0.86rem;
  font-weight: 850;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
}

.about-page__action:hover,
.about-page__action:focus-visible {
  border-color: #99f6e4;
  background: rgba(14, 116, 144, 0.38);
}

.about-page__action--primary {
  color: #06251f;
  background: #99f6e4;
  border-color: #5eead4;
}

.about-page__action--primary:hover,
.about-page__action--primary:focus-visible {
  background: #ccfbf1;
}

.about-page__action--back {
  min-height: 34px;
  border-color: #cbd5e1;
  color: #006d77;
  background: #ffffff;
  font-size: 0.84rem;
}

.about-page__action--back:hover,
.about-page__action--back:focus-visible {
  border-color: #0e7490;
  background: #ecfeff;
}

.about-page__stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.about-page__stat,
.about-page__principle,
.about-page__note {
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.about-page__stat {
  padding: 16px;
}

.about-page__stat span {
  display: block;
  color: #0f766e;
  font-size: clamp(1.65rem, 3vw, 2.45rem);
  font-weight: 950;
  line-height: 1;
}

.about-page__stat p {
  margin: 6px 0 0;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 800;
  line-height: 1.35;
}

.about-page__section,
.about-page__field {
  display: grid;
  gap: 14px;
  padding: clamp(14px, 2vw, 20px) 0;
}

.about-page__section-heading {
  display: grid;
  gap: 2px;
}

.about-page h2 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(1.28rem, 2.2vw, 1.85rem);
  font-weight: 950;
  line-height: 1.12;
}

.about-page__principles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.about-page__principle {
  display: grid;
  align-content: start;
  gap: 10px;
  padding: 16px;
}

.about-page__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  color: #075985;
  background: #e0f2fe;
}

.about-page__principle h3,
.about-page__note h3 {
  margin: 0;
  color: #0f172a;
  font-size: 0.98rem;
  font-weight: 950;
  line-height: 1.25;
}

.about-page__principle p,
.about-page__field-copy p,
.about-page__note p {
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.5;
}

.about-page__field {
  grid-template-columns: minmax(260px, 0.85fr) minmax(0, 1.15fr);
  align-items: start;
}

.about-page__field-copy {
  display: grid;
  gap: 8px;
  min-width: 0;
  padding-right: clamp(0px, 2vw, 22px);
}

.about-page__notes {
  display: grid;
  gap: 10px;
  min-width: 0;
}

.about-page__note {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  gap: 12px;
  padding: 14px;
}

.about-page__note span {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  color: #78350f;
  background: #fef3c7;
  font-size: 0.78rem;
  font-weight: 950;
}

@keyframes atlas-route {
  to {
    stroke-dashoffset: -192;
  }
}

@keyframes atlas-pin {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.86;
  }

  50% {
    transform: scale(1.32);
    opacity: 1;
  }
}

@keyframes atlas-compass {
  0%,
  100% {
    transform: rotate(-4deg);
  }

  50% {
    transform: rotate(7deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-page__route,
  .about-page__route-pins circle,
  .about-page__compass {
    animation: none;
  }
}

@media (max-width: 980px) {
  .about-page__stats,
  .about-page__principles,
  .about-page__field {
    grid-template-columns: 1fr;
  }

  .about-page__hero-copy {
    max-width: none;
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.72)),
      linear-gradient(0deg, rgba(15, 23, 42, 0.74), transparent 58%);
  }
}

@media (max-width: 620px) {
  .about-page {
    padding: 10px;
  }

  .about-page__hero {
    min-height: 520px;
  }

  .about-page__hero-copy {
    padding: 22px;
  }

  .about-page h1 {
    font-size: clamp(2.25rem, 16vw, 4rem);
  }

  .about-page__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .about-page__action {
    width: 100%;
  }

  .about-page__note {
    grid-template-columns: 1fr;
  }
}
</style>
