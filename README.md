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
* **TypeScript Ready**: Full type definitions included.
* **Up to date**: Supports new formats for trailers, motorcycles, and special vehicles.
* **Robust**: Normalizes inputs (handles spaces and hyphens automatically).

## 🚀 Installation

```shell
npm install chilean-plate-validator
```

## 🛠 Usage

### Using Functions
```typescript
import { plateValid, plateType } from 'chilean-plate-validator';

// Standard Validation
plateValid('BBCC12');    // true
plateValid('BB-CC-12');  // true (auto-normalized)

// Get Category
plateType('AA1234');    // 'OLD_PLATE'
plateType('Z1234');     // 'POLICE'
```

### Using the `CLPlate` Class
The class provides a cleaner interface and memoized results for better performance.

```typescript
import { CLPlate } from 'chilean-plate-validator';

const plate = new CLPlate('abcd11');

if (plate.isValid) {
  console.log(plate.type);      // 'NEW_VEHICLE_PLATE'
  console.log(plate.formatted); // 'ABCD-11'
}
```

## 📚 Legal Basis & Documentation
This module follows the official specifications from the Servicio de Registro Civil e Identificación de Chile.

- [Official Manual (Online)](https://www.registrocivil.cl/PortalOI/Manuales/ValidacionPatentes.pdf)
- [Local Backup (Historical Reference)](./docs/ValidacionPatentes.pdf)

## 📄 License
This project is licensed under the MIT License.

## 👤 Author
Gabriel Galilea
- GitHub: [@gabo2151](https://github.com/gabo2151)
- LinkedIn: [Gabriel Galilea](https://www.linkedin.com/in/gabrielgalilea)
