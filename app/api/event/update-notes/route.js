// app/api/event/update-notes/route.js
import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function POST(request) {
  await connectMongoDB();

  try {
    const { eventId, notes } = await request.json();

    console.log('Updating notes for event:', eventId);

    // Validate input
    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    // Sanitize notes (basic sanitization)
    const sanitizedNotes = typeof notes === 'string' ? notes.trim() : '';

    // Update only the notes field
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { 
        notes: sanitizedNotes,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    console.log('Notes updated successfully for event:', eventId);

    return NextResponse.json(
      { 
        success: true, 
        message: "Notes updated successfully",
        event: updatedEvent 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating notes:", error);
    
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: "Invalid event ID format" },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}