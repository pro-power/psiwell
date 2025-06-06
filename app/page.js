import Hero from "@/components/Hero";
import About from "@/components/About";
import Footer from "@/components/Footer";
import React from "react";
import CalendarBooking from "@/components/CalendarBooking";
import Rating from "@/components/Rating";
import InsuranceInfo from "@/components/InsuranceInfo";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Hero id="hero" />
      <About id="about" />
      <Rating id="rating" />
      <InsuranceInfo id="insurance" />
      <CalendarBooking id="calendar" />
      <Footer id="footer" />
    </div>
  );
}
