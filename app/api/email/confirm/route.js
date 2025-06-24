// app/api/email/confirm/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    // 1. Parse the incoming data
    const {
      date,
      time,
      client,
      email,
      phone,
      isReturningClient,
      consultationType,
    } = await request.json();

    // FIXED: Create date objects properly with timezone handling
    // Parse the date and time strings
    const [year, month, day] = date.split("-").map(Number);
    const [hours, minutes] = time.split(":").map(Number);

    // Create the appointment time in EST/EDT timezone
    // Using a more reliable method to handle timezones
    const appointmentDateTime = new Date();
    appointmentDateTime.setFullYear(year, month - 1, day);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    // Create end time (1 hour later)
    const endDateTime = new Date(appointmentDateTime);
    endDateTime.setHours(appointmentDateTime.getHours() + 1);

    // FIXED: Format for Google Calendar (need to convert to UTC for calendar links)
    // But preserve local time for display
    const formatForGoogleCalendar = (date) => {
      return date.toISOString().replace(/[-:]/g, "").replace(/\.\d+/g, "");
    };

    const startTimeISO = formatForGoogleCalendar(appointmentDateTime);
    const endTimeISO = formatForGoogleCalendar(endDateTime);

    // Create CLIENT Google Calendar link
    const clientEventDetails = {
      action: "TEMPLATE",
      text: `Appointment with Jason Versace`,
      dates: `${startTimeISO}/${endTimeISO}`,
      details: `Appointment with Jason Versace\nConsultation Type: ${
        consultationType === "in-person"
          ? "In-person visit"
          : "Telehealth consultation"
      }\nPhone: (813) 647-4654`,
      location:
        consultationType === "in-person"
          ? "100 S. Ashley Drive, Suite 600, Tampa, Florida 33602"
          : "Telehealth",
    };

    const clientGoogleCalendarUrl = `https://calendar.google.com/calendar/render?${Object.entries(
      clientEventDetails
    )
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")}`;

    // Create THERAPIST Google Calendar link
    const therapistEventDetails = {
      action: "TEMPLATE",
      text: `Appointment with ${client}`,
      dates: `${startTimeISO}/${endTimeISO}`,
      details: `Appointment with ${client}\nClient Email: ${email}\nClient Phone: ${phone}\nConsultation Type: ${
        consultationType === "in-person"
          ? "In-person visit"
          : "Telehealth consultation"
      }\nReturning Client: ${isReturningClient ? "Yes" : "No"}`,
      location:
        consultationType === "in-person"
          ? "100 S. Ashley Drive, Suite 600, Tampa, Florida 33602"
          : "Telehealth",
    };

    const therapistGoogleCalendarUrl = `https://calendar.google.com/calendar/render?${Object.entries(
      therapistEventDetails
    )
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&")}`;

    // FIXED: Format time and date for email display
    // Use the original time values directly since they're already in the correct timezone
    const formatTimeForEmail = (timeString) => {
      const [hours, minutes] = timeString.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${period}`;
    };

    const formatDateForEmail = (dateString) => {
      const [year, month, day] = dateString.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Use the formatted time and date
    const appointmentTimeEST = formatTimeForEmail(time);
    const appointmentDateEST = formatDateForEmail(date);

    // 2. Create a Nodemailer transporter using your custom domain email SMTP settings
    console.log('Environment variables check:', {
      SMTP_HOST: process.env.SMTP_HOST ? 'Set' : 'Missing',
      SMTP_PORT: process.env.SMTP_PORT || 'Using default 587',
      EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Missing',
      EMAIL_PASS: process.env.EMAIL_PASS ? 'Set' : 'Missing',
      THERAPIST_EMAIL: process.env.THERAPIST_EMAIL ? 'Set' : 'Missing'
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Send confirmation email to client
    console.log('Attempting to send client email to:', email);
    console.log('Formatted appointment time:', appointmentTimeEST);
    console.log('Formatted appointment date:', appointmentDateEST);
    
    try {
      await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Appointment Confirmation: ${appointmentDateEST} at ${appointmentTimeEST} EST`,
      text: isReturningClient
        ? `Hello ${client},

Your appointment has been confirmed for ${appointmentDateEST} at ${appointmentTimeEST} EST.
Consultation Type: ${
            consultationType === "in-person"
              ? "In-person visit"
              : "Telehealth consultation"
          }
${
  consultationType === "in-person"
    ? `
Location and Parking Information:
Our office is located at: 100 S. Ashley Drive, Suite 600, Tampa, Florida 33602
Parking is available on-site. Please arrive 5-10 minutes early to allow time for parking and check-in.

Directions: https://maps.google.com/?q=100+S.+Ashley+Drive,+Suite+600,+Tampa,+Florida+33602`
    : ""
}
We look forward to meeting you soon!

