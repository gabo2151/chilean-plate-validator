/**
 * RegExes build by chilean civil registration specifications.<br>
 * [«Instructivo para Validación de Patentes - Servicio de Registro Civil e Identificación»](https://www.registrocivil.cl/PortalOI/Manuales/ValidacionPatentes.pdf)
 */
const REGEX_LIST = [
  { name: 'OLD_PLATE', regex: /^(?=.{6}$)[A-Z]{2}\d{4}[^s]*$/ },
  { name: 'NEW_VEHICLE_PLATE', regex: /^(?=.{6}$)[B-DF-HJ-LPR-TV-Z]{4}[1-9]\d[^s]*$/ },
  { name: 'NEW_MOTORCYCLE_PLATE', regex: /^(?=.{6}$)[B-DF-HJ-LPR-TV-Z]{3}\d{3}[^s]*$/ },
]

export function plateValid(plate: string): boolean {
  let state = false;
  if (plate == null || typeof plate !== "string") return state;
  REGEX_LIST.forEach(reg => {
    if ( plate.match(reg.regex) != null ) state = true;
  });
  return state;
}

export function plateType(plate: string): string {
  let type = 'INVALID';
  if (plate == null || typeof plate !== "string") return type;
  REGEX_LIST.forEach(reg => {
    if ( plate.match(reg.regex) != null ) type = reg.name;
  });
  return type;
}

class Plate {
  valid!: boolean;
  type!: string;

  constructor(plate: string) {
    this.valid = plateValid(plate);
    this.type = plateType(plate);
  }
}