// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { ensureTable } from "./tables/insights.ts";

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
ensureTable(db)

console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights-list", (ctx) => {
  console.log("Received request to list insights");
  const result = listInsights({ db });

  // included a check for result to handle the case where no insights are found
  if (!result || !Array.isArray(result) || result.length === 0) {
    console.warn("No insights found in the database.");
    ctx.response.body = { message: "No insights found" };
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = result;
  ctx.response.status = 200; // there was a typo here, it should be ctx.response.status
});

router.get("/insights-get/:id", (ctx) => { // changed from insights to insights-get - it was ambiguous with the listInsights endpoint
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });

  // included a check for result to handle the case where the insight is not found
  if (!result) { 
    ctx.response.body = { message: "Insight not found" };
    ctx.response.status = 404;
    return;
  }

  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights-create", async (ctx) => { // get here is not appropriate for creating resources, should be POST
  const insightInstance = await ctx.request.body.json() as { brand: number; text: string };

  if (!insightInstance?.brand || !insightInstance?.text) {
    ctx.response.body = { message: "No data provided" };
    ctx.response.status = 400;
    return;
  }


  const response = createInsight({ db, insightInstance });
  if (response.error) {
    ctx.response.body = { message: response.error };
    ctx.response.status = 500;
    return;
  }
  ctx.response.body = { message: "Insight created successfully" };
  ctx.response.status = 200;
});

router.delete("/insights-delete/:id", (ctx) => { // get here is not appropriate for deleting resources, should be DELETE
  const insightId: number = Number(ctx.params.id);
  console.log("Received request to delete insight with ID:", insightId);
  if (!insightId) {
    ctx.response.body = { message: "No ID provided" };
    ctx.response.status = 400;
    return;
  }

  const response = deleteInsight({ db, id: insightId });
  if (response.error) {
    ctx.response.body = { message: response.error };
    ctx.response.status = response.error.includes("not found") ? 404 : 500;
    return;
  }
  ctx.response.status = 204;
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
