import { describe, it, expect, beforeAll, afterAll } from "vitest";
import pg from "pg";
import { buildApp } from "../src/app.js";
import { migrateAndSeed } from "../src/db.js";

const databaseUrl = process.env.DATABASE_URL;
const describeDb = databaseUrl ? describe : describe.skip;

let pool;
let app;

describeDb("GET /api/menu (with database)", () => {
  beforeAll(async () => {
    pool = new pg.Pool({ connectionString: databaseUrl });
    await migrateAndSeed(pool);
    app = buildApp({ db: pool });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns menu items from the database", async () => {
    const response = await app.inject({ method: "GET", url: "/api/menu" });
    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(5);
    expect(body[0]).toMatchObject({
      id: 1,
      name: "Drohnen-Burger Deluxe",
      description: "Saftiger Burger, frisch per Drohne geliefert",
    });
    expect(parseFloat(body[0].price)).toBe(12.9);
  });

  it("returns items ordered by id", async () => {
    const response = await app.inject({ method: "GET", url: "/api/menu" });
    const body = response.json();
    const ids = body.map((item) => item.id);
    expect(ids).toEqual([1, 2, 3, 4, 5]);
  });
});
