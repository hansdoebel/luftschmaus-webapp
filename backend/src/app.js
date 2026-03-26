import Fastify from "fastify";
import { collectDefaultMetrics, register } from "prom-client";

collectDefaultMetrics();

const fallbackMenu = [
  { id: 1, name: "Drohnen-Burger Deluxe", price: 12.9, description: "Saftiger Burger, frisch per Drohne geliefert" },
  { id: 2, name: "Luftschmaus Bowl", price: 10.5, description: "Frische Poke Bowl mit Lachs und Avocado" },
  { id: 3, name: "Sky Pizza Margherita", price: 9.9, description: "Klassische Margherita aus dem Steinofen" },
  { id: 4, name: "Cloud Wrap", price: 8.5, description: "Knuspriger Wrap mit Hähnchen und Gemüse" },
  { id: 5, name: "Rotor-Ramen", price: 11.5, description: "Dampfende Miso-Ramen mit Chashu" },
];

export function buildApp({ db } = {}) {
  const fastify = Fastify({ logger: false });

  if (db) {
    fastify.decorate("db", db);
    fastify.addHook("onClose", () => db.end());
  }

  fastify.get("/health", async () => ({ status: "ok" }));

  fastify.get("/api/menu", async () => {
    if (fastify.db) {
      const { rows } = await fastify.db.query(
        "SELECT id, name, price, description FROM menu ORDER BY id"
      );
      return rows;
    }
    return fallbackMenu;
  });

  fastify.get("/metrics", async (request, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });

  return fastify;
}
