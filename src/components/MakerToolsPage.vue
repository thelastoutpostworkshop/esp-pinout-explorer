<template>
  <section class="maker-tools-page" aria-label="Maker Tools">
    <header class="maker-tools-page__header">
      <div>
        <p class="maker-tools-page__eyebrow">Resources</p>
        <h1>Maker Tools</h1>
        <p class="maker-tools-page__subtitle">
          Maker utilities from The Last Outpost Workshop for ESP32 and embedded projects.
        </p>
      </div>
      <button class="maker-tools-page__back" type="button" @click="store.showPinout">
        <ArrowLeft :size="16" aria-hidden="true" />
        <span>Back to pinout</span>
      </button>
    </header>

    <section class="maker-tools-page__support" aria-label="Support the project">
      <div class="maker-tools-page__support-icon" aria-hidden="true">
        <Coffee :size="24" />
      </div>
      <div>
        <h2>Support the project</h2>
        <p>
          These maker utilities are free to use. If they help at your bench, a coffee supports ongoing development.
        </p>
      </div>
      <a class="maker-tools-page__support-action" href="https://buymeacoffee.com/thelastoutpostworkshop" rel="noreferrer" target="_blank">
        <Coffee :size="16" aria-hidden="true" />
        <span>Buy Me a Coffee</span>
      </a>
    </section>

    <section class="maker-tools-page__grid" aria-label="Maker utilities">
      <article v-for="(tool, index) in tools" :key="tool.title" class="maker-tools-page__card">
        <a
          v-if="tool.tutorialUrl"
          class="maker-tools-page__thumbnail"
          :href="tool.tutorialUrl"
          rel="noreferrer"
          target="_blank"
          :aria-label="`Watch ${tool.title} tutorial`"
          :style="{ '--maker-tools-delay': `${index * 70}ms` }"
        >
          <img :src="tool.thumbnailSrc" :alt="`${tool.title} tutorial thumbnail`" loading="lazy" />
          <span class="maker-tools-page__thumbnail-icon" aria-hidden="true">
            <Wrench :size="17" />
          </span>
          <span class="maker-tools-page__play" aria-hidden="true">
            <Play :size="22" fill="currentColor" />
          </span>
        </a>

        <div class="maker-tools-page__copy">
          <h2>{{ tool.title }}</h2>
          <p>{{ tool.description }}</p>
          <a v-if="tool.sourceUrl" class="maker-tools-page__source" :href="tool.sourceUrl" rel="noreferrer" target="_blank">
            {{ tool.sourceLabel }}
          </a>
          <span v-else class="maker-tools-page__source">{{ tool.sourceLabel }}</span>
        </div>

        <footer class="maker-tools-page__actions">
          <a
            v-if="tool.tutorialUrl"
            class="maker-tools-page__action maker-tools-page__action--muted"
            :href="tool.tutorialUrl"
            rel="noreferrer"
            target="_blank"
          >
            <Play :size="16" aria-hidden="true" />
            <span>Watch tutorial</span>
          </a>
          <a
            v-if="tool.url"
            class="maker-tools-page__action"
            :href="tool.url"
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink :size="16" aria-hidden="true" />
            <span>{{ tool.actionLabel }}</span>
          </a>
        </footer>
      </article>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ArrowLeft, Coffee, ExternalLink, Play, Wrench } from '@lucide/vue';
import arduinoMakerWorkshopThumbnail from '@/assets/tool-thumbnails/arduino-maker-workshop.jpg';
import espBoardVaultThumbnail from '@/assets/tool-thumbnails/esp-board-vault.jpg';
import espConnectThumbnail from '@/assets/tool-thumbnails/espconnect.jpg';
import gpioViewerThumbnail from '@/assets/tool-thumbnails/gpio-viewer.jpg';
import partitionBuilderThumbnail from '@/assets/tool-thumbnails/partition-builder.jpg';
import videoConversionThumbnail from '@/assets/tool-thumbnails/video-conversion.jpg';
import { useSocStore } from '@/stores/socStore';

interface ToolItem {
  title: string;
  description: string;
  thumbnailSrc: string;
  sourceLabel: string;
  actionLabel: string;
  tutorialUrl: string;
  sourceUrl?: string;
  url?: string;
}

const store = useSocStore();

