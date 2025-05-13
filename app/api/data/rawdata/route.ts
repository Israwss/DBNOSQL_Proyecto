// app/api/rawdata/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongo';

export async function GET() {
  console.log("🔁 Entrando a handler GET");

  try {
    const client = await clientPromise;
    console.log("✅ Cliente conectado");

    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const data = await collection.find({}).toArray();
    console.log("📦 Datos obtenidos:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error en /api/rawdata:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
