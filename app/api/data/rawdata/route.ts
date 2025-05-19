// app/api/data/rawdata/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');

    const url = new URL(req.url);
    const start = url.searchParams.get('start');
    const end = url.searchParams.get('end');
    const mall = url.searchParams.get('mall');

    if (!start || !end) {
      return NextResponse.json({ error: 'Faltan parámetros start y end' }, { status: 400 });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Fechas inválidas' }, { status: 400 });
    }

    const match: any = {
      order_date: { $exists: true },
      order_time: { $exists: true },
      total_price: { $type: 'number', $gte: 0 },
      quantity: { $type: 'number', $gt: 0 },
      $expr: {
        $and: [
          {
            $gte: [
              { $toDate: { $concat: ["$order_date", "T", "$order_time"] } },
              startDate
            ]
          },
          {
            $lte: [
              { $toDate: { $concat: ["$order_date", "T", "$order_time"] } },
              endDate
            ]
          }
        ]
      }
    };

    if (mall && mall !== 'all') {
      match.mall = mall;
    }

    const pipeline = [
      { $match: match },
      {
        $addFields: {
          fullDate: { $toDate: { $concat: ["$order_date", "T", "$order_time"] } }
        }
      },
      {
        $addFields: {
          hour: { $hour: "$fullDate" }
        }
      },
      {
        $group: {
          _id: "$hour",
          ventas: { $sum: "$total_price" },
          pizzas: { $sum: "$quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          hour: "$_id",
          ventas: 1,
          pizzas: 1
        }
      },
      { $sort: { hour: 1 } }
    ];

    const data = await db.collection('menu').aggregate(pipeline).toArray();

    const malls = await db.collection('menu').distinct('mall');

    return NextResponse.json({ data, malls });
  } catch (error: any) {
    console.error('❌ Error en /api/data/rawdata:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
