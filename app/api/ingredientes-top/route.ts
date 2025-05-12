import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

function parseCantidad(cantidad: string): number {
  return parseFloat(cantidad.replace('g', '')) || 0;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection
      .find({ pizza_ingredients: { $exists: true }, quantity: { $gt: 0 }, order_date: { $exists: true } })
      .toArray();

    const registros: {
      año: number;
      semana: number;
      ingrediente: string;
      cantidad_ingrediente: number;
      quantity: number;
    }[] = [];

    for (const row of data) {
      const ingredientesRaw = typeof row.pizza_ingredients === 'string'
        ? JSON.parse(row.pizza_ingredients)
        : row.pizza_ingredients;

      const orderDate = new Date(row.order_date);
      const week = parseInt(orderDate.toLocaleDateString('en-GB', { week: 'numeric' })); // fallback simple
      const year = orderDate.getFullYear();

      for (const ing in ingredientesRaw) {
        registros.push({
          año: year,
          semana: week,
          ingrediente: ing,
          cantidad_ingrediente: parseCantidad(ingredientesRaw[ing]),
          quantity: row.quantity,
        });
      }
    }

    // Calcular total usado por fila
    const usoPorIngrediente: Record<string, number[]> = {};

    for (const r of registros) {
      const total = r.cantidad_ingrediente * r.quantity;
      const key = `${r.año}-S${r.semana}-${r.ingrediente}`;
      if (!usoPorIngrediente[r.ingrediente]) usoPorIngrediente[r.ingrediente] = [];
      usoPorIngrediente[r.ingrediente].push(total);
    }

    // Promedio semanal por ingrediente
    const promedio = Object.entries(usoPorIngrediente).map(([ingrediente, usos]) => ({
      ingrediente,
      promedio_semanal_gramos: usos.reduce((a, b) => a + b, 0) / usos.length,
    }));

    const top10 = promedio
      .sort((a, b) => b.promedio_semanal_gramos - a.promedio_semanal_gramos)
      .slice(0, 10);

    return NextResponse.json(top10);
  } catch (error: any) {
    console.error("❌ Error en /api/ingredientes-top:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
