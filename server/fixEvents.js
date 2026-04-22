import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Event from './models/Event.js';

dotenv.config();

async function fixEvents() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Event.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'pending' } }
    );
    console.log(`Updated ${result.modifiedCount} events.`);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

fixEvents();
