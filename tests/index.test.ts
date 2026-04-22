import { plateValid, plateType, specialPlateInfo, normalize, CLPlate, PlateType } from '../src';

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
