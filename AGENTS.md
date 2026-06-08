# ESPSocsExplorer Agent Notes

This app is a Vue 3 + TypeScript + Vite pin explorer for Espressif SoCs and development boards. It uses Vuetify 4 for UI, Pinia for state, and data-driven SVG components for clickable chip packages and board headers.

## Core Principle

Accuracy matters more than UI flourish. Raw SoC package data must come from official Espressif datasheets. Board profiles must come from official Espressif board user guides, official schematics, or official board documentation. Do not infer pinout data from random tables, blogs, product listings, or screenshots.

## Current Scope

- Implemented SoCs:
  - ESP32-S3 QFN56
  - ESP32-C6 QFN40
  - ESP32-C6 QFN32
- Implemented board profiles:
  - ESP32-S3-DevKitC-1 v1.1
- Future work is tracked in `todo.md`.
- The README documents install, dev, build, and top-level structure.

## Important Files

- `src/data/socs/esp32s3.ts`: ESP32-S3 pin metadata.
- `src/data/socs/esp32c6.ts`: ESP32-C6 pin metadata and package variants.
- `src/types/soc.ts`: shared SoC and pin types.
- `src/stores/socStore.ts`: selected SoC, selected package, selected pin, and search/filter state.
- `src/components/AppShell.vue`: compact app bar, desktop sidebar layout, mobile control drawer, and main app frame.
- `src/components/ExplorerSidebar.vue`: SoC/profile selectors, selected SoC/profile chips, search, pin count, and legend.
- `src/components/ChipSvg.vue`: data-driven clickable SVG chip drawing.
- `src/components/BoardSvg.vue`: data-driven clickable SVG development-board header drawing.
- `src/components/SocPinoutView.vue`: focused pinout stage and right-side selected-pin drawer.
- `src/components/PinInfoDrawer.vue`: selected-pin details, function chips, warnings, notes, and source link.
- `src/components/InfoTooltip.vue`: reusable info icon popover for technical section headings.
- `src/components/FunctionChip.vue`: reusable function chip with optional popover description.
- `src/data/functionDescriptions.ts`: dictionary and pattern matcher for explaining non-obvious function names.
- `src/data/pinWarnings.ts`: presentation rules that split official warning categories into maker warnings and board design notes.

## Pin Data Rules

- Preserve the `SocDefinition`/`SocPin` shape from `src/types/soc.ts`.
- Add one data file per SoC family unless the package divergence is large enough to justify separation.
- Use `packageVariants` when a SoC has multiple package pinouts.
- Keep `source` metadata current: title, datasheet version, URL, and relevant sections.
- Every package pin should have a stable `id`, package `number`, `name`, `type`, `position`, and `mainFunctions`.
- Set `gpio` only when the package pin exposes a GPIO number.
- Add `warnings` for official cautions such as strapping, boot, USB, flash, PSRAM, JTAG, UART0, reset, voltage, power, glitch, or known boot restrictions.
- Do not omit official warnings just because they are low priority for makers. `src/data/pinWarnings.ts` decides which warnings get yellow maker-warning treatment versus calmer board-design-note treatment.
- Add `keywords` for search terms that users reasonably expect, such as `boot`, `strap`, `adc`, `touch`, `usb`, `spi`, `uart`, `jtag`, `flash`, `psram`, and package-specific function aliases.

## Board Profile Rules

- Use `boardProfiles` on the related `SocDefinition`.
- Set `kind: 'board'`, a stable `id`, a concise `name`, and a maker-facing `packageName`.
- Use official board header identifiers in `displayNumber`, for example `J1-4`.
- Preserve the board silkscreen/header label in `boardLabel`, for example `TX`, `3V3`, or `14`.
- Set `boardHeader` to the official header block name, for example `J1` or `J3`.
- For GPIO header pins, copy or derive SoC-level GPIO metadata from the raw SoC package pin so drawer sections, search, warnings, and tooltips stay consistent.
- Add board-specific maker warnings for pins connected to on-board hardware, boot/reset buttons, USB, UART bridges, LEDs, or module memory constraints.
- Keep board-only power and ground pins as real clickable pins. They should have clear notes and search keywords even when there is no GPIO.
- Board profiles should use `BoardSvg.vue`; raw package profiles should use `ChipSvg.vue`.
- If a board has hardware revisions, encode the revision in the profile name and source metadata, for example `DevKitC-1 v1.1`.

