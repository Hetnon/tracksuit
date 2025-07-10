import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export type ResponseMessage = {
  message?: string;
  error?: string;
};

export default (input: Input): ResponseMessage => {
  try {
    console.log(`Looking up insight for id=${input.id}`);
    input.db.sql`DELETE FROM insights WHERE id = ${input.id}`;
    if (input.db.changes === 0) {
      return { error: "404 - Insight not found to be deleted" };
    }

    return { message: "Insight deleted successfully" };
  } catch (error) {
    console.error("Error deleting insight:", error);
    return { error: "500 - Failed to delete insight" };
  }
};
