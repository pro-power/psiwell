import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Event from "@/lib/models/event";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Delete the event using the Event model
    const result = await Event.deleteOne({ _id: new ObjectId(eventId) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Event canceled successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error canceling event:", error);
    return NextResponse.json(
      { error: "Failed to cancel event" },
      { status: 500 }
    );
  }
} 