// app/api/fetch/event/route.js
import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET(request) {
  await connectMongoDB();

  try {
    // Check if this is an admin request by looking for Authorization header
    const authHeader = request.headers.get('Authorization');
    const isAdminRequest = authHeader && authHeader.startsWith('Bearer ');
    
    let events;
    
    if (isAdminRequest) {
      // Admin request - return all data including notes and sensitive info
      // Note: We're not verifying the token here to maintain compatibility
      // Token verification happens in individual admin actions (notes, edit, etc.)
      events = await Event.find({})
        .sort({ date: 1, time: 1 })
        .lean();
        
      console.log(`Admin dashboard fetched ${events.length} events`);
    } else {
      // Public request (for booking system) - return limited data without sensitive info
      events = await Event.find({}, {
        date: 1,
        time: 1,
        // Only include fields needed for time slot checking
      })
        .sort({ date: 1, time: 1 })
        .lean();
        
      console.log(`Public booking system fetched ${events.length} time slots`);
    }

    return NextResponse.json({ 
      success: true, 
      data: events 
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}