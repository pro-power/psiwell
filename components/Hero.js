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
          <p className="text-lg lg:text-xl mb-8">Your journey to wellness starts here.</p>
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
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative rounded-3xl overflow-hidden">
          <Image
            src="/stock.jpeg"
            alt="Driver in car"
            fill
            style={{ objectFit: "contain" }}
            priority
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
