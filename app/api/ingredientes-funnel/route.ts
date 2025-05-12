import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

function parseIngredientes(raw: any): Record<string, string> {
  if (typeof raw === 'string') return JSON.parse(raw);
  return raw;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection
      .find({ pizza_ingredients: { $exists: true }, total_price: { $exists: true } })
      .project({ pizza_ingredients: 1, total_price: 1 })
      .toArray();

    const ventas: Record<string, number> = {};

    for (const row of data) {
      const ingredientes = parseIngredientes(row.pizza_ingredients);
      for (const ing of Object.keys(ingredientes)) {
        if (!ventas[ing]) ventas[ing] = 0;
        ventas[ing] += row.total_price;
      }
    }

    const resumen = Object.entries(ventas).map(([ingrediente, valor]) => ({
      label: ingrediente,
      value: valor,
    }));

    const top = [...resumen]
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const bottom = [...resumen]
      .sort((a, b) => a.value - b.value)
      .slice(0, 10);

    return NextResponse.json({ top, bottom });
  } catch (error: any) {
    console.error("❌ Error en /api/ingredientes-funnel:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
