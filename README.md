# chilean-plate-validator

![Ridiculous badge, I wanted a shield too](https://img.shields.io/badge/sabrosura-extrema-brightgreen)
[![install size](https://packagephobia.com/badge?p=chilean-plate-validator)](https://packagephobia.com/result?p=chilean-plate-validator)
[![npm version](https://img.shields.io/npm/v/chilean-plate-validator)](https://www.npmjs.org/package/chilean-plate-validator)
[![npm downloads](https://img.shields.io/npm/dm/chilean-plate-validator)](https://npm-stat.com/charts.html?package=chilean-plate-validator)
[![Known Vulnerabilities](https://snyk.io/test/npm/chilean-plate-validator/badge.svg)](https://snyk.io/test/npm/chilean-plate-validator)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=coverage)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=sqale_index)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=gabo2151_chilean-plate-validator&metric=bugs)](https://sonarcloud.io/summary/new_code?id=gabo2151_chilean-plate-validator)

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