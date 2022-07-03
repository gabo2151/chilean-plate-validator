import { plateValid, plateType, CLPlate } from '../src';

const tests = [
  { plate: '', plateValid: false, plateType: 'INVALID' },
  { plate: 'BBCC10', plateValid: true, plateType: 'NEW_VEHICLE_PLATE' },
  { plate: 'bbcc10', plateValid: true, plateType: 'NEW_VEHICLE_PLATE' },
  { plate: 'AAXX00', plateValid: false, plateType: 'INVALID' },
  { plate: 'BBCC1', plateValid: false, plateType: 'INVALID' },
  { plate: 'BBBCC10', plateValid: false, plateType: 'INVALID' },
  { plate: 'BBCC00', plateValid: false, plateType: 'INVALID' },
  { plate: 'BB10CC', plateValid: false, plateType: 'INVALID' },
  { plate: 'SEXY69', plateValid: false, plateType: 'INVALID' },
  { plate: 'JJCC27', plateValid: true, plateType: 'NEW_VEHICLE_PLATE' },
  { plate: 'jjcc27', plateValid: true, plateType: 'NEW_VEHICLE_PLATE' },
  { plate: 'AR1240', plateValid: true, plateType: 'OLD_PLATE' },
  { plate: 'ar1240', plateValid: true, plateType: 'OLD_PLATE' },
  { plate: 'CBC320', plateValid: true, plateType: 'NEW_MOTORCYCLE_PLATE' },
  { plate: 'cbc320', plateValid: true, plateType: 'NEW_MOTORCYCLE_PLATE' },
  { plate: 'AC20', plateValid: false, plateType: 'INVALID' },
  { plate: 'ACX200', plateValid: false, plateType: 'INVALID' },
  { plate: 'BBBB2000', plateValid: false, plateType: 'INVALID' },
  { plate: 'CD1202', plateValid: true, plateType: 'CUERPO_DIPLOMÁTICO' },
  { plate: 'RP1202', plateValid: true, plateType: 'RADIOPATRULLA' },
  { plate: 'Z2139', plateValid: true, plateType: 'POLICE' },
  { plate: 'J1209', plateValid: true, plateType: 'POLICE' },
  { plate: 'A6709', plateValid: true, plateType: 'AMBULANCE' },
];

describe('testing index file', () => {

  tests.forEach(_test => {
    test(`\'${_test.plate}\' should result in \'${_test.plateValid}\'`, () => {
      expect(plateValid(_test.plate)).toBe(_test.plateValid);
    });
    test(`\'${_test.plate}\' should result in \'${_test.plateType}\'`, () => {
      expect(plateType(_test.plate)).toBe(_test.plateType);
    });
    test(`new CLPlate(\'${_test.plate}\').valid should result in \'${_test.plateValid}\'`, () => {
      expect(new CLPlate(_test.plate).valid).toBe(_test.plateValid);
    });
    test(`new CLPlate(\'${_test.plate}\').type should result in \'${_test.plateType}\'`, () => {
      expect(new CLPlate(_test.plate).type).toBe(_test.plateType);
    });
  });

});
