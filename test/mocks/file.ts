import { vi } from "vitest";

vi.mock("../../src/core/file.ts", async (importOriginalType) => {
  const { File } = await importOriginalType<typeof import("../../src/core/file.ts")>();

  class MockFile extends File {
    async write(): Promise<void> {
      await this.prettify();
      return;
    }
  }

  return { File: MockFile };
});
