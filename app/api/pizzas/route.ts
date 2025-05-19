import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    // Leer parámetros de paginación
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "8", 10);
    const skip = parseInt(req.nextUrl.searchParams.get("skip") || "0", 10);

    // Filtro opcional si quieres garantizar la existencia de campos clave
    const query = {
      pizza_id: { $exists: true },
      pizza_size: { $exists: true },
      pizza_category: { $exists: true },
      pizza_ingredients: { $exists: true },
      pizza_name: { $exists: true },
    };

    // Total de documentos que cumplen el filtro
    const total = await collection.countDocuments(query);

    // Obtener solo los datos necesarios con paginación
    const data = await collection
      .find(query)
      .project({
        _id: 0,
        pizza_id: 1,
        pizza_size: 1,
        pizza_category: 1,
        pizza_name: 1,
        pizza_ingredients: 1,
      })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Agregar ID autoincremental local (para DataGrid)
    const responseData = data.map((item, index) => ({
      id: skip + index + 1,
      ...item,
    }));

    return NextResponse.json({ data: responseData, total });
  } catch (error) {
    console.error('❌ Error en /api/pizzas:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
