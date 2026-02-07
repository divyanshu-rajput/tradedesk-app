import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();

if (globalThis.fetch == null) {
  globalThis.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({}),
    }),
  ) as unknown as typeof fetch;
}
