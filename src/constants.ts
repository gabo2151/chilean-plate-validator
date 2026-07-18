/**
 * @file constants.ts
 * @description Plate format definitions based on Chilean Civil Registration specifications.
 * @source [Instructivo para Validación de Patentes - Servicio de Registro Civil e Identificación](https://www.registrocivil.cl/PortalOI/Manuales/ValidacionPatentes.pdf)
 * @source [Wikipedia: Matrículas automovilísticas de Chile](https://es.wikipedia.org/wiki/Matrículas_automovilísticas_de_Chile)
 */

// ─── Plate type ───────────────────────────────────────────────────────────────

/**
 * All recognized Chilean plate categories, including `invalid` for unmatched inputs.
 *
 * @example
 * plateType('BCDF12') === PlateType.NewVehicle // true
 */
export const PlateType = {
  NewVehicle:    'new_vehicle_plate',
  NewMotorcycle: 'new_motorcycle_plate',
  Old:           'old_plate',
  Police:        'police',
  Ambulance:     'ambulance',
  Invalid:       'invalid',
} as const;

export type PlateType = typeof PlateType[keyof typeof PlateType];

// ─── Authority type ───────────────────────────────────────────────────────────

/**
 * Indicates the institutional nature of a special plate.
 */
export const AuthorityType = {
  Civil:        'civil',
  Police:       'police',
  Governmental: 'governmental',
} as const;

export type AuthorityType = typeof AuthorityType[keyof typeof AuthorityType];

// ─── Regex list ───────────────────────────────────────────────────────────────

export interface PlatePattern {
  /** Plate category this pattern matches. */
  type: PlateType;
  /** Regular expression to validate the normalized plate string. */
  pattern: RegExp;
}

/**
 * Ordered list of plate patterns. Evaluated top to bottom — more specific patterns first.
 */
export const PLATE_PATTERNS: PlatePattern[] = [
  {
    type:    PlateType.NewVehicle,
    // Vehicle format is 4 letters + 2 digits (LLLL·nn). Series omit the vowels
    // A, E, I, O, U and also M, N, Q. Ref: Registro Civil "Nuevo formato PPU".
    // TODO: the 2025 decree (D.O. 16-01-2025) moves cars to 5 letters + 1 digit
    //       (LLLLL·n), rolling out ~2029. Add that pattern when it circulates.
    pattern: /^[B-DF-HJ-LPR-TV-Z]{4}[1-9]\d$/,
  },
  {
    type:    PlateType.NewMotorcycle,
    // 3 letters + 2 digits (LLL·nn), e.g. BJH·61, FLB·49.
    //
    // IMPORTANT — do NOT change to \d{3}. The official registry format is
    // LLL·nnn-V, where the last digit is a check digit. That check digit is NOT
    // printed on the physical plate, so an OCR/LPR camera only ever sees LLL·nn.
    // This library validates what the camera reads, not the registry record.
    //
    // Letter set: all consonants — including M, N and Q, which the vehicle format
    // excludes — per the Registro Civil check-digit table. Only vowels are omitted.
    // CAVEAT: some sources note recent moto series may also reach into vowels
    // (I, O); if a valid plate is wrongly rejected, widen this class.
    // TODO: the 2025 decree (D.O. 16-01-2025) moves motos to 4 letters + 1 digit
    //       (LLLL·n), rolling out ~2027. Add that pattern when it circulates.
    pattern: /^[B-DF-HJ-NP-TV-Z]{3}\d{2}$/,
    // NOTE: Trailer plates share this exact format and cannot be visually distinguished.
    // Distinguishing between them requires external context (e.g. registration data).
  },
  {
    type:    PlateType.Old,
    pattern: /^[A-Z]{2}\d{4}$/,
  },
  {
    type:    PlateType.Police,
    pattern: /^[BCJMZ]\d{4}$/,
  },
  {
    type:    PlateType.Ambulance,
    pattern: /^A\d{4}$/,
  },
];

// ─── Special plates ───────────────────────────────────────────────────────────

export interface SpecialPlate {
  /** Two-letter prefix that identifies this special plate category. */
  prefix: string;
  /** Short human-readable name in Spanish. */
  label: string;
  /** Extended description of the plate category in Spanish. */
  description: string;
  /** Institutional nature of this plate. */
  authority: AuthorityType;
}

/**
 * Special plate categories that share the old plate format (`AA-0000`).
 * Matched by their two-letter prefix after the base format is confirmed.
 */
export const SPECIAL_PLATES: SpecialPlate[] = [
  {
    prefix:      'AG',
    label:       'Grúa',
    description: 'Vehículo de asistencia en carretera tipo grúa.',
    authority:   AuthorityType.Civil,
  },
  {
    prefix:      'AP',
    label:       'Camioneta de apoyo policial',
    description: 'Vehículo de apoyo logístico de Carabineros de Chile.',
    authority:   AuthorityType.Police,
  },
  {
    prefix:      'AT',
    label:       'Asistencia técnica personal',
    description: 'Vehículo de asistencia técnica de uso personal.',
    authority:   AuthorityType.Civil,
  },
  {
    prefix:      'CB',
    label:       'Carro blindado',
    description: 'Vehículo blindado de uso policial o de seguridad.',
    authority:   AuthorityType.Police,
  },
  {
    prefix:      'CC',
    label:       'Cuerpo consular',
    description: 'Vehículo asignado a representantes consulares extranjeros.',
    authority:   AuthorityType.Governmental,
  },
  {
    prefix:      'CD',
    label:       'Cuerpo diplomático',
    description: 'Vehículo asignado a representantes diplomáticos extranjeros.',
    authority:   AuthorityType.Governmental,
  },
  {
    prefix:      'CH',
    label:       'Cónsul honorario',
    description: 'Vehículo asignado a cónsules honorarios acreditados en Chile.',
    authority:   AuthorityType.Governmental,
  },
  {
    prefix:      'CR',
    label:       'Carro rodante',
    description: 'Vehículo de gran tamaño o carga especial tipo carro rodante.',
    authority:   AuthorityType.Civil,
  },
  {
    prefix:      'LA',
    label:       'Carro lanza agua',
    description: 'Vehículo policial equipado con sistema lanza agua.',
    authority:   AuthorityType.Police,
  },
  {
    prefix:      'LC',
    label:       'Lancha',
    description: 'Embarcación menor registrada con patente terrestre.',
    authority:   AuthorityType.Civil,
  },
  {
    prefix:      'OI',
    label:       'Organismo internacional',
    description: 'Vehículo asignado a organismos internacionales con sede en Chile.',
    authority:   AuthorityType.Governmental,
  },
  {
    prefix:      'PR',
    label:       'Patente provisoria',
    description: 'Patente temporal asignada a vehículos en trámite de inscripción.',
    authority:   AuthorityType.Civil,
  },
  {
    prefix:      'RP',
    label:       'Radiopatrulla',
    description: 'Vehículo policial de patrullaje con radio comunicación.',
    authority:   AuthorityType.Police,
  },
  {
    prefix:      'TC',
    label:       'Transporte escuela de caballería',
    description: 'Vehículo de transporte de la Escuela de Caballería de Chile.',
    authority:   AuthorityType.Police,
  },
];
