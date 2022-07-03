import { REGEX_LIST, SPECIAL_PLATES } from "./constants";

/**
 * Verifies if the plate is valid in Chile.
 *
 * @param plate Plate to validate.
 *
 * @returns True if the plate is valid in any of the RegEx saved,
 * false otherwise.
 */
export function plateValid(plate: string): boolean {
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
  const _plate = plate.toUpperCase();
  const findPlate = REGEX_LIST.find(reg => reg.regex.test(_plate));
  if (findPlate?.name === 'OLD_PLATE') {
    const specialPlate = SPECIAL_PLATES.find(sp => _plate.indexOf(sp.combination) > -1 );
    if(!!specialPlate) return specialPlate.name;
  }
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
