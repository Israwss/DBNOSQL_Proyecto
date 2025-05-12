import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';

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
        $addFields: {
          date: { $toDate: "$order_date" }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          total: { $sum: "$quantity" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en la predicción de ventas:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
