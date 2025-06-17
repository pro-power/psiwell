"use client";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/fetch/event", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents(data.data || []);
      } else {
        setError("Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const separateEvents = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const past = [];

    events.forEach((event) => {
      const eventDate = new Date(event.date);
      if (eventDate >= today) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    return { upcoming, past };
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Replace 'your-password-here' with your desired password
    if (password === "SandyMann2211") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleCancel = async (eventId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancelingId(eventId);
    try {
      const response = await fetch("/api/event/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      if (response.ok) {
        // Remove the canceled event from the list
        setEvents(events.filter((event) => event._id !== eventId));
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error canceling event:", error);
      setError("Something went wrong while canceling the booking");
    } finally {
      setCancelingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <form onSubmit={handleLogin} className="w-full max-w-md p-8">
          <h1 className="text-xl font-bold text-slate-400 mb-6 text-center">
            <i className="fa-solid fa-lock"></i>
          </h1>
          {error && (
            <div className="bg-red-100 text-red-600 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const { upcoming, past } = separateEvents();

  return (
    <div className="max-w-5xl mx-4 lg:mx-auto mt-20">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Booking Dashboard
      </h1>

      {error && (
        <div className="bg-red-100 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Upcoming Events
      </h2>
      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Client Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Consultation
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {upcoming.map((event, index) => (
                <tr key={index} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.client}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.isReturningClient
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {event.isReturningClient ? "Returning" : "New"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.consultationType === "in-person"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-orange-100 text-orange-800"
                      }`}
                    >
                      {event.consultationType === "in-person"
                        ? "In-person"
                        : "Telehealth"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <button
                      onClick={() => handleCancel(event._id)}
                      disabled={cancelingId === event._id}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        cancelingId === event._id
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      {cancelingId === event._id ? "Canceling..." : "Cancel"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Past Events</h2>
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {past.map((event, index) => (
                <tr key={index} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.time}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.client}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {event.phone}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
