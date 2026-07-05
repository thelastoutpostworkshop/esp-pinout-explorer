import { beforeEach, describe, expect, it } from 'vitest';
import { flushPromises, mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import AppShell from '@/components/AppShell.vue';
import BoardSvg from '@/components/BoardSvg.vue';
import ChipSvg from '@/components/ChipSvg.vue';
import ExplorerSidebar from '@/components/ExplorerSidebar.vue';
import MakerToolsPage from '@/components/MakerToolsPage.vue';
import PinInfoDrawer from '@/components/PinInfoDrawer.vue';
import PinSearch from '@/components/PinSearch.vue';
import ProfileInfoDrawer from '@/components/ProfileInfoDrawer.vue';
import SocPinoutView from '@/components/SocPinoutView.vue';
import { hasMakerWarning } from '@/data/pinWarnings';
import { esp32 } from '@/data/socs/esp32';
import { esp32c6 } from '@/data/socs/esp32c6';
import { esp32p4 } from '@/data/socs/esp32p4';
import { esp32s3 } from '@/data/socs/esp32s3';
import { vuetify } from '@/plugins/vuetify';
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

  it('uses maker warning badges without promoting board design notes', () => {
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
    expect(nodes[makerWarningIndex].find('.pin-node__warning-badge').exists()).toBe(true);
    expect(nodes[makerWarningIndex].find('.pin-node__warning-mark').text()).toBe('!');
    expect(nodes[makerWarningIndex].attributes('aria-label')).toContain('maker warnings: Strapping, Boot');
    expect(nodes[boardDesignNoteIndex].classes()).not.toContain('pin-node--warning');
    expect(nodes[boardDesignNoteIndex].find('.pin-node__warning-badge').exists()).toBe(false);
    expect(nodes[boardDesignNoteIndex].find('.pin-node__warning-mark').exists()).toBe(false);
    expect(nodes[boardDesignNoteIndex].attributes('aria-label')).not.toContain('maker warnings:');
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
        chipPackageId: esp32s3.defaultPackageId,
        chipPackageLabel: 'ESP32-S3 QFN56',
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
    expect(wrapper.find('.board-sheen').exists()).toBe(true);
    expect(nodes[0].classes()).toEqual(expect.arrayContaining(['board-pin--selected', 'board-pin--matched']));
    expect(nodes[1].classes()).toContain('board-pin--dimmed');
    const warningNode = nodes.find((node, index) => hasMakerWarning(pins[index]));
    expect(warningNode?.find('.board-pin__warning-badge').exists()).toBe(true);
    expect(warningNode?.find('.board-pin__warning-mark').text()).toBe('!');
    expect(warningNode?.attributes('aria-label')).toContain('maker warnings:');

    await nodes[0].trigger('keydown.enter');
    expect(wrapper.emitted('pin-click')).toEqual([[pins[0].id]]);

    const chipPackageButton = wrapper.find('[role="button"][aria-label="Open ESP32-S3 QFN56 chip package view"]');

    expect(chipPackageButton.exists()).toBe(true);
    expect(wrapper.text()).toContain('ESP32-S3 QFN56');
    expect(wrapper.text()).not.toContain('Module');
    await chipPackageButton.trigger('keydown.enter');
    expect(wrapper.emitted('chip-package-click')).toEqual([[esp32s3.defaultPackageId]]);
  });

  it('names the chip package action from the selected package option', () => {
    const boardProfile = esp32c6.boardProfiles?.find((profile) => profile.id === 'esp32c6-devkitc-1');
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        chipPackageId: esp32c6.defaultPackageId,
        chipPackageLabel: 'ESP32-C6 QFN40',
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32c6,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.find('[role="button"][aria-label="Open ESP32-C6 QFN40 chip package view"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('ESP32-C6 QFN40');
    expect(wrapper.text()).not.toContain('Module');
  });

  it('uses board-specific dual-header labels', () => {
    const boardProfile = esp32.boardProfiles?.find((profile) => profile.id === 'esp32-devkitc-v4');
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.findAll('.header-name').map((item) => item.text())).toEqual(['J2', 'J3']);
    const visiblePinLabels = wrapper.findAll('.board-pin__label').map((item) => item.text());

    expect(visiblePinLabels).toContain('23');
    expect(visiblePinLabels).toContain('34');
    expect(visiblePinLabels).not.toContain('IO23');
    expect(visiblePinLabels).not.toContain('IO34');
    expect(visiblePinLabels).toContain('VP');
    expect(visiblePinLabels).toContain('D0');

    const d3PinIndex = pins.findIndex((pin) => pin.boardLabel === 'D3');
    expect(pins[d3PinIndex].warnings).toEqual(expect.arrayContaining(['flash', 'onboard']));
    expect(wrapper.findAll('.board-pin')[d3PinIndex].find('.board-pin__warning-badge').exists()).toBe(true);
    expect(wrapper.findAll('.board-pin')[d3PinIndex].find('.board-pin__warning-mark').text()).toBe('!');
    expect(wrapper.findAll('.board-pin')[d3PinIndex].attributes('aria-label')).toContain(
      'maker warnings: Board hardware',
    );
    expect(wrapper.findAll('.board-pin')[d3PinIndex].attributes('aria-label')).not.toContain('Flash memory');

    const functionWrapper = mount(BoardSvg, {
      props: {
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        showMainFunctions: true,
        soc: esp32,
        totalPinCount: pins.length,
      },
    });

    expect(functionWrapper.attributes('aria-label')).toContain('main functions shown');
    expect(functionWrapper.find('svg').attributes('viewBox')).toBe('-100 8 1140 724');
    expect(functionWrapper.findAll('.board-function-label').length).toBeGreaterThan(0);
    expect(functionWrapper.findAll('.board-function-badge').length).toBeGreaterThan(0);
    expect(functionWrapper.find('.board-function-badge--gpio').exists()).toBe(true);
    expect(functionWrapper.find('.board-function-badge--analog').exists()).toBe(true);
    expect(functionWrapper.find('.board-function-badge__pill').attributes()).toMatchObject({ height: '24', rx: '5' });
    const badgeLabels = functionWrapper.findAll('.board-function-badge__text').map((item) => item.text());

    expect(badgeLabels).not.toContain('GPIO23');
    expect(badgeLabels).not.toContain('D2');
    expect(badgeLabels).toEqual(expect.arrayContaining(['GPIO9', 'ADC1_CH6']));
  });

  it('omits function badges that repeat the visible board pin label', () => {
    const boardProfile = esp32s3.boardProfiles?.find((profile) => profile.id === 'esp32s3-devkitc-1-v1-1');
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        showMainFunctions: true,
        soc: esp32s3,
        totalPinCount: pins.length,
      },
    });
    const badgeLabels = wrapper.findAll('.board-function-badge__text').map((item) => item.text());

    expect(badgeLabels).not.toContain('GPIO42');
    expect(badgeLabels).toEqual(expect.arrayContaining(['MTMS', 'GPIO43', 'U0TXD']));
  });

  it('renders connector-group board profiles without J1/J3 assumptions', async () => {
    const usbOtgProfile = esp32s3.boardProfiles?.find((profile) => profile.id === 'esp32s3-usb-otg');
    expect(usbOtgProfile).toBeDefined();
    const pins = usbOtgProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        boardArtwork: usbOtgProfile?.boardArtwork,
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
    expect(wrapper.find('.board-sheen').exists()).toBe(true);
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

  it('renders the ESP32-P4X-EYE connector-group board with eye artwork', () => {
    const boardProfile = esp32p4.boardProfiles?.find((profile) => profile.id === 'esp32p4x-eye');
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        boardArtwork: boardProfile?.boardArtwork,
        boardLayout: boardProfile?.boardLayout,
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32p4,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.attributes('aria-label')).toContain('20 of 20 connector pins shown');
    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.text()).toContain('USB 2.0');
    expect(wrapper.text()).toContain('DEBUG');
    expect(wrapper.text()).toContain('CAMERA');
    expect(wrapper.text()).toContain('LCD');
    expect(wrapper.text()).toContain('USB / SD / PWR');
    expectNoOverlappingRects(
      wrapper.findAll('.connector-board__pin').map((pinNode) => ({ rect: pinNode.find('.board-pin__pad') })),
    );
  });

  it('renders the ESP32-P4-Function-EV-Board v1.5.2 connector-group board with function artwork', () => {
    const boardProfile = esp32p4.boardProfiles?.find((profile) => profile.id === 'esp32p4-function-ev-board-v1-5-2');
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        boardArtwork: boardProfile?.boardArtwork,
        boardLayout: boardProfile?.boardLayout,
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32p4,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.attributes('aria-label')).toContain('40 of 40 connector pins shown');
    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.findAll('.connector-board__pin')).toHaveLength(40);
    expect(wrapper.text()).toContain('AUDIO');
    expect(wrapper.text()).toContain('BOOT/RST');
    expect(wrapper.text()).toContain('LCD/CAM');
    expect(wrapper.text()).toContain('USB / ETH / PWR');
    expectNoOverlappingRects(
      wrapper.findAll('.connector-board__pin').map((pinNode) => ({ rect: pinNode.find('.board-pin__pad') })),
    );
    expectNoRectIntersections(
      wrapper.findAll('.connector-board__pin').map((pinNode) => pinNode.find('.board-pin__pad')),
      wrapper.findAll('.connector-board__component rect'),
    );
  });

  it('renders the ESP32-P4-EYE connector-group board with eye artwork', () => {
    const boardProfile = esp32p4.boardProfiles?.find((profile) => profile.id === 'esp32p4-eye');
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        boardArtwork: boardProfile?.boardArtwork,
        boardLayout: boardProfile?.boardLayout,
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32p4,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.attributes('aria-label')).toContain('20 of 20 connector pins shown');
    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.text()).toContain('USB 2.0');
    expect(wrapper.text()).toContain('DEBUG');
    expect(wrapper.text()).toContain('CAMERA');
    expect(wrapper.text()).toContain('LCD');
    expect(wrapper.text()).toContain('USB / SD / PWR');
    expectNoOverlappingRects(
      wrapper.findAll('.connector-board__pin').map((pinNode) => ({ rect: pinNode.find('.board-pin__pad') })),
    );
  });

  it('renders the ESP32-S3 USB-Bridge connector profile with bridge artwork', async () => {
    const usbBridgeProfile = esp32s3.boardProfiles?.find((profile) => profile.id === 'esp32s3-usb-bridge');
    expect(usbBridgeProfile).toBeDefined();
    const pins = usbBridgeProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        boardArtwork: usbBridgeProfile?.boardArtwork,
        boardLayout: usbBridgeProfile?.boardLayout,
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: usbBridgeProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32s3,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.attributes('aria-label')).toContain('14 of 14 connector pins shown');
    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.findAll('.connector-board__pin')).toHaveLength(14);
    expect(wrapper.text()).toContain('Target JTAG');
    expect(wrapper.text()).toContain('Native USB');
    expect(wrapper.text()).toContain('TARGET');
    expect(wrapper.text()).toContain('BOOT/RST');
    expect(wrapper.text()).not.toContain('LCD');
    expect(wrapper.text()).not.toContain('SD');
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

  it('renders the ESP Thread Border Router connector profile with thread artwork', () => {
    const boardProfile = esp32s3.boardProfiles?.find((profile) => profile.id === 'esp32s3-thread-br-zigbee-gw-v1-2');
    expect(boardProfile).toBeDefined();
    const pins = boardProfile?.pins ?? [];
    const wrapper = mount(BoardSvg, {
      props: {
        boardArtwork: boardProfile?.boardArtwork,
        boardLayout: boardProfile?.boardLayout,
        filteredPinCount: pins.length,
        filteredPinIds: new Set(pins.map((pin) => pin.id)),
        hasFilter: false,
        packageName: boardProfile?.packageName ?? '',
        pins,
        selectedPinId: null,
        soc: esp32s3,
        totalPinCount: pins.length,
      },
    });

    expect(wrapper.attributes('aria-label')).toContain('34 of 34 connector pins shown');
    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.text()).toContain('USB1');
    expect(wrapper.text()).toContain('USB2');
    expect(wrapper.text()).toContain('ESP32-H2');
    expect(wrapper.text()).toContain('ESP32-S3');
    expectNoOverlappingRects(
      wrapper.findAll('.connector-board__pin').map((pinNode) => ({ rect: pinNode.find('.board-pin__pad') })),
    );
    expectNoRectIntersections(
      wrapper.findAll('.connector-board__pin').map((pinNode) => pinNode.find('.board-pin__pad')),
      wrapper.findAll('.connector-board__component rect'),
    );
  });

  it('keeps dense ESP32-S3 allocation board pins from overlapping', () => {
    for (const profileId of ['esp32s3-lcd-ev-board-v1-5', 'esp-vocat-v1-2', 'esp-dualkey']) {
      const profile = esp32s3.boardProfiles?.find((item) => item.id === profileId);
      expect(profile).toBeDefined();
      const pins = profile?.pins ?? [];
      const wrapper = mount(BoardSvg, {
        props: {
          boardArtwork: profile?.boardArtwork,
          boardLayout: profile?.boardLayout,
          filteredPinCount: pins.length,
          filteredPinIds: new Set(pins.map((pin) => pin.id)),
          hasFilter: false,
          packageName: profile?.packageName ?? '',
          pins,
          selectedPinId: null,
          soc: esp32s3,
          totalPinCount: pins.length,
        },
      });

      expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
      expectNoOverlappingRects(
        wrapper.findAll('.connector-board__pin').map((pinNode) => ({ rect: pinNode.find('.board-pin__pad') })),
      );
    }
  });
});

