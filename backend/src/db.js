import pg from "pg";

const seedData = [
  { id: 1, name: "Drohnen-Burger Deluxe", price: 12.9, description: "Saftiger Burger, frisch per Drohne geliefert" },
  { id: 2, name: "Luftschmaus Bowl", price: 10.5, description: "Frische Poke Bowl mit Lachs und Avocado" },
  { id: 3, name: "Sky Pizza Margherita", price: 9.9, description: "Klassische Margherita aus dem Steinofen" },
  { id: 4, name: "Cloud Wrap", price: 8.5, description: "Knuspriger Wrap mit Hähnchen und Gemüse" },
  { id: 5, name: "Rotor-Ramen", price: 11.5, description: "Dampfende Miso-Ramen mit Chashu" },
];

function buildConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const host = process.env.POSTGRES_HOST || "localhost";
  const db = process.env.POSTGRES_DB || "luftschmaus";
  if (!user || !password) return null;
  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:5432/${db}`;
}

export async function connectDb() {
  const connectionString = buildConnectionString();
  if (!connectionString) return null;
  const pool = new pg.Pool({ connectionString });
  await pool.query("SELECT 1");
  return pool;
}

export async function migrateAndSeed(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS menu (
      id    SERIAL PRIMARY KEY,
      name  TEXT NOT NULL,
      price NUMERIC(6,2) NOT NULL,
      description TEXT NOT NULL
    )
  `);

  const { rows } = await pool.query("SELECT count(*)::int AS count FROM menu");
  if (rows[0].count === 0) {
    for (const item of seedData) {
      await pool.query(
        "INSERT INTO menu (id, name, price, description) VALUES ($1, $2, $3, $4)",
        [item.id, item.name, item.price, item.description]
      );
    }
  }
}
