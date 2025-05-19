import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pizza_category = url.searchParams.get("pizza_category");
    const pizza_size = url.searchParams.get("pizza_size");

    const client = await clientPromise;
    const db = client.db("pizzaDB");

    const match: Record<string, any> = {
      pizza_ingredients: { $exists: true },
      total_price: { $type: "number", $gte: 0 },
    };

    if (pizza_category) {
      match.pizza_category = { $regex: `^${pizza_category}$`, $options: 'i' };
    }

    if (pizza_size) {
      match.pizza_size = { $regex: `^${pizza_size}$`, $options: 'i' };
    }

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          ingredientes: { $objectToArray: "$pizza_ingredients" },
        },
      },
      { $unwind: "$ingredientes" },
      {
        $group: {
          _id: "$ingredientes.k",
          value: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0,
          label: "$_id",
          value: 1,
        },
      },
    ];

    const resumen = await db.collection("menu").aggregate(pipeline).toArray();

    const top = [...resumen].sort((a, b) => b.value - a.value).slice(0, 10);
    const bottom = [...resumen].sort((a, b) => a.value - b.value).slice(0, 10);

    return NextResponse.json({ top, bottom });
  } catch (error: any) {
    console.error("❌ Error en /api/ingredientes-funnel:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
