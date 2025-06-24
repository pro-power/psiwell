// lib/models/event.js
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  client: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  consultationType: {
    type: String,
    enum: ['in-person', 'telehealth'],
    default: 'telehealth'
  },
  isReturningClient: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: '',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
eventSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema);

export default Event;