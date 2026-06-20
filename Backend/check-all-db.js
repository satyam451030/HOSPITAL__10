import 'dotenv/config';
import mongoose from 'mongoose';

async function main() {
  const uri = process.env.MONGO_URI;
  console.log("Connecting to:", uri);
  await mongoose.connect(uri);
  console.log("Connected.");
  
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  for (const col of collections) {
    const name = col.name;
    const count = await mongoose.connection.db.collection(name).countDocuments();
    console.log(`Collection: ${name}, Count: ${count}`);
    const samples = await mongoose.connection.db.collection(name).find({}).limit(3).toArray();
    console.log(`Sample data for ${name}:`, JSON.stringify(samples, null, 2));
  }
  
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
