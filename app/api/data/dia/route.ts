// app/api/data/por-dia-semana/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');

    const pipeline = [
      {
        $match: {
          order_date: { $exists: true },
          total_price: { $type: 'number', $gte: 0 },
          quantity: { $type: 'number', $gt: 0 }
        }
      },
      {
        $addFields: {
          dayOfWeek: {
            $mod: [
              { $add: [{ $dayOfWeek: { $toDate: "$order_date" } }, 5] },
              7
            ]
          }
        }
      },
      {
        $group: {
          _id: "$dayOfWeek",
          ventas: { $sum: "$total_price" },
          pizzas: { $sum: "$quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          ventas: 1,
          pizzas: 1
        }
      },
      { $sort: { day: 1 } }
    ];

    const result = await db.collection('menu').aggregate(pipeline).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("❌ Error en /api/data/por-dia-semana:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
