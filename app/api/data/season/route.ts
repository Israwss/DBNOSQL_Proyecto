import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');

    const pipeline = [
      {
        $match: {
          order_date: { $exists: true },
          total_price: { $type: 'number', $gte: 0 }
        }
      },
      {
        $addFields: {
          date: { $toDate: "$order_date" }
        }
      },
      {
        $match: {
          date: { $gte: new Date("2015-01-01") }
        }
      },
      {
        $project: {
          year: { $year: "$date" },
          quarter: {
            $add: [{ $floor: { $divide: [{ $month: "$date" }, 3] } }, 1]
          },
          total_price: 1
        }
      },
      {
        $group: {
          _id: {
            year: "$year",
            quarter: "$quarter"
          },
          total_sales: { $sum: "$total_price" }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.quarter": 1 }
      },
      {
        $project: {
          _id: 0,
          quarter: "$_id.quarter",
          year: "$_id.year",
          total_sales: 1
        }
      }
    ];

    const data = await db.collection('menu').aggregate(pipeline).toArray();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('❌ Error en /api/data/seasonal-sales:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
