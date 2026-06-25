import { beforeEach, describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import BoardSvg from '@/components/BoardSvg.vue';
import ChipSvg from '@/components/ChipSvg.vue';
import ExplorerSidebar from '@/components/ExplorerSidebar.vue';
import PinInfoDrawer from '@/components/PinInfoDrawer.vue';
import PinSearch from '@/components/PinSearch.vue';
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

    await wrapper.find('input').setValue('GPIO38');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['GPIO38']);

    expect(wrapper.text()).toContain('Safe use');
    await findButton(wrapper, 'Safe use').trigger('click');
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

    store.selectPackage('esp32s3-devkitm-1');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('ESP32-S3-MINI-1 / MINI-1U');
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

    await wrapper.find('button[aria-label="Close pin details"]').trigger('click');
    expect(wrapper.emitted('close')).toHaveLength(1);
  });
});

const searchStubs = {
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
  url: 'https://example.com/test.pdf',
  sections: ['Test Section'],
};

function findButton(wrapper: VueWrapper, label: string) {
  const button = wrapper.findAll('button').find((candidate) => candidate.text().trim() === label);
  expect(button, `Expected to find button "${label}"`).toBeDefined();
  return button!;
}
