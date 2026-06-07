# ESPSocsExplorer Agent Notes

This app is a Vue 3 + TypeScript + Vite pin explorer for Espressif SoCs. It uses Vuetify 4 for UI, Pinia for state, and data-driven SVG components for clickable chip packages.

## Core Principle

Accuracy matters more than UI flourish. Pin names, package pin numbers, GPIO numbers, alternate functions, warnings, and package variants must come from official Espressif datasheets or official Espressif product documentation. Do not infer pinout data from board schematics, random tables, blogs, or screenshots.

## Current Scope

- Implemented SoCs:
  - ESP32-S3 QFN56
  - ESP32-C6 QFN40
  - ESP32-C6 QFN32
- Future work is tracked in `todo.md`.
- The README documents install, dev, build, and top-level structure.

## Important Files

- `src/data/socs/esp32s3.ts`: ESP32-S3 pin metadata.
- `src/data/socs/esp32c6.ts`: ESP32-C6 pin metadata and package variants.
- `src/types/soc.ts`: shared SoC and pin types.
- `src/stores/socStore.ts`: selected SoC, selected package, selected pin, and search/filter state.
- `src/components/ChipSvg.vue`: data-driven clickable SVG chip drawing.
- `src/components/SocPinoutView.vue`: page layout, SoC/package selectors, pin legend, and stage.
- `src/components/PinInfoDrawer.vue`: selected-pin details, function chips, warnings, notes, and source link.
- `src/components/InfoTooltip.vue`: reusable info icon popover for technical section headings.
- `src/components/FunctionChip.vue`: reusable function chip with optional popover description.
- `src/data/functionDescriptions.ts`: dictionary and pattern matcher for explaining non-obvious function names.

## Pin Data Rules

- Preserve the `SocDefinition`/`SocPin` shape from `src/types/soc.ts`.
- Add one data file per SoC family unless the package divergence is large enough to justify separation.
- Use `packageVariants` when a SoC has multiple package pinouts.
- Keep `source` metadata current: title, datasheet version, URL, and relevant sections.
- Every package pin should have a stable `id`, package `number`, `name`, `type`, `position`, and `mainFunctions`.
- Set `gpio` only when the package pin exposes a GPIO number.
- Add `warnings` for strapping, boot, USB, flash/PSRAM, JTAG, UART0, reset, voltage, power, or known boot restrictions.
- Add `keywords` for search terms that users reasonably expect, such as `boot`, `strap`, `adc`, `touch`, `usb`, `spi`, `uart`, `jtag`, `flash`, `psram`, and package-specific function aliases.

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
   - Include strapping, boot, USB, flash/PSRAM, JTAG, UART0, reset, voltage, power-domain, and memory-related warnings.
   - Add maker-friendly notes when a pin is physically present but risky, reserved, or dedicated.
4. Register the SoC.
   - Add the new definition to the central SoC list used by `socStore`.
   - Make sure SoC/package selectors still work and default to the intended package.
5. Update the function dictionary.
   - Add exact or pattern descriptions in `src/data/functionDescriptions.ts` for new unclear function labels.
   - Check the drawer for labels that appear as plain abbreviations and add descriptions for them.
6. Update docs.
   - Add the SoC/package to `README.md` current SoCs when implemented.
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
   - Add package-specific flash/PSRAM, strapping, boot, power, USB, JTAG, and reserved-pin notes.
5. Check package selector behavior.
   - Multiple packages should show the package selector in `SocPinoutView.vue`.
   - Switching packages should clear or update selected-pin state safely through `socStore`.
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

- `ChipSvg.vue` must remain SVG-based and data-driven. Do not replace the pinout with static screenshots.
- Pin colors are category cues:
  - GPIO: blue fill.
  - Analog: green fill.
  - Power: red fill.
  - Ground: light gray fill.
  - Warning: bright yellow border with a subtle glow.
  - Selected: blue selected treatment with a scale/pop animation.
- Keep the legend focused on persistent pin categories and warning state. Do not add transient search/selected states back to the legend unless the UX changes.
- Search should highlight matched pins and dim unmatched pins. It should search pin name, GPIO, main functions, IO MUX, analog, RTC, matrix signals, notes, warnings, and keywords through the store.
- Technical terms in the drawer should use `InfoTooltip.vue` rather than permanent explanatory paragraphs when the explanation is optional.
- Main function labels should use `FunctionChip.vue` so known functions can show contextual help on hover, focus, and tap.

## Package Layout Rules

- The SVG pin positions use `side` and `order`. Keep package layout visually top-view and consistent with datasheet package diagrams.
- Center/exposed-pad pins use `side: 'center'`.
- When adding packages with many pins, verify the SVG spacing still works on desktop and mobile before finishing.

## Verification

- Run `npm run build` after code or data changes.
- For visual/UI changes, also verify the local app at `http://127.0.0.1:5173` when practical.
- Check selected-pin drawer behavior after changing chip interactions, function chips, tooltips, package selection, or store state.
- Do not commit generated `dist/`, `node_modules/`, or `.codex/` artifacts.

## Style Notes

- Keep edits scoped and data-driven.
- Prefer adding reusable helpers/components only when they serve repeated pinout concepts.
- Use clear maker-friendly language. Avoid long datasheet prose in the UI.
- Preserve ASCII in source files unless the file already requires non-ASCII.
