import { Insight } from "$models/insight.ts"; // use this to validate the data
import type { InsightType } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): InsightType | null => {
  console.log(`Looking up insight for id=${input.id}`);

  const [row] = input.db
    .sql<
    insightsTable.Row
  >`SELECT * FROM insights WHERE id = ${input.id} LIMIT 1`;

  if (!row) {
    console.log("Insight not found");
    return null; // I would change this to return null explicity - changed the return type to InsightType | null
  }

  //check type of the Row returned from the database // we were promising to return an Insight type but we wwre not checking if the row is valid
  const parsed = Insight.safeParse({
    ...row,
    createdAt: new Date(row.createdAt),
  });

  if (!parsed.success) {
    console.error("Invalid Insight from DB:", parsed.error.format());
    return null;
  }

  return parsed.data;
};
