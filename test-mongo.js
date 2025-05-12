const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://israel:123@yoshicluster.xhtic7n.mongodb.net/pizzaDB?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  tls: true,
  tlsInsecure: true // 👈 Esta opción es la clave en versiones modernas
});

async function run() {
  try {
    await client.connect();
    const db = client.db('pizzaDB');
    const collection = db.collection('menu');

    const count = await collection.countDocuments();
    console.log(`✅ Conexión exitosa. Documentos en 'menu': ${count}`);
  } catch (err) {
    console.error('❌ Error al conectar:', err);
  } finally {
    await client.close();
  }
}

run();
