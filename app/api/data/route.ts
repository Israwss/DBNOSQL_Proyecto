import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection.aggregate([
      {
        $match: {
          order_date: { $exists: true }
        }
      },
      {
        $group: {
          _id: {
            $dayOfWeek: { $toDate: "$order_date" } // 1=Sunday, 2=Monday, ..., 7=Saturday
          },
          total: { $sum: "$quantity" }
        }
      },
      {
        $project: {
          dayOfWeek: {
            $mod: [{ $add: ["$_id", 5] }, 7] // Convierte Sunday(1)→6, Monday(2)→0, ..., Saturday(7)→5
          },
          total: 1
        }
      },
      { $sort: { dayOfWeek: 1 } }
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
