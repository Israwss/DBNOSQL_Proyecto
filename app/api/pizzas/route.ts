import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const data = await collection
      .find({
        pizza_id: { $exists: true },
        pizza_size: { $exists: true },
        pizza_category: { $exists: true },
        pizza_ingredients: { $exists: true },
        pizza_name: { $exists: true },
      })
      .project({
        _id: 0,
        pizza_id: 1,
        pizza_size: 1,
        pizza_category: 1,
        pizza_ingredients: 1,
        pizza_name: 1,
      })
      .toArray();

    // Agregar ID autoincremental para DataGrid
    const responseData = data.map((item, index) => ({
      id: index + 1,
      ...item,
    }));

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Error en /api/pizzas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
