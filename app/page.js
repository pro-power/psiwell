import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import Map from "@/components/Map";
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
      <Map id="map" />
      <Footer id="footer" />
    </div>
  );
}
