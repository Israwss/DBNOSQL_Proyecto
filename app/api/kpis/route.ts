import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const year = 2015;

    const [ingresoTotal, ingresoDiario, totalPizzas, precioPromedio] = await Promise.all([
      // Total ingresos anuales
      collection.aggregate([
        {
          $addFields: { year: { $year: { $toDate: "$order_date" } } }
        },
        { $match: { year } },
        { $group: { _id: null, total: { $sum: "$total_price" } } }
      ]).toArray(),

      // Ingreso promedio por día
      collection.aggregate([
        {
          $addFields: { day: { $dateToString: { format: "%Y-%m-%d", date: { $toDate: "$order_date" } } } }
        },
        { $match: { day: { $regex: `^${year}` } } },
        {
          $group: {
            _id: "$day",
            total: { $sum: "$total_price" }
          }
        },
        {
          $group: {
            _id: null,
            promedio: { $avg: "$total" }
          }
        }
      ]).toArray(),

      // Total pizzas vendidas
      collection.aggregate([
        {
          $addFields: { year: { $year: { $toDate: "$order_date" } } }
        },
        { $match: { year } },
        { $group: { _id: null, total: { $sum: "$quantity" } } }
      ]).toArray(),

      // Precio promedio por pizza
      collection.aggregate([
        {
          $addFields: { year: { $year: { $toDate: "$order_date" } } }
        },
        { $match: { year } },
        {
          $group: {
            _id: null,
            total_price: { $sum: "$total_price" },
            total_quantity: { $sum: "$quantity" }
          }
        },
        {
          $project: {
            promedio: {
              $cond: [
                { $eq: ["$total_quantity", 0] },
                0,
                { $divide: ["$total_price", "$total_quantity"] }
              ]
            }
          }
        }
      ]).toArray()
    ]);

    return NextResponse.json({
      ingresoAnual: ingresoTotal[0]?.total ?? 0,
      ingresoDiario: ingresoDiario[0]?.promedio ?? 0,
      pizzasVendidas: totalPizzas[0]?.total ?? 0,
      precioPromedio: precioPromedio[0]?.promedio ?? 0
    });
  } catch (error) {
    console.error("❌ Error en KPIs:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
