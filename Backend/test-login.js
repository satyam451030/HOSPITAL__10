import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Doctor from './models/Doctor.js';

// Let's directly test the logic from loginDoctor in doctorControllers.js
async function testDirectLogin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  const testEmail = "maya.patel@example.com";
  const testPassword = "Doctor123!";

  console.log(`Searching for email: ${testEmail}`);
  const doc = await Doctor.findOne({ email: testEmail.toLowerCase() }).select("+password");
  if (!doc) {
    console.log("FAIL: Doctor not found");
    await mongoose.disconnect();
    return;
  }

  console.log("Doctor found:", doc.email);
  console.log("Database password:", doc.password);
  console.log("Input password:", testPassword);
  console.log("Is database password equal to input password?", doc.password === testPassword);

  if (doc.password !== testPassword) {
    console.log("FAIL: Passwords do not match");
  } else {
    console.log("SUCCESS: Passwords match!");
  }

  await mongoose.disconnect();
}

testDirectLogin().catch(console.error);
