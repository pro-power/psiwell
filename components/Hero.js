"use client";
import React from "react";
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
    <div
      className="flex flex-col lg:flex-row items-center justify-center gap-14 px-4 pt-20 lg:pt-0 lg:px-[20%] w-full h-screen"
      id={id}
    >
      <div className=" lg:px-0 w-full md:w-[80%]">
        <h2 className="text-4xl lg:text-6xl font-bold mb-4 leading-10 lg:leading-[4rem]">
          Psychotherapist Jason Versace, LMHC, NCC
        </h2>
        <p className="text-lg lg:text-2xl max-w-[550px]">
          Your journey to wellness starts here.
        </p>
        <p className="text-lg lg:text-2xl max-w-[550px]">
          Professional counseling and support.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-start gap-4">
          <button
            onClick={scrollToCalendar}
            className="px-5 lg:px-6 py-2 lg:py-3 bg-slate-200 text-black rounded-full text-md lg:text-lg font-semibold hover:bg-slate-300 transition duration-300"
          >
            Set an appointment
          </button>
        </div>
      </div>

      <div className="relative w-full sm:w-[80%] md:w-[60%] lg:w-[50%] xl:w-[45%] h-[350px] sm:h-[400px] md:h-[500px] lg:h-[600px]">
        <Image
          src="/stock.jpeg"
          alt="Jason Versace Wellness"
          layout="fill"
          objectFit="cover"
          objectPosition="center top"
          className="rounded-2xl"
        />
      </div>
    </div>
  );
}
