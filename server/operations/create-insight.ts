import { Insight } from "$models/insight.ts"; // changing this import from a type to an interface would be better - otherwise we can't use it to validate the data
import type { HasDBClient } from "../shared.ts";
import type * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  insightInstance: { brand: number; text: string };
};

type ResponseMessage = {
  message?: string;
  error?: string;
};

export default (input: Input): ResponseMessage => {
  console.log("Creating insight with data:");
  console.log(input.insightInstance.brand, input.insightInstance.text);

  if (
    !input.insightInstance?.brand ||
    typeof input.insightInstance.brand !== "number"
  ) {
    console.error("Invalid brand value");
    return { error: "Invalid brand value" };
  }

  if (
    !input.insightInstance?.text ||
    typeof input.insightInstance.text !== "string"
  ) {
    console.error("Invalid text value");
    return { error: "Invalid text value" };
  }

  const result = input.db
    .sql<
    insightsTable.Row
  >`INSERT INTO insights (brand, createdAt, text) VALUES (${input.insightInstance.brand}, ${
    new Date().toISOString()
  }, ${input.insightInstance.text}) RETURNING *`;

  // Check if the result is a valid Insight
  if (result.length > 0) {
    const row = result[0];
    const parsedResult = Insight.safeParse({
      ...row,
      createdAt: new Date(row.createdAt),
    });
    if (parsedResult.success) {
      console.log("Insight created successfully:");
      return { message: "Insight created successfully" };
    } else {
      console.error("Invalid Insight from DB:", parsedResult.error.format());
      return { error: "Invalid Insight from DB" };
    }
  }
  console.error("Failed to create insight");
  return { error: "Failed to create insight" };
};
