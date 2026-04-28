# Changelog

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
