import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

function parseIngredientes(raw: any): string[] {
  if (typeof raw === "string") {
    const parsed = JSON.parse(raw);
    return Object.keys(parsed);
  }
  return Object.keys(raw);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const ingrediente = url.searchParams.get("ingrediente");
    if (!ingrediente) {
      return NextResponse.json({ error: "Falta el parámetro 'ingrediente'" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection
      .find({ pizza_ingredients: { $exists: true }, total_price: { $exists: true } })
      .project({ pizza_ingredients: 1, total_price: 1 })
      .toArray();

    const registros: { ingredientes: string[]; precio: number }[] = data.map((row) => ({
      ingredientes: parseIngredientes(row.pizza_ingredients),
      precio: Number(row.total_price),
    }));

    const transacciones = registros.map((r) => r.ingredientes);
    const itemsetCounter = new Map<string, { count: number; items: string[] }>();

    // Contar combinaciones de 3 o más que incluyan el ingrediente
    for (const ingredientes of transacciones) {
      const set = new Set(ingredientes);
      if (!set.has(ingrediente)) continue;

      const combinaciones = Array.from(set).filter(i => i !== ingrediente);
      if (combinaciones.length < 2) continue;

      // Generar combinaciones de 2+ingrediente
      for (let i = 0; i < combinaciones.length; i++) {
        for (let j = i + 1; j < combinaciones.length; j++) {
          const combo = [ingrediente, combinaciones[i], combinaciones[j]].sort();
          const key = combo.join('|');
          if (!itemsetCounter.has(key)) {
            itemsetCounter.set(key, { count: 0, items: combo });
          }
          itemsetCounter.get(key)!.count += 1;
        }
      }
    }

    // Top 5 combinaciones más frecuentes
    const topCombinaciones = Array.from(itemsetCounter.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const combinacionResultados = topCombinaciones.map(({ items }) => {
      const itemset = new Set(items);
      const similares = registros.filter((r) => {
        const comunes = r.ingredientes.filter((i) => itemset.has(i));
        return comunes.length >= 2;
      });

      const promedio = similares.length > 0
        ? similares.reduce((acc, val) => acc + val.precio, 0) / similares.length
        : 0;

      return {
        itemset: items,
        support: similares.length / transacciones.length,
        promedio,
      };
    });

    return NextResponse.json(combinacionResultados);
  } catch (error: any) {
    console.error("❌ Error en /api/ingredientes/recomendaciones:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
