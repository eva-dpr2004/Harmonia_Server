const { isValidEmail, isValidName, isValidPassword, isValidAnimalName, isValidDate, isValidTime, isValidActivityDuration } = require('../utils/validator.js');
const crypto = require('crypto'); // Pour utiliser un générateur de nombres aléatoires sécurisé
require('dotenv').config(); // pour charger les variables d'environnement

// Fonction pour générer dynamiquement un mot de passe valide sécurisé
function generateValidPassword() {
  return `ValidPass${crypto.randomInt(1000)}!`; // Utilisation de crypto.randomInt() pour générer un nombre aléatoire sécurisé
}

// Fonction pour générer dynamiquement un mot de passe invalide (trop court)
function generateShortPassword() {
  return `Short${crypto.randomInt(10)}!`; // Utilisation de crypto.randomInt() pour générer un nombre aléatoire sécurisé
}

// Fonction pour générer un mot de passe sans majuscule
function generatePasswordWithoutUppercase() {
  return `validpass${crypto.randomInt(1000)}!`; // Utilisation de crypto.randomInt() pour générer un nombre aléatoire sécurisé
}

// Fonction pour générer un mot de passe sans caractère spécial
function generatePasswordWithoutSpecialCharacter() {
  return `ValidPass${crypto.randomInt(1000)}`; // Utilisation de crypto.randomInt() pour générer un nombre aléatoire sécurisé
}

// Fonction pour générer un mot de passe sans chiffre
function generatePasswordWithoutNumber() {
  return `ValidPass!`; // Génère un mot de passe sans chiffre
}

describe('Validator tests', () => {

  // Tests pour la validation des emails
  describe('Email validation', () => {
    // Mise à jour de la regex pour éviter le backtracking
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
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
    const validPasswords = [generateValidPassword(), 'StrongPassword1@']; // Utilisation de la génération dynamique sécurisée
    const invalidPasswords = [
      { password: generateShortPassword(), reason: 'too short' }, // Génération dynamique pour "trop court"
      { password: generatePasswordWithoutSpecialCharacter(), reason: 'missing special character' }, // Génération dynamique pour "manque caractère spécial"
      { password: generatePasswordWithoutUppercase(), reason: 'missing uppercase letter' }, // Génération dynamique pour "manque majuscule"
      { password: generatePasswordWithoutNumber(), reason: 'missing number' } // Génération dynamique pour "manque chiffre"
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