describe('SocPinoutView', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('passes connector-group layout through to USB-OTG board rendering', async () => {
    const store = useSocStore();
    store.selectSoc('esp32s3');
    store.selectPackage('esp32s3-usb-otg');

    const wrapper = mount(SocPinoutView, {
      global: {
        stubs: {
          PinInfoDrawer: { template: '<aside />' },
          ProfileInfoDrawer: { template: '<aside />' },
        },
      },
    });
    await flushPromises();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.connector-board-svg').exists()).toBe(true);
    expect(wrapper.find('.header-name').exists()).toBe(false);
    expect(wrapper.find('.soc-view__function-toggle').exists()).toBe(false);
    expect(wrapper.find('.connector-board__pin-label--functions').exists()).toBe(false);
    expect(wrapper.text()).not.toContain('3 / 32 header pins');
  });

  it('keeps the functions toggle available for dual-header board profiles', async () => {
    const store = useSocStore();
    store.selectSoc('esp32s3');
    store.selectPackage('esp32s3-devkitc-1-v1-1');

    const wrapper = mount(SocPinoutView, {
      global: {
        stubs: {
          PinInfoDrawer: { template: '<aside />' },
          ProfileInfoDrawer: { template: '<aside />' },
        },
      },
    });
    await flushPromises();
    await wrapper.vm.$nextTick();
    const functionToggle = wrapper.find('button[aria-label="Show main functions on board pins"]');

    expect(functionToggle.exists()).toBe(true);
    expect(functionToggle.attributes('aria-checked')).toBe('false');
    expect(wrapper.find('.board-function-label').exists()).toBe(false);

    await functionToggle.trigger('click');
    await wrapper.vm.$nextTick();

    expect(functionToggle.attributes('aria-checked')).toBe('true');
    expect(wrapper.find('.board-function-label').exists()).toBe(true);
  });

  it('opens the raw chip package from a board center-card package action', async () => {
    const store = useSocStore();
    store.selectSoc('esp32c6');
    store.selectPackage('esp32c6-devkitc-1');

    const wrapper = mount(SocPinoutView, {
      global: {
        stubs: {
          PinInfoDrawer: { template: '<aside />' },
          ProfileInfoDrawer: { template: '<aside />' },
        },
      },
    });
    await flushPromises();
    await wrapper.vm.$nextTick();
    const chipPackageButton = wrapper.find('[role="button"][aria-label="Open ESP32-C6 QFN40 chip package view"]');

    expect(chipPackageButton.exists()).toBe(true);
    await chipPackageButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(store.selectedPackageId).toBe('qfn40');
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.chip-svg').exists()).toBe(true);
  });
});

