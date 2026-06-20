import 'dotenv/config';
import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  email: String,
  password: { type: String, select: true }
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

async function main() {
  const uri = process.env.MONGO_URI;
  console.log("Connecting to:", uri);
  await mongoose.connect(uri);
  console.log("Connected.");
  const docs = await Doctor.find({}).select("+password");
  console.log(`Found ${docs.length} doctors.`);
  for (const doc of docs) {
    console.log(`Email: ${doc.email}`);
    console.log(`Password length: ${doc.password ? doc.password.length : 0}`);
    console.log(`Password preview: ${doc.password ? doc.password.substring(0, 10) : 'none'}`);
    console.log(`Password full: ${doc.password}`);
  }
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
