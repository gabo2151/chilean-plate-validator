/**
 * RegExes build by chilean civil registration specifications.<br>
 * [«Instructivo para Validación de Patentes - Servicio de Registro Civil e Identificación»](https://www.registrocivil.cl/PortalOI/Manuales/ValidacionPatentes.pdf)
 */
const REGEX_LIST = [
  { name: 'OLD_PLATE', regex: /^(?=.{6}$)[A-Z]{2}\d{4}[^s]*$/ },
  { name: 'NEW_VEHICLE_PLATE', regex: /^(?=.{6}$)[B-DF-HJ-LPR-TV-Z]{4}[1-9]\d[^s]*$/ },
  { name: 'NEW_MOTORCYCLE_PLATE', regex: /^(?=.{6}$)[B-DF-HJ-LPR-TV-Z]{3}\d{3}[^s]*$/ },
]

/**
 * Verifies if the plate is valid in Chile.
 *
 * @param plate Plate to validate.
 *
 * @returns True if the plate is valid in any of the RegEx saved,
 * false otherwise.
 */
export function plateValid(plate: string): boolean {
  if (plate == null) return false;
  return !!REGEX_LIST.find(reg => reg.regex.test(plate.toUpperCase()));
}

/**
 * Get the plate type according to the RegEx associated.
 *
 * @param plate Plate to check the type.
 *
 * @returns The type according to the RegEx that matches the plate submitted.
 */
export function plateType(plate: string): string {
  if (plate == null) return 'INVALID';
  const findPlate = REGEX_LIST.find(reg => reg.regex.test(plate.toUpperCase()));
  return (findPlate ? findPlate.name : 'INVALID');
}

/**
 * Plate class... Working on this...
 */
export class CLPlate {
  private readonly validState: boolean;
  private readonly plateType: string;

  /**
   * Creates a new Plate instance.
   *
   * @param plate Plate required to check validity and type
   */
  constructor(plate: string) {
    this.validState = plateValid(plate);
    this.plateType = plateType(plate);
  }

  get valid(): boolean {
    return this.validState;
  }

  get type(): string {
    return this.plateType;
  }

}