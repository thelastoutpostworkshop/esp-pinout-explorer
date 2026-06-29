# Contributor Guide

## Install

```bash
npm install
```

## Dev

```bash
npm run dev
```

The dev server is pinned to `http://127.0.0.1:5176` so it does not collide with other local Vite apps.

## Build

```bash
npm run build
```

## Structure

- `src/components/AppShell.vue` - compact app bar, responsive sidebar layout, and mobile control drawer
- `src/components/ExplorerSidebar.vue` - SoC/profile selectors, search, pin count, and legend
- `src/components/SocPinoutView.vue` - pinout stage and selected-pin drawer
- `src/components/ChipSvg.vue` - data-driven clickable SVG package drawing
- `src/components/BoardSvg.vue` - data-driven clickable SVG development-board header drawing
- `src/components/PinInfoDrawer.vue` - selected pin details, maker warnings, and board design notes
- `src/components/PinSearch.vue` - search and quick filters
- `src/data/boards/helpers.ts` - shared board pin builders for metadata inheritance, warnings, notes, and search keywords
- `src/data/boards/esp32s3/` - extracted ESP32-S3 board profiles and shared board source metadata
- `src/data/pinWarnings.ts` - warning presentation rules
- `src/data/socs/esp32.ts` - Classic ESP32 pin and board metadata
- `src/data/socs/esp32s3.ts` - ESP32-S3 pin metadata
- `src/data/socs/esp32c6.ts` - ESP32-C6 pin and package metadata
- `src/stores/socStore.ts` - Pinia selected SoC, selected pin, and search state

When a SoC has multiple packages or board profiles, the app shows a profile selector beside the SoC selector.

## Board Label Convention

Board profile data preserves official Espressif header and silkscreen labels in `boardLabel`, including labels such as `IO23` or `GPIO23`. `BoardSvg.vue` renders simple numeric GPIO labels as `23` for a consistent maker-facing board view. The official board label remains available in search and in the pin details drawer.

## Board Profile File Template

Add one file per board under `src/data/boards/<family>/`, for example `src/data/boards/esp32c6/devkitC1.ts`. Board files must use official Espressif board user guides, schematics, or board documentation as their source.

Use this shape for new board profiles:

```ts
import { makeBoardPin, type BoardSourcePinResolver } from '@/data/boards/helpers';
import { moduleSource } from '@/data/boards/<family>/moduleSources';
import type { PinType, PinWarning, SocModuleVariant, SocPackageVariant, SocPin, SocSource } from '@/types/soc';

interface BoardHeaderPinInput {
  header: 'J1' | 'J3';
  number: number;
  label: string;
  type: PinType;
  gpio?: number;
  mainFunctions: string[];
  notes?: string[];
  warnings?: PinWarning[];
  keywords?: string[];
}

const boardSource: SocSource = {
  title: 'Official board user guide title',
  version: 'documented version',
  publisher: 'Espressif',
  documentType: 'user-guide',
  url: 'https://docs.espressif.com/...',
  sections: ['Header Block J1', 'Header Block J3', 'Pin Layout'],
};

const moduleVariants: SocModuleVariant[] = [
  {
    name: 'Visible module name',
    antenna: 'PCB antenna',
    flash: 'Flash size and type',
    psram: 'PSRAM size or No PSRAM',
    footprint: 'Official module footprint',
    pinoutImpact: 'Same header profile; note any unavailable pins.',
    source: moduleSource,
  },
];

function boardPin(input: BoardHeaderPinInput, resolveSourcePinByGpio: BoardSourcePinResolver): SocPin {
  const displayNumber = `${input.header}-${input.number}`;

  return makeBoardPin({
    id: `family-board-${input.header.toLowerCase()}-${input.number}`,
    number: input.number,
    displayNumber,
    label: input.label,
    type: input.type,
    gpio: input.gpio,
    boardHeader: input.header,
    position: { side: input.header === 'J1' ? 'left' : 'right', order: input.number },
    mainFunctions: input.mainFunctions,
    sourcePin: resolveSourcePinByGpio(input.gpio),
    note: `${displayNumber} board header pin, silkscreen label ${input.label}.`,
    notes: input.notes,
    warnings: input.warnings,
    baseKeywords: ['board', 'devkit', 'module', 'header'],
    keywords: input.keywords,
  });
}

export function createFamilyBoardProfile(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant {
  const pin = (input: BoardHeaderPinInput) => boardPin(input, resolveSourcePinByGpio);

  return {
    id: 'family-board-id',
    name: 'Board name',
    packageName: 'Official board header description',
    kind: 'board',
    source: boardSource,
    moduleNames: ['Visible module name'],
    moduleVariants,
    pins: [
      pin({
        header: 'J1',
        number: 1,
        label: '3V3',
        type: 'power',
        mainFunctions: ['3.3 V power supply'],
        warnings: ['power'],
        keywords: ['3v3', 'power'],
      }),
    ],
  };
}
```

Register the factory in the family barrel file, not in the raw SoC file:

```ts
export function createFamilyBoardProfiles(resolveSourcePinByGpio: BoardSourcePinResolver): SocPackageVariant[] {
  return [
    createExistingBoardProfile(resolveSourcePinByGpio),
    createFamilyBoardProfile(resolveSourcePinByGpio),
  ];
}
```

After adding a board profile, update README/current docs when appropriate, mark the matching TODO item, and run:

```bash
npm test
npm run build
```
