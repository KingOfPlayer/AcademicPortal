import { describe, it, expect, beforeAll } from "vitest";
import { AppealContent } from "./appeal-content";

describe("Appeal Content", () => {
  it("Create Appeal Content", async () => {
    const appealContent = new AppealContent({
      content: "Test Content",
      contentPath: "test/path",
      createdAt: new Date(),
      updatedAt: new Date(),
      activityType: [{ categoryCode: "A1", categoryID: 1 }],
    });
    await expect(appealContent.validate()).resolves.not.toThrow();
  });

  it("Create Appeal Content with missing required fields", async () => {
    const appealContent = new AppealContent({
      content: "",
      contentPath: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      activityType: [{ categoryCode: "A1", categoryID: 1 }],
    });
    await expect(appealContent.validate()).rejects.toThrow();
  });
});
