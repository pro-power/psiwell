"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { 
  Calendar, Clock, User, Phone, Mail, MapPin, Video, Edit, Trash2, 
  Search, Filter, Plus, Download, Eye, LogOut, BarChart3, Users,
  CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight,
  Settings, Loader2, Check, X, FileText, TrendingUp, Activity,
  Bell, Home, UserCheck, Calendar as CalendarIcon, Stethoscope
} from "lucide-react";

export default function EnhancedDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Data state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState("");

  // UI state
  const [view, setView] = useState("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("overview");

  // Modal state
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [appointmentNotes, setAppointmentNotes] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    client: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    consultationType: 'in-person',
    isReturningClient: false,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Business hours configuration
  const businessHours = {
    0: null, // Sunday - closed
    1: null, // Monday - closed
    2: { start: '09:00', end: '17:30' }, // Tuesday 9:00 AM - 5:30 PM
    3: { start: '18:00', end: '22:00' }, // Wednesday 6:00 PM - 10:00 PM
    4: { start: '09:00', end: '17:30' }, // Thursday 9:00 AM - 5:30 PM
    5: { start: '09:00', end: '17:30' }, // Friday 9:00 AM - 5:30 PM
    6: { start: '10:00', end: '16:00' }, // Saturday 10:00 AM - 4:00 PM 
  };


  const parseLocalDate = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateString) => {
    return parseLocalDate(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getAvailableTimeSlotsForDate = (date) => {
    // Parse date correctly to avoid timezone issues
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const dayOfWeek = localDate.getDay();
    
    const hours = businessHours[dayOfWeek];
    
    if (!hours || hours === null) {
      return [];
    }
  
    const slots = [];
    
    try {
      const [startHour, startMinute] = hours.start.split(':').map(Number);
      const [endHour, endMinute] = hours.end.split(':').map(Number);
      
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      
      for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 60) {
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeSlot);
      }
      
      return slots;
    } catch (error) {
      console.error('Error generating time slots:', error);
      return [];
    }
  };
  

  const isValidBookingDate = (date) => {
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    const dayOfWeek = localDate.getDay();
    const hours = businessHours[dayOfWeek];
    return hours !== null && hours !== undefined;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_token_expiry');
    setAuthToken(null);
    setIsAuthenticated(false);
    setEvents([]);
    setSelectedItems(new Set());
    setActiveTab('overview');
    setCurrentPage(1);
    setError('');
  };


  const fetchEvents = useCallback(async () => {
    try {
      const response = await fetch("/api/fetch/event", {
        method: "GET",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
      });

      const data = await response.json();
      if (response.ok) {
        setEvents(data.data || []);
        setError("");
      } else {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
          return;
        }
        setError("Failed to fetch events: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setError("Something went wrong while fetching events");
    } finally {
      setLoading(false);
    }
  }, [authToken]); // Add authToken dependency

  const calculateStats = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    
    const monthFromNow = new Date(today);
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const newStats = {
      total: events.length,
      upcoming: events.filter(e => new Date(e.date) >= today).length,
      today: events.filter(e => new Date(e.date).toDateString() === today.toDateString()).length,
      thisWeek: events.filter(e => {
        const eventDate = parseLocalDate(e.date);
        return eventDate >= today && eventDate < weekFromNow;
      }).length,
      thisMonth: events.filter(e => {
        const eventDate = parseLocalDate(e.date);
        return eventDate >= today && eventDate < monthFromNow;
      }).length,
      newClients: events.filter(e => !e.isReturningClient).length,
      returningClients: events.filter(e => e.isReturningClient).length,
      completedThisMonth: events.filter(e => {
        const eventDate = parseLocalDate(e.date);
        return eventDate >= startOfMonth && eventDate < today;
      }).length,
      revenue: events.length * 150,
      averagePerDay: events.length > 0 ? (events.length / 30).toFixed(1) : 0
    };

    setStats(newStats);
  }, [events]); // Add events dependency
  
  
  const fetchAvailableTimeSlots = useCallback(async (selectedDate, excludeEventId = null) => {
    setLoadingTimeSlots(true);
  
    try {
      // Parse date correctly to avoid timezone issues
      const [year, month, day] = selectedDate.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const dayOfWeek = localDate.getDay();
      const businessHoursForDay = businessHours[dayOfWeek];
      
      if (!businessHoursForDay) {
        setAvailableTimeSlots([]);
        setLoadingTimeSlots(false);
        return;
      }
      
      // Check if the date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateObj = new Date(year, month - 1, day);
      selectedDateObj.setHours(0, 0, 0, 0);
      
      if (selectedDateObj < today) {
        setAvailableTimeSlots([]);
        setLoadingTimeSlots(false);
        return;
      }
  
      // Get all possible time slots for that day (inline the logic to avoid circular deps)
      const slots = [];
      try {
        const [startHour, startMinute] = businessHoursForDay.start.split(':').map(Number);
        const [endHour, endMinute] = businessHoursForDay.end.split(':').map(Number);
        
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        
        for (let minutes = startTotalMinutes; minutes < endTotalMinutes; minutes += 60) {
          const hour = Math.floor(minutes / 60);
          const minute = minutes % 60;
          const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          slots.push(timeSlot);
        }
      } catch (error) {
        console.error('Error generating time slots:', error);
      }
  
      // Fetch already booked slots for the date
      const response = await fetch("/api/fetch/timeslot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }),
      });
  
      const data = await response.json();
      let bookedSlots = [];
      
      if (response.ok && data.data) {
        bookedSlots = data.data;
      }
  
      // Filter out booked times
      const normalize = (timeStr) => timeStr?.padStart(5, '0').trim();
  
      const availableSlots = slots.filter(slot => {
        return !bookedSlots.some(booked => {
          if (excludeEventId && booked._id === excludeEventId) {
            return false;
          }
          const bookedTime = typeof booked === 'string' ? booked : booked.time;
          return normalize(bookedTime) === normalize(slot);
        });
      });
  
      setAvailableTimeSlots(availableSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setAvailableTimeSlots([]);
    }
  
    setLoadingTimeSlots(false);
  }, []); // EMPTY dependency array - no dependencies that change
  

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    newClients: 0,
    returningClients: 0,
    completedThisMonth: 0,
    revenue: 0,
    averagePerDay: 0
  });

  // Effects
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const expiry = localStorage.getItem('admin_token_expiry');
    
    if (token && expiry && new Date() < new Date(expiry)) {
      setAuthToken(token);
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_token_expiry');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated, fetchEvents]);
  
  useEffect(() => {
    calculateStats();
  }, [events, calculateStats]);
  
  useEffect(() => {
    if (formData.date) {
      // Check validity inline to avoid dependency issues
      const [year, month, day] = formData.date.split('-').map(Number);
      const localDate = new Date(year, month - 1, day);
      const dayOfWeek = localDate.getDay();
      const hours = businessHours[dayOfWeek];
      
      if (!hours || hours === null) {
        setAvailableTimeSlots([]);
        setFormData(prev => ({ ...prev, time: '' }));
        return;
      }
      
      const excludeId = isEditModalOpen ? selectedAppointment?._id : null;
      fetchAvailableTimeSlots(formData.date, excludeId);
      setFormData(prev => ({ ...prev, time: '' }));
    } else {
      setAvailableTimeSlots([]);
    }
  }, [formData.date, isEditModalOpen, selectedAppointment?._id, fetchAvailableTimeSlots]);

  // Authentication handlers
  // Add this state for rate limiting
const [loginAttempts, setLoginAttempts] = useState(0);
const [isBlocked, setIsBlocked] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  
  // Check if user is temporarily blocked
  if (isBlocked) {
    setAuthError("Too many failed attempts. Please wait 5 minutes before trying again.");
    return;
  }
  
  setIsLoggingIn(true);
  setAuthError("");

  try {
    const response = await fetch('/api/auth/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      const { token, expiresIn } = await response.json();
      const expiry = new Date(Date.now() + expiresIn * 1000);
      
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_token_expiry', expiry.toISOString());
      
      setAuthToken(token);
      setIsAuthenticated(true);
      setAuthError("");
      setLoginAttempts(0); // Reset attempts on success
    } else {
      // Handle failed login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setIsBlocked(true);
        setAuthError("Too many failed attempts. Access blocked for 5 minutes.");
        setTimeout(() => {
          setIsBlocked(false);
          setLoginAttempts(0);
        }, 5 * 60 * 1000); // 5 minutes
      } else {
        const errorData = await response.json();
        setAuthError(`${errorData.error || "Authentication failed"} (${newAttempts}/5 attempts)`);
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    setAuthError("Unable to connect to the server. Please try again later.");
  } finally {
    setIsLoggingIn(false);
    setPassword("");
  }
};

  

  // Event handlers
  const handleCancel = async (eventId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setActionLoading(prev => ({ ...prev, [eventId]: 'canceling' }));
    
    try {
      const response = await fetch("/api/event/cancel", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ eventId }),
      });

      if (response.ok) {
        setEvents(events.filter((event) => event._id !== eventId));
        setSelectedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        setError("");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to cancel booking");
      }
    } catch (error) {
      setError("Something went wrong while canceling the booking");
    } finally {
      setActionLoading(prev => {
        const newState = { ...prev };
        delete newState[eventId];
        return newState;
      });
    }
  };

  const handleBulkCancel = async () => {
    if (selectedItems.size === 0) return;
    
    if (!confirm(`Are you sure you want to cancel ${selectedItems.size} appointment(s)?`)) {
      return;
    }

    const promises = Array.from(selectedItems).map(id => handleCancel(id));
    await Promise.all(promises);
    setSelectedItems(new Set());
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      client: appointment.client,
      email: appointment.email,
      phone: appointment.phone,
      date: appointment.date,
      time: appointment.time,
      consultationType: appointment.consultationType,
      isReturningClient: appointment.isReturningClient,
      notes: appointment.notes || ''
    });
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setFormData({
      client: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      consultationType: 'in-person',
      isReturningClient: false,
      notes: ''
    });
    setAvailableTimeSlots([]);
    setIsCreateModalOpen(true);
  };

  const handleViewNotes = (appointment) => {
    setSelectedAppointment(appointment);
    setAppointmentNotes(appointment.notes || '');
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!authToken) {
      setError("Authentication required. Please log in again.");
      return;
    }

    try {
      const response = await fetch('/api/event/update-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          eventId: selectedAppointment._id,
          notes: appointmentNotes
        })
      });

      if (response.ok) {
        setEvents(prev => prev.map(event => 
          event._id === selectedAppointment._id 
            ? { ...event, notes: appointmentNotes }
            : event
        ));
        setIsNotesModalOpen(false);
        setError("");
      } else {
        const data = await response.json();
        
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
          return;
        }
        setError(data.error || 'Failed to save notes');
      }
    } catch (error) {
      setError('Something went wrong while saving notes');
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!authToken) {
      setError("Authentication required. Please log in again.");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const endpoint = isEditModalOpen ? '/api/event/update' : '/api/event';
      const method = isEditModalOpen ? 'PUT' : 'POST';
      const body = isEditModalOpen 
        ? { ...formData, eventId: selectedAppointment._id }
        : formData;

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isEditModalOpen) {
          setEvents(prev => prev.map(event => 
            event._id === selectedAppointment._id ? { ...event, ...formData } : event
          ));
          setIsEditModalOpen(false);
        } else {
          const newEvent = data.event || { ...formData, _id: Date.now().toString() };
          setEvents(prev => [...prev, newEvent]);
          setIsCreateModalOpen(false);
        }
        
        setError("");
      } else {
        if (response.status === 401) {
          setError("Session expired. Please log in again.");
          handleLogout();
          return;
        }
        const errorData = await response.json();
        setError(errorData.error || 'Failed to save appointment');
      }
    } catch (error) {
      setError('Something went wrong while saving the appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  // Utility functions
  const filterAndSortEvents = () => {
    let filtered = events.filter(event => {
      const matchesSearch = event.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.phone.includes(searchTerm);
      
      const matchesDate = !filterDate || event.date === filterDate;
      const matchesType = filterType === 'all' || event.consultationType === filterType;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const eventDate = new Date(event.date);
      
      let matchesStatus = true;
      if (filterStatus === 'upcoming') {
        matchesStatus = eventDate >= today;
      } else if (filterStatus === 'past') {
        matchesStatus = eventDate < today;
      } else if (filterStatus === 'today') {
        matchesStatus = eventDate.toDateString() === today.toDateString();
      }
      
      return matchesSearch && matchesDate && matchesType && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'client':
          aVal = a.client.toLowerCase();
          bVal = b.client.toLowerCase();
          break;
        case 'time':
          aVal = a.time;
          bVal = b.time;
          break;
        case 'date':
        default:
          aVal = new Date(a.date + ' ' + a.time);
          bVal = new Date(b.date + ' ' + b.time);
          break;
      }
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  };

  const paginateEvents = (filteredEvents) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  };

  const exportToCSV = () => {
    const filtered = filterAndSortEvents();
    const headers = ['Date', 'Time', 'Client', 'Email', 'Phone', 'Type', 'Consultation', 'Notes'];
    const rows = filtered.map(event => [
      event.date,
      event.time,
      event.client,
      event.email,
      event.phone,
      event.isReturningClient ? 'Returning' : 'New',
      event.consultationType === 'in-person' ? 'In-person' : 'Telehealth',
      event.notes || ''
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAppointmentStatus = (date, time) => {
    const [hour, minute] = time.split(':').map(Number);
    const dateObj = parseLocalDate(date);
    dateObj.setHours(hour, minute, 0, 0);
    const appointmentDateTime = dateObj;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDateTime < now) return 'completed';
    if (appointmentDateTime.toDateString() === today.toDateString()) return 'today';
    return 'upcoming';
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* login screen logo section with this: */}
<div className="text-center mb-8">
  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-white shadow-md">
  <Image 
    src="/psiwell.png" 
    alt="Psi Wellness Logo" 
    width={48}
    height={48}
    className="object-contain"
    priority
  />
  </div>
  <h1 className="text-2xl font-bold text-gray-900 mb-2">Psi Wellness Dashboard</h1>
  <p className="text-gray-600">Secure admin access for appointment management</p>
</div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {authError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {authError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  disabled={isLoggingIn}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoggingIn || !password}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Authenticating...
                  </>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredEvents = filterAndSortEvents();
  const paginatedEvents = paginateEvents(filteredEvents);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Simple Admin Navbar */}
        <nav className="dashboard-nav bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
<div className="flex items-center space-x-3">
  <div className="relative h-14 w-14">
    <div className="h-14 w-14 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-200">
    <Image 
    src="/psiwell.png" 
    alt="Psi Wellness Logo" 
    width={48}
    height={48}
    className="object-contain"
    priority
  />
    </div>
  </div>
  <div>
    <h1 className="text-xl font-bold text-gray-900">Psi Wellness</h1>
    <p className="text-xs text-gray-500">Admin Dashboard</p>
  </div>
</div>
              
              {/* Session Status & Logout */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Active Session
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Dashboard Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Manage appointments and client information</p>
              </div>
              <button
                onClick={handleCreate}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-sm"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Appointment
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-xl">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'clients', label: 'Clients', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Today</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">This Week</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.thisWeek}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">This Month</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">New Clients</p>
                      <p className="text-3xl font-bold text-green-600">{stats.newClients}</p>
                      <p className="text-sm text-gray-500">{stats.total > 0 ? ((stats.newClients / stats.total) * 100).toFixed(1) : 0}% of total</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Returning Clients</p>
                      <p className="text-3xl font-bold text-blue-600">{stats.returningClients}</p>
                      <p className="text-sm text-gray-500">{stats.total > 0 ? ((stats.returningClients / stats.total) * 100).toFixed(1) : 0}% of total</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Avg. Appointments/Day</p>
                      <p className="text-3xl font-bold text-purple-600">{stats.averagePerDay}</p>
                      <p className="text-sm text-gray-500">Based on current data</p>
                    </div>
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button
                    onClick={handleCreate}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                  >
                    <Plus className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 group-hover:text-blue-600">New Appointment</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all group"
                  >
                    <CalendarIcon className="h-6 w-6 text-gray-400 group-hover:text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 group-hover:text-green-600">View Calendar</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('clients')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
                  >
                    <Users className="h-6 w-6 text-gray-400 group-hover:text-purple-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 group-hover:text-purple-600">Client Directory</p>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('analytics')}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all group"
                  >
                    <BarChart3 className="h-6 w-6 text-gray-400 group-hover:text-orange-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 group-hover:text-orange-600">View Analytics</p>
                  </button>
                </div>
              </div>

              {/* Recent Appointments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Appointments</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {events.slice(0, 5).map((event) => {
                        const status = getAppointmentStatus(event.date, event.time);
                        return (
                          <tr key={event._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                                  <User className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="text-sm font-medium text-gray-900">{event.client}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{formatDate(event.date)}</div>
                              <div className="text-sm text-gray-500">{formatTime(event.time)}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                event.consultationType === "in-person"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-orange-100 text-orange-800"
                              }`}>
                                {event.consultationType === "in-person" ? "In-person" : "Telehealth"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                              {status === 'today' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                              {status === 'upcoming' && <Clock className="h-4 w-4 text-blue-500" />}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleViewDetails(event)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="View Details"
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleEdit(event)}
                                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <>
              {/* Filters and Controls */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search appointments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="today">Today</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="past">Past</option>
                    </select>
                    
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="in-person">In-person</option>
                      <option value="telehealth">Telehealth</option>
                    </select>
                    
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={`${sortBy}-${sortOrder}`}
                      onChange={(e) => {
                        const [field, order] = e.target.value.split('-');
                        setSortBy(field);
                        setSortOrder(order);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="date-asc">Date (Earliest)</option>
                      <option value="date-desc">Date (Latest)</option>
                      <option value="client-asc">Client (A-Z)</option>
                      <option value="client-desc">Client (Z-A)</option>
                      <option value="time-asc">Time (Earliest)</option>
                      <option value="time-desc">Time (Latest)</option>
                    </select>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setView(view === 'table' ? 'cards' : 'table')}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {view === 'table' ? 'Card View' : 'Table View'}
                      </button>
                      
                      <button
                        onClick={exportToCSV}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>
                
                {selectedItems.size > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">
                        {selectedItems.size} appointment(s) selected
                      </span>
                      <div className="space-x-2">
                        <button
                          onClick={handleBulkCancel}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancel Selected
                        </button>
                        <button
                          onClick={() => setSelectedItems(new Set())}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Clear Selection
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                  <span>{error}</span>
                  <button
                    onClick={() => setError("")}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Table View */}
              {view === 'table' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left">
                            <input
                              type="checkbox"
                              checked={selectedItems.size === paginatedEvents.length && paginatedEvents.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedItems(new Set(paginatedEvents.map(event => event._id)));
                                } else {
                                  setSelectedItems(new Set());
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Time</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Client</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Contact</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Consultation</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedEvents.map((event) => {
                          const status = getAppointmentStatus(event.date, event.time);
                          return (
                            <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={selectedItems.has(event._id)}
                                  onChange={(e) => {
                                    const newSet = new Set(selectedItems);
                                    if (e.target.checked) {
                                      newSet.add(event._id);
                                    } else {
                                      newSet.delete(event._id);
                                    }
                                    setSelectedItems(newSet);
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center">
                                  {status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                                  {status === 'today' && <AlertCircle className="h-4 w-4 text-orange-500" />}
                                  {status === 'upcoming' && <Clock className="h-4 w-4 text-blue-500" />}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatDate(event.date)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {formatTime(event.time)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{event.client}</div>
                                <div className="text-xs text-gray-500">
                                  {event.isReturningClient ? 'Returning Client' : 'New Client'}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-gray-900">{event.email}</div>
                                <div className="text-sm text-gray-500">{event.phone}</div>
                              </td>
                              <td className="px-6 py-4">
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
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                                    event.consultationType === "in-person"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {event.consultationType === "in-person" ? (
                                    <>
                                      <MapPin className="h-3 w-3 mr-1" />
                                      In-person
                                    </>
                                  ) : (
                                    <>
                                      <Video className="h-3 w-3 mr-1" />
                                      Telehealth
                                    </>
                                  )}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() => handleViewDetails(event)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleViewNotes(event)}
                                    className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                                    title="View Notes"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(event)}
                                    className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleCancel(event._id)}
                                    disabled={actionLoading[event._id]}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                    title="Cancel"
                                  >
                                    {actionLoading[event._id] ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {paginatedEvents.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                        <p className="text-gray-500">Try adjusting your filters or create a new appointment.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredEvents.length)} of {filteredEvents.length} results
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-md ${
                            currentPage === page
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Client Directory</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...new Set(events.map(event => event.client))].map((clientName, index) => {
                  const clientEvents = events.filter(event => event.client === clientName);
                  const latestEvent = clientEvents[0];
                  const totalSessions = clientEvents.length;
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-all">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{clientName}</h4>
                          <p className="text-sm text-gray-500">{latestEvent?.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Total Sessions:</span>
                          <span className="font-medium">{totalSessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Client Type:</span>
                          <span className="font-medium">
                            {latestEvent?.isReturningClient ? 'Returning' : 'New'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Preferred Type:</span>
                          <span className="font-medium">
                            {latestEvent?.consultationType === 'in-person' ? 'In-person' : 'Telehealth'}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSearchTerm(clientName);
                          setActiveTab('appointments');
                        }}
                        className="w-full mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        View Appointments
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client Type Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Client Distribution</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Returning Clients</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{stats.returningClients}</div>
                        <div className="text-sm text-gray-500">{stats.total > 0 ? ((stats.returningClients / stats.total) * 100).toFixed(1) : 0}%</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">New Clients</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{stats.newClients}</div>
                        <div className="text-sm text-gray-500">{stats.total > 0 ? ((stats.newClients / stats.total) * 100).toFixed(1) : 0}%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consultation Type Distribution */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Consultation Types</h3>
                  <div className="space-y-4">
                    {['in-person', 'telehealth'].map((type) => {
                      const count = events.filter(e => e.consultationType === type).length;
                      const percentage = events.length > 0 ? ((count / events.length) * 100).toFixed(1) : 0;
                      
                      return (
                        <div key={type} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full mr-3 ${
                              type === 'in-person' ? 'bg-purple-500' : 'bg-orange-500'
                            }`}></div>
                            <span className="text-gray-700 capitalize">
                              {type === 'in-person' ? 'In-person' : 'Telehealth'}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{count}</div>
                            <div className="text-sm text-gray-500">{percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Monthly Performance */}
              
            </div>
          )}
        </div>

        {/* Create/Edit Modal */}
        {(isCreateModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {isEditModalOpen ? 'Edit Appointment' : 'Create New Appointment'}
                  </h2>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setIsCreateModalOpen(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Time
  </label>
  {!formData.date ? (
    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
      Please select a date first
    </div>
  ) : !isValidBookingDate(formData.date) ? (
    <div className="w-full px-3 py-2 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
      Selected date is not available (office closed)
    </div>
  ) : loadingTimeSlots ? (
    <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
      <Loader2 className="h-4 w-4 animate-spin mr-2" />
      <span className="text-sm text-gray-500">Loading available times...</span>
    </div>
  ) : availableTimeSlots.length === 0 ? (
    <div className="w-full px-3 py-2 border border-yellow-300 rounded-lg bg-yellow-50 text-yellow-700 text-sm">
      No available time slots for this date (fully booked)
    </div>
  ) : (
    <select
      value={formData.time}
      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    >
      <option value="">Select time</option>
      {availableTimeSlots.map(slot => (
        <option key={slot} value={slot}>
          {formatTime(slot)}
        </option>
      ))}
    </select>
  )}
</div>
                    </div>

                  {/* Business Hours and Availability Info */}
{formData.date && (
  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
    {!isValidBookingDate(formData.date) ? (
      <div>
        <p className="text-sm text-blue-700">
          <strong>Office Closed:</strong> No appointments available on {formatDate(formData.date)}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Business Hours: Monday: Closed, Tuesday: 9:00 AM - 5:30 PM, Wednesday: 6:00 PM - 10:00 PM, 
          Thursday: 9:00 PM - 5:30 PM, Friday: 9:00 PM - 5:30 PM, Saturday: 10:00 PM - 4:00 PM, Sunday: Closed
        </p>
      </div>
    ) : availableTimeSlots.length === 0 && !loadingTimeSlots ? (
      <div>
        <p className="text-sm text-orange-700">
          <strong>Fully Booked:</strong> No available time slots for {formatDate(formData.date)}
        </p>
        <p className="text-xs text-orange-600 mt-1">
          Try selecting a different date or check with the client for alternative times.
        </p>
      </div>
    ) : availableTimeSlots.length > 0 ? (
      <div>
        <p className="text-sm text-blue-700">
          <strong>Available times:</strong> {availableTimeSlots.length} slot(s) available for {formatDate(formData.date)}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          Business hours: {(() => {
            const dayOfWeek = new Date(formData.date).getDay();
            const hours = businessHours[dayOfWeek];
            if (!hours) return 'Closed';
            return `${formatTime(hours.start + ':00')} - ${formatTime(hours.end + ':00')}`;
          })()}
        </p>
      </div>
    ) : null}
  </div>
)}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Consultation Type
                    </label>
                    <select
                      value={formData.consultationType}
                      onChange={(e) => setFormData(prev => ({ ...prev, consultationType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="in-person">In-person</option>
                      <option value="telehealth">Telehealth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add any notes about this appointment..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isReturningClient"
                      checked={formData.isReturningClient}
                      onChange={(e) => setFormData(prev => ({ ...prev, isReturningClient: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isReturningClient" className="ml-2 text-sm text-gray-700">
                      Returning Client
                    </label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setIsCreateModalOpen(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
  type="submit"
  disabled={
    isSubmitting || 
    !formData.client || 
    !formData.email || 
    !formData.phone || 
    !formData.date || 
    !formData.time || 
    !isValidBookingDate(formData.date) ||
    (formData.date && availableTimeSlots.length === 0 && !loadingTimeSlots)
  }
  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
>
  {isSubmitting ? (
    <>
      <Loader2 className="animate-spin h-4 w-4 mr-2" />
      {isEditModalOpen ? 'Saving...' : 'Creating...'}
    </>
  ) : (
    isEditModalOpen ? 'Save Changes' : 'Create Appointment'
  )}
</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {isNotesModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Session Notes</h2>
                    <p className="text-gray-600">{selectedAppointment.client} - {formatDate(selectedAppointment.date)}</p>
                  </div>
                  <button
                    onClick={() => setIsNotesModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session Notes:
                    </label>
                    <textarea
                      rows={8}
                      value={appointmentNotes}
                      onChange={(e) => setAppointmentNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add session notes, observations, treatment progress, goals, etc..."
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setIsNotesModalOpen(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveNotes}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Detail Modal */}
        {isDetailModalOpen && selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Appointment Details</h2>
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <p className="text-lg font-semibold text-gray-900">{selectedAppointment.client}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedAppointment.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedAppointment.phone}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Type</label>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedAppointment.isReturningClient
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {selectedAppointment.isReturningClient ? "Returning Client" : "New Client"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <p className="text-lg font-semibold text-gray-900">{formatDate(selectedAppointment.date)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <p className="text-lg font-semibold text-gray-900">{formatTime(selectedAppointment.time)}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedAppointment.consultationType === "in-person"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {selectedAppointment.consultationType === "in-person" ? (
                          <>
                            <MapPin className="h-4 w-4 mr-1" />
                            In-person
                          </>
                        ) : (
                          <>
                            <Video className="h-4 w-4 mr-1" />
                            Telehealth
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <div className="flex items-center">
                        {(() => {
                          const status = getAppointmentStatus(selectedAppointment.date, selectedAppointment.time);
                          if (status === 'completed') {
                            return (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Completed
                              </span>
                            );
                          } else if (status === 'today') {
                            return (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Today
                              </span>
                            );
                          } else {
                            return (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                <Clock className="h-4 w-4 mr-1" />
                                Upcoming
                              </span>
                            );
                          }
                        })()}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedAppointment.notes && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <p className="text-gray-900">{selectedAppointment.notes}</p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleViewNotes(selectedAppointment);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View/Edit Notes
                  </button>
                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      handleEdit(selectedAppointment);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Appointment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}