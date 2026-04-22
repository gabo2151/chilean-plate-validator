import { PLATE_PATTERNS, SPECIAL_PLATES, PlateType, type SpecialPlate } from "./constants";

/**
 * Strips all non-alphanumeric characters from a string and converts it to uppercase.
 *
 * Useful for sanitizing user input before passing it to {@link plateValid} or {@link plateType}.
 * The standalone validation functions are strict and do not normalize internally —
 * call this explicitly if the input may contain hyphens, spaces, or other separators.
 *
 * @param p - The raw plate string.
 * @returns A sanitized, uppercase string containing only letters and digits.
 *
 * @example
 * normalize('BC-DF 12') // 'BCDF12'
 */
export const normalize = (p: string): string => p.replace(/[^A-Z0-9]/gi, "").toUpperCase();

/**
 * Checks whether a string is a valid Chilean license plate.
 *
 * This function is strict: the input must already be normalized (uppercase, no separators).
 * Use {@link normalize} beforehand if the input may contain hyphens or spaces.
 *
 * @param plate - The plate string to validate. Must be pre-normalized.
 * @returns `true` if the plate matches any known Chilean format, `false` otherwise.
 *
 * @example
 * plateValid('BCDF12')  // true
 * plateValid('BC-DF12') // false — use normalize() first if needed
 */
export function plateValid(plate: string): boolean {
  if (!plate) return false;
  return PLATE_PATTERNS.some((p) => p.pattern.test(plate));
}

/**
 * Identifies the category of a Chilean license plate.
 *
 * This function is strict: the input must already be normalized (uppercase, no separators).
 * Use {@link normalize} beforehand if the input may contain hyphens or spaces.
 *
 * For plates matching the old format, the function further checks against
 * {@link SPECIAL_PLATES} to return a more specific category (e.g. `PlateType.Old`),
 * but the returned value will still be `PlateType.Old` — use {@link specialPlateInfo}
 * to get the full special plate metadata.
 *
 * @param plate - The plate string to identify. Must be pre-normalized.
 * @returns The {@link PlateType} of the plate, or `PlateType.Invalid` if no format matches.
 *
 * @example
 * plateType('BCDF12') // 'new_vehicle_plate'
 * plateType('CD1234') // 'old_plate'
 * plateType('BC-DF12') // 'invalid' — use normalize() first if needed
 */
export function plateType(plate: string): PlateType {
  if (!plate) return PlateType.Invalid;
  const match = PLATE_PATTERNS.find((p) => p.pattern.test(plate));
  return match ? match.type : PlateType.Invalid;
}

/**
 * Returns the {@link SpecialPlate} metadata for a plate that matches the old format,
 * or `null` if the plate is not a recognized special category.
 *
 * @param plate - The plate string to check. Must be pre-normalized.
 * @returns The matching {@link SpecialPlate} entry, or `null`.
 *
 * @example
 * specialPlateInfo('CD1234') // { prefix: 'CD', label: 'Cuerpo diplomático', ... }
 * specialPlateInfo('AA1234') // null
 * specialPlateInfo('BCDF12') // null
 */
export function specialPlateInfo(plate: string): SpecialPlate | null {
  if (!plate) return null;
  if (plateType(plate) !== PlateType.Old) return null;
  return SPECIAL_PLATES.find((sp) => plate.startsWith(sp.prefix)) ?? null;
}

export { PlateType, AuthorityType } from './constants';
export type { PlateType as PlateTypeValue, AuthorityType as AuthorityTypeValue, SpecialPlate, PlatePattern } from './constants';

/**
 * Represents a Chilean license plate with utilities for validation, classification, and formatting.
 *
 * The constructor accepts raw input and normalizes it internally via {@link normalize},
 * so hyphens and spaces are handled automatically. Validation and type detection
 * are performed on the normalized string.
 *
 * @example
 * const plate = new CLPlate('BC-DF12')
 * plate.clean       // 'BCDF12'
 * plate.isValid     // true
 * plate.type        // 'new_vehicle_plate'
 * plate.formatted   // 'BCDF-12'
 * plate.specialInfo // null
 *
 * const special = new CLPlate('CD-1234')
 * special.type        // 'old_plate'
 * special.specialInfo // { prefix: 'CD', label: 'Cuerpo diplomático', ... }
 */
export class CLPlate {
  /** The normalized plate string (uppercase, alphanumeric only). */
  public readonly clean: string;
  private readonly _type: PlateType;
  private readonly _specialInfo: SpecialPlate | null;

  constructor(plate: string) {
    this.clean = normalize(plate);
    this._type = plateType(this.clean);
    this._specialInfo = specialPlateInfo(this.clean);
  }

  /** Whether the plate matches a known Chilean format. */
  get isValid(): boolean { return this._type !== PlateType.Invalid; }

  /** The plate category. Returns `PlateType.Invalid` if no known format matches. */
  get type(): PlateType { return this._type; }

  /**
   * Full metadata for special plates (old format with a recognized two-letter prefix).
   * Returns `null` for standard plates.
   *
   * @example
   * new CLPlate('CD1234').specialInfo // { prefix: 'CD', label: 'Cuerpo diplomático', ... }
   * new CLPlate('AA1234').specialInfo // null
   */
  get specialInfo(): SpecialPlate | null { return this._specialInfo; }

  /**
   * The plate formatted for display, with a hyphen inserted at the appropriate position.
   *
   * If the plate is invalid, returns the raw normalized string without modification.
   *
   * @example
   * new CLPlate('AA1234').formatted  // 'AA-1234'
   * new CLPlate('BCDF12').formatted  // 'BCDF-12'
   * new CLPlate('A1234').formatted   // 'A-1234'
   */
  get formatted(): string {
    if (!this.isValid) return this.clean;

    if (this.clean.length === 6) {
      const isOldFormat = this._type === PlateType.Old || this._specialInfo !== null;
      const splitIndex = isOldFormat ? 2 : 4;
      return `${this.clean.slice(0, splitIndex)}-${this.clean.slice(splitIndex)}`;
    }

    if (this.clean.length === 5) {
      return `${this.clean.slice(0, 1)}-${this.clean.slice(1)}`;
    }

    return this.clean;
  }
}
