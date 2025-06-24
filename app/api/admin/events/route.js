// app/api/admin/events/route.js
import { NextResponse } from "next/server";
import Event from "@/lib/models/event";
import { connectMongoDB } from "@/lib/mongodb";
import { verifyAdminToken } from "@/lib/auth/middleware";

export async function GET(request) {
  // Verify admin authentication
  const authHeader = request.headers.get('Authorization');
  const verification = verifyAdminToken(authHeader);

  if (!verification.isValid) {
    return NextResponse.json(
      { error: "Unauthorized: " + verification.error },
      { status: 401 }
    );
  }

  await connectMongoDB();

  try {
    // Get query parameters for filtering/pagination
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit')) || 100;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const sortBy = url.searchParams.get('sortBy') || 'date';
    const sortOrder = url.searchParams.get('sortOrder') === 'desc' ? -1 : 1;
    const status = url.searchParams.get('status'); // upcoming, past, today
    const consultationType = url.searchParams.get('consultationType');
    const clientType = url.searchParams.get('clientType'); // new, returning

    // Build filter query
    let filter = {};
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (status === 'upcoming') {
      filter.date = { $gte: today.toISOString().split('T')[0] };
    } else if (status === 'past') {
      filter.date = { $lt: today.toISOString().split('T')[0] };
    } else if (status === 'today') {
      filter.date = today.toISOString().split('T')[0];
    }
    
    if (consultationType && ['in-person', 'telehealth'].includes(consultationType)) {
      filter.consultationType = consultationType;
    }
    
    if (clientType === 'new') {
      filter.isReturningClient = false;
    } else if (clientType === 'returning') {
      filter.isReturningClient = true;
    }

    // Build sort object
    const sort = {};
    if (sortBy === 'date') {
      sort.date = sortOrder;
      sort.time = sortOrder; // Secondary sort by time
    } else if (sortBy === 'client') {
      sort.client = sortOrder;
    } else if (sortBy === 'time') {
      sort.time = sortOrder;
    } else {
      sort.date = 1;
      sort.time = 1;
    }

    // Fetch events with pagination and filtering
    const events = await Event.find(filter)
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .lean();

    // Get total count for pagination
    const totalCount = await Event.countDocuments(filter);

    console.log(`Admin fetched ${events.length}/${totalCount} events with filters:`, {
      filter,
      sort,
      limit,
      offset,
      adminIP: verification.adminData.ip
    });

    return NextResponse.json({ 
      success: true, 
      data: events,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + events.length < totalCount
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching admin events:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}