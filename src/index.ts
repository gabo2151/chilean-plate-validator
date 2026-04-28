import { PLATE_PATTERNS, SPECIAL_PLATES, PlateType, type SpecialPlate } from "./constants";
import type { IPlateValidConfig } from './types';


// Maps digit characters to their visually similar letter equivalents (OCR correction)
const DIGIT_TO_LETTER: Record<string, string> = {
  '0': 'O', '1': 'I', '5': 'S', '8': 'B', '2': 'Z'
};

// Maps letter characters to their visually similar digit equivalents (OCR correction)
const LETTER_TO_DIGIT: Record<string, string> = {
  'O': '0', 'I': '1', 'S': '5', 'B': '8', 'Z': '2'
};

/*
 * Corrects OCR misreads in a plate string by position.
 * Characters at letterPositions are converted from digits to letters if needed,
 * and characters at digitPositions from letters to digits.
 */
function correctOcrErrors(
  plate: string,
  letterPositions: number[],
  digitPositions: number[]
): string {
  const chars = plate.split('');

  for (const i of letterPositions) {
    const ch = chars[i];
    if (/[0-9]/.test(ch)) {
      chars[i] = DIGIT_TO_LETTER[ch] ?? ch;
    }
  }

  for (const i of digitPositions) {
    const ch = chars[i];
    if (/[A-Z]/.test(ch)) {
      chars[i] = LETTER_TO_DIGIT[ch] ?? ch;
    }
  }

  return chars.join('');
}

// Returns all possible OCR-corrected variants of a plate, deduplicated.
function getFuzzyCandidates(plate: string): string[] {
  const candidates: string[] = [plate];

  if (plate.length === 6) {
    candidates.push(correctOcrErrors(plate, [0, 1, 2, 3], [4, 5]));
    candidates.push(correctOcrErrors(plate, [0, 1], [2, 3, 4, 5]));
  }

  if (plate.length === 5) {
    candidates.push(correctOcrErrors(plate, [0], [1, 2, 3, 4]));
  }

  return [...new Set(candidates)];
}

/**
 * Returns all valid plate strings that can be derived from the input
 * by correcting common OCR character substitutions.
 *
 * Useful when you need the corrected string itself, not just a boolean result.
 * Returns an empty array if no valid plate can be derived.
 *
 * Note that a single OCR input can theoretically correct to more than one valid plate
 * (e.g. ambiguous length-6 strings that match both old and new formats after correction).
 * In practice this is rare, but callers should handle the multi-result case.
 *
 * @param plate - The plate string to correct. Must be pre-normalized.
 * @returns An array of valid corrected plate strings, or `[]` if none match.
 *
 * @example
 * fuzzyCorrect('8CDF12') // ['BCDF12']
 * fuzzyCorrect('BCDF12') // ['BCDF12'] — already valid, returned as-is
 * fuzzyCorrect('XXXX99') // []
 */
export function fuzzyCorrect(plate: string): string[] {
  if (!plate) return [];
  return getFuzzyCandidates(plate).filter((candidate) =>
    PLATE_PATTERNS.some(p => p.pattern.test(candidate))
  );
}

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
 * @param plate  - The plate string to validate. Must be pre-normalized.
 * @param config - Optional validation config. Use `{ fuzzy: true }` to enable OCR correction.
 * @returns `true` if the plate matches any known Chilean format, `false` otherwise.
 *
 * @example
 * plateValid('BCDF12')                   // true
 * plateValid('8CDF12')                   // false — '8' not corrected in strict mode
 * plateValid('8CDF12', { fuzzy: true })  // true  — '8' corrected to 'B'
 * plateValid('BC-DF12')                  // false — use normalize() first if needed
 */
export function plateValid(plate: string, config?: IPlateValidConfig): boolean {
  if (!plate) return false;

  if (config?.fuzzy) {
    return fuzzyCorrect(plate).length > 0;
  }

  return PLATE_PATTERNS.some((p) => p.pattern.test(plate));
}

