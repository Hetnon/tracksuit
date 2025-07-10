import { Insight } from "$models/insight.ts"; // use this to validate the data
import type { InsightType } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient;

export default (input: Input): InsightType[] => {
  console.log("Listing insights");

  const rows = input.db.sql<insightsTable.Row>`SELECT * FROM insights`;
  console.log("Rows fetched from DB:", rows.length);

  if (rows.length === 0) {
    console.warn("No insights found in the database.");
    return [];
  }

  const rowsConverted = rows.map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt),
  }));

  const parsed = Insight.array().safeParse(rowsConverted);
  if (!parsed.success) {
    console.error("Invalid Insight list from DB:", parsed.error.format());
    return [];
  }
  return parsed.data;
};
