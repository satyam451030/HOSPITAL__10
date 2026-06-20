import 'dotenv/config';
import { connectDB } from './config/db.js';
import Doctor from './models/Doctor.js';
import Service from './models/Service.js';

const sampleDoctors = [
  {
    name: 'Dr. Maya Patel',
    email: 'maya.patel@example.com',
    password: 'Doctor123!',
    specialization: 'Cardiology',
    experience: '10 years',
    qualifications: 'MBBS, MD',
    location: 'Mumbai',
    about: 'Experienced cardiologist helping patients manage heart health.',
    fee: 1200,
    availability: 'Available',
    schedule: {
      '2026-06-10': ['09:00 AM', '10:30 AM', '02:00 PM'],
      '2026-06-11': ['11:00 AM', '01:00 PM', '03:30 PM'],
    },
    patients: '4500+',
    rating: 4.8,
    success: '98% patient satisfaction',
  },
  {
    name: 'Dr. Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'Doctor123!',
    specialization: 'Dermatology',
    experience: '8 years',
    qualifications: 'MBBS, DDV',
    location: 'Delhi',
    about: 'Dermatologist focused on skin, hair, and nail health.',
    fee: 900,
    availability: 'Available',
    schedule: {
      '2026-06-10': ['10:00 AM', '12:00 PM', '04:00 PM'],
      '2026-06-12': ['09:30 AM', '01:30 PM', '05:00 PM'],
    },
    patients: '3200+',
    rating: 4.6,
    success: 'Excellent care for skin conditions',
  },
];

const sampleServices = [
  {
    name: 'General Health Checkup',
    about: 'Complete health checkup package for adults.',
    shortDescription: 'Routine checkup with lab tests and consultation.',
    price: 799,
    available: true,
    slots: {
      '2026-06-10': ['10:00 AM', '11:30 AM', '02:00 PM'],
      '2026-06-11': ['09:00 AM', '12:00 PM', '03:00 PM'],
    },
    instructions: ['Fast for 8 hours before the appointment', 'Bring previous reports if any'],
  },
  {
    name: 'Skin Consultation',
    about: 'Consult with a specialist for acne, rashes, and other skin concerns.',
    shortDescription: 'Expert dermatology consultation with treatment guidance.',
    price: 599,
    available: true,
    slots: {
      '2026-06-10': ['11:00 AM', '01:00 PM', '04:00 PM'],
      '2026-06-12': ['10:30 AM', '02:30 PM', '05:30 PM'],
    },
    instructions: ['Avoid applying lotions before the appointment', 'Note any skin products you use regularly'],
  },
];

async function main() {
  await connectDB();

  const doctorCount = await Doctor.countDocuments();
  const serviceCount = await Service.countDocuments();

  if (doctorCount === 0) {
    await Doctor.insertMany(sampleDoctors);
    console.log(`Inserted ${sampleDoctors.length} sample doctors.`);
  } else {
    console.log(`Doctors already exist (${doctorCount}). Skipping doctor seeding.`);
  }

  if (serviceCount === 0) {
    await Service.insertMany(sampleServices);
    console.log(`Inserted ${sampleServices.length} sample services.`);
  } else {
    console.log(`Services already exist (${serviceCount}). Skipping service seeding.`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
