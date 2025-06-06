// app/api/email/confirm/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // 1. Parse the incoming data
    const { date, time, client, email, phone } = await request.json();

    // Format date and time for calendars
    const formattedDate = new Date(date);
    const [hours, minutes] = time.split(":");

    // Set start and end times (assuming 1 hour appointment)
    const startTime = new Date(formattedDate);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    // Format for Google Calendar URL
    const startTimeISO = startTime
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+/g, "");
    const endTimeISO = endTime
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d+/g, "");

    // Create Google Calendar link
    const eventDetails = {
      action: "TEMPLATE",
      text: `Appointment with ${client}`,
      dates: `${startTimeISO}/${endTimeISO}`,
      details: `Appointment with ${client}\nClient Email: ${email}\nClient Phone: ${phone}`,
      location: "Office Location",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?${Object.entries(
      eventDetails
    )
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")}`;

    // Create Apple Calendar link
    const appleCalendarUrl = `data:text/calendar;charset=utf-8,BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Company//Your Product//EN
BEGIN:VEVENT
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${endTime.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:Appointment with ${client}
DESCRIPTION:Appointment with ${client}\\nClient Email: ${email}\\nClient Phone: ${phone}
LOCATION:Office Location
END:VEVENT
END:VCALENDAR`;

    // 2. Create a Nodemailer transporter using your Gmail credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Send confirmation email to client
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Booking Confirmation",
      text: `Hello ${client},

Your booking has been confirmed on ${date} at ${time}.
We look forward to meeting you soon!

Add this appointment to your calendar:
Google Calendar: ${googleCalendarUrl}
Apple Calendar: ${appleCalendarUrl}

Regards,
Jason Versace`,
      html: `
        <p>Hello ${client},</p>
        <p>Your booking has been confirmed on <strong>${date}</strong> at <strong>${time}</strong>.</p>
        <p>We look forward to meeting you soon!</p>
        <div style="margin-top: 20px;">
          <p><strong>Add to your calendar:</strong></p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <a href="${googleCalendarUrl}" target="_blank" style="display: inline-block; background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Add to Google Calendar
            </a>
            <a href="${appleCalendarUrl}" target="_blank" style="display: inline-block; background-color: #000000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Add to Apple Calendar
            </a>
          </div>
        </div>
        <p>Regards,<br>Jason Versace</p>
      `,
    });

    // 4. Send notification email to therapist
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.THERAPIST_EMAIL,
      subject: "New Appointment Booking",
      text: `New appointment booked:

Client: ${client}
Date: ${date}
Time: ${time}
Email: ${email}
Phone: ${phone}

Add this appointment to your calendar:
Google Calendar: ${googleCalendarUrl}
Apple Calendar: ${appleCalendarUrl}`,
      html: `
        <p><strong>New appointment booked:</strong></p>
        <p>
          <strong>Client:</strong> ${client}<br>
          <strong>Date:</strong> ${date}<br>
          <strong>Time:</strong> ${time}<br>
          <strong>Email:</strong> ${email}<br>
          <strong>Phone:</strong> ${phone}
        </p>
        <div style="margin-top: 20px;">
          <p><strong>Add to your calendar:</strong></p>
          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <a href="${googleCalendarUrl}" target="_blank" style="display: inline-block; background-color: #4285F4; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Add to Google Calendar
            </a>
            <a href="${appleCalendarUrl}" target="_blank" style="display: inline-block; background-color: #000000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Add to Apple Calendar
            </a>
          </div>
        </div>
      `,
    });

    // 5. Return a success response
    return NextResponse.json(
      { message: "Booking created and emails sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);

    // 6. Return an error response
    return NextResponse.json(
      { error: "Failed to send confirmation emails." },
      { status: 500 }
    );
  }
}
