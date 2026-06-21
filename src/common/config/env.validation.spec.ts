import { validateEnv } from './env.validation';

describe('validateEnv', () => {
  it('returns the config when required values are present', () => {
    const config = {
      MONGODB_URI: 'mongodb+srv://example',
      JWT_SECRET: 'secret-value',
      PORT: '3000',
    };

    expect(validateEnv(config)).toBe(config);
  });

  it('throws when MONGODB_URI is missing', () => {
    expect(() =>
      validateEnv({
        JWT_SECRET: 'secret-value',
      }),
    ).toThrow('Missing environment variable: MONGODB_URI');
  });

  it('throws when JWT_SECRET is empty', () => {
    expect(() =>
      validateEnv({
        MONGODB_URI: 'mongodb+srv://example',
        JWT_SECRET: '   ',
      }),
    ).toThrow('Environment variable cannot be empty: JWT_SECRET');
  });

  it('throws when PORT is invalid', () => {
    expect(() =>
      validateEnv({
        MONGODB_URI: 'mongodb+srv://example',
        JWT_SECRET: 'secret-value',
        PORT: 'abc',
      }),
    ).toThrow('Environment variable PORT must be a valid number');
  });
});