Add this appointment to your calendar:
Google Calendar: ${clientGoogleCalendarUrl}

Cancellation Policy:
Please note that appointments may be cancelled up to 2 hours before the scheduled time. Cancellations made less than 2 hours before the appointment will be subject to a cancellation fee. To cancel or reschedule, please call or text: tel:813-647-4654

Regards,
Jason Versace`
        : `Hello ${client},

Your appointment has been confirmed for ${appointmentDateEST} at ${appointmentTimeEST} EST.
Consultation Type: ${
            consultationType === "in-person"
              ? "In-person visit"
              : "Telehealth consultation"
          }
${
  consultationType === "in-person"
    ? `
Location and Parking Information:
Our office is located at: 100 S. Ashley Drive, Suite 600, Tampa, Florida 33602
Parking is available on-site. Please arrive 5-10 minutes early to allow time for parking and check-in.

Directions: https://maps.google.com/?q=100+S.+Ashley+Drive,+Suite+600,+Tampa,+Florida+33602`
    : ""
}
We look forward to meeting you soon!

As a new client, please review and complete the informed consent form attached to this email.

Add this appointment to your calendar:
Google Calendar: ${clientGoogleCalendarUrl}

Cancellation Policy:
Please note that appointments may be cancelled up to 2 hours before the scheduled time. Cancellations made less than 2 hours before the appointment will be subject to a cancellation fee. To cancel or reschedule, please call or text: tel:813-647-4654

