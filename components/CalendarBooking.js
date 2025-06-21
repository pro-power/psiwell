"use client";
import { useEffect, useState } from "react";

export default function CalendarBooking({ id }) {
  const [currentStep, setCurrentStep] = useState(1);
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
    1: null, // Monday
    2: { start: 9, end: 17 }, // Tuesday
    3: { start: 18, end: 22 }, // Wednesday
    4: { start: 9, end: 17 }, // Thursday
    5: { start: 9, end: 17 }, // Friday
    6: { start: 10, end: 16 }, // Saturday
    0: null, // Sunday - closed
  };

  const steps = [
    { number: 1, title: "Select Date", description: "Choose your preferred date" },
    { number: 2, title: "Select Time", description: "Pick an available time slot" },
    { number: 3, title: "Your Details", description: "Fill in your information" },
    { number: 4, title: "Confirm", description: "Review and book" },
  ];

  const getFormattedDate = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toISOString().split("T")[0];
  };

  const isValidBookingDate = (date) => {
    const dayOfWeek = date.getDay();
    return businessHours[dayOfWeek] !== null;
  };

  const getAvailableTimeSlotsForDate = (date) => {
    const dayOfWeek = date.getDay();
    const hours = businessHours[dayOfWeek];

    if (!hours) return [];

    const slots = [];
    for (let hour = hours.start; hour < hours.end; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const formatTimeDisplay = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDateDisplay = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long", 
      day: "numeric",
    });
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
      setAvailableTimeSlots(
        availableSlots.filter((slot) => !bookedTimeSlots.includes(slot))
      );
    }
  }, [selectedDay, bookedTimeSlots, currentYear, currentMonth]);

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

  const handleDateSelect = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const isValid = isValidBookingDate(date);
    const isPast = date < new Date().setHours(0, 0, 0, 0);
    
    if (isValid && !isPast) {
      setSelectedDay(day);
      setSelectedTime(null);
      setTimeout(() => setCurrentStep(2), 300); // Delay for animation
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setTimeout(() => setCurrentStep(3), 300); // Delay for animation
  };

  const handleBackToCalendar = () => {
    setCurrentStep(1);
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const handleBackToTimeSlots = () => {
    setCurrentStep(2);
    setSelectedTime(null);
  };

  const handleConfirm = async () => {
    if (
      !selectedDay ||
      !selectedTime ||
      !name ||
      !email ||
      !phone ||
      isReturningClient === null ||
      consultationType === null
    ) {
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
      // First, try to book the appointment
      const bookingResponse = await fetch("/api/event", {
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

      const bookingData = await bookingResponse.json();
      
      if (bookingResponse.ok) {
        // Appointment booked successfully, now try to send email
        try {
          const emailResponse = await fetch("/api/email/confirm", {
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

          if (emailResponse.ok) {
            setMessage("success");
            setCurrentStep(4);
          } else {
            // Booking succeeded but email failed
            setMessage("success-no-email");
            setCurrentStep(4);
          }
        } catch (emailError) {
          console.error("Email error:", emailError);
          // Booking succeeded but email failed
          setMessage("success-no-email");
          setCurrentStep(4);
        }
        
        // Refresh available time slots
        fetchBookedTimeSlots();
      } else {
        // Booking failed
        setMessage(bookingData.error || "Failed to book appointment. Please try again or email us directly.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Failed to book appointment. Please try again or email us directly at jason@psiwellnessinc.com");
    }

    setLoading(false);
  };

  const resetBooking = () => {
    setSelectedDay(null);
    setSelectedTime(null);
    setName("");
    setEmail("");
    setPhone("");
    setIsReturningClient(null);
    setConsultationType(null);
    setMessage("");
    setCurrentStep(1);
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (month, year) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month, year) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = Array.from(
    { length: getDaysInMonth(currentMonth, currentYear) },
    (_, i) => i + 1
  );

  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <section id={id} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Schedule Your Appointment
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Book a consultation with Jason Versace. Choose between telehealth or in-person visits.
          </p>
        </div>

        {/* Progress Steps - Dynamic based on current step */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Current Step Indicator */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-semibold bg-blue-600 text-white shadow-lg">
                  {currentStep}
                </div>
                <div className="mt-2 text-center">
                  <div className="text-sm sm:text-base font-medium text-gray-900">
                    {steps[currentStep - 1]?.title}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                    {steps[currentStep - 1]?.description}
                  </div>
                </div>
              </div>

              {/* Progress Bar and Next Steps */}
              {currentStep < 4 && (
                <>
                  <div className="w-8 sm:w-16 h-1 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-200 text-gray-600">
                      {currentStep + 1}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm sm:text-base font-medium text-gray-600">
                        {steps[currentStep]?.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                        {steps[currentStep]?.description}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Final steps preview for step 1 & 2 */}
              {currentStep <= 2 && (
                <>
                  <div className="w-8 sm:w-16 h-1 bg-gray-200"></div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm font-semibold bg-gray-200 text-gray-600">
                      {currentStep + 2}
                    </div>
                    <div className="mt-2 text-center">
                      <div className="text-sm sm:text-base font-medium text-gray-600">
                        {steps[currentStep + 1]?.title}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                        {steps[currentStep + 1]?.description}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Booking Interface */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden min-h-[500px]">
          
          {/* Step 1: Calendar */}
          <div className={`transition-all duration-500 ease-in-out ${
            currentStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full absolute'
          }`}>
            {currentStep === 1 && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Select a Date
                  </h3>
                  <div className="flex items-center space-x-4">
                    <h4 className="text-xl font-semibold text-gray-700">
                      {monthNames[currentMonth]} {currentYear}
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={handlePrevMonth}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={handleNextMonth}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {weekDays.map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-semibold text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Empty cells for days before month starts */}
                  {emptyDays.map((_, index) => (
                    <div key={`empty-${index}`} className="p-3"></div>
                  ))}
                  
                  {/* Calendar days */}
                  {daysInMonth.map((day) => {
                    const date = new Date(currentYear, currentMonth, day);
                    const isValid = isValidBookingDate(date);
                    const isPast = date < new Date().setHours(0, 0, 0, 0);
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                      <button
                        key={day}
                        disabled={!isValid || isPast}
                        className={`p-3 text-center rounded-xl transition-all duration-200 hover:scale-105 ${
                          !isValid || isPast
                            ? "text-gray-300 cursor-not-allowed"
                            : isToday
                            ? "bg-blue-100 text-blue-600 hover:bg-blue-200 border-2 border-blue-300"
                            : "hover:bg-blue-50 text-gray-900 border border-gray-200 hover:border-blue-300"
                        }`}
                        onClick={() => handleDateSelect(day)}
                      >
                        <span className="text-sm font-medium">{day}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Business Hours Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Office Hours</h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <div>Monday: Closed</div>
                    <div>Tuesday: 9:00 AM - 5:30 PM</div>
                    <div>Wednesday: 6:00 PM - 10:00 PM</div>
                    <div>Thursday: 9:00 PM - 5:30 PM</div>
                    <div>Friday: 9:00 PM - 5:30 PM</div>
                    <div>Saturday: 10:00 PM - 4:00 PM</div>
                    <div>Sunday: Closed</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Time Slots */}
          <div className={`transition-all duration-500 ease-in-out ${
            currentStep === 2 ? 'opacity-100 translate-x-0' : currentStep > 2 ? 'opacity-0 -translate-x-full absolute' : 'opacity-0 translate-x-full absolute'
          }`}>
            {currentStep === 2 && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Select a Time
                  </h3>
                  <button
                    onClick={handleBackToCalendar}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Calendar
                  </button>
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium">Selected Date</div>
                  <div className="text-lg font-semibold text-blue-900">
                    {formatDateDisplay(selectedDay)}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl text-center transition-all duration-200 hover:scale-105 hover:shadow-md"
                    >
                      <div className="font-semibold text-gray-900">{formatTimeDisplay(time)}</div>
                      <div className="text-xs text-gray-500 mt-1">1 hour session</div>
                    </button>
                  ))}
                </div>

                {availableTimeSlots.length === 0 && (
                  <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-xl">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium">No available time slots</p>
                    <p className="text-sm mt-1">Please select a different date</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: User Information */}
          <div className={`transition-all duration-500 ease-in-out ${
            currentStep === 3 ? 'opacity-100 translate-x-0' : currentStep > 3 ? 'opacity-0 -translate-x-full absolute' : 'opacity-0 translate-x-full absolute'
          }`}>
            {currentStep === 3 && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Your Information
                  </h3>
                  <button
                    onClick={handleBackToTimeSlots}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Time Slots
                  </button>
                </div>

                {/* Appointment Summary */}
                <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-2">Appointment Summary</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div><strong>Date:</strong> {formatDateDisplay(selectedDay)}</div>
                    <div><strong>Time:</strong> {formatTimeDisplay(selectedTime)}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Client Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Are you a returning client? *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isReturningClient === true
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setIsReturningClient(true)}
                      >
                        <div className="font-medium">Yes</div>
                        <div className="text-sm text-gray-600">Returning Client</div>
                      </button>
                      <button
                        type="button"
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isReturningClient === false
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setIsReturningClient(false)}
                      >
                        <div className="font-medium">No</div>
                        <div className="text-sm text-gray-600">New Client</div>
                      </button>
                    </div>
                  </div>

                  {/* Consultation Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Consultation Preference *
                    </label>
                    <div className="space-y-3">
                      <button
                        type="button"
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          consultationType === "telehealth"
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setConsultationType("telehealth")}
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <div className="font-medium">Telehealth</div>
                            <div className="text-sm text-gray-600">Video consultation from home</div>
                          </div>
                        </div>
                      </button>
                      <button
                        type="button"
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          consultationType === "in-person"
                            ? "border-blue-600 bg-blue-50 text-blue-900"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setConsultationType("in-person")}
                      >
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          <div>
                            <div className="font-medium">In-Person</div>
                            <div className="text-sm text-gray-600">Visit our Tampa office</div>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleConfirm}
                    disabled={loading || !name || !email || !phone || isReturningClient === null || consultationType === null}
                    className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking Appointment...
                      </>
                    ) : (
                      "Confirm Appointment"
                    )}
                  </button>

                  {/* Error Message */}
                  {message && !message.includes("success") && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}

                  {message && !message.includes("Failed") && (
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Step 4: Confirmation */}
          <div className={`transition-all duration-500 ease-in-out ${
            currentStep === 4 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full absolute'
          }`}>
            {currentStep === 4 && (
              <div className="p-6 sm:p-8 text-center">
                <div className="max-w-md mx-auto">
                  {message === "success" ? (
                    <>
                      <div className="mb-8">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Appointment Booked Successfully!
                        </h3>
                        <p className="text-gray-600">
                          Your appointment has been confirmed. You will receive a confirmation email shortly with all the details.
                        </p>
                      </div>
                    </>
                  ) : message === "success-no-email" ? (
                    <>
                      <div className="mb-8">
                        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Appointment Booked!
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Your appointment has been successfully booked, but we couldn&rsquo;t send the confirmation email.
                        </p>
                        <div className="text-sm text-gray-700 bg-yellow-50 p-4 rounded-lg">
                          <p className="font-medium mb-2">Please contact us directly:</p>
                          <p>Email: <a href="mailto:jason@psiwellnessinc.com" className="text-blue-600 hover:underline">jason@psiwellnessinc.com</a></p>
                          <p>Phone: <a href="tel:8136474654" className="text-blue-600 hover:underline">(813) 647-4654</a></p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-8">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          Booking Failed
                        </h3>
                        <p className="text-gray-600 mb-4">
                          We couldn&rsquo;t process your appointment booking. Please try again or contact us directly.
                        </p>
                        <div className="text-sm text-gray-700 bg-red-50 p-4 rounded-lg">
                          <p className="font-medium mb-2">Please contact us:</p>
                          <p>Email: <a href="mailto:jason@psiwellnessinc.com" className="text-blue-600 hover:underline">jason@psiwellnessinc.com</a></p>
                          <p>Phone: <a href="tel:8136474654" className="text-blue-600 hover:underline">(813) 647-4654</a></p>
                        </div>
                      </div>
                    </>
                  )}

                  {(message === "success" || message === "success-no-email") && (
                    <>
                      <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                        <h4 className="font-semibold text-gray-900 mb-4">Appointment Details</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-medium">{formatDateDisplay(selectedDay)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-medium">{formatTimeDisplay(selectedTime)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium">
                              {consultationType === "in-person" ? "In-Person Visit" : "Telehealth Session"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Client:</span>
                            <span className="font-medium">{name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="font-medium text-blue-900 mb-1">What&rsquo;s Next?</p>
                        <p>
                          {message === "success" ? 
                            `Check your email for confirmation details and calendar invite. ${consultationType === "in-person" ? 
                              "Please arrive 5-10 minutes early for your in-person visit." : 
                              "You'll receive telehealth connection details in your confirmation email."
                            }` :
                            `We have your appointment details. ${consultationType === "in-person" ? 
                              "Please arrive 5-10 minutes early for your in-person visit." : 
                              "We'll provide telehealth connection details when you contact us."
                            }`
                          }
                        </p>
                      </div>
                    </>
                  )}

                  <button
                    onClick={resetBooking}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}