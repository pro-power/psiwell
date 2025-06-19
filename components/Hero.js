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
    <section
      id={id}
      className="relative w-full min-h-screen flex items-center justify-center bg-white"
    >
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 lg:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          
          {/* Content Section */}
          <div className="text-center lg:text-left space-y-8 lg:pr-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-blue-800 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Licensed Mental Health Counselor
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                <span className="block">Psychotherapist</span>
                <span className="block text-blue-600">Jason Versace</span>
                <span className="block text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-600 mt-2">
                  LMHC, NCC
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className="space-y-3 text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
              <p className="font-medium text-gray-800">Your journey to wellness starts here.</p>
              <p>Professional counseling and therapeutic support for individuals, couples, and families.</p>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm">
              {['Addiction Counseling', 'Sex Therapy', 'CBT Specialist', 'Individual Therapy', 'Couples Therapy'].map((specialty) => (
                <span 
                  key={specialty}
                  className="px-3 py-1 bg-white/80 text-gray-700 rounded-full border border-gray-200 font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={scrollToCalendar}
                className="group px-6 py-3 bg-blue-600 text-white rounded-full text-base font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Schedule Appointment
                <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-white text-gray-800 rounded-full text-base font-semibold hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Licensed Professional
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Insurance Accepted
                </div>
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  Telehealth Available
                </div>
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative lg:pl-8 flex justify-center">
            <div className="relative w-[80vw] aspect-[3/4] md:w-[70vw] md:aspect-[3/4] lg:w-full lg:aspect-[3/4] lg:max-w-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/stock.jpeg"
                alt="Jason Versace - Professional Psychotherapist"
                fill
                className="object-cover object-top"
                priority
                sizes="(max-width: 640px) 80vw, (max-width: 768px) 70vw, (max-width: 1024px) 50vw, 500px"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}