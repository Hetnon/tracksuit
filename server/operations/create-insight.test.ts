import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type { InsightType } from "$models/insight.ts";
import { withDB } from "../testing.ts";
import createInsight from "./create-insight.ts";
import { Row } from "$tables/insights.ts";


describe("creating insights in the database", () => {
  describe("valid input", () => {
    withDB((fixture) => {
      let resultId: number;
      let allInsights: Row[];
      const input = { brand: 2, text: "new insight" };
      let message: string | undefined;
      let error: string | undefined;

      beforeAll(() => {
        const response = createInsight({ db: fixture.db, insightInstance: input });
        expect(response.error).toBeUndefined();
        message = response.message;
        allInsights = fixture.insights.selectAll();
      });

      it("returns an inserted ID greater than zero", () => {
        expect(typeof message).toEqual("string");
        expect(message).toContain("Insight created successfully");
        expect(allInsights.length).toBeGreaterThan(0);
      });

      it("stores the insight in the database with correct fields", () => {
        const created = allInsights[allInsights.length - 1];
        expect(created).toBeDefined();
        expect(created?.brand).toEqual(input.brand);
        expect(created?.text).toEqual(input.text);
      });
    });
  });

  describe("invalid input", () => {
    withDB((fixture) => {
      let response: { message?: string; error?: string };

      beforeAll(() => {
        // missing text
        response = createInsight({ db: fixture.db, insightInstance: { brand: 1, text: "" } });
      });

      it("returns an error for empty text", () => {
        expect(response.error).toBeDefined();
      });
    });
  });
});