const tools: ToolItem[] = [
  {
    title: 'ESPConnect',
    description:
      'Browser-based utility for working with ESP devices. Inspect hardware details, manage SPIFFS, FATFS, and LittleFS files, back up flash, and deploy firmware from a modern Chromium browser.',
    thumbnailSrc: espConnectThumbnail,
    url: 'https://thelastoutpostworkshop.github.io/ESPConnect/',
    sourceUrl: 'https://github.com/thelastoutpostworkshop/ESPConnect',
    sourceLabel: 'thelastoutpostworkshop/ESPConnect',
    tutorialUrl: 'https://www.youtube.com/watch?v=-nhDKzBxHiI',
    actionLabel: 'Open tool',
  },
  {
    title: 'ESP Board Vault',
    description:
      'Local-first desktop inventory for ESP32 makers. Scan, identify, organize, and track boards with hardware details, partition maps, photos, projects, checklists, and backups.',
    thumbnailSrc: espBoardVaultThumbnail,
    sourceUrl: 'https://github.com/thelastoutpostworkshop/ESPVault',
    sourceLabel: 'thelastoutpostworkshop/ESPVault',
    tutorialUrl: 'https://youtu.be/YwYP-eET9Oo',
    actionLabel: 'Open source',
  },
  {
    title: 'ESP32 Partition Builder',
    description:
      'Plan and create custom partition layouts for ESP32 boards before flashing firmware or organizing storage.',
    thumbnailSrc: partitionBuilderThumbnail,
    url: 'https://thelastoutpostworkshop.github.io/ESP32PartitionBuilder/',
    sourceUrl: 'https://github.com/thelastoutpostworkshop/ESP32PartitionBuilder',
    sourceLabel: 'thelastoutpostworkshop/ESP32PartitionBuilder',
    tutorialUrl: 'https://www.youtube.com/watch?v=EuHxodrye6E',
    actionLabel: 'Open tool',
  },
  {
    title: 'Video Conversion Studio',
    description:
      'Convert regular video or audio files into output that fits ESP32 display projects and embedded playback workflows.',
    thumbnailSrc: videoConversionThumbnail,
    url: 'https://thelastoutpostworkshop.github.io/video_conversion/',
    sourceUrl: 'https://github.com/thelastoutpostworkshop/video_conversion',
    sourceLabel: 'thelastoutpostworkshop/video_conversion',
    tutorialUrl: 'https://www.youtube.com/watch?v=bFq05qXqin0',
    actionLabel: 'Open tool',
  },
  {
    title: 'GPIOViewer',
    description:
      'Real-time GPIO pin activity visualization in a web browser, useful for inspecting pin states and troubleshooting wiring or signal activity.',
    thumbnailSrc: gpioViewerThumbnail,
    url: 'https://www.youtube.com/watch?v=JJzRXcQrl3I',
    sourceUrl: 'https://github.com/thelastoutpostworkshop/gpio_viewer',
    sourceLabel: 'thelastoutpostworkshop/gpio_viewer',
    tutorialUrl: 'https://www.youtube.com/watch?v=JJzRXcQrl3I',
    actionLabel: 'Watch tutorial',
  },
  {
    title: 'Arduino Maker Workshop',
    description:
      'A VS Code extension for Arduino-centered maker development, with a focused editor workflow for sketch-driven board projects.',
    thumbnailSrc: arduinoMakerWorkshopThumbnail,
    url: 'https://marketplace.visualstudio.com/items?itemName=TheLastOutpostWorkshop.arduino-maker-workshop',
    sourceLabel: 'VS Code Marketplace extension',
    tutorialUrl: 'https://www.youtube.com/watch?v=rduTUUVkzqM',
    actionLabel: 'Open extension',
  },
] as const;
</script>

<style scoped>
.maker-tools-page {
  display: grid;
  align-content: start;
  gap: 16px;
  min-width: 0;
  height: 100%;
  overflow: auto;
  padding: clamp(16px, 2vw, 24px);
  background: #f6f8f7;
}

.maker-tools-page__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.maker-tools-page__eyebrow {
  margin: 0 0 3px;
  color: #006d77;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.maker-tools-page h1 {
  margin: 0;
  color: #0f172a;
  font-size: clamp(1.35rem, 2.4vw, 2rem);
  font-weight: 900;
  letter-spacing: 0;
}

.maker-tools-page__subtitle {
  max-width: 720px;
  margin: 6px 0 0;
  color: #475569;
  font-size: 0.95rem;
  font-weight: 650;
  line-height: 1.45;
}

