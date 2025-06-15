import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import React from "react";
import CalendarBooking from "@/components/CalendarBooking";
import InsuranceInfo from "@/components/InsuranceInfo";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero id="hero" />
      <About id="about" />
      <InsuranceInfo id="insurance" />
      <CalendarBooking id="calendar" />
      <div id="map" className="w-full max-w-2xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow border border-slate-200 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Office Location</h2>
        <p className="mb-2 text-center text-slate-700">
          <span className="font-semibold">Office address:</span> 100 South Ashley Drive, Suite 600, Tampa, FL 33602
        </p>
        <div className="w-full flex flex-col items-center mb-2">
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=100+South+Ashley+Drive,+Suite+600,+Tampa,+FL+33602&output=embed"
            width="100%"
            height="250"
            style={{ border: 0, borderRadius: '1rem' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-xl border w-full max-w-xl"
          ></iframe>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=100+South+Ashley+Drive,+Suite+600,+Tampa,+FL+33602"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-600 underline hover:text-blue-800"
          >
            Get Directions
          </a>
        </div>
        <div className="text-center text-slate-700">
          <span className="font-semibold">Business hours:</span> <br />
          Monday &amp; Tuesday: 9 AM–5 PM<br />
          Wednesday: 6 PM–10 PM<br />
          Thursday &amp; Friday: 9 AM–5 PM<br />
          Closed Saturday &amp; Sunday
        </div>
      </div>
      <Footer id="footer" />
    </div>
  );
}