describe('AppShell', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('coordinates the mobile controls drawer with pin and profile detail drawers', async () => {
    const store = useSocStore();
    const wrapper = mount(AppShell, {
      global: {
        plugins: [vuetify],
        stubs: appShellStubs,
      },
    });
    const controlsButton = wrapper.find('button[aria-label="Open explorer controls"]');

    expect(controlsButton.exists()).toBe(true);

    store.selectPin(store.selectedPins[0].id);
    await wrapper.vm.$nextTick();

    await controlsButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(store.selectedPinId).toBeNull();
    expect(store.profileInfoOpen).toBe(false);
    expect(wrapper.find('.app-shell__mobile-drawer').exists()).toBe(true);

    await wrapper.find('.app-shell-test-sidebar-change').trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.app-shell__mobile-drawer').exists()).toBe(false);

    await controlsButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.app-shell__mobile-drawer').exists()).toBe(true);

    store.selectPin(store.selectedPins[0].id);
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.app-shell__mobile-drawer').exists()).toBe(false);

    await controlsButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.app-shell__mobile-drawer').exists()).toBe(true);

    store.openProfileInfo();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.app-shell__mobile-drawer').exists()).toBe(false);

    store.openProfileInfo();
    await controlsButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(store.profileInfoOpen).toBe(false);
    expect(wrapper.find('.app-shell__mobile-drawer').exists()).toBe(true);
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
    expect(wrapper.emitted('quick-filter')).toBeUndefined();

    expect(wrapper.text()).toContain('Safe use');
    const safeUseChip = findButton(wrapper, 'Safe use');
    expect(safeUseChip.find('svg').exists()).toBe(true);
    expect(safeUseChip.classes()).not.toContain('pin-search__chip--safe');

    await safeUseChip.trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['safe use']);
    expect(wrapper.emitted('quick-filter')).toHaveLength(1);

    await wrapper.setProps({ modelValue: 'safe use' });
    await findButton(wrapper, 'Safe use').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    expect(wrapper.emitted('quick-filter')).toHaveLength(2);
  });

  it('shows the input-only quick filter only when the selected profile has input-only pins', async () => {
    const store = useSocStore();
    store.selectSoc('esp32');

    const wrapper = mount(PinSearch, {
      props: {
        modelValue: '',
      },
      global: {
        stubs: searchStubs,
      },
    });

    expect(wrapper.text()).toContain('Input only');

    await findButton(wrapper, 'Input only').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['input only']);

    store.selectSoc('esp32s3');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).not.toContain('Input only');
  });
});

