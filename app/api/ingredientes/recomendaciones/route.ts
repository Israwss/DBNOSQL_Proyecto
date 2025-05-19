// /api/ingredientes/recomendaciones/route.ts
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

function parseIngredientes(raw: any): string[] {
  if (typeof raw === "string") return Object.keys(JSON.parse(raw));
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
    const docs = await db.collection("menu").find({
      pizza_ingredients: { $exists: true },
      total_price: { $type: "number", $gte: 0 },
    }).project({ pizza_ingredients: 1, total_price: 1 }).toArray();

    const transacciones: { ingredientes: string[]; precio: number }[] = [];

    for (const doc of docs) {
      const ingredientes = parseIngredientes(doc.pizza_ingredients);
      if (ingredientes.length < 3 || !ingredientes.includes(ingrediente)) continue;

      transacciones.push({ ingredientes, precio: Number(doc.total_price) });
    }

    const contador = new Map<string, { items: string[]; count: number; total: number }>();

    for (const { ingredientes, precio } of transacciones) {
      const otros = ingredientes.filter((i) => i !== ingrediente);
      for (let i = 0; i < otros.length; i++) {
        for (let j = i + 1; j < otros.length; j++) {
          const combinacion = [ingrediente, otros[i], otros[j]].sort();
          const clave = combinacion.join("|");
          if (!contador.has(clave)) {
            contador.set(clave, { items: combinacion, count: 0, total: 0 });
          }
          const entry = contador.get(clave)!;
          entry.count += 1;
          entry.total += precio;
        }
      }
    }

    const top = Array.from(contador.values())
      .filter((c) => c.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((c) => ({
        itemset: c.items,
        promedio: c.total / c.count,
        support: c.count / transacciones.length,
      }));

    return NextResponse.json(top);
  } catch (error: any) {
    console.error("❌ Error en recomendaciones:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
