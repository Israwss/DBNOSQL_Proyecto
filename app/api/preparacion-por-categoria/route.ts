import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection
      .find({ pizza_category: { $exists: true }, t_prep: { $exists: true } })
      .toArray();

    const agrupados: Record<string, number[]> = {};

    for (const row of data) {
      const categoria = row.pizza_category;
      const tprep = Number(row.t_prep);
      if (isNaN(tprep)) continue;

      if (!agrupados[categoria]) agrupados[categoria] = [];
      agrupados[categoria].push(tprep);
    }

    const resumen = Object.entries(agrupados).map(([categoria, tiempos]) => {
      const sorted = tiempos.sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median =
        sorted.length % 2 === 0
          ? (sorted[mid - 1] + sorted[mid]) / 2
          : sorted[mid];

      return {
        pizza_category: categoria,
        t_prep_median: median,
      };
    });

    return NextResponse.json(resumen);
  } catch (error: any) {
    console.error("❌ Error en /api/preparacion-por-categoria:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
