import { initializeDatabase } from "./index";

async function run() {
  console.log("Starting database initialization...");
  try {
    await initializeDatabase();
    console.log("Success: Database schema has been applied to MySQL.");
  } catch (error) {
    console.error("Initialization failed:", error);
    process.exit(1);
  }
}

run();
