/**
 * Centralized test data for the saucedemo.com UI suite.
 * Keeping data out of spec files makes the suite easier to maintain and
 * lets us swap in environment-specific data (e.g. via env vars) later
 * without touching test logic.
 */

export const SAUCE_PASSWORD = 'secret_sauce';

export const users = {
  standard: { username: 'standard_user', password: SAUCE_PASSWORD },
  lockedOut: { username: 'locked_out_user', password: SAUCE_PASSWORD },
  problem: { username: 'problem_user', password: SAUCE_PASSWORD },
  performanceGlitch: { username: 'performance_glitch_user', password: SAUCE_PASSWORD },
  errorUser: { username: 'error_user', password: SAUCE_PASSWORD },
  visualUser: { username: 'visual_user', password: SAUCE_PASSWORD },
} as const;

export const invalidLoginCases = [
  {
    name: 'unregistered username',
    username: 'not_a_real_user',
    password: SAUCE_PASSWORD,
    expectedError: 'Username and password do not match any user in this service',
  },
  {
    name: 'wrong password',
    username: 'standard_user',
    password: 'wrong_password',
    expectedError: 'Username and password do not match any user in this service',
  },
  {
    name: 'locked out user',
    username: 'locked_out_user',
    password: SAUCE_PASSWORD,
    expectedError: 'Sorry, this user has been locked out',
  },
  {
    name: 'empty username',
    username: '',
    password: SAUCE_PASSWORD,
    expectedError: 'Username is required',
  },
  {
    name: 'empty password',
    username: 'standard_user',
    password: '',
    expectedError: 'Password is required',
  },
] as const;

export const checkoutInfo = {
  valid: { firstName: 'Ada', lastName: 'Lovelace', postalCode: '12345' },
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
};