/**
 * Shorthand for {@link plateValid}`(plate, { fuzzy: true })`.
 *
 * Attempts to correct common OCR character substitutions before validating.
 * Prefer this over `plateValid` when the input comes from an image recognition pipeline.
 *
 * @param plate - The plate string to validate. Must be pre-normalized.
 * @returns `true` if the plate matches any known Chilean format after OCR correction.
 *
 * @example
 * fuzzyPlateValid('8CDF12') // true  — '8' corrected to 'B'
 * fuzzyPlateValid('BCDF12') // true  — no correction needed
 * fuzzyPlateValid('XXXX99') // false — no valid format found
 */
export function fuzzyPlateValid(plate: string): boolean {
  return fuzzyCorrect(plate).length > 0;
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
export type { IPlateValidConfig } from './types';

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

  /**
   * Strips all non-alphanumeric characters and converts to uppercase.
   *
   * Static convenience wrapper around the standalone {@link normalize} function,
   * useful when working exclusively with the `CLPlate` class without importing
   * standalone utilities.
   *
   * @param plate - The raw plate string.
   * @returns A sanitized, uppercase string containing only letters and digits.
   *
   * @example
   * CLPlate.normalize('BC-DF 12') // 'BCDF12'
   */
  static normalize(plate: string): string {
    return normalize(plate);
  }

  /**
   * Returns all valid plate strings that can be derived from the input
   * by correcting common OCR character substitutions.
   *
   * Static convenience wrapper around the standalone {@link fuzzyCorrect} function.
   * The input must be pre-normalized.
   *
   * @param plate - The plate string to correct. Must be pre-normalized.
   * @returns An array of valid corrected plate strings, or `[]` if none match.
   *
   * @example
   * CLPlate.fuzzyCorrect('8CDF12') // ['BCDF12']
   * CLPlate.fuzzyCorrect('BCDF12') // ['BCDF12'] — already valid, returned as-is
   * CLPlate.fuzzyCorrect('XXXX99') // []
   */
  static fuzzyCorrect(plate: string): string[] {
    return fuzzyCorrect(plate);
  }

  /**
   * Returns `true` if the plate matches a known Chilean format after OCR correction.
   *
   * Static convenience wrapper around {@link fuzzyPlateValid}.
   * Prefer this over `CLPlate.fuzzyCorrect(plate).length > 0` when you only need
   * a boolean result.
   *
   * @param plate - The plate string to validate. Must be pre-normalized.
   * @returns `true` if a valid plate can be derived via OCR correction.
   *
   * @example
   * CLPlate.isValidFuzzy('8CDF12') // true  — '8' corrected to 'B'
   * CLPlate.isValidFuzzy('BCDF12') // true  — no correction needed
   * CLPlate.isValidFuzzy('XXXX99') // false — no valid format found
   */
  static isValidFuzzy(plate: string): boolean {
    return fuzzyPlateValid(plate);
  }

  /**
   * All valid plate strings derivable from {@link clean} via OCR correction.
   *
   * In rare cases a single input may correct to more than one valid plate; callers
   * should handle the multi-result case.
   *
   * @example
   * new CLPlate('8CDF12').fuzzyCorrections // ['BCDF12']
   * new CLPlate('BCDF12').fuzzyCorrections // ['BCDF12'] — already valid, returned as-is
   * new CLPlate('XXXX99').fuzzyCorrections // []
   */
  get fuzzyCorrections(): string[] {
    return fuzzyCorrect(this.clean);
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

    /* istanbul ignore next */
    return this.clean;
  }

  /**
   * Returns the formatted plate string, identical to {@link formatted}.
   *
   * Implemented so that string coercion (template literals, `String()`, `console.log`)
   * produces a human-readable value rather than `[object Object]`.
   *
   * @example
   * String(new CLPlate('BCDF12'))      // 'BCDF-12'
   * `Plate: ${new CLPlate('AA1234')}`  // 'Plate: AA-1234'
   */
  toString(): string {
    return this.formatted;
  }
}
