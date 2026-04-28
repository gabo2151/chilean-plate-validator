import { fuzzyCorrect, fuzzyPlateValid, plateValid, plateType, specialPlateInfo, normalize, CLPlate, PlateType } from '../src';

// ─── plateValid / plateType (strict — pre-normalized input only) ──────────────

const strictCases = [
  { plate: '',       expectedValid: false, expectedType: PlateType.Invalid },
  { plate: 'BBCC10', expectedValid: true,  expectedType: PlateType.NewVehicle },
  { plate: 'AR1240', expectedValid: true,  expectedType: PlateType.Old },
  { plate: 'CBC320', expectedValid: true,  expectedType: PlateType.NewMotorcycle },
  { plate: 'RRR123', expectedValid: true,  expectedType: PlateType.NewMotorcycle },
  { plate: 'CD1202', expectedValid: true,  expectedType: PlateType.Old },
  { plate: 'Z2139',  expectedValid: true,  expectedType: PlateType.Police },
  { plate: 'A6709',  expectedValid: true,  expectedType: PlateType.Ambulance },
  { plate: 'SEXY69', expectedValid: false, expectedType: PlateType.Invalid },
];

describe('plateValid and plateType — strict mode', () => {
  strictCases.forEach(({ plate, expectedValid, expectedType }) => {
    test(`"${plate || 'empty'}" → valid: ${expectedValid}, type: ${expectedType}`, () => {
      expect(plateValid(plate)).toBe(expectedValid);
      expect(plateType(plate)).toBe(expectedType);
    });
  });

  test('should reject non-normalized input', () => {
    expect(plateValid('BB-CC-12')).toBe(false);
    expect(plateType('BB-CC-12')).toBe(PlateType.Invalid);
  });

  test('should accept normalized input via normalize()', () => {
    expect(plateValid(normalize('BB-CC-12'))).toBe(true);
    expect(plateType(normalize('BB-CC-12'))).toBe(PlateType.NewVehicle);
  });
});

// ─── specialPlateInfo ─────────────────────────────────────────────────────────

describe('specialPlateInfo', () => {
  test('should return metadata for a known special plate', () => {
    const info = specialPlateInfo('CD1202');
    expect(info).not.toBeNull();
    expect(info?.prefix).toBe('CD');
    expect(info?.label).toBe('Cuerpo diplomático');
    expect(info?.authority).toBe('governmental');
  });

  test('should return null for a standard old plate', () => {
    expect(specialPlateInfo('AR1240')).toBeNull();
  });

  test('should return null for non-old-format plates', () => {
    expect(specialPlateInfo('BCDF12')).toBeNull();
    expect(specialPlateInfo('Z2139')).toBeNull();
  });
});

// ─── CLPlate class ────────────────────────────────────────────────────────────

describe('CLPlate', () => {
  test('normalizes input automatically', () => {
    const plate = new CLPlate('bb-cc-12');
    expect(plate.clean).toBe('BBCC12');
    expect(plate.isValid).toBe(true);
    expect(plate.type).toBe(PlateType.NewVehicle);
  });

  test('formats new vehicle plate correctly', () => {
    expect(new CLPlate('BB-CC-12').formatted).toBe('BBCC-12');
  });

  test('formats old plate correctly', () => {
    expect(new CLPlate('AR1240').formatted).toBe('AR-1240');
  });

  test('formats 5-character plate correctly', () => {
    expect(new CLPlate('A6709').formatted).toBe('A-6709');
  });

  test('returns raw clean string when invalid', () => {
    expect(new CLPlate('SEXY69').formatted).toBe('SEXY69');
  });

  test('exposes specialInfo for special plates', () => {
    const plate = new CLPlate('CD-1202');
    expect(plate.specialInfo).not.toBeNull();
    expect(plate.specialInfo?.prefix).toBe('CD');
    expect(plate.specialInfo?.authority).toBe('governmental');
  });

  test('returns null specialInfo for standard plates', () => {
    expect(new CLPlate('BBCC12').specialInfo).toBeNull();
    expect(new CLPlate('AR1240').specialInfo).toBeNull();
  });

  test('handles empty string', () => {
    const plate = new CLPlate('');
    expect(plate.isValid).toBe(false);
    expect(plate.type).toBe(PlateType.Invalid);
    expect(plate.specialInfo).toBeNull();
  });
});

