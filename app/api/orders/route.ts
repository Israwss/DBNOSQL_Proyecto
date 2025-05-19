import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '0');
    const pageSize = parseInt(searchParams.get('pageSize') || '8');

    const query = {
      order_details_id: { $exists: true },
      order_id: { $exists: true },
      pizza_id: { $exists: true },
      quantity: { $exists: true },
      order_date: { $exists: true },
      order_time: { $exists: true },
      unit_price: { $type: 'number' },
      total_price: { $type: 'number' },
      customer_id: { $exists: true },
      t_prep: { $type: 'number' }
    };

    const totalCount = await collection.countDocuments(query);

    const data = await collection
      .find(query)
      .project({
        _id: 0,
        order_details_id: 1,
        order_id: 1,
        pizza_id: 1,
        quantity: 1,
        order_date: 1,
        order_time: 1,
        unit_price: 1,
        total_price: 1,
        customer_id: 1,
        t_prep: 1
      })
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    const responseData = data.map((item, index) => ({
      id: page * pageSize + index + 1,
      ...item,
      unit_price: parseFloat(item.unit_price) || 0,
      total_price: parseFloat(item.total_price) || 0,
      t_prep: parseFloat(item.t_prep) || 0
    }));

    return NextResponse.json({ data: responseData, totalCount });
  } catch (error) {
    console.error('❌ Error en /api/orders:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