describe('ExplorerSidebar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('shows module identity for board profiles', async () => {
    const store = useSocStore();
    const wrapper = mount(
      {
        components: { ExplorerSidebar, ProfileInfoDrawer },
        template: '<ExplorerSidebar /><ProfileInfoDrawer />',
      },
      {
        global: {
          stubs: sidebarStubs,
        },
      },
    );

    expect(wrapper.find('.explorer-sidebar__chips').exists()).toBe(false);
    expect(wrapper.find('[role="dialog"][aria-label="Profile information"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('Profile info');
    expect(wrapper.text()).toContain('Variants: WROOM-1-N8R8 / WROOM-1U-N8R8 / WROOM-2-N32R16V');
    expect(wrapper.text()).toContain('Variant: MINI-1-N4R2');
    expect(wrapper.text()).not.toContain('Dual-core 32-bit Xtensa LX7');
    expect(wrapper.text()).not.toContain('USB ports, 5V/GND headers, or 3V3/GND headers');
    const autocompletes = wrapper.findAllComponents({ name: 'VAutocomplete' });
    expect(autocompletes).toHaveLength(2);
    const profileAutocomplete = autocompletes[0];
    const markingAutocomplete = autocompletes[1];
    const profileItems = profileAutocomplete.props('items') as Array<{ id: string; name: string }>;
    const filterProfile = profileAutocomplete.props('customFilter') as (
      value: string,
      query: string,
      item: { raw: (typeof profileItems)[number] },
    ) => boolean;
    const devKitCProfileItem = profileItems.find((item) => item.id === 'esp32s3-devkitc-1-v1-1');
    const usbBridgeProfileItem = profileItems.find((item) => item.id === 'esp32s3-usb-bridge');

    expect(devKitCProfileItem).toBeDefined();
    expect(usbBridgeProfileItem).toBeDefined();
    expect(filterProfile('', 'n32r16v', { raw: devKitCProfileItem! })).toBe(true);
    expect(filterProfile('', 'mini n4r2', { raw: usbBridgeProfileItem! })).toBe(true);
    expect(filterProfile('', 'wrover', { raw: usbBridgeProfileItem! })).toBe(false);
    const markingItems = markingAutocomplete.props('items') as Array<{
      chipGroupLabel: string;
      duplicateProfileLabel: string;
      profileGroupLabel: string;
      isFirstChipGroup: boolean;
      marking: string;
      markingSearchText: string;
      profileId: string;
      searchText: string;
      startsChipGroup: boolean;
      startsProfileGroup: boolean;
      subtitle: string;
    }>;
    const filterModuleMarking = markingAutocomplete.props('customFilter') as (
      value: string,
      query: string,
      item: { raw: (typeof markingItems)[number] },
    ) => boolean;
    const s3WroomVariant = markingItems.find(
      (item) => item.marking === 'ESP32-S3-WROOM-2-N32R16V' && item.profileId === 'esp32s3-devkitc-1-v1-1',
    );
    const c6MiniModule = markingItems.find(
      (item) => item.marking === 'ESP32-C6-MINI-1' && item.profileId === 'esp32c6-mini-1',
    );
    const c6Wroom1 = markingItems.find(
      (item) => item.marking === 'ESP32-C6-WROOM-1' && item.profileId === 'esp32c6-devkitc-1',
    );
    const espWroom02 = markingItems.find(
      (item) => item.marking === 'ESP-WROOM-02' && item.profileId === 'esp8266-devkits',
    );
    const esp32Wroom32e = markingItems.find(
      (item) => item.marking === 'ESP32-WROOM-32E' && item.profileId === 'esp32-devkitc-v4',
    );
    const esp32WroverE = markingItems.find(
      (item) => item.marking === 'ESP32-WROVER-E' && item.profileId === 'esp32-devkitc-v4',
    );
    const esp32WroverIe = markingItems.find(
      (item) => item.marking === 'ESP32-WROVER-IE' && item.profileId === 'esp32-devkitc-v4',
    );
    const esp32WroverEProfiles = markingItems
      .filter((item) => item.chipGroupLabel === 'ESP32' && item.profileGroupLabel === 'Dev boards' && item.marking === 'ESP32-WROVER-E')
      .map((item) => item.duplicateProfileLabel)
      .sort();

    expect(s3WroomVariant).toBeDefined();
    expect(c6MiniModule).toBeDefined();
    expect(c6Wroom1).toBeDefined();
    expect(espWroom02).toBeDefined();
    expect(esp32Wroom32e).toBeDefined();
    expect(esp32WroverE).toBeDefined();
    expect(esp32WroverIe).toBeDefined();
    expect(esp32WroverEProfiles).toEqual(['DevKitC V4', 'ESP32-Ethernet-Kit v1.2', 'WROVER-KIT v4.1']);
    expect(markingItems.filter((item) => item.startsChipGroup).map((item) => item.chipGroupLabel)).toEqual(
      expect.arrayContaining(['ESP32-C6', 'ESP32-S3', 'ESP8266EX']),
    );
    expect(markingItems.find((item) => item.chipGroupLabel === 'ESP32-C6')?.isFirstChipGroup).toBe(false);
    expect(
      markingItems
        .filter((item) => item.chipGroupLabel === 'ESP32-C6' && item.startsProfileGroup)
        .map((item) => item.profileGroupLabel),
    ).toEqual(['Dev boards', 'Module pads']);
    expect(c6Wroom1?.chipGroupLabel).toBe('ESP32-C6');
    expect(c6Wroom1?.profileGroupLabel).toBe('Dev boards');
    expect(c6Wroom1?.duplicateProfileLabel).toBe('');
    expect(c6MiniModule?.profileGroupLabel).toBe('Module pads');
    expect(s3WroomVariant?.chipGroupLabel).toBe('ESP32-S3');
    expect(espWroom02?.chipGroupLabel).toBe('ESP8266EX');
    expect(wrapper.findAll('.module-marking-select__item small')).toHaveLength(0);
    expect(filterModuleMarking('', 'n32r16v', { raw: s3WroomVariant! })).toBe(true);
    expect(filterModuleMarking('', 'module pads mini', { raw: c6MiniModule! })).toBe(true);
    expect(filterModuleMarking('', 'wroom-1', { raw: c6Wroom1! })).toBe(true);
    expect(filterModuleMarking('', 'wroom-1', { raw: s3WroomVariant! })).toBe(false);
    expect(filterModuleMarking('', 'wroom-1', { raw: espWroom02! })).toBe(false);
    expect(filterModuleMarking('', 'wroom-02', { raw: espWroom02! })).toBe(true);
    expect(filterModuleMarking('', 'wrover-e', { raw: esp32WroverE! })).toBe(true);
    expect(filterModuleMarking('', 'wrover-e', { raw: esp32Wroom32e! })).toBe(false);
    expect(filterModuleMarking('', 'wrover-e', { raw: esp32WroverIe! })).toBe(false);
    expect(filterModuleMarking('', 'wrover', { raw: s3WroomVariant! })).toBe(false);

    await findButton(wrapper, 'Profile info & Variants').trigger('click');

    expect(wrapper.find('[role="dialog"][aria-label="Profile information"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Profile');
    expect(wrapper.text()).toContain('Type');
    expect(wrapper.text()).toContain('Dev board');
    expect(wrapper.text()).toContain('View');
    expect(wrapper.text()).toContain('Header pins, silkscreen labels, and on-board parts.');
    expect(wrapper.text()).toContain('Module');
    expect(wrapper.text()).toContain('Chip');
    expect(wrapper.text()).toContain(
      'Entry-level ESP32-S3-WROOM development board. Most I/O pins are broken out to side headers for easy interfacing.',
    );
    expect(wrapper.text()).toContain('Wireless');
    expect(wrapper.text()).toContain('2.4 GHz Wi-Fi 802.11 b/g/n and Bluetooth 5 LE.');
    expect(wrapper.text()).toContain('CPU');
    expect(wrapper.text()).toContain('Dual-core 32-bit Xtensa LX7');
    expect(wrapper.text()).toContain('SRAM');
    expect(wrapper.text()).toContain('512 KB SRAM and 16 KB RTC SRAM.');
    expect(wrapper.text()).toContain('ROM');
    expect(wrapper.text()).toContain('384 KB ROM.');
    expect(wrapper.text()).toContain('ESP32-S3-WROOM-1 / WROOM-1U / WROOM-2');
    expect(wrapper.text()).toContain('Flash');
    expect(wrapper.text()).toContain('8 MB Quad SPI flash / 32 MB Octal SPI flash');
    expect(wrapper.text()).toContain('PSRAM');
    expect(wrapper.text()).toContain('8 MB Octal PSRAM / 16 MB Octal PSRAM');
    expect(wrapper.text()).toContain('Board');
    expect(wrapper.text()).toContain('Power');
    expect(wrapper.text()).toContain('USB ports, 5V/GND headers, or 3V3/GND headers');
    expect(wrapper.text()).toContain('Program');
    expect(wrapper.text()).toContain('USB-to-UART bridge for flashing');
    expect(wrapper.text()).toContain('On-board');
    expect(wrapper.text()).toContain('addressable RGB LED on GPIO38');
    expect(wrapper.text()).toContain('Module variants');
    expect(wrapper.text()).toContain('Official docs');
    expect(wrapper.find('.profile-info__source').attributes('href')).toBe(esp32s3.boardProfiles?.[0]?.source?.url);
    expect(wrapper.text()).toContain('Reference images');
    expect(wrapper.text()).toContain('ESP32-S3-WROOM-2-N32R16V');
    expect(wrapper.text()).toContain('External antenna connector');
    expect(wrapper.text()).toContain('GPIO35/GPIO36/GPIO37 are used internally');
    expect(wrapper.find('.profile-info__table-wrap a').attributes('href')).toBe(
      esp32s3.boardProfiles?.[0]?.moduleVariants?.[0].source?.url,
    );

    expect(wrapper.findAll('.profile-info__figure')).toHaveLength(esp32s3.boardProfiles?.[0]?.source?.figures?.length ?? 0);
    expect(wrapper.findAll('[role="status"][aria-label="Loading reference image"]')).toHaveLength(
      esp32s3.boardProfiles?.[0]?.source?.figures?.length ?? 0,
    );
    expect(wrapper.text()).toContain('Pin layout');
    const referenceImages = wrapper.findAll('.profile-info__figure img');
    expect(referenceImages[0].attributes('src')).toBe(esp32s3.boardProfiles?.[0]?.source?.figures?.[0].url);

    await referenceImages[0].trigger('load');
    expect(wrapper.findAll('[role="status"][aria-label="Loading reference image"]')).toHaveLength(
      (esp32s3.boardProfiles?.[0]?.source?.figures?.length ?? 1) - 1,
    );

    await referenceImages[1].trigger('error');
    expect(wrapper.text()).toContain('Image unavailable');

    await wrapper.find('button[aria-label="Close profile information"]').trigger('click');
    expect(wrapper.find('[role="dialog"][aria-label="Profile information"]').exists()).toBe(false);

    store.selectPackage('esp32s3-devkitm-1');
    await wrapper.vm.$nextTick();

    await findButton(wrapper, 'Profile info & Variants').trigger('click');

    expect(wrapper.text()).toContain('ESP32-S3-MINI-1 / MINI-1U');
    expect(wrapper.find('.profile-info__source').attributes('href')).toBe(
      esp32s3.boardProfiles?.find((profile) => profile.id === 'esp32s3-devkitm-1')?.source?.url,
    );

    store.selectPackage('esp-vocat-v1-2');
    await wrapper.vm.$nextTick();

    expect(wrapper.find('.profile-info__document-link').exists()).toBe(true);
    expect(wrapper.find('.profile-info__document-link').attributes('href')).toContain('.pdf');
    expect(wrapper.text()).toContain('Open PDF');

    store.selectSoc('esp32c6');
    await wrapper.vm.$nextTick();
    const c6ProfileItems = profileAutocomplete.props('items') as Array<{ id: string; name: string }>;

    expect(wrapper.findAll('.profile-select__header').map((item) => item.text())).toEqual([
      'Dev boards',
      'Module pads',
      'Chip packages',
    ]);
    expect(c6ProfileItems.map((item) => item.id)).toEqual(
      expect.arrayContaining(['esp32c6-mini-1', 'esp32c6-mini-1u']),
    );
    expect(c6ProfileItems.find((item) => item.id === 'qfn40')?.name).toBe('ESP32-C6 QFN40');
    expect(c6ProfileItems.find((item) => item.id === 'qfn32')?.name).toBe('ESP32-C6 QFN32');
    expect(
      filterProfile('', 'module pads mini', {
        raw: c6ProfileItems.find((item) => item.id === 'esp32c6-mini-1')!,
      }),
    ).toBe(true);
    expect(wrapper.text()).toContain('Variants: MINI-1 / MINI-1U');
    expect(wrapper.text()).toContain('Variants: WROOM-1-N8 / WROOM-1U-N8');
    expect(wrapper.text()).toContain('PCB/module pads, not dev-board headers.');
    expect(wrapper.text()).toContain('Single-core 32-bit RISC-V HP CPU');
    expect(wrapper.text()).toContain('DevKitM-1 (MINI)');
    expect(wrapper.text()).toContain('MINI-1');
    expect(wrapper.text()).toContain('MINI-1U');
    expect(wrapper.text()).toContain('ESP32-C6 QFN40');
    expect(wrapper.text()).toContain('ESP32-C6 QFN32');
    const c6ProfileInfoText = wrapper.find('[role="dialog"][aria-label="Profile information"]').text();

    expect(c6ProfileInfoText).not.toContain('Dev board: DevKitM-1');
    expect(c6ProfileInfoText).not.toContain('Module: MINI-1');
    expect(wrapper.text()).toContain('ESP32-C6-MINI-1 / MINI-1U');
    expect(wrapper.text()).toContain('4 MB SPI flash in chip package');
    expect(wrapper.text()).toContain('No PSRAM');
    expect(wrapper.text()).toContain('J5 jumper supports module current measurement');

    profileAutocomplete.vm.$emit('update:modelValue', 'esp32c6-mini-1');
    await wrapper.vm.$nextTick();
    const c6ModuleProfileItems = profileAutocomplete.props('items') as Array<{ id: string; name: string }>;

    expect(store.selectedPackage.id).toBe('esp32c6-mini-1');
    expect(c6ModuleProfileItems.map((item) => item.id)).toEqual(expect.arrayContaining(['esp32c6-mini-1']));
    expect(wrapper.text()).toContain('Module pads for PCB design, not dev-board headers.');
    expect(wrapper.text()).toContain('ESP32-C6-MINI-1');
    expect(wrapper.text()).toContain('4 MB SPI flash in chip package');
    expect(wrapper.text()).not.toContain('J5 jumper supports module current measurement');

    store.selectPackage('qfn40');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Chip package');
    expect(wrapper.text()).not.toContain('Module pads for PCB design, not dev-board headers.');
  });

  it('shows the board profile selector for ESP32-P4 profiles', async () => {
    const store = useSocStore();
    store.selectSoc('esp32p4');

    const wrapper = mount(
      {
        components: { ExplorerSidebar },
        template: '<ExplorerSidebar />',
      },
      {
        global: {
          stubs: sidebarStubs,
        },
      },
    );

    const profileAutocomplete = wrapper.findComponent({ name: 'VAutocomplete' });
    expect(profileAutocomplete.exists()).toBe(true);
    expect((profileAutocomplete.props('items') as Array<{ id: string }>).map((item) => item.id)).toEqual([
      'esp32p4x-function-ev-board',
      'esp32p4x-eye',
      'esp32p4-function-ev-board-v1-5-2',
      'esp32p4-eye',
    ]);
    expect(wrapper.text()).toContain('Dev boards');
    expect(wrapper.text()).toContain('ESP32-P4X-Function-EV-Board');
    expect(wrapper.text()).toContain('ESP32-P4X-EYE');
    expect(wrapper.text()).toContain('ESP32-P4-Function-EV-Board v1.5.2');
    expect(wrapper.text()).toContain('ESP32-P4-EYE');
  });

  it('shows resource links and opens maker tools', async () => {
    const store = useSocStore();
    const wrapper = mount(ExplorerSidebar, {
      global: {
        stubs: sidebarStubs,
      },
    });

    expect(wrapper.text()).toContain('Resources');
    expect(wrapper.find('a[href="https://youtu.be/-nhDKzBxHiI"]').exists()).toBe(true);
    expect(wrapper.find('a[href="https://buymeacoffee.com/thelastoutpostworkshop"]').exists()).toBe(true);
    expect(wrapper.find('a[href="https://github.com/thelastoutpostworkshop/ESPSocsExplorer"]').exists()).toBe(true);

    await findButton(wrapper, 'Maker Tools').trigger('click');

    expect(store.activeView).toBe('makerTools');
    expect(wrapper.emitted('changed')).toHaveLength(1);
  });

  it('emits changed when a quick filter is selected', async () => {
    const store = useSocStore();
    const wrapper = mount(ExplorerSidebar, {
      global: {
        stubs: {
          ...sidebarStubs,
          PinSearch: {
            emits: ['quick-filter', 'update:modelValue'],
            props: ['modelValue'],
            template:
              '<button type="button" @click="$emit(\'update:modelValue\', \'type:io\'); $emit(\'quick-filter\')">Quick GPIO</button>',
          },
        },
      },
    });

    await findButton(wrapper, 'Quick GPIO').trigger('click');

    expect(store.searchQuery).toBe('type:io');
    expect(wrapper.emitted('changed')).toHaveLength(1);
  });
});