Regards,
Jason Versace`,
      html: isReturningClient
        ? `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <p>Hello ${client},</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2563eb; margin-top: 0;">Appointment Confirmation</h2>
            <p style="font-size: 18px; margin-bottom: 10px;">
              <strong>Date:</strong> ${appointmentDateEST}<br>
              <strong>Time:</strong> ${appointmentTimeEST} EST<br>
              <strong>Consultation Type:</strong> ${
                consultationType === "in-person"
                  ? "In-person visit"
                  : "Telehealth consultation"
              }
            </p>
          </div>

          ${
            consultationType === "in-person"
              ? `
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0;">Location and Parking Information</h3>
            <p>Our office is located at: <a href="https://maps.google.com/?q=100+S.+Ashley+Drive,+Suite+600,+Tampa,+Florida+33602" style="color: #2563eb; text-decoration: underline;">100 S. Ashley Drive, Suite 600, Tampa, Florida 33602</a></p>
            <p>Parking is available on-site. Please arrive 5-10 minutes early to allow time for parking and check-in.</p>
          </div>`
              : ""
          }

          <p>We look forward to meeting you soon!</p>

          <div style="margin: 20px 0;">
            <a href="${clientGoogleCalendarUrl}" target="_blank" style="display: inline-block; background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Add to Google Calendar
            </a>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Cancellation Policy</h3>
            <p>Please note that appointments may be cancelled up to 2 hours before the scheduled time. Cancellations made less than 2 hours before the appointment will be subject to a cancellation fee. To cancel or reschedule, please call or text <a href="tel:8136474654" style="color: #2563eb; text-decoration: underline;">(813) 647-4654</a>.</p>
          </div>

          <p>Regards,<br>Jason Versace</p>
        </div>
      `
        : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <p>Hello ${client},</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #2563eb; margin-top: 0;">Appointment Confirmation</h2>
            <p style="font-size: 18px; margin-bottom: 10px;">
              <strong>Date:</strong> ${appointmentDateEST}<br>
              <strong>Time:</strong> ${appointmentTimeEST} EST<br>
              <strong>Consultation Type:</strong> ${
                consultationType === "in-person"
                  ? "In-person visit"
                  : "Telehealth consultation"
              }
            </p>
          </div>

          ${
            consultationType === "in-person"
              ? `
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-top: 0;">Location and Parking Information</h3>
            <p>Our office is located at: <a href="https://maps.google.com/?q=100+S.+Ashley+Drive,+Suite+600,+Tampa,+Florida+33602" style="color: #2563eb; text-decoration: underline;">100 S. Ashley Drive, Suite 600, Tampa, Florida 33602</a></p>
            <p>Parking is available on-site. Please arrive 5-10 minutes early to allow time for parking and check-in.</p>
          </div>`
              : ""
          }

          <p>We look forward to meeting you soon!</p>
          <p>As a new client, please review and complete the informed consent form attached to this email.</p>

          <div style="margin: 20px 0;">
            <a href="${clientGoogleCalendarUrl}" target="_blank" style="display: inline-block; background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Add to Google Calendar
            </a>
          </div>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Cancellation Policy</h3>
            <p>Please note that appointments may be cancelled up to 2 hours before the scheduled time. Cancellations made less than 2 hours before the appointment will be subject to a cancellation fee. To cancel or reschedule, please call or text <a href="tel:8136474654" style="color: #2563eb; text-decoration: underline;">(813) 647-4654</a>.</p>
          </div>

          <p>Regards,<br>Jason Versace</p>
        </div>
      `,
      attachments: isReturningClient
        ? []
        : [
            {
              filename: "informed-consent-form.pdf",
              path: "./public/documents/informed-consent-form.pdf",
            },
          ],
    });
    
    console.log('Client email sent successfully');
    } catch (clientEmailError) {
      console.error('Error sending client email:', clientEmailError);
      throw clientEmailError;
    }

    // 4. Send notification email to therapist
    console.log('Attempting to send therapist email to:', process.env.THERAPIST_EMAIL);
    
    try {
      await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.THERAPIST_EMAIL,
      subject: `New Appointment: ${client} on ${appointmentDateEST} at ${appointmentTimeEST} EST`,
      text: `New appointment booked:

Client: ${client}
Date: ${appointmentDateEST}
Time: ${appointmentTimeEST} EST
Email: ${email}
Phone: ${phone}
Consultation Type: ${
        consultationType === "in-person"
          ? "In-person visit"
          : "Telehealth consultation"
      }
Returning Client: ${isReturningClient ? "Yes" : "No"}

Add this appointment to your calendar:
Google Calendar: ${therapistGoogleCalendarUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">New Appointment Booked</h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;">
              <strong>Client:</strong> ${client}<br>
              <strong>Date:</strong> ${appointmentDateEST}<br>
              <strong>Time:</strong> ${appointmentTimeEST} EST<br>
              <strong>Email:</strong> ${email}<br>
              <strong>Phone:</strong> ${phone}<br>
              <strong>Consultation Type:</strong> ${
                consultationType === "in-person"
                  ? "In-person visit"
                  : "Telehealth consultation"
              }<br>
              <strong>Returning Client:</strong> ${isReturningClient ? "Yes" : "No"}
            </p>
          </div>

          <div style="margin: 20px 0;">
            <a href="${therapistGoogleCalendarUrl}" target="_blank" style="display: inline-block; background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Add to Google Calendar
            </a>
          </div>
        </div>
      `,
    });
    
    console.log('Therapist email sent successfully');
    } catch (therapistEmailError) {
      console.error('Error sending therapist email:', therapistEmailError);
      throw therapistEmailError;
    }

    // 5. Return a success response
    return NextResponse.json(
      { message: "Booking created and emails sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Full error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });

    // 6. Return an error response
    return NextResponse.json(
      { 
        error: "Failed to send confirmation emails.", 
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}