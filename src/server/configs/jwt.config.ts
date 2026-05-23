let _secret: Uint8Array | null = null;

export const getJwtSecret = (): Uint8Array => {
  if (_secret) return _secret;

  const raw = process.env.JWT_SECRET;
  if (!raw) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  _secret = new TextEncoder().encode(raw);
  return _secret;
};
