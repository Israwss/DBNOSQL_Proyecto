
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection
      .find({ t_prep: { $exists: true }, pizza_size: { $exists: true } })
      .project({ pizza_size: 1, t_prep: 1, _id: 0 })
      .toArray();

    const cleaned = data
      .filter((d) => !isNaN(Number(d.t_prep)))
      .map((d) => ({
        pizza_size: d.pizza_size,
        t_prep: Number(d.t_prep),
      }));

    return NextResponse.json(cleaned);
  } catch (error: any) {
    console.error("❌ Error en /api/histograma-prep:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
