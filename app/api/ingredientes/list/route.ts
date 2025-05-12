import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

function parseIngredientes(raw: any): Record<string, string> {
  if (typeof raw === "string") return JSON.parse(raw);
  return raw;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const data = await db.collection("menu").find({ pizza_ingredients: { $exists: true } }).project({ pizza_ingredients: 1 }).toArray();

    const ingredientes = new Set<string>();
    for (const row of data) {
      const parsed = parseIngredientes(row.pizza_ingredients);
      Object.keys(parsed).forEach((i) => ingredientes.add(i));
    }

    return NextResponse.json([...ingredientes].sort());
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

