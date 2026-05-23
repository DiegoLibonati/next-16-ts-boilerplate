import * as Undici from "undici";

const TEST_BASE_URL = "http://localhost";

const fetchWithBase: typeof Undici.fetch = (
  input: Parameters<typeof Undici.fetch>[0],
  init?: Parameters<typeof Undici.fetch>[1]
) => {
  if (typeof input === "string" && input.startsWith("/")) {
    return Undici.fetch(`${TEST_BASE_URL}${input}`, init);
  }
  return Undici.fetch(input, init);
};

Object.defineProperties(globalThis, {
  fetch: { value: fetchWithBase, writable: true, configurable: true },
  FormData: { value: Undici.FormData, writable: true, configurable: true },
  Headers: { value: Undici.Headers, writable: true, configurable: true },
  Request: { value: Undici.Request, writable: true, configurable: true },
  Response: { value: Undici.Response, writable: true, configurable: true },
});
