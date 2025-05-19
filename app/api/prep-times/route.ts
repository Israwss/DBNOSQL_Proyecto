// /api/prep-times/route.ts
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection
      .find({
        pizza_size: { $in: ['S', 'M', 'L', 'XL', 'XXL'] },
        t_prep: { $type: 'number', $gte: 0 },
      })
      .project({ pizza_size: 1, t_prep: 1, _id: 0 })
      .toArray();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ Error en /api/prep-times:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
