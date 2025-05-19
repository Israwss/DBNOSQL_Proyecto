// /api/top-pizzas/route.ts
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

    // Construir dinámicamente el $match
    const matchStage: Record<string, any> = {
      pizza_name: { $exists: true, $ne: null },
      quantity: { $type: "number", $gt: 0 }
    };

    if (pizza_category) {
      matchStage.pizza_category = pizza_category;
    }

    if (pizza_size) {
      matchStage.pizza_size = pizza_size;
    }

    const data = await collection.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$pizza_name",
          pizzasTotal: { $sum: "$quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          pizza_name: "$_id",
          pizzasTotal: 1
        }
      },
      { $sort: { pizzasTotal: -1 } },
      { $limit: 10 }
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en /api/top-pizzas:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
