// app/api/branches/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');

    // Filtrar solo sucursales con coordenadas válidas
    const branches = await db.collection('menu').aggregate([
      {
        $match: {
          lat: { $exists: true, $ne: null },
          lon: { $exists: true, $ne: null },
          mall: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: '$mall',
          lat: { $first: '$lat' },
          lon: { $first: '$lon' },
        },
      },
      {
        $project: {
          _id: 0,
          mall: '$_id',
          lat: 1,
          lon: 1,
        },
      },
    ]).toArray();

    return NextResponse.json(branches);
  } catch (error) {
    console.error('❌ Error en /api/branches:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

