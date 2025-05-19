// /api/ingredientes/list/route.ts
import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");

    const ingredientes = await db.collection("menu").aggregate([
      { $match: { pizza_ingredients: { $exists: true } } },
      { $project: { ingredientsArray: { $objectToArray: "$pizza_ingredients" } } },
      { $unwind: "$ingredientsArray" },
      { $group: { _id: "$ingredientsArray.k" } },
      { $sort: { _id: 1 } }
    ]).toArray();

    return NextResponse.json(ingredientes.map((i) => i._id));
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

