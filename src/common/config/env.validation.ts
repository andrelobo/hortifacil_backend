type RawEnv = Record<string, unknown>;

function assertNonEmptyString(
  config: RawEnv,
  key: string,
  allowEmpty = false,
): void {
  const value = config[key];

  if (typeof value !== 'string') {
    throw new Error(`Missing environment variable: ${key}`);
  }

  if (!allowEmpty && value.trim().length === 0) {
    throw new Error(`Environment variable cannot be empty: ${key}`);
  }
}

export function validateEnv(config: RawEnv): RawEnv {
  assertNonEmptyString(config, 'MONGODB_URI');
  assertNonEmptyString(config, 'JWT_SECRET');

  const port = config.PORT;

  if (port !== undefined && Number.isNaN(Number(port))) {
    throw new Error('Environment variable PORT must be a valid number');
  }

  return config;
}

