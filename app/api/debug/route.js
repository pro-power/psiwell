import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  await connectMongoDB();

  try {
    // Debug database connection
    console.log("Connected to database:", mongoose.connection.name);
    console.log("Database state:", mongoose.connection.readyState);
    
    // Count all documents
    const count = await Event.countDocuments();
    console.log("Total events in database:", count);
    
    // Get all events
    const events = await Event.find({}).limit(10);
    console.log("Events found:", events);
    
    // Check collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Available collections:", collections.map(c => c.name));

    return NextResponse.json({
      success: true,
      databaseName: mongoose.connection.name,
      databaseState: mongoose.connection.readyState,
      totalEvents: count,
      events: events,
      collections: collections.map(c => c.name)
    }, { status: 200 });
    
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json(
      { error: "Debug failed", details: error.message },
      { status: 500 }
    );
  }
}