describe('CLPlate — fuzzyCorrections', () => {
  test('returns corrected plate for recoverable input', () => {
    expect(new CLPlate('8CDF12').fuzzyCorrections).toEqual(['BCDF12']);
  });

  test('returns the plate itself when already valid', () => {
    expect(new CLPlate('BCDF12').fuzzyCorrections).toEqual(['BCDF12']);
  });

  test('returns empty array when unrecoverable', () => {
    expect(new CLPlate('99999').fuzzyCorrections).toEqual([]);
  });

  test('handles empty string', () => {
    expect(new CLPlate('').fuzzyCorrections).toEqual([]);
  });
});

describe('CLPlate — static helpers', () => {
  test('normalize strips separators and uppercases', () => {
    expect(CLPlate.normalize('bc-df 12')).toBe('BCDF12');
  });

  test('fuzzyCorrect returns corrected plate', () => {
    expect(CLPlate.fuzzyCorrect('8CDF12')).toEqual(['BCDF12']);
  });

  test('isValidFuzzy returns true for recoverable input', () => {
    expect(CLPlate.isValidFuzzy('8CDF12')).toBe(true);
  });

  test('isValidFuzzy returns false for unrecoverable input', () => {
    expect(CLPlate.isValidFuzzy('99999')).toBe(false);
  });
});

describe('CLPlate — toString', () => {
  test('coerces to formatted string in template literal', () => {
    expect(`${new CLPlate('BCDF12')}`).toBe('BCDF-12');
  });

  test('coerces to formatted string via String()', () => {
    expect(String(new CLPlate('AA1234'))).toBe('AA-1234');
  });
});

// ─── Fuzzy validation (OCR correction) ───────────────────────────────────────

describe('plateValid — fuzzy mode', () => {
  test('corrects digit-to-letter substitution (8→B)', () => {
    expect(plateValid('8CDF12', { fuzzy: true })).toBe(true);
  });

  test('corrects multiple substitutions in letter and digit positions', () => {
    expect(plateValid('8CDF1Z', { fuzzy: true })).toBe(true); // 8→B (pos 0), Z→2 (pos 5)
  });

  test('returns false when no valid plate can be derived', () => {
    expect(plateValid('99999', { fuzzy: true })).toBe(false);
  });

  test('accepts already-valid plates unchanged', () => {
    expect(plateValid('BCDF12', { fuzzy: true })).toBe(true);
  });
});

describe('fuzzyPlateValid', () => {
  test('corrects OCR errors and returns true for recoverable plates', () => {
    expect(fuzzyPlateValid('8CDF12')).toBe(true); // 8→B
  });

  test('returns true for already-valid plates', () => {
    expect(fuzzyPlateValid('BCDF12')).toBe(true);
  });

  test('returns false when no valid plate can be derived', () => {
    expect(fuzzyPlateValid('99999')).toBe(false);
  });

  test('handles empty string', () => {
    expect(fuzzyPlateValid('')).toBe(false);
  });
});

describe('fuzzyCorrect', () => {
  test('returns corrected plate string for recoverable input', () => {
    expect(fuzzyCorrect('8CDF12')).toEqual(['BCDF12']);
  });

  test('returns original plate when already valid', () => {
    expect(fuzzyCorrect('BCDF12')).toEqual(['BCDF12']);
  });

  test('returns empty array when no valid plate can be derived', () => {
    expect(fuzzyCorrect('99999')).toEqual([]);
  });

  test('handles empty string', () => {
    expect(fuzzyCorrect('')).toEqual([]);
  });

  test('corrects old format plate (digit in letter position)', () => {
    expect(fuzzyCorrect('8R1240')).toEqual(['BR1240']); // 8→B
  });
});

describe('fuzzy validation — invalid length (OCR dropout / hallucination)', () => {
  test('returns false for input with too few characters', () => {
    expect(fuzzyPlateValid('BCDF1')).toBe(false);
    expect(fuzzyCorrect('BCDF1')).toEqual([]);
  });

  test('returns false for input with too many characters', () => {
    expect(fuzzyPlateValid('BBCDF12')).toBe(false);
    expect(fuzzyCorrect('BBCDF12')).toEqual([]);
  });
});
