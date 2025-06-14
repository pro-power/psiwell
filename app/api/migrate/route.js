import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";

export async function GET() {
  await connectMongoDB();

  try {
    // Update all existing events that don't have the new fields
    const result = await Event.updateMany(
      {
        $or: [
          { isReturningClient: { $exists: false } },
          { consultationType: { $exists: false } }
        ]
      },
      {
        $set: {
          isReturningClient: false,
          consultationType: 'telehealth'
        }
      }
    );

    return NextResponse.json(
      { 
        success: true, 
        message: `Updated ${result.modifiedCount} events`,
        result 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error("Error migrating events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 