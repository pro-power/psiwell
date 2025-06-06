import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  await connectMongoDB();

  try {
    const events = await Event.find({})
      .sort({ date: 1, time: 1 }) // Sort by date and time
      .lean(); // Convert to plain JavaScript objects

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
