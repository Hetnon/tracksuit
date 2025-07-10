import { expect } from "jsr:@std/expect";
import { beforeAll, describe, it } from "jsr:@std/testing/bdd";
import type * as insightsTable from "$tables/insights.ts";
import type { ResponseMessage } from "./delete-insight.ts";
import { withDB } from "../testing.ts";
import deleteInsight from "./delete-insight.ts";
import {InsightType} from "$models/insight.ts";
import { Row } from "$tables/insights.ts";

describe("deleting insights from the database", () => {
  describe("existing insight", () => {
    withDB((fixture) => {
      let response: ResponseMessage;
      let inserted: insightsTable.Row;

      beforeAll(() => {
        // insert a row directly
        const now = new Date().toISOString();
        fixture.db.sql<insightsTable.Row>`INSERT INTO insights (brand, createdAt, text) VALUES (${3}, ${now}, ${"to delete"})`;
        [inserted] = fixture.db.sql<insightsTable.Row>`SELECT * FROM insights WHERE text = ${"to delete"}`;

        response = deleteInsight({ db: fixture.db, id: inserted.id });
      });

      it("returns no error on successful delete", () => {
        expect(response.error).toBeUndefined();
      });

      it("removes the insight from the database", () => {
        const rows = fixture.db.sql<insightsTable.Row>`SELECT * FROM insights WHERE id = ${inserted.id}`;
        expect(rows.length).toEqual(0);
      });
    });
  });

  describe("non-existent insight", () => {
    withDB((fixture) => {
      let response: ResponseMessage;

      beforeAll(() => {
        response = deleteInsight({ db: fixture.db, id: 9999 });
      });

      it("returns an error when no insight to delete", () => {
        expect(response.error).toBeDefined();
      });
    });
  });
});
