import type { MetadataRoute } from "next";

import manifest from "@/app/manifest";

describe("manifest", () => {
  describe("when called", () => {
    it("should return the correct app name", () => {
      const result: MetadataRoute.Manifest = manifest();
      expect(result.name).toBe("Next.js 16 MongoDB Boilerplate");
    });

    it("should return the correct short name", () => {
      const result: MetadataRoute.Manifest = manifest();
      expect(result.short_name).toBe("Next16Mongo");
    });

    it("should return standalone display mode", () => {
      const result: MetadataRoute.Manifest = manifest();
      expect(result.display).toBe("standalone");
    });

    it("should return / as the start URL", () => {
      const result: MetadataRoute.Manifest = manifest();
      expect(result.start_url).toBe("/");
    });

    it("should return two icon entries", () => {
      const result: MetadataRoute.Manifest = manifest();
      expect(result.icons).toHaveLength(2);
    });

    it("should include the 192x192 icon", () => {
      const result: MetadataRoute.Manifest = manifest();
      expect(result.icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ src: "/icon-192.png", sizes: "192x192" }),
        ])
      );
    });

    it("should include the 512x512 icon", () => {
      const result: MetadataRoute.Manifest = manifest();
      expect(result.icons).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ src: "/icon-512.png", sizes: "512x512" }),
        ])
      );
    });
  });
});