describe('MakerToolsPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('renders maker tool cards and can return to the pinout', async () => {
    const store = useSocStore();
    store.showMakerTools();

    const wrapper = mount(MakerToolsPage);

    expect(wrapper.text()).toContain('Maker Tools');
    expect(wrapper.text()).toContain('ESPConnect');
    expect(wrapper.text()).toContain('ESP Board Vault');
    expect(wrapper.text()).toContain('ESP32 Partition Builder');
    expect(wrapper.text()).toContain('GPIOViewer');
    expect(wrapper.find('a[href="https://thelastoutpostworkshop.github.io/ESPConnect/"]').exists()).toBe(true);
    expect(wrapper.find('a[href="https://github.com/thelastoutpostworkshop/ESPConnect"]').exists()).toBe(true);
    expect(wrapper.findAll('.maker-tools-page__card')).toHaveLength(6);
    expect(wrapper.findAll('.maker-tools-page__thumbnail img')).toHaveLength(6);

    await findButton(wrapper, 'Back to pinout').trigger('click');

    expect(store.activeView).toBe('pinout');
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

    expect(wrapper.findAll('.pin-info__stat')).toHaveLength(2);
    expect(wrapper.find('.pin-info__decision').text()).toContain('Avoid for normal projects');
    expect(wrapper.find('.pin-info__decision').text()).toContain('Can affect startup or flashing behavior.');
    expect(wrapper.find('.pin-info__decision').text()).toContain('Reserved for flash-memory communication');
    expect(wrapper.text()).toContain('GPIO0');
    expect(wrapper.text()).toContain('I/O');
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

  it('summarizes clean board header GPIO pins as general-use candidates', () => {
    const wrapper = mount(PinInfoDrawer, {
      props: {
        pin: cleanBoardGpioPin,
        source: testSource,
      },
      global: {
        stubs: drawerStubs,
      },
    });

    const decision = wrapper.find('.pin-info__decision');

    expect(decision.text()).toContain('Good general GPIO');
    expect(decision.text()).toContain('No maker warnings are recorded for this exposed board-header GPIO.');
    expect(decision.text()).toContain('Board-header GPIO');
    expect(decision.text()).toContain('No maker warnings');
    expect(wrapper.findAll('.pin-info__stat').map((item) => item.text())).toContain('Board Label4');
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

const appShellStubs = {
  AboutPage: {
    template: '<main />',
  },
  ExplorerSidebar: {
    emits: ['changed'],
    props: ['showProfileControls'],
    template:
      '<nav><button class="app-shell-test-sidebar-change" type="button" @click="$emit(\'changed\')">Sidebar changed</button></nav>',
  },
  MakerToolsPage: {
    template: '<main />',
  },
  ProfileNavigator: {
    template: '<div />',
  },
  SocPinoutView: {
    template: '<main />',
  },
  VAppBar: {
    template: '<header><slot /></header>',
  },
  VAppBarTitle: {
    template: '<div><slot /></div>',
  },
  VBtn: {
    emits: ['click'],
    template: '<button :aria-label="$attrs[\'aria-label\']" type="button" @click="$emit(\'click\')"><slot /></button>',
  },
  VMain: {
    template: '<main><slot /></main>',
  },
  VNavigationDrawer: {
    emits: ['update:modelValue'],
    inheritAttrs: false,
    props: ['modelValue'],
    template:
      '<aside v-if="modelValue" v-bind="$attrs"><button type="button" @click="$emit(\'update:modelValue\', false)">Close drawer</button><slot /></aside>',
  },
  VTooltip: {
    template: '<span><slot name="activator" :props="{}" /></span>',
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
  VCard: {
    template: '<section><slot /></section>',
  },
  VDivider: {
    template: '<hr class="v-divider">',
  },
  VNavigationDrawer: {
    emits: ['update:modelValue'],
    props: ['modelValue'],
    inheritAttrs: false,
    template: '<aside v-if="modelValue" v-bind="$attrs" class="v-navigation-drawer v-navigation-drawer--active"><slot /></aside>',
  },
  VListItem: {
    props: ['title', 'subtitle'],
    template: '<div class="v-list-item">{{ title }}<small v-if="subtitle">{{ subtitle }}</small><slot /></div>',
  },
  VListSubheader: {
    template: '<div class="v-list-subheader"><slot /></div>',
  },
  VAutocomplete: {
    name: 'VAutocomplete',
    props: ['items', 'customFilter'],
    template: `
      <label>
        <slot
          v-for="item in items"
          name="item"
          :item="item"
          :props="{ class: 'select-option' }"
        />
      </label>
    `,
  },
  VSelect: {
    props: ['items'],
    template: `
      <label>
        <slot
          v-for="item in items"
          name="item"
          :item="item"
          :props="{ class: 'select-option' }"
        />
      </label>
    `,
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

const cleanBoardGpioPin: SocPin = {
  boardHeader: 'J1',
  boardLabel: '4',
  displayNumber: 'J1-4',
  gpio: 4,
  id: 'clean-board-gpio',
  mainFunctions: ['GPIO4'],
  name: 'GPIO4',
  number: 4,
  position: { side: 'left', order: 4 },
  type: 'io',
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
