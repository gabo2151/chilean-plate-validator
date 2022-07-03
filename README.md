# chilean-plate-validator

![Ridiculous badge, I wanted a shield too](https://img.shields.io/badge/sabrosura-extrema-brightgreen)
[![install size](https://packagephobia.com/badge?p=chilean-plate-validator)](https://packagephobia.com/result?p=chilean-plate-validator)
[![npm version](https://img.shields.io/npm/v/chilean-plate-validator)](https://www.npmjs.org/package/chilean-plate-validator)
[![npm downloads](https://img.shields.io/npm/dm/chilean-plate-validator)](https://npm-stat.com/charts.html?package=chilean-plate-validator)
[![Known Vulnerabilities](https://snyk.io/test/npm/chilean-plate-validator/badge.svg)](https://snyk.io/test/npm/chilean-plate-validator)

## Description

This module will help you to verify if a chilean registration plate is valid (doesn't calculate the check digit).

The RegExes built in, follow the chilean civil registration specifications.

[«Instructivo para Validación de Patentes - Servicio de Registro Civil e Identificación»](https://www.registrocivil.cl/PortalOI/Manuales/ValidacionPatentes.pdf)

## Code Example

#### Example 1:
```typescript
import { plateValid } from 'chilean-plate-validator';

plateValid('BBCC12'); // returns true
plateType('BBCC12');  // returns 'NEW_VEHICLE_PLATE'
```

#### Example 2:
```typescript
import { CLPlate } from 'chilean-plate-validator';

const plate = new CLPlate('BBCC12');

plate.valid // returns true
plate.type  // returns 'NEW_VEHICLE_PLATE'
```

## Installation

```shell
$ npm i chilean-plate-validator --save
```

## License

[MIT License](https://github.com/gabo2151/chilean-plate-validator/blob/main/LICENSE)

## Author

- GitHub: [Gabo2151](https://github.com/gabo2151)
- Twitter: [gabriel_galilea](https://twitter.com/gabriel_galilea)