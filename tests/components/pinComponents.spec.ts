import { beforeEach, describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import BoardSvg from '@/components/BoardSvg.vue';
import ChipSvg from '@/components/ChipSvg.vue';
import ExplorerSidebar from '@/components/ExplorerSidebar.vue';
import PinInfoDrawer from '@/components/PinInfoDrawer.vue';
import PinSearch from '@/components/PinSearch.vue';
import SocPinoutView from '@/components/SocPinoutView.vue';
import { hasMakerWarning } from '@/data/pinWarnings';
import { esp32c6 } from '@/data/socs/esp32c6';
import { esp32s3 } from '@/data/socs/esp32s3';
import { useSocStore } from '@/stores/socStore';
import type { SocPin, SocSource } from '@/types/soc';

describe('ChipSvg', () => {
  it('renders one interactive SVG node per package pin and emits selected pin ids', async () => {
    const wrapper = mount(ChipSvg, {
      props: {
        filteredPinCount: esp32s3.pins.length,
        filteredPinIds: new Set(esp32s3.pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: esp32s3.packageName,
        pins: esp32s3.pins,
        selectedPinId: null,
        soc: esp32s3,
        totalPinCount: esp32s3.pins.length,
      },
    });
    const nodes = wrapper.findAll('.pin-node');

    expect(nodes).toHaveLength(esp32s3.pins.length);
    await nodes[0].trigger('click');
    await nodes[1].trigger('keydown.space');

    expect(wrapper.emitted('pin-click')).toEqual([[esp32s3.pins[0].id], [esp32s3.pins[1].id]]);
  });

  it('uses maker warning borders without promoting board design notes', () => {
    const wrapper = mount(ChipSvg, {
      props: {
        filteredPinCount: esp32s3.pins.length,
        filteredPinIds: new Set(esp32s3.pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: esp32s3.packageName,
        pins: esp32s3.pins,
        selectedPinId: null,
        soc: esp32s3,
        totalPinCount: esp32s3.pins.length,
      },
    });
    const nodes = wrapper.findAll('.pin-node');
    const makerWarningIndex = esp32s3.pins.findIndex((pin) => pin.warnings?.includes('boot'));
    const boardDesignNoteIndex = esp32s3.pins.findIndex((pin) => pin.warnings?.includes('glitch') && !hasMakerWarning(pin));

    expect(nodes[makerWarningIndex].classes()).toContain('pin-node--warning');
    expect(nodes[boardDesignNoteIndex].classes()).not.toContain('pin-node--warning');
  });
});

describe('BoardSvg', () => {
  it('renders header pins with selected, matched, and dimmed states', async () => {
    const boardProfile = esp32s3.boardProfiles?.[0];
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        filteredPinCount: 1,
        filteredPinIds: new Set([pins[0].id]),
        hasFilter: true,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: pins[0].id,
        soc: esp32s3,
        totalPinCount: pins.length,
      },
    });
    const nodes = wrapper.findAll('.board-pin');

    expect(nodes).toHaveLength(pins.length);
    expect(wrapper.attributes('aria-label')).toContain('1 of 44 header pins shown');
    expect(nodes[0].classes()).toEqual(expect.arrayContaining(['board-pin--selected', 'board-pin--matched']));
    expect(nodes[1].classes()).toContain('board-pin--dimmed');

    await nodes[0].trigger('keydown.enter');
    expect(wrapper.emitted('pin-click')).toEqual([[pins[0].id]]);
  });

  it('renders connector-group board profiles without J1/J3 assumptions', async () => {
    const usbOtgProfile = esp32s3.boardProfiles?.find((profile) => profile.id === 'esp32s3-usb-otg');
    expect(usbOtgProfile).toBeDefined();
    const pins = usbOtgProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        boardLayout: usbOtgProfile?.boardLayout,
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: usbOtgProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32s3,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.attributes('aria-label')).toContain('32 of 32 connector pins shown');
    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.findAll('.connector-board__pin')).toHaveLength(32);
    expect(wrapper.text()).toContain('USB switch');
    expect(wrapper.text()).toContain('Extended pins');
    expectNoOverlappingRects(
      wrapper.findAll('.connector-board__pin').map((pinNode) => ({ rect: pinNode.find('.board-pin__pad') })),
    );
    expectNoRectIntersections(
      wrapper.findAll('.connector-board__pin').map((pinNode) => pinNode.find('.board-pin__pad')),
      wrapper.findAll('.connector-board__component rect'),
    );

    await wrapper.findAll('.connector-board__pin')[0].trigger('click');
    expect(wrapper.emitted('pin-click')).toEqual([[pins[0].id]]);
  });
});

