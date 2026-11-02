import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, sqlClient } from "./index";

migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => console.log("Migrations applied."))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => sqlClient.end());
