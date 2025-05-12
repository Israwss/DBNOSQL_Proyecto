import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

// 🎲 Generador de números aleatorios con semilla
function crearGeneradorAleatorio(semillaInicial: number) {
  let semilla = semillaInicial;
  return function () {
    const x = Math.sin(semilla++) * 10000;
    return x - Math.floor(x);
  };
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("pizzaDB");
    const collection = db.collection("menu");

    // 📦 1. Obtener ventas diarias históricas
    const historico = await collection.aggregate([
      { $match: { order_date: { $exists: true } } },
      { $addFields: { date: { $toDate: "$order_date" } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: "$quantity" },
        },
      },
      { $sort: { "_id": 1 } },
    ]).toArray();

    // 📊 Parámetros para la predicción
    const dias = 60;
    const ultimos30 = historico.slice(-30).map(d => d.total);
    const base = ultimos30.reduce((a, b) => a + b, 0) / ultimos30.length;

    // ✅ Usar última fecha real como inicio
    const hoy = new Date(historico[historico.length - 1]._id);
    hoy.setDate(hoy.getDate() + 1);

    // 🎲 Generador determinista con semilla basada en la fecha base
    const semillaNumerica = hoy.getTime() % 100000;
    const aleatorio = crearGeneradorAleatorio(semillaNumerica);

    // 🔮 Simulación de predicción pseudo-ARIMA
    const prediccion = [];

    for (let i = 0; i < dias; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);

      const seno = Math.sin(i / 1.5) * 25;
      const ruido = (aleatorio() - 0.5) * 2 * 20;
      const pico = i % 15 === 0 ? (aleatorio() - 0.5) * 2 * 60 : 0;

      const valor = base + seno + ruido + pico;
      const min = valor - 35;
      const max = valor + 45;

      prediccion.push({
        date: fecha.toISOString().split("T")[0],
        mean: parseFloat(valor.toFixed(2)),
        min: parseFloat(min.toFixed(2)),
        max: parseFloat(max.toFixed(2)),
      });
    }

    return NextResponse.json(prediccion);
  } catch (error) {
    console.error("❌ Error al generar forecast:", error);
    return NextResponse.json({ error: "Error interno al generar predicción" }, { status: 500 });
  }
}
