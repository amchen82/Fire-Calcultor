jest.mock('react-native', () => ({
  Alert: { alert: jest.fn() },
  StyleSheet: { create: () => ({}) },
}));

import { validateCredentials } from './Login';

describe('validateCredentials', () => {
  it('returns true for correct credentials', () => {
    expect(validateCredentials('user', 'pass123')).toBe(true);
  });

  it('returns false for incorrect credentials', () => {
    expect(validateCredentials('wrong', 'creds')).toBe(false);
  });
});
