const { isValidEmail, isValidName, isValidPassword, isValidAnimalName, isValidDate, isValidTime, isValidActivityDuration } = require('../utils/validator.js');

describe('Validator tests', () => {

  // Tests pour la validation des emails
  describe('Email validation', () => {
    const validEmails = ['test@example.com', 'user.name@domain.co'];
    const invalidEmails = ['invalid-email', 'test@', '', null, undefined];

    validEmails.forEach(email => {
      test(`Valid email "${email}" should pass`, () => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    invalidEmails.forEach(email => {
      test(`Invalid email "${email}" should fail`, () => {
        expect(isValidEmail(email)).toBe(false);
      });
    });
  });

  // Tests pour la validation des noms
  describe('Name validation', () => {
    const validNames = ['ValidName123', 'Jean-Pierre'];
    const invalidNames = [
      { name: 'No', reason: 'too short' },
      { name: 'ThisNameIsFarTooLongForValidationTestingInOurApplicationBecauseItExceedsTheLimitOf100CharactersToTriggerValidationError', reason: 'too long' },
      { name: 'DROP TABLE users', reason: 'contains dangerous SQL keyword' },
      { name: 'Invalid@Name!', reason: 'contains invalid characters' },
      { name: 'NameWITHConsecutiveUppercase', reason: 'contains consecutive uppercase letters' }
    ];

    validNames.forEach(name => {
      test(`Valid name "${name}" should pass`, () => {
        expect(isValidName(name)).toBe(true);
      });
    });

    invalidNames.forEach(({ name, reason }) => {
      test(`Invalid name "${name}" should fail because it is ${reason}`, () => {
        expect(isValidName(name)).toBe(false);
      });
    });
  });

  // Tests pour la validation des mots de passe
  describe('Password validation', () => {
    const validPasswords = ['ValidPass123!', 'StrongPassword1@'];
    const invalidPasswords = [
      { password: 'Short12!', reason: 'too short' },
      { password: 'ValidPass123', reason: 'missing special character' },
      { password: 'validpass123!', reason: 'missing uppercase letter' },
      { password: 'ValidPass!', reason: 'missing number' }
    ];

    validPasswords.forEach(password => {
      test(`Valid password "${password}" should pass`, () => {
        expect(isValidPassword(password)).toBe(true);
      });
    });

    invalidPasswords.forEach(({ password, reason }) => {
      test(`Invalid password "${password}" should fail because it is ${reason}`, () => {
        expect(isValidPassword(password)).toBe(false);
      });
    });
  });

  // Tests pour la validation des animaux (nom, date, poids, habitat)
  describe('Animal validation', () => {
    // Nom de l'animal
    const validAnimalNames = ['Rex', 'Luna', 'Toby'];
    const invalidAnimalNames = [
      { name: 'No', reason: 'too short' },
      { name: 'ThisNameIsFarTooLongForValidationTestingInOurApplicationBecauseItExceedsTheLimitOf100CharactersToTriggerValidationError', reason: 'too long' },
      { name: 'DROP TABLE animals', reason: 'contains dangerous SQL keyword' }
    ];

    validAnimalNames.forEach(name => {
      test(`Valid animal name "${name}" should pass`, () => {
        expect(isValidAnimalName(name)).toBe(true);
      });
    });

    invalidAnimalNames.forEach(({ name, reason }) => {
      test(`Invalid animal name "${name}" should fail because it is ${reason}`, () => {
        expect(isValidAnimalName(name)).toBe(false);
      });
    });

    // Tests pour les dates
    test('Valid date should pass', () => {
      const validDate = '2020-01-01';
      expect(isValidDate(validDate)).toBe(true);
    });

    test('Future date should fail', () => {
      const invalidDate = '3000-01-01';
      expect(isValidDate(invalidDate)).toBe(false);
    });

    // Tests pour les heures
    test('Valid time should pass', () => {
      const validTime = '10:30';
      expect(isValidTime(validTime)).toBe(true);
    });

    test('Invalid time should fail', () => {
      const invalidTime = '25:00';
      expect(isValidTime(invalidTime)).toBe(false);
    });

    // Tests pour la durée de l'activité
    test('Valid activity duration should pass', () => {
      const startTime = '10:00';
      const endTime = '12:30';
      expect(isValidActivityDuration(startTime, endTime)).toBe(true);
    });

    test('Invalid activity duration should fail', () => {
      const startTime = '12:30';
      const endTime = '10:00';
      expect(isValidActivityDuration(startTime, endTime)).toBe(false);
    });
  });
});
