// /api/top-ingredientes-preparacion/route.ts
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const pizza_category = url.searchParams.get("pizza_category");
    const pizza_size = url.searchParams.get("pizza_size");

    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const match: Record<string, any> = {
      pizza_ingredients: { $exists: true },
      t_prep: { $type: "number", $gte: 0 },
    };

    if (pizza_category) {
      match.pizza_category = { $regex: `^${pizza_category}$`, $options: "i" };
    }

    if (pizza_size) {
      match.pizza_size = { $regex: `^${pizza_size}$`, $options: "i" };
    }

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          ingredientsArray: { $objectToArray: "$pizza_ingredients" },
        },
      },
      { $unwind: "$ingredientsArray" },
      {
        $group: {
          _id: "$ingredientsArray.k",
          promedio_tiempo: { $avg: "$t_prep" },
        },
      },
      { $sort: { promedio_tiempo: -1 } },
      { $limit: 25 },
      {
        $project: {
          ingrediente: "$_id",
          promedio_tiempo: 1,
          _id: 0,
        },
      },
    ];

    const result = await collection.aggregate(pipeline).toArray();
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Error en /api/top-ingredientes-preparacion:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
