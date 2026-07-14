const PRODUCTION_ENVIRONMENT = "production";

export function getRequiredServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

export function getOptionalServerEnv(name: string): string | null {
  return process.env[name] || null;
}

export function requireProductionServerEnv(names: readonly string[]): void {
  if (process.env.NODE_ENV !== PRODUCTION_ENVIRONMENT) {
    return;
  }

  const missingNames = names.filter((name) => !process.env[name]);
  if (missingNames.length > 0) {
    throw new Error(
      `Production web authentication requires: ${missingNames.join(", ")}`,
    );
  }
}
