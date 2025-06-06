"use client";
import Link from "next/link";
import Image from "next/image";

export default function Hero({ id }) {
  const scrollToCalendar = () => {
    const calendarSection = document.getElementById("calendar");
    if (calendarSection) {
      calendarSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full">
      <div
        id={id}
        className="min-h-screen w-[90%] lg:w-[70%] flex flex-col lg:flex-row items-center justify-center mx-auto mb-16"
      >
        {/* Left Section */}
        <div className="w-full lg:w-1/2 px-6 lg:pl-20 text-center lg:text-left mb-8 lg:mb-0">
          <h1 className="text-4xl lg:text-6xl font-medium mb-6">Jason Versace</h1>
          <p className="text-lg lg:text-xl mb-2">Simple, affordable, memorable</p>
          <p className="text-lg lg:text-xl mb-8">No cancellations. No waiting.</p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              onClick={scrollToCalendar}
              className="w-full sm:w-auto bg-slate-400 hover:bg-slate-500 transition px-10 py-5 rounded-full font-bold text-center cursor-pointer text-white text-2xl shadow-lg"
            >
              Set an appointment
            </button>
            <div className="w-full sm:w-auto flex flex-col items-center sm:items-start gap-1 text-slate-700 font-medium text-center lg:text-left">
              <span className="underline">Have questions? Contact us</span>
              <a href="tel:2174172073" className="hover:text-slate-900 underline">(217) 417-2073</a>
              <a href="mailto:jasonversace1969@gmail.com" className="hover:text-slate-900 underline">jasonversace1969@gmail.com</a>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 h-[300px] lg:h-[500px] relative">
          <Image
            src="/stock.jpeg"
            alt="Driver in car"
            fill
            style={{ objectFit: "contain" }}
            priority
            className="rounded-2xl"
          />
        </div>
      </div>
      {/* Location Info Block */}
      <div className="w-full max-w-2xl mx-auto mb-8 p-6 bg-white rounded-2xl shadow border border-slate-200 flex flex-col items-center">
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
    </div>
  );
}
