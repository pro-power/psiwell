import { NextResponse } from "next/server";

import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(req) {
  await connectMongoDB(); // Ensure MongoDB is connected

  try {
    const requestBody = await req.json();
    console.log("Received Data:", requestBody); // Debugging log

    const { date, time, client, email, phone, isReturningClient, consultationType } = requestBody;

    if (!date || !time || !client || !email || !phone || isReturningClient === null || !consultationType) {
      console.error("Validation Error: Missing fields");
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const newEvent = new Event({
      date,
      time,
      client,
      email,
      phone,
      isReturningClient,
      consultationType,
    });

    await newEvent.save();
    console.log("Event Saved Successfully:", newEvent); // Debugging log

    return NextResponse.json(
      { success: true, data: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
