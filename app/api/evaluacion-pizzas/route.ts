import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const pipeline = [
      {
        $match: {
          pizza_name: { $exists: true },
          order_date: { $exists: true },
          quantity: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$pizza_name",
          total_unidades: { $sum: "$quantity" },
          total_ordenes: { $sum: 1 },
          ingreso_total: { $sum: "$total_price" },
          precio_promedio: { $avg: "$unit_price" },
          primer_pedido: { $min: { $toDate: "$order_date" } },
          ultimo_pedido: { $max: { $toDate: "$order_date" } },
        },
      },
      {
        $addFields: {
          dias_activa: {
            $add: [
              {
                $divide: [
                  { $subtract: ["$ultimo_pedido", "$primer_pedido"] },
                  1000 * 60 * 60 * 24, // ms → días
                ],
              },
              1,
            ],
          },
        },
      },
      {
        $addFields: {
          ventas_por_dia: {
            $cond: [
              { $eq: ["$dias_activa", 0] },
              "$total_unidades",
              { $divide: ["$total_unidades", "$dias_activa"] },
            ],
          },
        },
      },
    ];

    const baseData = await collection.aggregate(pipeline).toArray();

    // Mediana del precio promedio para clasificar
    const precios = baseData.map((p) => p.precio_promedio).sort((a, b) => a - b);
    const mid = Math.floor(precios.length / 2);
    const mediana =
      precios.length % 2 === 0 ? (precios[mid - 1] + precios[mid]) / 2 : precios[mid];

    // Clasificación de estrategia
    const evaluacion = baseData.map((row) => {
      let estrategia = 'Mantener';
      if (row.ventas_por_dia < 3 && row.precio_promedio > mediana) {
        estrategia = 'Ajustar precio';
      } else if (row.ventas_por_dia < 3) {
        estrategia = 'Descontinuar';
      } else if (row.ventas_por_dia >= 4 && row.ventas_por_dia <= 6) {
        estrategia = 'Promocionar';
      }

      return {
        pizza_name: row._id,
        total_unidades: row.total_unidades,
        precio_promedio: parseFloat(row.precio_promedio.toFixed(2)),
        estrategia,
      };
    });

    return NextResponse.json(evaluacion);
  } catch (error: any) {
    console.error("❌ Error en /api/evaluacion-pizzas:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
