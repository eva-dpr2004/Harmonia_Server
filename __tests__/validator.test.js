const { isValidEmail } = require('../utils/validator.js');
 
describe('Email validation', () => {

  test('Valid email should pass', () => {

    const email = 'test@example.com';

    expect(isValidEmail(email)).toBe(true);

  });
 
  test('Invalid email should fail', () => {

    const email = 'invalid-email';

    expect(isValidEmail(email)).toBe(false);

  });
 
  test('Email without domain should fail', () => {

    const email = 'test@';

    expect(isValidEmail(email)).toBe(false);

  });
 
  test('Empty string should fail', () => {

    const email = '';

    expect(isValidEmail(email)).toBe(false);

  });

});

 