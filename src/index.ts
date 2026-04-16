import { REGEX_LIST, SPECIAL_PLATES } from "./constants";

/**
 * Normalizes the plate string by removing hyphens, spaces, and converting to uppercase.
 * @param p The raw plate string.
 * @returns A sanitized, uppercase string.
 */
const normalize = (p: string): string => p.replace(/[-\s]/g, "").toUpperCase();

/**
 * Verifies if a given string is a valid Chilean license plate.
 * @param plate The plate string to validate.
 * @returns `true` if the plate matches any known Chilean format, `false` otherwise.
 */
export function plateValid(plate: string): boolean {
  if (!plate) return false;
  const clean = normalize(plate);
  return REGEX_LIST.some((reg) => reg.regex.test(clean));
}

/**
 * Identifies the specific type of Chilean plate.
 * @param plate The plate string to check.
 * @returns The name of the plate category or 'INVALID' if no match is found.
 */
export function plateType(plate: string): string {
  if (!plate) return 'INVALID';
  const clean = normalize(plate);

  const findPlate = REGEX_LIST.find((reg) => reg.regex.test(clean));

  if (findPlate?.name === 'OLD_PLATE') {
    const special = SPECIAL_PLATES.find((sp) => clean.startsWith(sp.combination));
    if (special) return special.name;
  }

  return findPlate ? findPlate.name : 'INVALID';
}

/**
 * Represents a Chilean License Plate with utility methods for validation and formatting.
 */
export class CLPlate {
  public readonly clean: string;
  private readonly _isValid: boolean;
  private readonly _type: string;

  constructor(plate: string) {
    this.clean = normalize(plate);
    this._isValid = plateValid(this.clean);
    this._type = plateType(this.clean);
  }

  get isValid(): boolean { return this._isValid; }
  get type(): string { return this._type; }

  /**
   * Formats the plate for display (e.g., adds hyphens where applicable).
   * @example "AA1234" -> "AA-1234"
   * @returns The formatted plate string or the cleaned string if invalid.
   */
  get formatted(): string {
    if (!this.isValid) return this.clean;

    const type = this.type;

    if (this.clean.length === 6) {
      const isOldFormat = type === 'OLD_PLATE' || SPECIAL_PLATES.some(sp => sp.name === type);
      const splitIndex = isOldFormat ? 2 : 4;
      return `${this.clean.slice(0, splitIndex)}-${this.clean.slice(splitIndex)}`;
    }

    if (this.clean.length === 5) {
      return `${this.clean.slice(0, 1)}-${this.clean.slice(1)}`;
    }

    return this.clean;
  }
}
