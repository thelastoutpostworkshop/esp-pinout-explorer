import { beforeEach, describe, expect, it } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
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
    expect(nodes[boardDesignNoteIndex].classes()).not.toContain('pin-node--warning');
    expect(nodes[boardDesignNoteIndex].find('.pin-node__warning-badge').exists()).toBe(false);
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
    const chipPackageButton = wrapper.find('[role="button"][aria-label="Open ESP32-C6 QFN40 chip package view"]');

    expect(chipPackageButton.exists()).toBe(true);
    await chipPackageButton.trigger('click');
    await wrapper.vm.$nextTick();

    expect(store.selectedPackageId).toBe('qfn40');
    expect(wrapper.find('.chip-svg').exists()).toBe(true);
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
    const profileAutocomplete = wrapper.findComponent({ name: 'VAutocomplete' });
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

    expect(wrapper.findAll('.v-list-subheader').map((item) => item.text())).toEqual(['Dev boards', 'Chip packages']);
    expect(c6ProfileItems.map((item) => item.id)).not.toEqual(
      expect.arrayContaining(['esp32c6-mini-1', 'esp32c6-mini-1u']),
    );
    expect(c6ProfileItems.find((item) => item.id === 'qfn40')?.name).toBe('ESP32-C6 QFN40');
    expect(c6ProfileItems.find((item) => item.id === 'qfn32')?.name).toBe('ESP32-C6 QFN32');
    expect(wrapper.text()).toContain('Variants: MINI-1 / MINI-1U');
    expect(wrapper.text()).toContain('Variants: WROOM-1-N8 / WROOM-1U-N8');
    expect(wrapper.text()).toContain('Single-core 32-bit RISC-V HP CPU');
    expect(wrapper.text()).toContain('DevKitM-1 (MINI)');
    expect(wrapper.text()).toContain('MINI-1');
    expect(wrapper.text()).toContain('MINI-1U');
    expect(wrapper.text()).toContain('ESP32-C6 QFN40');
    expect(wrapper.text()).toContain('ESP32-C6 QFN32');
    expect(wrapper.text()).not.toContain('Dev board: DevKitM-1');
    expect(wrapper.text()).not.toContain('Module: MINI-1');
    expect(wrapper.text()).toContain('ESP32-C6-MINI-1 / MINI-1U');
    expect(wrapper.text()).toContain('4 MB SPI flash in chip package');
    expect(wrapper.text()).toContain('No PSRAM');
    expect(wrapper.text()).toContain('J5 jumper supports module current measurement');

    store.selectPackage('esp32c6-mini-1');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Module pads for PCB design, not dev-board headers.');
    expect(wrapper.text()).toContain('ESP32-C6-MINI-1');
    expect(wrapper.text()).toContain('4 MB SPI flash in chip package');
    expect(wrapper.text()).not.toContain('J5 jumper supports module current measurement');

    store.selectPackage('qfn40');
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toContain('Chip package');
    expect(wrapper.text()).not.toContain('Module pads for PCB design, not dev-board headers.');
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