## Adding A New Board Profile

1. Confirm the official board source.
   - Prefer the official Espressif board user guide and its Header Block tables.
   - Use official schematics only to clarify board connections that are not explicit in the user guide.
   - Record source title, version, URL, and relevant sections.
2. Encode the board headers.
   - Create one `SocPin` per header pin, including power, ground, reset, boot, and no-GPIO pins.
   - Use `displayNumber`, `boardHeader`, and `boardLabel` for board identity.
   - Use `position.side` and `position.order` to place the pin in `BoardSvg.vue`.
3. Reconcile board constraints.
   - Mark pins used by on-board LEDs, USB, UART bridges, boot/reset buttons, or module memory as maker warnings when they affect normal project use.
   - If a pin is physically present on a header but unavailable for some module variants, keep it in the board profile and add a clear warning/note.
4. Register the board profile.
   - Add it to `boardProfiles` on the matching SoC.
   - Set `defaultProfileId` when the board profile should be the first view for that SoC.
5. Verify.
   - Run `npm run build`.
   - Open the app locally when practical and test profile selection, search filters, warning borders, selected-pin drawer, and mobile layout.

## Adding A New SoC

1. Confirm the official Espressif source.
   - Use the latest official datasheet or official product documentation.
   - Record the datasheet title, version, URL, and source sections in the SoC `source` object.
   - If the public datasheet is missing or unclear, do not guess. Mark the SoC as blocked or leave it in `todo.md`.
2. Create or update the SoC data file.
   - Prefer `src/data/socs/<soc-id>.ts`.
   - Define all package pins from the datasheet package top-view/pin tables.
   - Include exposed center pads as `side: 'center'` when present.
   - Preserve official pin names and alternate-function spelling.
3. Populate pin metadata.
   - Set package `number`, `name`, `type`, `gpio`, `position`, `mainFunctions`, `ioMux`, `rtc`, `analog`, `matrixSignals`, `notes`, `warnings`, and `keywords` where applicable.
   - Include strapping, boot, USB, flash, PSRAM, JTAG, UART0, reset, voltage, power-domain, and memory-related warnings.
   - Add maker-friendly notes when a pin is physically present but risky, reserved, or dedicated.
4. Register the SoC.
   - Add the new definition to the central SoC list used by `socStore`.
   - Make sure SoC/profile selectors still work and default to the intended package or board profile.
5. Update the function dictionary.
   - Add exact or pattern descriptions in `src/data/functionDescriptions.ts` for new unclear function labels.
   - Check the drawer for labels that appear as plain abbreviations and add descriptions for them.
6. Update docs.
   - Add the SoC/package or board profile to `README.md` current profiles when implemented.
   - Mark the corresponding item complete in `todo.md`.
7. Verify.
   - Run `npm run build`.
   - Open the app locally and verify selector behavior, pin count, clickable pins, drawer details, search, warnings, tooltips, and mobile layout.

## Adding A New Package For An Existing SoC

1. Confirm the package-specific official source.
   - Use the datasheet package section for that exact package, not another package with the same SoC name.
   - Confirm package size, pin count, exposed pad, omitted pins, and package-specific warnings.
2. Add a package variant.
   - Use `packageVariants` in the existing SoC data file.
   - Give the variant a stable `id`, user-facing `name`, `packageName`, and complete `pins` array.
   - Keep the existing default package unchanged unless the product direction explicitly changes.
3. Map the package top-view layout.
   - Assign `side` and `order` from the datasheet top-view package drawing.
   - Use `side: 'center'` for exposed ground pads.
   - Verify pin order clockwise/counterclockwise against the datasheet before coding all pins.
4. Reconcile package differences.
   - Do not blindly copy the larger package pin list.
   - Remove pins that are not exposed in the smaller package.
   - Add package-specific flash, PSRAM, strapping, boot, power, USB, JTAG, and reserved-pin notes.
