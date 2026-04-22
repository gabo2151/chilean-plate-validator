# chilean-plate-validator

![Sabrosura Extrema](https://img.shields.io/badge/sabrosura-extrema-brightgreen)
[![npm version](https://img.shields.io/npm/v/chilean-plate-validator)](https://www.npmjs.org/package/chilean-plate-validator)
[![install size](https://packagephobia.com/badge?p=chilean-plate-validator)](https://packagephobia.com/result?p=chilean-plate-validator)
[![npm downloads](https://img.shields.io/npm/dm/chilean-plate-validator)](https://npm-stat.com/charts.html?package=chilean-plate-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🇨🇱 Description

A lightweight, zero-dependency utility to validate and identify Chilean license plates. Updated to comply with the latest 2024-2026 regulations (**Ley 21.601**).

### Features
* **Dual Build**: Native support for ESM (`import`) and CommonJS (`require`).
* **TypeScript Ready**: Full type definitions and typed return values included.
* **Up to date**: Supports new formats for trailers, motorcycles, and special vehicles.
* **Strict by default**: Validation functions do not normalize internally — input contract is explicit.

## ⚠️ Breaking changes in v1.0.0

Version 1.0.0 introduces a redesigned API. If you are upgrading from `0.x`, the following changes require attention:

### Plate type values
All plate type strings have changed format. Update any comparisons in your code:

| v0.x                     | v1.0.0                  |
|--------------------------|-------------------------|
| `'NEW_VEHICLE_PLATE'`    | `'new_vehicle_plate'`   |
| `'NEW_MOTORCYCLE_PLATE'` | `'new_motorcycle_plate'` |
| `'OLD_PLATE'`            | `'old_plate'`           |
| `'POLICE'`               | `'police'`              |
| `'AMBULANCE'`            | `'ambulance'`           |
| `'INVALID'`              | `'invalid'`             |

Use the exported `PlateType` object to avoid hardcoding strings:
```ts
import { PlateType } from 'chilean-plate-validator';

plateType('BCDF12') === PlateType.NewVehicle // true
```

### Validation is now strict
`plateValid` and `plateType` no longer normalize the input internally. Inputs with hyphens or spaces will return `false` / `'invalid'`. Use `normalize` explicitly if needed:

```ts
// v0.x — worked
plateValid('BC-DF12') // true

// v1.0.0 — strict
plateValid('BC-DF12')              // false
plateValid(normalize('BC-DF12'))   // true
```

### Special plate metadata
Special plate categories (diplomatic, police support, etc.) are no longer returned as a type string. Use the new `specialPlateInfo` function or `CLPlate.specialInfo` to access their metadata:

```ts
// v0.x
plateType('CD1234') // 'CUERPO_DIPLOMÁTICO'

// v1.0.0
plateType('CD1234')        // 'old_plate'
specialPlateInfo('CD1234') // { prefix: 'CD', label: 'Cuerpo diplomático', authority: 'governmental', ... }
```

---

## 🚀 Installation

```shell
npm install chilean-plate-validator
```

## 🛠 Usage

### Using functions

```ts
import { normalize, plateValid, plateType, specialPlateInfo } from 'chilean-plate-validator'

// Strict validation — input must be pre-normalized
plateValid('BCDF12') // true
plateValid('BC-DF12') // false

// Normalize first if the input may contain separators
plateValid(normalize('BC-DF12')) // true

// Get plate category
plateType('BCDF12') // 'new_vehicle_plate'
plateType('AA1234') // 'old_plate'
plateType('Z1234')  // 'police'

// Get special plate metadata (old format only)
specialPlateInfo('CD1234') // { prefix: 'CD', label: 'Cuerpo diplomático', authority: 'governmental', ... }
specialPlateInfo('AA1234') // null
```

### Using the `PlateType` object

Avoid hardcoding type strings — use `PlateType` for comparisons:

```ts
import { plateType, PlateType } from 'chilean-plate-validator'

if (plateType('BCDF12') === PlateType.NewVehicle) {
  // ...
}
```

### Using the `CLPlate` class

The class normalizes input automatically and exposes memoized results for convenience:

```ts
import { CLPlate } from 'chilean-plate-validator'

const plate = new CLPlate('bc-df12')

plate.clean       // 'BCDF12'
plate.isValid     // true
plate.type        // 'new_vehicle_plate'
plate.formatted   // 'BCDF-12'
plate.specialInfo // null

const special = new CLPlate('CD-1234')

special.isValid     // true
special.type        // 'old_plate'
special.formatted   // 'CD-1234'
special.specialInfo // { prefix: 'CD', label: 'Cuerpo diplomático', authority: 'governmental', ... }
```

## 📚 Legal basis & documentation

This module follows the official specifications from the Servicio de Registro Civil e Identificación de Chile.

- [Official Manual (Online)](https://www.registrocivil.cl/PortalOI/Manuales/ValidacionPatentes.pdf)
- [Local Backup (Historical Reference)](./docs/ValidacionPatentes.pdf)

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Gabriel Galilea
- GitHub: [@gabo2151](https://github.com/gabo2151)
- LinkedIn: [Gabriel Galilea](https://www.linkedin.com/in/gabrielgalilea)
