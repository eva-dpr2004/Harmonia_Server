const validator = require('validator');  

// Validation pour les emails
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validation pour les noms (utilisateurs et animaux)
function isValidName(name) {
  const sqlRegex = /(DROP\s+TABLE|SELECT|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC)/i;
  const consecutiveUppercaseRegex = /(?:[A-Z]{2,})/;
  const allowedCharsRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ0-9-_' ]*$/;

  if (name.length > 100) return false;

  return (
    name.length >= 3 &&
    allowedCharsRegex.test(name) &&
    !consecutiveUppercaseRegex.test(name) &&
    !sqlRegex.test(name)
  );
}

// Validation pour les mots de passe
function isValidPassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\^$*.[\]{}()?\-"!@#%&/,><':;|_~`])\S{12,}$/;
  return passwordRegex.test(password);
}

// Validation pour les noms d'animaux
function isValidAnimalName(name) {
  const sqlRegex = /(DROP\s+TABLE|SELECT|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC)/i;
  const allowedCharsRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ _-]*$/;

  return (
    name.length >= 3 && 
    name.length <= 100 &&
    allowedCharsRegex.test(name) &&
    !sqlRegex.test(name)
  );
}

// Validation des dates (doivent être passées ou présentes)
function isValidDate(date) {
  const today = new Date().toISOString().split('T')[0];
  return validator.isDate(date) && !validator.isAfter(date, today);
}

// Validation des heures (format 24h: hh:mm)
function isValidTime(time) {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}

// Validation de la durée de l'activité (l'heure de fin doit être après l'heure de début)
function isValidActivityDuration(startTime, endTime) {
  const debutDate = new Date(`1970-01-01T${startTime}:00Z`);
  const finDate = new Date(`1970-01-01T${endTime}:00Z`);

  return finDate >= debutDate;  // retourner false si l'heure de fin est avant l'heure de début
}

module.exports = { isValidEmail, isValidName, isValidPassword, isValidAnimalName, isValidDate, isValidTime, isValidActivityDuration };
