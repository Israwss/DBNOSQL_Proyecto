import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection.aggregate([
      // 1. Filtrar registros que tienen order_date
      {
        $match: {
          order_date: { $exists: true }
        }
      },
      // 2. Convertir order_date a tipo fecha (Date)
      {
        $addFields: {
          order_date_date: {
            $toDate: "$order_date"
          }
        }
      },
      // 3. Agrupar por día de la semana
      {
        $group: {
          _id: {
            $dayOfWeek: "$order_date_date" // 1 = Sunday, ..., 7 = Saturday
          },
          total: { $sum: "$quantity" }
        }
      },
      // 4. Ajustar para que Lunes = 0, ..., Domingo = 6
      {
        $addFields: {
          dayOfWeek: {
            $mod: [{ $add: ["$_id", 5] }, 7]
          }
        }
      },
      // 5. Proyección limpia
      {
        $project: {
          _id: 0,
          dayOfWeek: 1,
          total: 1
        }
      },
      // 6. Ordenar cronológicamente
      {
        $sort: { dayOfWeek: 1 }
      }
    ]).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