describe('SocPinoutView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('passes connector-group layout through to USB-OTG board rendering', () => {
    const store = useSocStore();
    store.selectPackage('esp32s3-usb-otg');

    const wrapper = mount(SocPinoutView, {
      global: {
        stubs: {
          PinInfoDrawer: { template: '<aside />' },
        },
      },
    });

    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.find('.header-name').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('3 / 32 header pins');
  });
});

describe('PinSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('emits text search and quick filter updates', async () => {
    const wrapper = mount(PinSearch, {
      props: {
        modelValue: '',
      },
      global: {
        stubs: searchStubs,
      },
    });

    expect(wrapper.text()).toContain('Quick filters');
    expect(wrapper.text()).toContain('Use search for exact functions');
    expect(wrapper.text()).toContain('RTC');

    await wrapper.find('input').setValue('GPIO38');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['GPIO38']);

    expect(wrapper.text()).toContain('Safe use');
    const safeUseChip = findButton(wrapper, 'Safe use');
    expect(safeUseChip.find('svg').exists()).toBe(true);
    expect(safeUseChip.classes()).not.toContain('pin-search__chip--safe');

    await safeUseChip.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['safe use']);

    await wrapper.setProps({ modelValue: 'safe use' });
    await findButton(wrapper, 'Safe use').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
  });
});

describe('ExplorerSidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows module identity for board profiles', async () => {
    const store = useSocStore();
    const wrapper = mount(ExplorerSidebar, {
      global: {
        stubs: sidebarStubs,
      },
    });

    expect(wrapper.text()).toContain('Module');
    expect(wrapper.text()).toContain('ESP32-S3-WROOM-1 / WROOM-1U / WROOM-2');
    expect(wrapper.text()).toContain('Official docs');
    expect(wrapper.find('.explorer-sidebar__source').attributes('href')).toBe(esp32s3.boardProfiles?.[0]?.source?.url);
    expect(wrapper.text()).toContain('Reference images');

    await wrapper.find('button[aria-label="View module variant details"]').trigger('click');

    expect(wrapper.find('[role="dialog"][aria-label="Module variant details"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('ESP32-S3-WROOM-2-N32R16V');
    expect(wrapper.text()).toContain('External antenna connector');
    expect(wrapper.text()).toContain('GPIO35/GPIO36/GPIO37 are used internally');
    expect(wrapper.find('.module-details a').attributes('href')).toBe(
      esp32s3.boardProfiles?.[0]?.moduleVariants?.[0].source?.url,
    );

    await wrapper.find('button[aria-label="Close module variant details"]').trigger('click');
    expect(wrapper.find('[role="dialog"][aria-label="Module variant details"]').exists()).toBe(false);

    await wrapper.find('.explorer-sidebar__figure-button').trigger('click');

    expect(wrapper.find('[role="dialog"][aria-label="Reference images"]').exists()).toBe(true);
    expect(wrapper.findAll('.reference-images__figure')).toHaveLength(esp32s3.boardProfiles?.[0]?.source?.figures?.length ?? 0);
    expect(wrapper.text()).toContain('Pin layout');
    expect(wrapper.find('.reference-images__figure img').attributes('src')).toBe(esp32s3.boardProfiles?.[0]?.source?.figures?.[0].url);

    await wrapper.find('button[aria-label="Close reference images"]').trigger('click');
    expect(wrapper.find('[role="dialog"][aria-label="Reference images"]').exists()).toBe(false);

    store.selectPackage('esp32s3-devkitm-1');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('ESP32-S3-MINI-1 / MINI-1U');
    expect(wrapper.find('.explorer-sidebar__source').attributes('href')).toBe(
      esp32s3.boardProfiles?.find((profile) => profile.id === 'esp32s3-devkitm-1')?.source?.url,
    );

    store.selectSoc('esp32c6');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.explorer-sidebar__figure-button').exists()).toBe(false);
  });
});

