// app/api/event/route.js
import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(request) {
  await connectMongoDB();

  try {
    const {
      date,
      time,
      client,
      email,
      phone,
      isReturningClient,
      consultationType,
      notes
    } = await request.json();

    console.log("Received Data:", {
      date,
      time,
      client,
      email,
      phone,
      isReturningClient,
      consultationType,
      notes: notes ? "Present" : "Not provided"
    });

    // Validate required fields
    if (!date || !time || !client || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: date, time, client, email, phone" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return NextResponse.json(
        { error: "Invalid time format. Use HH:MM" },
        { status: 400 }
      );
    }

    // Check if the appointment is in the past
    const appointmentDateTime = new Date(`${date}T${time}:00`);
    const now = new Date();
    
    if (appointmentDateTime < now) {
      return NextResponse.json(
        { error: "Cannot book appointments in the past" },
        { status: 400 }
      );
    }

    // Check if the time slot is already booked
    const existingEvent = await Event.findOne({ date, time });
    if (existingEvent) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please choose a different time." },
        { status: 409 }
      );
    }

    // Create new event with proper data sanitization
    const newEvent = new Event({
      date,
      time,
      client: client.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      isReturningClient: Boolean(isReturningClient),
      consultationType: consultationType || 'telehealth',
      notes: notes ? notes.trim() : ''
    });

    const savedEvent = await newEvent.save();
    console.log("Event Saved Successfully:", {
      id: savedEvent._id,
      client: savedEvent.client,
      date: savedEvent.date,
      time: savedEvent.time
    });

    return NextResponse.json(
      { 
        success: true, 
        message: "Appointment booked successfully",
        event: savedEvent 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: "Validation failed: " + validationErrors.join(', ') },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "This time slot is already booked" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}