.maker-tools-page__back,
.maker-tools-page__support-action,
.maker-tools-page__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 34px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 0 10px;
  color: #006d77;
  background: #ffffff;
  font-family: inherit;
  font-size: 0.84rem;
  font-weight: 850;
  line-height: 1.2;
  text-decoration: none;
  cursor: pointer;
}

.maker-tools-page__back:hover,
.maker-tools-page__back:focus-visible,
.maker-tools-page__support-action:hover,
.maker-tools-page__support-action:focus-visible,
.maker-tools-page__action:hover,
.maker-tools-page__action:focus-visible {
  border-color: #0e7490;
  background: #ecfeff;
}

.maker-tools-page__support {
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  border: 1px solid #cde7e7;
  border-radius: 8px;
  padding: 14px;
  background:
    linear-gradient(90deg, rgba(20, 184, 166, 0.1), transparent 72%),
    #ffffff;
}

.maker-tools-page__support-icon {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid #99f6e4;
  border-radius: 8px;
  color: #006d77;
  background: #dffcf7;
}

.maker-tools-page__support h2 {
  margin: 0;
  color: #0f172a;
  font-size: 0.98rem;
  font-weight: 900;
}

.maker-tools-page__support p {
  margin: 5px 0 0;
  color: #475569;
  font-size: 0.88rem;
  line-height: 1.45;
}

.maker-tools-page__support-action {
  color: #06251f;
  background: #99f6e4;
  border-color: #5eead4;
}

.maker-tools-page__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(330px, 1fr));
  gap: 14px;
}

.maker-tools-page__card {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-width: 0;
  overflow: hidden;
  border: 1px solid #dbe3ea;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
}

.maker-tools-page__thumbnail {
  position: relative;
  display: block;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  color: #ffffff;
  background: #e2e8f0;
  opacity: 0;
  transform: translateY(8px) scale(0.985);
  animation: maker-tools-thumbnail-enter 440ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: var(--maker-tools-delay, 0ms);
}

.maker-tools-page__thumbnail img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    filter 180ms ease,
    transform 180ms ease;
}

.maker-tools-page__thumbnail::after {
  position: absolute;
  inset: 0;
  content: '';
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(15, 23, 42, 0.38)),
    linear-gradient(90deg, rgba(0, 109, 119, 0.28), transparent 46%);
}

.maker-tools-page__thumbnail:hover img,
.maker-tools-page__thumbnail:focus-visible img {
  filter: saturate(1.08) contrast(1.03);
  transform: scale(1.025);
}

.maker-tools-page__thumbnail-icon,
.maker-tools-page__play {
  position: absolute;
  z-index: 1;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.24);
}

.maker-tools-page__thumbnail-icon {
  top: 10px;
  left: 10px;
  width: 32px;
  height: 32px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.62);
}

.maker-tools-page__play {
  top: 50%;
  left: 50%;
  width: 46px;
  height: 46px;
  border-radius: 999px;
  color: #06251f;
  background: rgba(153, 246, 228, 0.92);
  transform: translate(-50%, -50%);
}

.maker-tools-page__copy {
  display: grid;
  align-content: start;
  gap: 8px;
  min-width: 0;
  padding: 14px;
}

.maker-tools-page__copy h2 {
  margin: 0;
  color: #0f172a;
  font-size: 1rem;
  font-weight: 900;
  line-height: 1.3;
}

.maker-tools-page__copy p {
  margin: 0;
  color: #475569;
  font-size: 0.88rem;
  line-height: 1.48;
}

.maker-tools-page__source {
  color: #006d77;
  font-size: 0.82rem;
  font-weight: 850;
  overflow-wrap: anywhere;
  text-decoration: none;
}

.maker-tools-page__source:hover,
.maker-tools-page__source:focus-visible {
  text-decoration: underline;
}

.maker-tools-page__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #e2e8f0;
  padding: 10px 14px;
  background: #f8fafc;
}

.maker-tools-page__action--muted {
  color: #475569;
}

@keyframes maker-tools-thumbnail-enter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .maker-tools-page__thumbnail {
    opacity: 1;
    transform: none;
    animation: none;
  }
}

@media (max-width: 720px) {
  .maker-tools-page__header,
  .maker-tools-page__support {
    grid-template-columns: 1fr;
  }

  .maker-tools-page__header {
    display: grid;
  }

  .maker-tools-page__support-action,
  .maker-tools-page__back {
    justify-self: start;
  }

  .maker-tools-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
