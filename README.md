# chilean-plate-validator

![Ridiculous badge, I wanted a shield too](https://img.shields.io/badge/sabrosura-extrema-brightgreen)

## Description

This module will help you to verify if a chilean registration plate is valid.

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

Read LICENCE.md

## Author

- GitHub: [Gabo2151](https://github.com/gabo2151)
- Twitter: [gabriel_galilea](https://twitter.com/gabriel_galilea)