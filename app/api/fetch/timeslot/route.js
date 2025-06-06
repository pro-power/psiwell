import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  await connectMongoDB(); // Ensure MongoDB connection

  try {
    const { date } = await req.json(); // Extract date from request body

    if (!date) {
      return NextResponse.json({ error: "Date is required." }, { status: 400 });
    }

    // Fetch all events for the given date
    const events = await Event.find({ date }).select("time -_id"); // Exclude `_id` for cleaner response

    // Log all events fetched
    console.log("Fetched Events:", events);

    // Extract time values
    const bookedTimeSlots = events.map((event) => event.time);

    return NextResponse.json(
      { success: true, data: bookedTimeSlots },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching booked time slots:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
