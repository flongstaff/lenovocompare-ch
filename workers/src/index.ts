import { Hono } from "hono";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
};

interface PriceRow {
  id: string;
  laptop_id: string;
  retailer: string;
  price_chf: number;
  price_type: string | null;
  url: string | null;
  note: string | null;
  date_added: string;
  is_user_added: number;
  source: string;
}

const app = new Hono<{ Bindings: Bindings }>();

// CORS: allow GitHub Pages origin + localhost dev
// Per CONTEXT.md: Workers and static site are separate origins -- CORS headers required
app.use(
  "*",
  cors({
    origin: ["https://flongstaff.github.io", "http://localhost:3000"],
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400,
  }),
);

// Health check
app.get("/", (c) => c.json({ status: "ok", service: "lenovocompare-prices" }));

const MAX_LIMIT = 500;
const DEFAULT_LIMIT = 200;

const transformRow = (row: PriceRow) => ({
  id: row.id,
  laptopId: row.laptop_id,
  retailer: row.retailer,
  price: row.price_chf,
  url: row.url,
  dateAdded: row.date_added,
  isUserAdded: row.is_user_added === 1,
  priceType: row.price_type,
  note: row.note,
});

// GET /api/prices -- return paginated prices
app.get("/api/prices", async (c) => {
  try {
    const limit = Math.min(Number(c.req.query("limit")) || DEFAULT_LIMIT, MAX_LIMIT);
    const offset = Math.max(Number(c.req.query("offset")) || 0, 0);

    const { results } = await c.env.DB.prepare("SELECT * FROM prices ORDER BY date_added DESC LIMIT ? OFFSET ?")
      .bind(limit, offset)
      .all<PriceRow>();

    const prices = (results ?? []).map(transformRow);
    return c.json(prices);
  } catch (err) {
    console.error("[GET /api/prices] Error:", err);
    return c.json({ error: "Failed to fetch prices" }, 500);
  }
});

// GET /api/prices/:laptopId -- return prices for a specific model
app.get("/api/prices/:laptopId", async (c) => {
  const laptopId = c.req.param("laptopId");
  try {
    const { results } = await c.env.DB.prepare("SELECT * FROM prices WHERE laptop_id = ? ORDER BY date_added DESC")
      .bind(laptopId)
      .all<PriceRow>();

    const prices = (results ?? []).map(transformRow);

    return c.json(prices);
  } catch (err) {
    console.error(`[GET /api/prices/${laptopId}] Error:`, err);
    return c.json({ error: "Failed to fetch prices" }, 500);
  }
});

export default app;
