/**
 * Configuration options for {@link plateValid}.
 */
export interface IPlateValidConfig {
  /**
   * When `true`, attempts to correct common OCR character substitutions
   * (e.g. `0→O`, `1→I`, `8→B`) before validating.
   *
   * Useful when the plate string comes from an image recognition pipeline.
   *
   * @example
   * plateValid('8CDF12', { fuzzy: true })  // true  ('8' corrected to 'B')
   * plateValid('8CDF12')                   // false
   */
  fuzzy?: boolean;
}
