# Changelog

## v1.2.0

### Fixed
- **Motorcycle format corrected**: motorcycle plates are 3 letters + **2** digits (`LLL·nn`, e.g. `BJH61`), not 3 + 3. The registry format `LLL·nnn` includes a check digit that is not printed on the physical plate, so an OCR/LPR camera only ever reads `LLL·nn` — which is what this library validates. The previous pattern accepted 6-character strings like `CBC320` that never appear on a plate, and rejected real ones. Formatting (`BJH-61`) and fuzzy recovery now handle the 3-2 split.
- Motorcycle letter set now includes `M`, `N` and `Q` (per the Registro Civil check-digit table); vehicle plates still correctly omit them.
- Documentation: corrected several examples that used `XXXX99` as "invalid" (it is a valid vehicle plate) and fixed the supported-formats table.

### Added
- `CLPlate.isFuzzyValid` instance getter — returns `true` when a valid plate can be derived from the input via OCR correction (superset of `isValid`).

### Notes
- A 2025 decree (D.O. 16-01-2025) introduces new formats (vehicles: 5 letters + 1 digit; motorcycles: 4 letters + 1 digit) plus a green plate for EVs/hybrids, rolling out gradually (~2027–2029). These are **not yet validated** and will be added as they enter circulation.

## v1.1.1

### Fixed
- **Packaging**: `main`, `types` and `exports` pointed to non-existent files (`index.js`, `index.d.ts`), breaking `require()` and TypeScript type resolution for consumers. Now correctly reference the emitted `.cjs`/`.mjs`/`.d.cts`/`.d.mts` files.

## v1.1.0

### Added
- `fuzzyCorrect(plate)` — returns all valid plates derivable from an OCR input string
- Fuzzy validation mode via `plateValid(plate, { fuzzy: true })`
- `fuzzyPlateValid(plate)` shorthand
- `IPlateValidConfig` added to public type exports

## v1.0.0

### Breaking Changes

Version 1.0.0 introduces a redesigned API. If you are upgrading from `0.x`, the following changes require attention:

#### Plate type values
All plate type strings have changed format. Update any comparisons in your code:

| v0.x                     | v1.0.0                   |
|--------------------------|--------------------------|
| `'NEW_VEHICLE_PLATE'`    | `'new_vehicle_plate'`    |
| `'NEW_MOTORCYCLE_PLATE'` | `'new_motorcycle_plate'` |
| `'OLD_PLATE'`            | `'old_plate'`            |
| `'POLICE'`               | `'police'`               |
| `'AMBULANCE'`            | `'ambulance'`            |
| `'INVALID'`              | `'invalid'`              |

Use the exported `PlateType` object to avoid hardcoding strings:
```ts
import { PlateType } from 'chilean-plate-validator';

plateType('BCDF12') === PlateType.NewVehicle // true
```

#### Validation is now strict
`plateValid` and `plateType` no longer normalize the input internally. Inputs with hyphens or spaces will return `false` / `'invalid'`. Use `normalize` explicitly if needed:

```ts
// v0.x — worked
plateValid('BC-DF12')              // true

// v1.0.0 — strict
plateValid('BC-DF12')              // false
plateValid(normalize('BC-DF12'))   // true
```

#### Special plate metadata
Special plate categories (diplomatic, police support, etc.) are no longer returned as a type string. Use the new `specialPlateInfo` function or `CLPlate.specialInfo` to access their metadata:

```ts
// v0.x
plateType('CD1234')        // 'CUERPO_DIPLOMÁTICO'

// v1.0.0
plateType('CD1234')        // 'old_plate'
specialPlateInfo('CD1234') // { prefix: 'CD', label: 'Cuerpo diplomático', authority: 'governmental', ... }
```
