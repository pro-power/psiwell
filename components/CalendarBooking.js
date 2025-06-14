"use client";
import { useEffect, useState } from "react";

export default function CalendarBooking({ id }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isReturningClient, setIsReturningClient] = useState(null);
  const [consultationType, setConsultationType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Business hours configuration
  const businessHours = {
    1: { start: 9, end: 17 }, // Monday
    2: { start: 9, end: 17 }, // Tuesday
    3: { start: 18, end: 22 }, // Wednesday
    4: { start: 9, end: 17 }, // Thursday
    5: { start: 9, end: 17 }, // Friday
    6: null, // Saturday - closed
    0: null, // Sunday - closed
  };

  const getFormattedDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  // Function to check if a date is valid for booking
  const isValidBookingDate = (date) => {
    const dayOfWeek = date.getDay();
    return businessHours[dayOfWeek] !== null;
  };

  // Function to get available time slots for a specific date
  const getAvailableTimeSlotsForDate = (date) => {
    const dayOfWeek = date.getDay();
    const hours = businessHours[dayOfWeek];
    
    if (!hours) return [];

    const slots = [];
    for (let hour = hours.start; hour < hours.end; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Function to format time for display (12-hour format)
  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    if (selectedDay) {
      fetchBookedTimeSlots();
    }
  }, [selectedDay]);

  useEffect(() => {
    if (selectedDay) {
      const date = new Date(currentYear, currentMonth, selectedDay);
      const availableSlots = getAvailableTimeSlotsForDate(date);
      setAvailableTimeSlots(availableSlots.filter(slot => !bookedTimeSlots.includes(slot)));
    }
  }, [selectedDay, bookedTimeSlots, currentYear, currentMonth]);

  useEffect(() => {
    // Set today's date as selected when component mounts
    const today = new Date();
    if (isValidBookingDate(today)) {
      setSelectedDay(today.getDate());
    }
  }, []);

  const fetchBookedTimeSlots = async () => {
    try {
      const response = await fetch("/api/fetch/timeslot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: getFormattedDate(selectedDay) }),
      });

      const data = await response.json();
      if (response.ok) {
        setBookedTimeSlots(data.data || []);
      } else {
        setBookedTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching booked time slots:", error);
      setBookedTimeSlots([]);
    }
  };

  const handleConfirm = async () => {
    if (!selectedDay || !selectedTime || !name || !email || !phone || isReturningClient === null || consultationType === null) {
      setMessage("All fields are required.");
      return;
    }

    const selectedDate = new Date(currentYear, currentMonth, selectedDay);
    if (!isValidBookingDate(selectedDate)) {
      setMessage("Selected date is not available for booking.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response_email = await fetch("/api/email/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: getFormattedDate(selectedDay),
          time: selectedTime,
          client: name,
          email,
          phone,
          isReturningClient,
          consultationType,
        }),
      });
      const response = await fetch("/api/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: getFormattedDate(selectedDay),
          time: selectedTime,
          client: name,
          email,
          phone,
          isReturningClient,
          consultationType,
        }),
      });

      const data = await response.json();
      if (response.ok && response_email.ok) {
        setMessage("Booking confirmed successfully!");
        fetchBookedTimeSlots();
      } else {
        setMessage(data.error || "Failed to book event.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const weekDays = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    // Convert Sunday (0) to Saturday (6) for our calendar
    return (firstDay + 1) % 7;
  };

  const getCurrentWeekDays = () => {
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [...weekDays];
    return [...days.slice(firstDay), ...days.slice(0, firstDay)];
  };

  const daysInMonth = Array.from(
    { length: getDaysInMonth(currentMonth, currentYear) },
    (_, i) => i + 1
  );

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setCurrentYear((prev) => (currentMonth === 0 ? prev - 1 : prev));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setCurrentYear((prev) => (currentMonth === 11 ? prev + 1 : prev));
  };

  return (
    <div id={id} className="min-h-screen py-20 ">
      <div className="flex flex-col md:flex-row max-w-5xl mx-4 lg:mx-auto my-32 border bg-white border-slate-200 rounded-md shadow-sm overflow-hidden">
        {/* LEFT PANEL: Meeting Info & User Input */}
        <div className="w-full md:w-1/3 p-6 bg-white">
          <h1 className="text-2xl font-semibold text-gray-900">
            Meet Jason Versace
          </h1>

          <p className="text-gray-600 mt-3">
            Schedule a meeting with Jason Versace to discuss your project, get
            advice, or just have a chat. Please fill in your details below to
            confirm your booking.
          </p>

          <div className="mt-6 space-y-4">
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Are you a returning client? *</p>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientStatus"
                    value="returning"
                    checked={isReturningClient === true}
                    onChange={() => setIsReturningClient(true)}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="clientStatus"
                    value="new"
                    checked={isReturningClient === false}
                    onChange={() => setIsReturningClient(false)}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 mb-2">Please select your preference: telehealth consultation or in-person visit. *</p>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="consultationType"
                    value="in-person"
                    checked={consultationType === "in-person"}
                    onChange={() => setConsultationType("in-person")}
                    className="mr-2"
                  />
                  In-person visit
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="consultationType"
                    value="telehealth"
                    checked={consultationType === "telehealth"}
                    onChange={() => setConsultationType("telehealth")}
                    className="mr-2"
                  />
                  Telehealth
                </label>
              </div>
            </div>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <input
              type="tel"
              placeholder="Your Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
            <button
              className="mt-4 w-full bg-slate-400 text-white p-2 rounded-md hover:bg-slate-500 transition hover:cursor-[url('/psi.png'),_pointer]"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
            {message && (
              <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}
          </div>
        </div>

        {/* MIDDLE PANEL: Calendar */}
        <div className="w-full md:w-1/3 p-6 border-x border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {new Date(currentYear, currentMonth).toLocaleString("default", {
                month: "long",
              })}{" "}
              {currentYear}
            </h3>
            <div className="flex space-x-2">
              <button
                className="px-2 py-1 bg-slate-50 rounded w-8 hover:bg-slate-100 transition"
                onClick={handlePrevMonth}
              >
                <i className="fa-solid fa-play fa-rotate-180 text-slate-300"></i>
              </button>
              <button
                className="px-2 py-1 bg-slate-50 rounded w-8 hover:bg-slate-100 transition"
                onClick={handleNextMonth}
              >
                <i className="fa-solid fa-play text-slate-300"></i>
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 mt-4 font-semibold text-slate-500">
            {getCurrentWeekDays().map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 mt-2">
            {daysInMonth.map((day) => {
              const date = new Date(currentYear, currentMonth, day);
              const isValid = isValidBookingDate(date);
              const isPast = date < new Date().setHours(0, 0, 0, 0);
              
              return (
                <div
                  key={day}
                  className={`flex items-center justify-center rounded h-10 w-10 transition ${
                    !isValid || isPast
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : selectedDay === day
                      ? "bg-slate-500 text-white cursor-pointer"
                      : "bg-white hover:bg-slate-50 cursor-pointer"
                  }`}
                  onClick={() => {
                    if (isValid && !isPast) {
                      setSelectedDay(day);
                      setSelectedTime(null);
                    }
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Time Slots */}
        <div className="w-full md:w-1/3 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Available Time Slots
          </h3>
          {selectedDay ? (
            <div className="grid grid-cols-1 gap-2">
              {availableTimeSlots.map((time) => (
                <button
                  key={time}
                  className={`p-2 rounded-md text-center transition ${
                    selectedTime === time
                      ? "bg-slate-500 text-white"
                      : "bg-white hover:bg-slate-50 border border-slate-200"
                  }`}
                  onClick={() => setSelectedTime(time)}
                >
                  {formatTimeDisplay(time)}
                </button>
              ))}
              {availableTimeSlots.length === 0 && (
                <p className="text-gray-500 text-center">
                  No available time slots for this day.
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center">
              Please select a date to view available time slots.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
