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
      .find({ pizza_ingredients: { $exists: true }, t_prep: { $exists: true } })
      .project({ pizza_ingredients: 1, t_prep: 1 })
      .toArray();

    const tiempoPorIngrediente: Record<string, number[]> = {};

    for (const row of data) {
      const tPrep = Number(row.t_prep);
      if (isNaN(tPrep)) continue;

      const ingredientes = parseIngredientes(row.pizza_ingredients);
      for (const ing of Object.keys(ingredientes)) {
        if (!tiempoPorIngrediente[ing]) tiempoPorIngrediente[ing] = [];
        tiempoPorIngrediente[ing].push(tPrep);
      }
    }

    const promedio = Object.entries(tiempoPorIngrediente).map(([ingrediente, tiempos]) => ({
      ingrediente,
      promedio_tiempo: tiempos.reduce((a, b) => a + b, 0) / tiempos.length,
    }));

    const top25 = promedio
      .sort((a, b) => b.promedio_tiempo - a.promedio_tiempo)
      .slice(0, 25);

    return NextResponse.json(top25);
  } catch (error: any) {
    console.error("❌ Error en /api/top-ingredientes-preparacion:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
