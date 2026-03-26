import { buildApp } from "./app.js";
import { connectDb, migrateAndSeed } from "./db.js";

const start = async () => {
  let db;
  try {
    db = await connectDb();
    if (db) {
      await migrateAndSeed(db);
      console.log("database connected and migrated");
    }
  } catch (err) {
    console.warn("database not reachable, continuing without db:", err.message);
    db = undefined;
  }

  const fastify = buildApp({ db });
  await fastify.listen({ port: 3000, host: "0.0.0.0" });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => fastify.close().then(() => process.exit(0)));
  }
};

start();