5. Check profile selector behavior.
   - Multiple packages or board profiles should show the profile selector in `ExplorerSidebar.vue`.
   - Switching profiles should clear or update selected-pin state safely through `socStore`.
   - Pin count and package label must match the selected package.
6. Verify the SVG layout.
   - Check that all pins fit, labels are readable, center pads render correctly, and selected-pin animation does not obscure adjacent pins badly.
   - Test desktop and mobile widths, especially packages with many pins.
7. Update docs and TODO.
   - Add the package to `README.md`.
   - Mark the package complete in `todo.md`.
8. Run verification.
   - Run `npm run build`.
   - In the local app, test package switching, search, selected-pin drawer, warnings, and function tooltips for the new package.

## Function Description Dictionary

`src/data/functionDescriptions.ts` explains labels that appear in `Main Functions`.

When adding or editing SoC data:

- Add exact descriptions for named functions that are not obvious, especially JTAG, SPI memory, clock, USB, SDIO, boot, reset, RF, and crystal functions.
- Prefer exact entries for special meanings, for example `MTCK`, `FSPICLK`, `SPICS0`, `XTAL_32K_P`.
- Use regex/pattern descriptions for families of names, for example `GPIO\d+`, `ADC\d_CH\d+`, `TOUCH\d+`, `U\dTXD`, `SDIO_DATA\d`, `SUBSPI*`, and `FSPIIO\d`.
- Keep descriptions short, practical, and user-facing. Explain what the signal is and mention constraints only when they are broadly true.
- Do not overclaim that a function is safe to use. The drawer warnings and notes remain the authority for restrictions.
- If a function label appears in the drawer and would be unclear to a maker, it should either match the dictionary or intentionally remain undescribed because its meaning is already plain.

## UI Behavior Rules

- `ChipSvg.vue` and `BoardSvg.vue` must remain SVG-based and data-driven. Do not replace pinouts with static screenshots.
- Keep SoC/profile controls in `ExplorerSidebar.vue`, not in the main pinout stage. The right-side pin drawer should not cover primary controls.
- Pin colors are category cues:
  - GPIO: blue fill.
  - Analog: green fill.
  - Power: red fill.
  - Ground: light gray fill.
  - Maker warning: bright yellow border with a subtle glow.
  - Selected: blue selected treatment with a scale/pop animation.
- The chip should only show the yellow warning border for maker warnings from `src/data/pinWarnings.ts`. Board design notes should stay visible in the drawer and searchable, but should not flood the package view with warning borders.
- Keep the legend focused on persistent pin categories and warning state. Do not add transient search/selected states back to the legend unless the UX changes.
- Search should highlight matched pins and dim unmatched pins. It should search pin name, GPIO, main functions, IO MUX, analog, RTC, matrix signals, notes, warnings, and keywords through the store.
- The `Safe use` quick filter is for board profiles only. It should include exposed board-header GPIO pins with no maker warnings, and exclude power, ground, reset/control, boot/strapping, UART0, USB, PSRAM-constrained, voltage-sensitive, and on-board hardware pins.
- Technical terms in the drawer should use `InfoTooltip.vue` rather than permanent explanatory paragraphs when the explanation is optional.
- Main function labels should use `FunctionChip.vue` so known functions can show contextual help on hover, focus, and tap.

## Package Layout Rules

- The SVG pin positions use `side` and `order`. Keep package layout visually top-view and consistent with datasheet package diagrams.
- Center/exposed-pad pins use `side: 'center'`.
- When adding packages with many pins, verify the SVG spacing still works on desktop and mobile before finishing.

## Verification

- Run `npm run build` after code or data changes.
- For visual/UI changes, also verify the local app at `http://127.0.0.1:5173` when practical.
- Check selected-pin drawer behavior after changing chip/board interactions, function chips, tooltips, profile selection, or store state.
- Do not commit generated `dist/`, `node_modules/`, or `.codex/` artifacts.

## Style Notes

- Keep edits scoped and data-driven.
- Prefer adding reusable helpers/components only when they serve repeated pinout concepts.
- Use clear maker-friendly language. Avoid long datasheet prose in the UI.
- Preserve ASCII in source files unless the file already requires non-ASCII.