describe('PinInfoDrawer', () => {
  it('separates maker warnings from board design notes', async () => {
    const wrapper = mount(PinInfoDrawer, {
      props: {
        pin: pinWithMixedWarnings,
        source: testSource,
      },
      global: {
        stubs: drawerStubs,
      },
    });

    expect(wrapper.text()).toContain('Maker Warnings');
    expect(wrapper.text()).toContain('Boot');
    expect(wrapper.text()).toContain('Board Design Notes');
    expect(wrapper.text()).toContain('Flash memory');
    expect(wrapper.text()).toContain('Source: Test Datasheet v1.0');
    expect(wrapper.text()).not.toContain('Sections:');
    expect(wrapper.find('.pin-info__source a').attributes('href')).toBe(testSource.url);

    await wrapper.find('button[aria-label="Close pin details"]').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});

const searchStubs = {
  InfoTooltip: {
    props: ['label', 'text'],
    template: '<span :aria-label="label">{{ text }}</span>',
  },
  VBtn: {
    emits: ['click'],
    template: '<button :aria-label="$attrs[\'aria-label\']" type="button" @click="$emit(\'click\')"><slot /></button>',
  },
  VChip: {
    emits: ['click'],
    template: '<button class="v-chip" type="button" @click="$emit(\'click\')"><slot /></button>',
  },
  VTextField: {
    emits: ['update:modelValue'],
    props: ['modelValue'],
    template: `
      <label>
        <slot name="prepend-inner" />
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
        <slot name="append-inner" />
      </label>
    `,
  },
};

const drawerStubs = {
  FunctionChip: {
    props: ['label'],
    template: '<span>{{ label }}</span>',
  },
  InfoTooltip: {
    template: '<span />',
  },
  VBtn: {
    emits: ['click'],
    template: '<button :aria-label="$attrs[\'aria-label\']" type="button" @click="$emit(\'click\')"><slot /></button>',
  },
  VCard: {
    template: '<section><slot /></section>',
  },
  VCardText: {
    template: '<div><slot /></div>',
  },
  VCardTitle: {
    template: '<header><slot /></header>',
  },
  VChip: {
    template: '<span><slot /></span>',
  },
  VDivider: {
    template: '<hr>',
  },
  VNavigationDrawer: {
    emits: ['update:modelValue'],
    props: ['modelValue'],
    template: '<aside><slot /></aside>',
  },
};

const sidebarStubs = {
  InfoTooltip: {
    props: ['label', 'text'],
    template: '<span :aria-label="label">{{ text }}</span>',
  },
  PinSearch: {
    template: '<div />',
  },
  VChip: {
    template: '<span><slot /></span>',
  },
  VSelect: {
    template: '<label />',
  },
};

const pinWithMixedWarnings: SocPin = {
  gpio: 0,
  id: 'mixed-warning-pin',
  mainFunctions: ['GPIO0'],
  name: 'GPIO0',
  number: 5,
  position: { side: 'left', order: 5 },
  type: 'io',
  warnings: ['boot', 'flash'],
};

const testSource: SocSource = {
  title: 'Test Datasheet',
  version: 'v1.0',
  publisher: 'Espressif',
  documentType: 'datasheet',
  url: 'https://example.com/test.pdf',
  sections: ['Test Section'],
};

function findButton(wrapper: VueWrapper, label: string) {
  const button = wrapper.findAll('button').find((candidate) => candidate.text().trim() === label);
  expect(button, `Expected to find button "${label}"`).toBeDefined();
  return button!;
}

function expectNoOverlappingRects(items: { rect: VueWrapper }[]) {
  const rects = items.map((item) => ({
    x: Number(item.rect.attributes('x')),
    y: Number(item.rect.attributes('y')),
    width: Number(item.rect.attributes('width')),
    height: Number(item.rect.attributes('height')),
  }));

  for (const [index, first] of rects.entries()) {
    for (const second of rects.slice(index + 1)) {
      const horizontalOverlap = first.x < second.x + second.width && second.x < first.x + first.width;
      const verticalOverlap = first.y < second.y + second.height && second.y < first.y + first.height;

      expect(horizontalOverlap && verticalOverlap).toBe(false);
    }
  }
}

function expectNoRectIntersections(firstItems: VueWrapper[], secondItems: VueWrapper[]) {
  const firstRects = firstItems.map(rectAttributes);
  const secondRects = secondItems.map(rectAttributes);

  for (const first of firstRects) {
    for (const second of secondRects) {
      expect(rectsOverlap(first, second)).toBe(false);
    }
  }
}

function rectAttributes(rect: VueWrapper) {
  return {
    x: Number(rect.attributes('x')),
    y: Number(rect.attributes('y')),
    width: Number(rect.attributes('width')),
    height: Number(rect.attributes('height')),
  };
}

function rectsOverlap(
  first: { x: number; y: number; width: number; height: number },
  second: { x: number; y: number; width: number; height: number },
) {
  const horizontalOverlap = first.x < second.x + second.width && second.x < first.x + first.width;
  const verticalOverlap = first.y < second.y + second.height && second.y < first.y + first.height;

  return horizontalOverlap && verticalOverlap;
}
