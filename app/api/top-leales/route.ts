import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    const data = await collection
      .find({ customer_id: { $exists: true }, order_date: { $exists: true }, quantity: { $gt: 0 } })
      .toArray();

    const clientesMap = new Map<string, {
      pedidos: Set<string>;
      total_pizzas: number;
      gasto: number;
      primer: Date;
      ultimo: Date;
    }>();

    for (const row of data) {
      const id = row.customer_id;
      const date = new Date(row.order_date);
      const orderId = row.order_id;

      if (!clientesMap.has(id)) {
        clientesMap.set(id, {
          pedidos: new Set([orderId]),
          total_pizzas: row.quantity,
          gasto: row.total_price,
          primer: date,
          ultimo: date,
        });
      } else {
        const c = clientesMap.get(id)!;
        c.pedidos.add(orderId);
        c.total_pizzas += row.quantity;
        c.gasto += row.total_price;
        c.primer = c.primer > date ? date : c.primer;
        c.ultimo = c.ultimo < date ? date : c.ultimo;
      }
    }

    // Identificar clientes leales
    const leales = new Set<string>();
    for (const [id, c] of clientesMap.entries()) {
      const meses = Math.floor((c.ultimo.getTime() - c.primer.getTime()) / (1000 * 60 * 60 * 24 * 30));
      if (c.pedidos.size >= 5 && meses >= 2) {
        leales.add(id);
      }
    }

    // Calcular total pedidos por pizza
    const totales: Record<string, number> = {};
    const lealesTotales: Record<string, number> = {};

    for (const row of data) {
      const pizza = row.pizza_name;
      const cantidad = row.quantity;
      const cliente = row.customer_id;

      totales[pizza] = (totales[pizza] || 0) + cantidad;

      if (leales.has(cliente)) {
        lealesTotales[pizza] = (lealesTotales[pizza] || 0) + cantidad;
      }
    }

    // Calcular proporciones
    const comparativa = Object.entries(totales).map(([pizza, total]) => {
      const totalLeal = lealesTotales[pizza] || 0;
      return {
        pizza_name: pizza,
        proporcion_lealtad: totalLeal / total,
      };
    });

    const top10 = comparativa
      .sort((a, b) => b.proporcion_lealtad - a.proporcion_lealtad)
      .slice(0, 10);

    return NextResponse.json(top10);
  } catch (error: any) {
    console.error("❌ Error en /api/top-leales:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
