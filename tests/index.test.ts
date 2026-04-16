import { plateValid, plateType, CLPlate } from '../src';

const testCases = [
  { plate: '', expectedValid: false, expectedType: 'INVALID' },
  { plate: 'BBCC10', expectedValid: true, expectedType: 'NEW_VEHICLE_PLATE' },
  { plate: 'BB-CC-12', expectedValid: true, expectedType: 'NEW_VEHICLE_PLATE' },
  { plate: 'AR1240', expectedValid: true, expectedType: 'OLD_PLATE' },
  { plate: 'CBC320', expectedValid: true, expectedType: 'NEW_MOTORCYCLE_PLATE' },
  { plate: 'RRR123', expectedValid: true, expectedType: 'NEW_MOTORCYCLE_PLATE' },
  { plate: 'CD1202', expectedValid: true, expectedType: 'CUERPO_DIPLOMÁTICO' },
  { plate: 'Z2139', expectedValid: true, expectedType: 'POLICE' },
  { plate: 'A6709', expectedValid: true, expectedType: 'AMBULANCE' },
  { plate: 'SEXY69', expectedValid: false, expectedType: 'INVALID' },
];

describe('Chilean Plate Validator', () => {
  testCases.forEach(({ plate, expectedValid, expectedType }) => {
    describe(`Plate: ${plate || 'empty'}`, () => {

      test('should validate correctly via functions', () => {
        expect(plateValid(plate)).toBe(expectedValid);
        expect(plateType(plate)).toBe(expectedType);
      });

      test('should validate correctly via CLPlate class', () => {
        const instance = new CLPlate(plate);
        expect(instance.isValid).toBe(expectedValid);
        expect(instance.type).toBe(expectedType);
      });

      if (expectedValid && plate === 'BB-CC-12') {
        test('should format correctly', () => {
          const instance = new CLPlate(plate);
          expect(instance.formatted).toBe('BBCC-12');
        });
      }

      if (expectedValid && plate === 'A6709') {
        test('should format correctly for 5-digit plates', () => {
          const instance = new CLPlate(plate);
          expect(instance.formatted).toBe('A-6709');
        });
      }
    });
  });
});
