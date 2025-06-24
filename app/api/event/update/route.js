// app/api/event/update/route.js
import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function PUT(request) {
  await connectMongoDB();

  try {
    const {
      eventId,
      client,
      email,
      phone,
      date,
      time,
      consultationType,
      isReturningClient,
      notes
    } = await request.json();

    console.log('Updating event:', eventId);

    // Validate required fields
    if (!eventId || !client || !email || !phone || !date || !time) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the new time slot conflicts with another appointment (excluding current one)
    if (date && time) {
      const conflictingEvent = await Event.findOne({ 
        date, 
        time, 
        _id: { $ne: eventId } 
      });
      
      if (conflictingEvent) {
        return NextResponse.json(
          { error: "This time slot is already booked by another appointment" },
          { status: 400 }
        );
      }
    }

    // Update the event in the database
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        client: client.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        date,
        time,
        consultationType: consultationType || 'telehealth',
        isReturningClient: isReturningClient || false,
        notes: notes || ''
      },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    console.log('Event updated successfully:', updatedEvent._id);

    return NextResponse.json(
      { 
        success: true, 
        message: "Event updated successfully",
        event: updatedEvent 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating event:", error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: "Validation error: " + error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}