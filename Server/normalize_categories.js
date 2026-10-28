const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://TRENDSSHOP:z2ao1PhZy0lVdpfh@cluster0.0i3pjbq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function normalize() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('TrendsShop');
    const cats = await db.collection('categories').find().toArray();
    for (const cat of cats) {
      const department = cat.department || cat.gender || "MEN'S";
      const subcategories = (cat.subcategories || [])
        .map((s) => (typeof s === 'object' && s !== null ? s.name : String(s)))
        .filter(Boolean);

      await db.collection('categories').updateOne(
        { _id: cat._id },
        { $set: { department, gender: department, subcategories } }
      );
    }
    console.log('Categories normalized successfully, count:', cats.length);
  } finally {
    await client.close();
  }
}

normalize().catch(console.error);
