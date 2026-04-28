# chilean-plate-validator

![Sabrosura Extrema](https://img.shields.io/badge/sabrosura-extrema-brightgreen)
[![npm version](https://img.shields.io/npm/v/chilean-plate-validator)](https://www.npmjs.org/package/chilean-plate-validator)
[![install size](https://packagephobia.com/badge?p=chilean-plate-validator)](https://packagephobia.com/result?p=chilean-plate-validator)
[![npm downloads](https://img.shields.io/npm/dm/chilean-plate-validator)](https://npm-stat.com/charts.html?package=chilean-plate-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🇨🇱 Description

A lightweight, zero-dependency utility for **Chilean license plate (PPU) validation and identification**. Optimized for **LPR/OCR** systems and compliant with **Ley 21.601** (2024-2026 regulations).

### Features
* **OCR-tolerant (Fuzzy Mode)**: Automatically corrects common character substitutions from image recognition pipelines (e.g., `8` → `B`, `0` → `O`).
* **Complete PPU Coverage**: Supports cars, motorcycles, trailers (remolques), and special governmental plates.
* **Dual Build**: Native support for ESM (`import`) and CommonJS (`require`).
* **TypeScript Ready**: Full type definitions and `PlateType` enums for robust development.
* **Zero Dependencies**: Extremely small footprint for edge computing or browser use.

### Supported Formats

| Type        | Format          | Example  | Description                |
|-------------|-----------------|----------|----------------------------|
| New Vehicle | `AAAA11`        | `BCDF12` | Post-2007 standard         |
| Old Vehicle | `AA1111`        | `AA1234` | Pre-2007 standard          |
| Special     | `AA1111`        | `CD1234` | Diplomatic, Judicial, etc. |
| Motorcycles | `AA111`/`AAA11` | `AB123`  | Small format plates        |
| Police      | `Z1111`         | `Z1234`  | Carabineros de Chile       |


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

### Fuzzy validation (OCR input)

When the plate string comes from an image recognition pipeline, use fuzzy mode to correct common character substitutions (`0→O`, `1→I`, `8→B`, `5→S`, `2→Z`) before validating:

```ts
import { plateValid, fuzzyPlateValid } from 'chilean-plate-validator'

// Strict mode — fails on OCR errors
plateValid('8CDF12') // false

// Option 1 — config flag
plateValid('8CDF12', { fuzzy: true }) // true — '8' corrected to 'B'

// Option 2 — shorthand
fuzzyPlateValid('8CDF12') // true
```

```ts
import { plateValid, fuzzyPlateValid, fuzzyCorrect } from 'chilean-plate-validator'

// Validate only
plateValid('8CDF12', { fuzzy: true }) // true
fuzzyPlateValid('8CDF12')             // true

// Get the corrected plate(s)
fuzzyCorrect('8CDF12') // ['BCDF12']
fuzzyCorrect('BCDF12') // ['BCDF12'] — already valid
fuzzyCorrect('XXXX99') // []
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

For OCR input, use the fuzzy getters on the instance or the static helpers:

```ts
// Instance — three distinct states
const plate = new CLPlate('8CDF12')

plate.isValid        // false — strict validation fails
plate.isFuzzyValid   // true  — recoverable via OCR correction
plate.fuzzyCorrections // ['BCDF12']

// Already valid plates return [] from fuzzyCorrections
new CLPlate('BCDF12').isFuzzyValid    // false — already strictly valid
new CLPlate('BCDF12').fuzzyCorrections // []

// Unrecoverable input
new CLPlate('XXXX99').isFuzzyValid    // false
new CLPlate('XXXX99').fuzzyCorrections // []
```

```ts
// Static helpers — no instantiation needed
CLPlate.normalize('BC-DF 12')   // 'BCDF12'
CLPlate.fuzzyCorrect('8CDF12')  // ['BCDF12']
CLPlate.isValidFuzzy('8CDF12')  // true
```

```ts
// toString() — coercion-friendly
String(new CLPlate('BCDF12'))     // 'BCDF-12'
`Plate: ${new CLPlate('AA1234')}` // 'Plate: AA-1234'
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
